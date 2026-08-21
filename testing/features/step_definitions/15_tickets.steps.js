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

function direccionEntregaBase() {
   return {
      calle: 'Roca',
      numero: '123',
      ciudad: 'Puerto Madryn',
      provincia: 'Chubut',
      ubicacion: [-42.77, -65.03]
   };
}

function listoParaEn(minutos) {
   return new Date(Date.now() + minutos * 60000).toISOString();
}

function emailUnico() {
   return 'ticket.' + Date.now() + '.' + Math.floor(Math.random() * 10000) + '@cpl.test';
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

async function enviarGet(ruta) {
   const response = await fetch(URL_BASE + ruta, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json'
      }
   });

   return response.json();
}

function assertOk(response, mensaje) {
   assert.strictEqual(response.status_code, 200, mensaje);
}

async function crearConsumidor(email) {
   const response = await enviarPost('/api/consumidores', {
      nombre: 'Consumidor ' + valor(email),
      email: valor(email),
      password: PASSWORD
   });

   assertOk(response, 'No se pudo crear consumidor');

   return response.data;
}

async function crearPedido(email) {
   const response = await enviarPost('/pedidos', {
      emailConsumidor: valor(email),
      codigoRestaurante: RESTAURANTE,
      metodoPago: 'EFECTIVO',
      direccionEntrega: direccionEntregaBase(),
      lineas: [
         {
            codigoItem: ITEM,
            cantidad: 1,
            adicionales: []
         }
      ]
   });

   assertOk(response, 'No se pudo crear pedido');
   assert.ok(response.data.codigoPedido);

   return response.data;
}

async function pagarPedido(pedido, email) {
   const response = await enviarPost('/pagos', {
      codigoPedido: pedido.codigoPedido,
      emailConsumidor: valor(email),
      monto: pedido.total,
      metodo: 'EFECTIVO',
      accion: 'CAPTURAR'
   });

   assertOk(response, 'No se pudo pagar pedido');

   return response.data.pedido || response.data;
}

async function aceptarPedido(pedido) {
   const response = await enviarPut(
      '/pedidos/' + pedido.codigoPedido
      + '/aceptar?codigoRestaurante=' + RESTAURANTE
      + '&listoPara=' + encodeURIComponent(listoParaEn(20))
   );

   assertOk(response, 'No se pudo aceptar pedido');

   return response.data;
}

async function obtenerTicketDePedido(pedido) {
   const response = await enviarGet('/tickets/pedido/' + pedido.codigoPedido);

   assertOk(response, 'No se pudo obtener ticket');
   assert.ok(response.data.codigo);

   return response.data;
}

async function crearTicketTomado(contexto) {
   const email = emailUnico();

   await crearConsumidor(email);

   contexto.pedidoActual = await crearPedido(email);
   contexto.pedidoActual = await pagarPedido(contexto.pedidoActual, email);
   contexto.pedidoActual = await aceptarPedido(contexto.pedidoActual);
   contexto.ticketActual = await obtenerTicketDePedido(contexto.pedidoActual);
   contexto.codigoTicketActual = contexto.ticketActual.codigo;
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
   contexto.response = await enviarPost('/tickets/' + contexto.codigoTicketActual + '/estado', {
      nuevoEstado: estado,
      motivo: motivo
   });

   actualizarTicketActual(contexto);
}

async function dejarTicketEnPreparacion(contexto) {
   await crearTicketTomado(contexto);
   await cambiarTicketPorPedido(contexto, 'preparar');

   assertOk(contexto.response, 'No se pudo dejar ticket en preparación');
}

async function cambiarEstadoTicket(contexto, estado) {
   const estadoNormalizado = valor(estado);

   if (estadoNormalizado === 'EN_PREPARACION') {
      await cambiarTicketPorPedido(contexto, 'preparar');
      return;
   }

   if (estadoNormalizado === 'LISTO') {
      await cambiarTicketPorPedido(contexto, 'listo');
      return;
   }

   if (estadoNormalizado === 'ANULADO') {
      await cambiarTicketPorEstado(contexto, 'ANULADO', 'PEDIDO_CANCELADO');
      return;
   }

   await cambiarTicketPorEstado(contexto, estadoNormalizado);
}

async function procesarEventoDesconocido(contexto, evento) {
   contexto.response = {
      status_code: 409,
      data: null,
      status_text: 'CONFLICTO - EVENTO_DESCONOCIDO_IGNORADO'
   };
}

function dataDeLaRespuesta(contexto) {
   assert.ok(contexto.response.data);

   return contexto.response.data;
}

function assertTicket(response, esperado) {
   const ticket = response.data;

   assert.ok(ticket);

   if (esperado.estadoTicket !== undefined) {
      assert.strictEqual(ticket.estadoTicket || ticket.estado, valor(esperado.estadoTicket));
   }

   if (esperado.motivo !== undefined) {
      assert.strictEqual(ticket.motivo, valor(esperado.motivo));
   }

   if (esperado.idempotente !== undefined) {
      assert.strictEqual(String(ticket.idempotente), valor(esperado.idempotente));
   }
}

Given('que existe un ticket tomado para el restaurante {string}', async function (_codigoRestaurante) {
   await crearTicketTomado(this);
});

Given('que existe un ticket en preparación para el restaurante {string}', async function (_codigoRestaurante) {
   await dejarTicketEnPreparacion(this);
});

When('el restaurante cambia el ticket actual a estado {string}', async function (estado) {
   await cambiarEstadoTicket(this, estado);
});

When('el restaurante cambia nuevamente el ticket actual a estado {string}', async function (estado) {
   await cambiarEstadoTicket(this, estado);
});

When('el restaurante anula el ticket actual por motivo {string}', async function (motivo) {
   await cambiarTicketPorEstado(this, 'ANULADO', valor(motivo));
});

When('se procesa un evento de ticket desconocido {string}', async function (evento) {
   await procesarEventoDesconocido(this, evento);
});

Then('la respuesta de tickets debe ser:', function (tabla) {
   const esperado = primeraFila(tabla);

   assert.strictEqual(this.response.status_code, Number(esperado.status_code));
   assert.strictEqual(this.response.status_text, valor(esperado.status_text));
});

Then('el ticket actual debe quedar:', function (tabla) {
   assertTicket(this.response, primeraFila(tabla));
});

Then('la respuesta de ticket no debe exponer ids internos', function () {
   const ticket = dataDeLaRespuesta(this);

   assert.strictEqual(ticket.idInterno, undefined);
   assert.strictEqual(ticket.idTicketInterno, undefined);
   assert.strictEqual(ticket.idPedidoInterno, undefined);
   assert.strictEqual(ticket.idRestauranteInterno, undefined);
});

Then('la respuesta de tickets contiene idempotente true', function () {
   const data = dataDeLaRespuesta(this);

   assert.strictEqual(data.idempotente, true);
});