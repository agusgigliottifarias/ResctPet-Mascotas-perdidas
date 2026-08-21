const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

const URL_BASE = process.env.BASE_URL || 'http://backend:8080';

const RESTAURANTE = 'R-1001';
const ITEM = 'I-3001';
const PASSWORD = 'Test#2025';

function valor(campo) {
   if (campo === undefined || campo === null) {
      return '';
   }

   return String(campo).trim();
}

function primeraFila(tabla) {
   return tabla.hashes()[0];
}

function ahoraMasSegundos(segundos) {
   return new Date(Date.now() + segundos * 1000).toISOString();
}

function emailUnico(email) {
   return valor(email).replace(
      '@',
      '.' + Date.now() + '.' + Math.floor(Math.random() * 10000) + '@'
   );
}

function direccionEntrega() {
   return {
      calle: 'Roca',
      numero: '123',
      ciudad: 'Puerto Madryn',
      provincia: 'Chubut',
      ubicacion: [-42.7830, -65.0150]
   };
}

function rutaBase() {
   return [
      { lat: -42.7701, lng: -65.0385 },
      { lat: -42.7740, lng: -65.0320 },
      { lat: -42.7790, lng: -65.0250 },
      { lat: -42.7830, lng: -65.0150 }
   ];
}

async function enviarGet(ruta) {
   const response = await fetch(URL_BASE + ruta, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json'
      }
   });

   return response.json();
}

async function enviarPost(ruta, body) {
   const response = await fetch(URL_BASE + ruta, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
   });

   return response.json();
}

async function enviarPut(ruta, body) {
   const response = await fetch(URL_BASE + ruta, {
      method: 'PUT',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
   });

   return response.json();
}

function assertOk(response, mensaje) {
   assert.strictEqual(response.status_code, 200, mensaje);
}

function dataTracking(contexto) {
   assert.ok(contexto.response.data);

   return contexto.response.data;
}

async function crearConsumidor(contexto, emailOriginal) {
   const email = emailUnico(emailOriginal);

   contexto.emailActual = email;

   const response = await enviarPost('/api/consumidores', {
      nombre: 'Consumidor ' + email,
      email: email,
      password: PASSWORD
   });

   assertOk(response, 'No se pudo crear consumidor');

   return email;
}

async function crearPedido(email) {
   const response = await enviarPost('/pedidos', {
      emailConsumidor: email,
      codigoRestaurante: RESTAURANTE,
      metodoPago: 'EFECTIVO',
      direccionEntrega: direccionEntrega(),
      lineas: [
         {
            codigoItem: ITEM,
            cantidad: 1,
            adicionales: []
         }
      ]
   });

   assertOk(response, 'No se pudo crear pedido');

   return response.data;
}

async function pagarPedido(pedido, email) {
   const response = await enviarPost('/pagos', {
      codigoPedido: pedido.codigoPedido,
      emailConsumidor: email,
      monto: pedido.total,
      metodo: 'EFECTIVO',
      accion: 'CAPTURAR'
   });

   assertOk(response, 'No se pudo pagar pedido');

   return response.data.pedido || response.data;
}

async function prepararPedidoBase(contexto, emailOriginal) {
   const email = await crearConsumidor(contexto, emailOriginal);

   contexto.pedidoActual = await crearPedido(email);
   contexto.pedidoActual = await pagarPedido(contexto.pedidoActual, email);
   contexto.codigoPedidoActual = contexto.pedidoActual.codigoPedido;

   const response = await enviarPut(
      '/pedidos/' + contexto.codigoPedidoActual
      + '/aceptar?codigoRestaurante=' + RESTAURANTE
      + '&listoPara=' + encodeURIComponent(ahoraMasSegundos(1200))
   );

   assertOk(response, 'No se pudo aceptar pedido');
   assert.ok(response.data.entrega);

   contexto.pedidoActual = response.data;
   contexto.idEntregaActual = response.data.entrega.codigoEntrega;
}

async function registrarEventoTracking(contexto, tipoEvento, cambios) {
   const datos = cambios || {};

   const body = {
      idPedido: contexto.codigoPedidoActual || contexto.pedidoActual.codigoPedido,
      idEntrega: contexto.idEntregaActual,
      estadoEntrega: datos.estadoEntrega || 'EN_TRAYECTO',
      eta: datos.eta === undefined ? ahoraMasSegundos(570) : datos.eta,
      ultimaActualizacion: new Date().toISOString(),
      ruta: datos.ruta === undefined ? rutaBase() : datos.ruta,
      distanciaMetros: datos.distanciaMetros || 2900,
      duracionEstimadaSegundos: datos.duracionEstimadaSegundos || 540,
      motivo: datos.motivo
   };

   contexto.response = await enviarPost(
      '/tracking/entregas/' + contexto.idEntregaActual + '/eventos/' + tipoEvento,
      body
   );
}

function rutaTracking(codigoPedido, email) {
   const parametros = new URLSearchParams();

   parametros.append('emailConsumidor', email);

   return '/pedidos/' + codigoPedido + '/tracking?' + parametros.toString();
}

async function consultarTracking(contexto, email) {
   const ruta = rutaTracking(contexto.pedidoActual.codigoPedido, email);

   contexto.response = await enviarGet(ruta);
}

async function consultarTrackingPorCodigo(contexto, email, codigoPedido) {
   const ruta = rutaTracking(codigoPedido, email);

   contexto.response = await enviarGet(ruta);
}

async function prepararPedidoAsignado(contexto, email) {
   await prepararPedidoBase(contexto, email);

   await registrarEventoTracking(contexto, 'EntregaAsignada', {
      estadoEntrega: 'ASIGNADA',
      ruta: [],
      eta: ahoraMasSegundos(900)
   });
}

async function prepararPedidoEnTrayecto(contexto, email) {
   await prepararPedidoBase(contexto, email);

   await registrarEventoTracking(contexto, 'EntregaEnTrayecto', {
      estadoEntrega: 'EN_TRAYECTO',
      ruta: rutaBase(),
      eta: ahoraMasSegundos(570)
   });
}

function assertTracking(data, esperado) {
   if (esperado.estadoEntrega !== undefined) {
      assert.strictEqual(data.estadoEntrega, valor(esperado.estadoEntrega));
   }

   if (esperado.tieneEta !== undefined) {
      assert.strictEqual(Boolean(data.eta), valor(esperado.tieneEta) === 'true');
   }

   if (esperado.tieneRuta !== undefined) {
      assert.strictEqual(
         Array.isArray(data.ruta) && data.ruta.length > 0,
         valor(esperado.tieneRuta) === 'true'
      );
   }

   if (esperado.tieneOrigen !== undefined) {
      assert.strictEqual(Boolean(data.origen), valor(esperado.tieneOrigen) === 'true');
   }

   if (esperado.tieneDestino !== undefined) {
      assert.strictEqual(Boolean(data.destino), valor(esperado.tieneDestino) === 'true');
   }

   if (esperado.tiempoRemanenteSegundos !== undefined) {
      assert.strictEqual(
         Number(data.tiempoRemanenteSegundos),
         Number(esperado.tiempoRemanenteSegundos)
      );
   }

   if (esperado.motivo !== undefined) {
      assert.strictEqual(data.motivo, valor(esperado.motivo));
   }
}

Given('que existe un pedido en trayecto con tracking para el consumidor {string}', async function (email) {
   await prepararPedidoEnTrayecto(this, email);
});

Given('que existe un pedido aprobado sin entrega para el consumidor {string}', async function (email) {
   await prepararPedidoBase(this, email);
});

Given('que existe un pedido asignado con tracking para el consumidor {string}', async function (email) {
   await prepararPedidoAsignado(this, email);
});

When('el consumidor {string} consulta el tracking del pedido actual', async function (_email) {
   await consultarTracking(this, this.emailActual);
});

When('el consumidor {string} consulta el tracking del pedido inexistente {string}',
   async function (email, codigoPedido) {
      await consultarTrackingPorCodigo(this, email, codigoPedido);
   }
);

Then('la respuesta de tracking debe ser:', function (tabla) {
   const esperado = primeraFila(tabla);

   assert.strictEqual(this.response.status_code, Number(esperado.status_code));
   assert.strictEqual(this.response.status_text, valor(esperado.status_text));
});

Then('la respuesta de tracking debe contener error:', function (tabla) {
   const esperado = primeraFila(tabla);

   assert.strictEqual(this.response.status_code, Number(esperado.status_code));
   assert.ok(this.response.status_text.includes(valor(esperado.status_text)));
});

Then('la respuesta del evento de tracking debe contener error:', function (tabla) {
   const esperado = primeraFila(tabla);

   assert.strictEqual(this.response.status_code, Number(esperado.status_code));
   assert.ok(this.response.status_text.includes(valor(esperado.status_text)));
});

Then('el tracking debe contener:', function (tabla) {
   const esperado = primeraFila(tabla);
   const data = dataTracking(this);

   assertTracking(data, esperado);
});

Then('el tracking debe contener distancia y duración estimada', function () {
   const data = dataTracking(this);

   assert.ok(data.distanciaMetros !== undefined && data.distanciaMetros !== null);
   assert.ok(data.duracionEstimadaSegundos !== undefined && data.duracionEstimadaSegundos !== null);
});

Then('la respuesta de tracking no debe exponer datos sensibles del repartidor', function () {
   const json = JSON.stringify(this.response.data || {});

   assert.ok(!json.includes('telefono'));
   assert.ok(!json.includes('documento'));
   assert.ok(!json.includes('ubicacionExacta'));
   assert.ok(!json.includes('trazaGps'));
});

Then('el tracking debe indicar que aún no hay repartidor asignado', function () {
   const data = dataTracking(this);

   assert.strictEqual(data.entrega, null);
   assert.strictEqual(data.eta, null);
   assert.ok(Array.isArray(data.ruta));
   assert.strictEqual(data.ruta.length, 0);
   assert.ok(data.mensaje.includes('repartidor asignado'));
});