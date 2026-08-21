const assert = require('assert');
const { When, Then } = require('@cucumber/cucumber');

const URL_BASE = process.env.BASE_URL || 'http://backend:8080';

async function consultarSaldo(ruta) {
   const response = await fetch(URL_BASE + ruta, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json'
      }
   });

   return response.json();
}

function rutaSaldoRepartidor(codigoRepartidor) {
   return '/repartidores/' + codigoRepartidor + '/saldo';
}

function agregarParametros(ruta, parametros) {
   const query = new URLSearchParams(parametros).toString();
   const separador = ruta.includes('?') ? '&' : '?';

   return ruta + separador + query;
}

function primeraFila(tabla) {
   return tabla.hashes()[0];
}

When('se consulta el saldo del repartidor {string}', async function (codigoRepartidor) {
   const ruta = rutaSaldoRepartidor(codigoRepartidor);

   this.response = await consultarSaldo(ruta);
});

When('se consulta el saldo del repartidor {string} con paginación size {string}', async function (codigoRepartidor, size) {
   const ruta = agregarParametros(
      rutaSaldoRepartidor(codigoRepartidor),
      {
         page: '0',
         size: size
      }
   );

   this.response = await consultarSaldo(ruta);
});

When('se consulta el saldo del repartidor {string} desde {string} hasta {string}', async function (codigoRepartidor, desde, hasta) {
   const ruta = agregarParametros(
      rutaSaldoRepartidor(codigoRepartidor),
      {
         desde: desde,
         hasta: hasta,
         page: '0',
         size: '20'
      }
   );

   this.response = await consultarSaldo(ruta);
});

Then('la respuesta de saldo debe ser:', function (tabla) {
   const esperado = primeraFila(tabla);

   assert.equal(this.response.status_code, Number(esperado.status_code));
   assert.equal(this.response.status_text, esperado.status_text);
});

Then('el saldo del repartidor debe contener:', function (tabla) {
   const esperado = primeraFila(tabla);
   const saldo = this.response.data;

   assert.equal(saldo.idRepartidor, esperado.idRepartidor);
   assert.equal(saldo.moneda, esperado.moneda);
   assert.ok(Number(saldo.saldoLiquidable) >= Number(esperado.saldoLiquidable));
});