const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

const URL_BASE = process.env.BASE_URL || 'http://backend:8080';

const RESTAURANTE_BASE = 'R-1001';
const ITEM_BASE = 'I-3001';
const REPARTIDOR_BASE = 'D-100';
const PASSWORD_BASE = 'Test#2025';

function valor(campo) {
   if (campo === undefined || campo === null) {
      return '';
   }

   return String(campo).trim();
}

function primeraFila(tabla) {
   return tabla.hashes()[0];
}

function direccionEntregaBase() {
   return {
      calle: 'Av. Roca',
      numero: '123',
      ciudad: 'Puerto Madryn',
      provincia: 'Chubut',
      ubicacion: [-42.7720, -65.0360]
   };
}

function listoParaEnMinutos(minutos) {
   return new Date(Date.now() + minutos * 60000).toISOString();
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

function assertRespuesta(response, esperado) {
   assert.strictEqual(response.status_code, Number(esperado.status_code));
   assert.strictEqual(response.status_text, valor(esperado.status_text));
}

function assertPreparacionExitosa(response, mensaje) {
   assert.strictEqual(response.status_code, 200, mensaje);
}

async function registrarConsumidor(email, nombre, password) {
   const response = await enviarPost('/api/consumidores', {
      nombre: valor(nombre || 'Consumidor ' + email),
      email: valor(email),
      password: valor(password || PASSWORD_BASE)
   });

   assertPreparacionExitosa(response, 'No se pudo preparar consumidor');

   return response.data;
}

async function crearPedido(email, codigoRestaurante, metodoPago, lineas) {
   return enviarPost('/pedidos', {
      emailConsumidor: valor(email),
      codigoRestaurante: valor(codigoRestaurante),
      direccionEntrega: direccionEntregaBase(),
      horaEntrega: '2026-05-20T20:00:00Z',
      metodoPago: valor(metodoPago),
      lineas: lineas
   });
}

async function crearPedidoBase(email) {
   const response = await crearPedido(
      email,
      RESTAURANTE_BASE,
      'EFECTIVO',
      [
         {
            codigoItem: ITEM_BASE,
            cantidad: 1,
            adicionales: []
         }
      ]
   );

   assertPreparacionExitosa(response, 'No se pudo crear pedido');
   assert.ok(response.data.codigoPedido);

   return response.data;
}

async function consultarMenuParaPedido(codigoRestaurante, codigoMenu) {
   return enviarGet(
      '/restaurantes/' +
      valor(codigoRestaurante) +
      '/menus/' +
      valor(codigoMenu)
   );
}

function rutaConsultaPedido(email, codigoPedido) {
   const parametros = new URLSearchParams();

   parametros.append('emailConsumidor', valor(email));

   return '/pedidos/consumidor/' +
      valor(codigoPedido) +
      '?' +
      parametros.toString();
}

async function consultarPedido(email, codigoPedido) {
   return enviarGet(rutaConsultaPedido(email, codigoPedido));
}

async function pagarPedido(pedido, email) {
   const response = await enviarPost('/pagos', {
      codigoPedido: pedido.codigoPedido,
      emailConsumidor: valor(email),
      monto: pedido.total,
      metodo: 'EFECTIVO',
      accion: 'CAPTURAR'
   });

   assertPreparacionExitosa(response, 'No se pudo pagar pedido');

   return response.data.pedido || response.data;
}

async function aceptarPedido(pedido) {
   const response = await enviarPut(
      '/pedidos/' + pedido.codigoPedido
      + '/aceptar?codigoRestaurante=' + RESTAURANTE_BASE
      + '&listoPara=' + encodeURIComponent(listoParaEnMinutos(20))
   );

   assertPreparacionExitosa(response, 'No se pudo aceptar pedido');

   return response.data;
}

async function iniciarPreparacion(pedido) {
   const response = await enviarPut('/pedidos/' + pedido.codigoPedido + '/iniciar-preparacion', {});

   assertPreparacionExitosa(response, 'No se pudo iniciar preparación');

   return response.data;
}

async function marcarListo(pedido) {
   const response = await enviarPut('/pedidos/' + pedido.codigoPedido + '/marcar-listo', {});

   assertPreparacionExitosa(response, 'No se pudo marcar listo');

   return response.data;
}

async function asignarRepartidor(pedido) {
   const parametros = new URLSearchParams();

   parametros.append('codigoRepartidor', REPARTIDOR_BASE);

   const response = await enviarPost(
      '/pedidos/' + pedido.codigoPedido + '/asignar-repartidor?' + parametros.toString(),
      {}
   );

   assertPreparacionExitosa(response, 'No se pudo asignar repartidor');

   return response.data;
}

async function tomarPedido(pedido) {
   const parametros = new URLSearchParams();

   parametros.append('codigoRepartidor', REPARTIDOR_BASE);

   const response = await enviarPost(
      '/pedidos/' + pedido.codigoPedido + '/tomar?' + parametros.toString(),
      {}
   );

   assertPreparacionExitosa(response, 'No se pudo tomar pedido');

   return response.data;
}

async function retirarPedido(pedido) {
   const parametros = new URLSearchParams();

   parametros.append('codigoRepartidor', REPARTIDOR_BASE);

   const response = await enviarPost(
      '/pedidos/' + pedido.codigoPedido + '/retirar?' + parametros.toString(),
      {}
   );

   assertPreparacionExitosa(response, 'No se pudo retirar pedido');

   return response.data;
}

async function cancelarPedido(codigoPedido, email, motivo) {
   const parametros = new URLSearchParams();

   parametros.append(
      'emailConsumidor',
      valor(email)
   );

   parametros.append(
      'motivoCancelacion',
      valor(motivo)
   );

   return enviarPost(
      '/pedidos/' +
      valor(codigoPedido) +
      '/cancelar?' +
      parametros.toString(),
      {}
   );
}

async function crearPedidoDelConsumidor(contexto, email) {
   await registrarConsumidor(email);

   contexto.pedidoActual = await crearPedidoBase(email);
}

async function refrescarPedidoActual(contexto, email) {
   const response = await consultarPedido(
      email,
      contexto.pedidoActual.codigoPedido
   );

   assertPreparacionExitosa(response, 'No se pudo consultar pedido');

   contexto.pedidoActual = response.data;
}

async function prepararPedidoEnEstado(contexto, email, estadoPedido) {
   await crearPedidoDelConsumidor(contexto, email);

   if (estadoPedido === 'APROBADO') {
      contexto.pedidoActual = await pagarPedido(contexto.pedidoActual, email);
   }
}

async function prepararPedidoConTicket(contexto, email, estadoTicket) {
   await crearPedidoDelConsumidor(contexto, email);

   contexto.pedidoActual = await pagarPedido(contexto.pedidoActual, email);
   contexto.pedidoActual = await aceptarPedido(contexto.pedidoActual);

   if (estadoTicket === 'EN_PREPARACION') {
      contexto.pedidoActual = await iniciarPreparacion(contexto.pedidoActual);
   }

   if (estadoTicket === 'LISTO') {
      contexto.pedidoActual = await iniciarPreparacion(contexto.pedidoActual);
      contexto.pedidoActual = await marcarListo(contexto.pedidoActual);
   }
}

async function prepararPedidoRecibido(contexto) {
   contexto.emailActual = 'historial.' + Date.now() + '@cpl.test';

   await crearPedidoDelConsumidor(contexto, contexto.emailActual);

   contexto.pedidoActual = await pagarPedido(
      contexto.pedidoActual,
      contexto.emailActual
   );
}

function data(response) {
   return response.data;
}

function historial(response) {
   return data(response).orders;
}

function paginaHistorial(response) {
   return data(response).page;
}

function assertMenuPerteneceARestaurante(response, codigoRestaurante) {
   assert.strictEqual(
      data(response).codigoRestaurante,
      valor(codigoRestaurante)
   );
}

function assertMenuContieneItemDisponible(response, codigoItem) {
   const items = data(response).menu.items || [];

   const item = items.find(function (itemMenu) {
      return itemMenu.codigo === valor(codigoItem);
   });

   assert.ok(item, 'No se encontró el ítem esperado');
   assert.strictEqual(item.disponible, true);
}

function assertPedidoCreado(response, codigoRestaurante) {
   const pedido = data(response);

   assert.ok(pedido.codigoPedido);
   assert.strictEqual(pedido.restaurante.codigoRestaurante, valor(codigoRestaurante));
   assert.strictEqual(pedido.idPedido, undefined);
   assert.strictEqual(pedido.restaurante.idRestaurante, undefined);
}

function assertEstadoPedido(response, estadoEsperado) {
   assert.strictEqual(data(response).estadoPedido, valor(estadoEsperado));
}

function assertTotalPedido(response, montoEsperado, monedaEsperada) {
   assert.strictEqual(data(response).total.monto, montoEsperado);
   assert.strictEqual(data(response).total.moneda, valor(monedaEsperada));
}

function assertPedidoCreadoSiCorresponde(response, esperado) {
   if (Number(response.status_code) !== 200) {
      return;
   }

   assertPedidoCreado(response, esperado.restaurante);
   assertEstadoPedido(response, esperado.estadoPedido);
   assertTotalPedido(
      response,
      Number(esperado.totalEsperado),
      esperado.moneda
   );
}

function assertCancelacion(response, esperado) {
   const pedido = data(response);

   assert.strictEqual(pedido.estadoPedido, valor(esperado.estadoPedido));
   assert.strictEqual(pedido.motivoCancelacion, valor(esperado.motivo));
   assert.ok(pedido.fechaHoraCancelacion);
}

function assertCancelacionNoExponeIds(response) {
   const pedido = data(response);

   assert.ok(pedido.codigoPedido);
   assert.strictEqual(pedido.idPedido, undefined);

   if (pedido.restaurante) {
      assert.ok(pedido.restaurante.codigoRestaurante);
      assert.strictEqual(pedido.restaurante.idRestaurante, undefined);
   }
}

function assertPedidoVisible(response, esperado) {
   const pedido = data(response);

   assert.strictEqual(pedido.estadoPedido, valor(esperado.estadoPedido));
   assert.strictEqual(pedido.restaurante.codigoRestaurante, valor(esperado.codigoRestaurante));
   assert.strictEqual(pedido.total.moneda, valor(esperado.moneda));

   assert.ok(Array.isArray(pedido.lineas));
   assert.ok(pedido.lineas.length > 0);

   if (valor(esperado.ticketEstado) !== '') {
      assert.ok(pedido.ticket);
      assert.strictEqual(pedido.ticket.estado, valor(esperado.ticketEstado));
   }

   if (valor(esperado.entregaEstado) === '') {
      assert.strictEqual(pedido.entrega, null);
   } else {
      assert.strictEqual(pedido.entrega.estado, valor(esperado.entregaEstado));
   }

   if (valor(esperado.repartidor) === 'no') {
      assert.strictEqual(pedido.repartidor, null);
   } else {
      assert.ok(pedido.repartidor);
      assert.ok(pedido.repartidor.codigoRepartidor);
   }

   if (valor(esperado.tiempoEstimado) === 'si') {
      assert.notStrictEqual(pedido.tiempoRemanenteEstimado, null);
      assert.ok(pedido.tiempoRemanenteEstimado >= 0);
   }
}

function assertPedidoVisibleNoExponeIds(response) {
   const pedido = data(response);

   assert.ok(pedido.codigoPedido);
   assert.strictEqual(pedido.idPedido, undefined);

   assert.ok(pedido.restaurante.codigoRestaurante);
   assert.strictEqual(pedido.restaurante.idRestaurante, undefined);

   pedido.lineas.forEach(function (linea) {
      assert.strictEqual(linea.idItem, undefined);
   });

   if (pedido.ticket) {
      assert.ok(pedido.ticket.codigoTicket);
      assert.strictEqual(pedido.ticket.idTicket, undefined);
   }

   if (pedido.entrega) {
      assert.ok(pedido.entrega.codigoEntrega);
      assert.strictEqual(pedido.entrega.idEntrega, undefined);
   }

   if (pedido.repartidor) {
      assert.ok(pedido.repartidor.codigoRepartidor);
      assert.strictEqual(pedido.repartidor.idRepartidor, undefined);
   }
}

function assertHistorialTienePaginacion(response) {
   assert.ok(paginaHistorial(response));
   assert.ok(paginaHistorial(response).size !== undefined);
}

function assertHistorialContienePedidoActual(response, pedidoActual) {
   const pedido = historial(response).find(function (pedidoHistorial) {
      return pedidoHistorial.codigoPedido === pedidoActual.codigoPedido;
   });

   assert.ok(pedido);
}

function assertHistorialVacio(response) {
   assert.strictEqual(historial(response).length, 0);
}

function assertHistorialTieneEstado(response, estado) {
   historial(response).forEach(function (pedido) {
      assert.strictEqual(pedido.estado, estado);
   });
}

function assertErrorHistorial(response, esperado) {
   assert.strictEqual(response.status_code, Number(esperado.status_code));
   assert.ok(response.status_text.includes(valor(esperado.status_text)));
}

function assertHistorialNoExponeIds(response) {
   historial(response).forEach(function (pedido) {
      assert.strictEqual(pedido.idHistorial, undefined);
   });
}

function rutaHistorial(email, parametrosExtra) {
   const parametros = new URLSearchParams(parametrosExtra || {});

   const ruta = '/historial/consumidores/' + email + '/pedidos';

   if (parametros.toString() === '') {
      return ruta;
   }

   return ruta + '?' + parametros.toString();
}

Given('que existe un consumidor activo para pedido con nombre {string}, email {string} y password {string}',
   async function (nombre, email, password) {
      await registrarConsumidor(email, nombre, password);
   }
);

When('se consulta el menú {string} del restaurante {string} para crear pedido',
   async function (codigoMenu, codigoRestaurante) {
      this.response = await consultarMenuParaPedido(
         codigoRestaurante,
         codigoMenu
      );
   }
);

When('se crea un pedido para el consumidor {string} en el restaurante {string} con método de pago {string} y líneas:',
   async function (email, codigoRestaurante, metodoPago, lineasDocString) {
      this.response = await crearPedido(
         email,
         codigoRestaurante,
         metodoPago,
         JSON.parse(lineasDocString)
      );
   }
);

Then('la respuesta de pedido debe ser:', function (tabla) {
   assertRespuesta(this.response, primeraFila(tabla));
});

Then('si el pedido fue creado debe contener:', function (tabla) {
   assertPedidoCreadoSiCorresponde(this.response, primeraFila(tabla));
});

Then('la respuesta de menú para pedido debe ser:', function (tabla) {
   assertRespuesta(this.response, primeraFila(tabla));
});

Then('la respuesta de menú para pedido debe pertenecer al restaurante {string}', function (codigoRestaurante) {
   assertMenuPerteneceARestaurante(this.response, codigoRestaurante);
});

Then('la respuesta de menú para pedido debe contener el ítem disponible {string}', function (codigoItem) {
   assertMenuContieneItemDisponible(this.response, codigoItem);
});

Then('la respuesta debe contener un pedido creado para el restaurante {string}', function (codigoRestaurante) {
   assertPedidoCreado(this.response, codigoRestaurante);
});

Then('la respuesta debe contener el estado de pedido {string}', function (estadoEsperado) {
   assertEstadoPedido(this.response, estadoEsperado);
});

Then('la respuesta debe contener total de pedido {float} {string}', function (montoEsperado, monedaEsperada) {
   assertTotalPedido(this.response, montoEsperado, monedaEsperada);
});

Given('que existe el consumidor visible {string}', async function (email) {
   await registrarConsumidor(email);
});

Given('que existe un pedido visible creado para el consumidor {string}', async function (email) {
   await crearPedidoDelConsumidor(this, email);
});

Given('el consumidor {string} paga el pedido visible actual', async function (email) {
   this.pedidoActual = await pagarPedido(this.pedidoActual, email);

   await refrescarPedidoActual(this, email);
});

Given('el restaurante acepta el pedido visible actual', async function () {
   this.pedidoActual = await aceptarPedido(this.pedidoActual);
});

Given('el restaurante marca el pedido visible actual como listo', async function () {
   this.pedidoActual = await iniciarPreparacion(this.pedidoActual);
   this.pedidoActual = await marcarListo(this.pedidoActual);
});

Given('se asigna un repartidor al pedido visible actual', async function () {
   this.pedidoActual = await asignarRepartidor(this.pedidoActual);
});

Given('el repartidor toma el pedido visible actual', async function () {
   this.pedidoActual = await tomarPedido(this.pedidoActual);
});

Given('el repartidor retira el pedido visible actual', async function () {
   this.pedidoActual = await retirarPedido(this.pedidoActual);
});

When('el consumidor {string} consulta el pedido visible actual', async function (email) {
   this.response = await consultarPedido(
      email,
      this.pedidoActual.codigoPedido
   );
});

When('el consumidor {string} consulta el pedido visible inexistente {string}',
   async function (email, codigoPedido) {
      this.response = await consultarPedido(email, codigoPedido);
   }
);

Then('la respuesta de ver pedido debe ser:', function (tabla) {
   assertRespuesta(this.response, primeraFila(tabla));
});

Then('la respuesta de ver pedido debe contener:', function (tabla) {
   assertPedidoVisible(this.response, primeraFila(tabla));
});

Then('la respuesta de ver pedido no debe exponer ids internos', function () {
   assertPedidoVisibleNoExponeIds(this.response);
});

Given('que existe el consumidor de cancelación {string}', async function (email) {
   await registrarConsumidor(email);
});

Given('que existe un pedido del consumidor {string} en estado {string}',
   async function (email, estadoPedido) {
      await prepararPedidoEnEstado(this, email, estadoPedido);
   }
);

Given('que existe un pedido del consumidor {string} con ticket en estado {string}',
   async function (email, estadoTicket) {
      await prepararPedidoConTicket(this, email, estadoTicket);
   }
);

Given('el consumidor {string} canceló el pedido actual', async function (email) {
   this.response = await cancelarPedido(
      this.pedidoActual.codigoPedido,
      email,
      'Cancelación inicial'
   );

   assertPreparacionExitosa(
      this.response,
      'No se pudo cancelar el pedido inicial'
   );
});

When('el consumidor {string} cancela el pedido con motivo {string}',
   async function (email, motivo) {
      this.response = await cancelarPedido(
         this.pedidoActual.codigoPedido,
         email,
         motivo
      );
   }
);

When('el consumidor {string} intenta cancelar un pedido inexistente', async function (email) {
   this.response = await cancelarPedido(
      'O-99999999',
      email,
      'Pedido inexistente'
   );
});

When('el consumidor {string} intenta cancelar el pedido actual', async function (email) {
   await registrarConsumidor(email);

   this.response = await cancelarPedido(
      this.pedidoActual.codigoPedido,
      email,
      'No corresponde'
   );
});

Then('la respuesta de cancelación debe ser:', function (tabla) {
   assertRespuesta(this.response, primeraFila(tabla));
});

Then('la cancelación debe dejar el pedido:', function (tabla) {
   assertCancelacion(this.response, primeraFila(tabla));
});

Then('la respuesta de cancelación no debe exponer ids internos', function () {
   assertCancelacionNoExponeIds(this.response);
});

Given('que existe para tarjeta 14 un consumidor con pedidos en historial', async function () {
   await prepararPedidoRecibido(this);
});

Given('que existe para tarjeta 14 un consumidor sin pedidos', async function () {
   this.emailActual = 'vacio.' + Date.now() + '@cpl.test';

   await registrarConsumidor(this.emailActual);
});

Given('que existe para tarjeta 14 un pedido recibido en historial', async function () {
   await prepararPedidoRecibido(this);
});

When('el consumidor de la tarjeta 14 consulta su historial de pedidos', async function () {
   this.response = await enviarGet(rutaHistorial(this.emailActual));
});

When('el consumidor de la tarjeta 14 consulta su historial filtrando por estado {string}',
   async function (estado) {
      this.response = await enviarGet(
         rutaHistorial(this.emailActual, {
            estado: valor(estado)
         })
      );
   }
);

When('el consumidor de la tarjeta 14 consulta su historial con rango inválido', async function () {
   this.response = await enviarGet(
      rutaHistorial(this.emailActual, {
         desde: '2026-12-31T00:00:00Z',
         hasta: '2026-01-01T00:00:00Z'
      })
   );
});

Then('la respuesta de historial debe ser:', function (tabla) {
   assertRespuesta(this.response, primeraFila(tabla));
});

Then('el historial debe contener metadatos de paginación', function () {
   assertHistorialTienePaginacion(this.response);
});

Then('el historial debe contener el pedido de la tarjeta 14', function () {
   assertHistorialContienePedidoActual(
      this.response,
      this.pedidoActual
   );
});

Then('el historial debe estar vacío', function () {
   assertHistorialVacio(this.response);
});

Then('todos los pedidos del historial deben tener estado {string}', function (estado) {
   assertHistorialTieneEstado(this.response, estado);
});

Then('la respuesta de historial debe contener error:', function (tabla) {
   assertErrorHistorial(this.response, primeraFila(tabla));
});

Then('la respuesta de historial no debe exponer ids internos', function () {
   assertHistorialNoExponeIds(this.response);
});
