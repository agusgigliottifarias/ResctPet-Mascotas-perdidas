const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

const URL_BASE = process.env.BASE_URL || 'http://backend:8080';

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

async function enviarGet(ruta) {
   const response = await fetch(URL_BASE + ruta, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json'
      }
   });

   return response.json();
}

function primeraFila(tabla) {
   return tabla.hashes()[0];
}

function eventoDesdeTabla(tabla) {
   const fila = primeraFila(tabla);

   return {
      eventId: fila.eventId,
      eventType: fila.eventType,
      idPedido: fila.idPedido,
      timestamp: fila.timestamp,
      actorTipo: fila.actorTipo,
      payload: fila.payload
   };
}

async function registrarEvento(tabla) {
   const evento = eventoDesdeTabla(tabla);

   return enviarPost('/trazabilidad/eventos', evento);
}

function rutaTrazabilidadPedido(codigoPedido) {
   const parametros = new URLSearchParams();

   parametros.append('page', '0');
   parametros.append('size', '50');

   return '/pedidos/' + codigoPedido + '/trazabilidad?' + parametros.toString();
}

Given('que se registró el evento de trazabilidad:', async function (tabla) {
   await registrarEvento(tabla);
});

When('se registra el evento de trazabilidad:', async function (tabla) {
   this.response = await registrarEvento(tabla);
});

When('se registra nuevamente el evento de trazabilidad:', async function (tabla) {
   this.response = await registrarEvento(tabla);
});

When('se consulta la trazabilidad del pedido {string}', async function (codigoPedido) {
   const ruta = rutaTrazabilidadPedido(codigoPedido);

   this.response = await enviarGet(ruta);
});

Then('la respuesta de trazabilidad debe ser:', function (tabla) {
   const esperado = primeraFila(tabla);

   assert.strictEqual(this.response.status_code, Number(esperado.status_code));
   assert.strictEqual(this.response.status_text, esperado.status_text);
});

Then('la respuesta contiene el evento de trazabilidad:', function (tabla) {
   const esperado = primeraFila(tabla);
   const data = this.response.data;

   assert.strictEqual(data.idPedido, esperado.idPedido);
   assert.strictEqual(data.eventId, esperado.eventId);
   assert.strictEqual(String(data.idempotente), esperado.idempotente);
});

Then('el timeline contiene el evento:', function (tabla) {
   const esperado = primeraFila(tabla);
   const timeline = this.response.data.timeline;

   const encontrado = timeline.find(function (evento) {
      return evento.eventId === esperado.eventId;
   });

   assert.ok(encontrado, 'No se encontró el evento esperado');
   assert.strictEqual(encontrado.eventType, esperado.eventType);
   assert.strictEqual(encontrado.idPedido, esperado.idPedido);
});