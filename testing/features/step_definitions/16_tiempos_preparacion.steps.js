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

function ahoraMasMinutos(minutos) {
   return new Date(Date.now() + minutos * 60000).toISOString();
}

function emailUnico() {
   return 'tiempos.' + Date.now() + '.' + Math.floor(Math.random() * 10000) + '@cpl.test';
}

function direccionEntrega() {
   return {
      calle: 'Roca',
      numero: '123',
      ciudad: 'Puerto Madryn',
      provincia: 'Chubut',
      ubicacion: [-42.77, -65.03]
   };
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

function dataDeLaRespuesta(contexto) {
   return contexto.response.data;
}

async function crearConsumidor(email) {
   const response = await enviarPost('/api/consumidores', {
      nombre: 'Consumidor ' + email,
      email: email,
      password: PASSWORD
   });

   assertOk(response, 'No se pudo crear consumidor');
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
}

async function aceptarPedido(pedido) {
   const response = await enviarPut(
      '/pedidos/' + pedido.codigoPedido
      + '/aceptar?codigoRestaurante=' + RESTAURANTE
      + '&listoPara=' + encodeURIComponent(ahoraMasMinutos(20))
   );

   if (response.status_code === 200) {
      return response.data;
   }

   if (String(response.status_text).includes('NO_HAY_REPARTIDORES_DISPONIBLES')) {
      return pedido;
   }

   assertOk(response, 'No se pudo aceptar pedido');

   return response.data;
}

async function obtenerTicket(pedido) {
   const response = await enviarGet('/tickets/pedido/' + pedido.codigoPedido);

   assertOk(response, 'No se pudo obtener ticket');

   return response.data;
}

async function crearTicketTomado(contexto) {
   const email = emailUnico();

   await crearConsumidor(email);

   contexto.pedidoActual = await crearPedido(email);
   await pagarPedido(contexto.pedidoActual, email);

   contexto.pedidoActual = await aceptarPedido(contexto.pedidoActual);
   contexto.ticketActual = await obtenerTicket(contexto.pedidoActual);
}

function actualizarTicketActual(contexto) {
   if (contexto.response.data) {
      contexto.ticketActual = contexto.response.data;
   }
}

async function cambiarTicketPorPedido(contexto, accion) {
   const ruta = '/tickets/pedido/' + contexto.pedidoActual.codigoPedido + '/' + accion;

   contexto.response = await enviarPost(ruta);
   actualizarTicketActual(contexto);
}

async function cambiarTicketPorEstado(contexto, estado, motivo) {
   contexto.response = await enviarPost('/tickets/' + contexto.ticketActual.codigo + '/estado', {
      nuevoEstado: estado,
      motivo: motivo
   });

   actualizarTicketActual(contexto);
}

async function dejarTicketEnPreparacion(contexto) {
   await cambiarTicketPorPedido(contexto, 'preparar');

   assertOk(contexto.response, 'No se pudo dejar ticket en preparación');
}

async function dejarTicketListo(contexto) {
   await dejarTicketEnPreparacion(contexto);
   await cambiarTicketPorPedido(contexto, 'listo');

   assertOk(contexto.response, 'No se pudo dejar ticket listo');
}

async function dejarTicketAnulado(contexto) {
   await cambiarTicketPorEstado(contexto, 'ANULADO', 'PEDIDO_CANCELADO');

   assertOk(contexto.response, 'No se pudo dejar ticket anulado');
}

async function prepararTicketSegunEstado(contexto, estado) {
   const estadoNormalizado = valor(estado);

   if (estadoNormalizado === 'TOMADO') {
      return;
   }

   if (estadoNormalizado === 'EN_PREPARACION') {
      await dejarTicketEnPreparacion(contexto);
      return;
   }

   if (estadoNormalizado === 'LISTO') {
      await dejarTicketListo(contexto);
      return;
   }

   if (estadoNormalizado === 'ANULADO') {
      await dejarTicketAnulado(contexto);
      return;
   }

   assert.fail('Estado de ticket no soportado en el step: ' + estado);
}

async function cambiarEstadoTicket(contexto, nuevoEstado, motivo) {
   const estado = valor(nuevoEstado);

   if (estado === 'EN_PREPARACION') {
      await cambiarTicketPorPedido(contexto, 'preparar');
      return;
   }

   if (estado === 'LISTO') {
      await cambiarTicketPorPedido(contexto, 'listo');
      return;
   }

   if (estado === 'ANULADO') {
      await cambiarTicketPorEstado(contexto, 'ANULADO', 'PEDIDO_CANCELADO');
      return;
   }

   await cambiarTicketPorEstado(contexto, estado, motivo);
}

function estadoTicketActual(contexto) {
   const data = dataDeLaRespuesta(contexto);

   return data.estadoTicket || data.estado;
}

function assertCampoPresente(contexto, campo) {
   const data = dataDeLaRespuesta(contexto);

   assert.ok(data[campo], 'Falta ' + campo);
}

function rutaTiemposPreparacion(fila) {
   const parametros = new URLSearchParams();

   parametros.append('desde', fila.desde);
   parametros.append('hasta', fila.hasta);
   parametros.append('page', fila.page);
   parametros.append('size', fila.size);

   return '/tickets/restaurantes/' +
      fila.restaurante +
      '/cocina/tiempos-preparacion?' +
      parametros.toString();
}

Given('que existe un pedido aprobado {string} del restaurante {string}', async function (_codigoPedido, _codigoRestaurante) {
   await crearTicketTomado(this);
});


Given('existe un ticket {string} asociado al pedido {string} en estado {string}',
   async function (_codigoTicket, _codigoPedido, estado) {
      await prepararTicketSegunEstado(this, estado);
   }
);

Given('el ticket {string} tiene inicioPreparacion cargado', async function (_codigoTicket) {
   await dejarTicketEnPreparacion(this);
});

Given('el ticket {string} tiene finPreparacion cargado', async function (_codigoTicket) {
   await dejarTicketListo(this);
});

When('se cambia el estado del ticket {string}:', async function (_codigoTicket, tabla) {
   const fila = primeraFila(tabla);

   await cambiarEstadoTicket(
      this,
      fila.nuevoEstado,
      fila.motivo
   );
});

When('se consultan tiempos de preparación:', async function (tabla) {
   const ruta = rutaTiemposPreparacion(primeraFila(tabla));

   this.response = await enviarGet(ruta);
});

Then('la respuesta de tiempos de preparación debe ser:', function (tabla) {
   const esperado = primeraFila(tabla);

   assert.strictEqual(this.response.status_code, Number(esperado.status_code));
   assert.strictEqual(this.response.status_text, valor(esperado.status_text));
});

Then('el ticket de tiempos debe quedar en estado {string}', function (estado) {
   assert.strictEqual(estadoTicketActual(this), valor(estado));
});

Then('el ticket debe tener inicioPreparacion', function () {
   assertCampoPresente(this, 'inicioPreparacion');
});

Then('el ticket debe tener finPreparacion', function () {
   assertCampoPresente(this, 'finPreparacion');
});

Then('el ticket debe tener duracionPreparacionSegundos', function () {
   const data = dataDeLaRespuesta(this);

   assert.ok(data.duracionPreparacionSegundos >= 0);
});

Then('la respuesta del ticket debe contener idempotente true', function () {
   const data = dataDeLaRespuesta(this);

   assert.strictEqual(data.idempotente, true);
});

Given('que existen tickets listos con duración registrada para el restaurante {string}', async function (_codigoRestaurante) {
   await crearTicketTomado(this);
   await dejarTicketListo(this);
});

Then('la respuesta debe contener una lista de tiempos de preparación', function () {
   assert.ok(Array.isArray(dataDeLaRespuesta(this)));
});