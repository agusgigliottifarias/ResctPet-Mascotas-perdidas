const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

const URL_BASE = process.env.BASE_URL || 'http://backend:8080';

function primeraFila(tabla) {
   return tabla.hashes()[0];
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

async function registrarConsumidor(consumidor) {
   return enviarPost('/api/consumidores', consumidor);
}

async function iniciarSesionConsumidor(credenciales) {
   return enviarPost('/api/consumidores/login', credenciales);
}

Given('que el sistema CPL está operativo', function () {
});

Given('el consumidor registrado:', async function (tabla) {
   this.response = await registrarConsumidor(primeraFila(tabla));

   assert.strictEqual(this.response.status_code, 200);
});

When('se registra el consumidor:', async function (tabla) {
   this.response = await registrarConsumidor(primeraFila(tabla));
});

When('el consumidor inicia sesión:', async function (tabla) {
   this.response = await iniciarSesionConsumidor(primeraFila(tabla));
});

Then('la respuesta debe ser:', function (tabla) {
   const esperado = primeraFila(tabla);

   assert.strictEqual(this.response.status_code, Number(esperado.status_code));
   assert.strictEqual(this.response.status_text, esperado.status_text);
});

Then('la respuesta contiene el consumidor:', function (tabla) {
   const esperado = primeraFila(tabla);
   const consumidor = this.response.data;

   assert.strictEqual(consumidor.nombre, esperado.nombre);
   assert.strictEqual(consumidor.email, esperado.email);
});