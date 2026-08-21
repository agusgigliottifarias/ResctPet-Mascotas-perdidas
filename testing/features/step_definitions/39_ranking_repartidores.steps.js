const assert = require('assert');
const { When, Then } = require('@cucumber/cucumber');

const URL_BASE = process.env.BASE_URL || 'http://backend:8080';

async function consultarRanking(ruta) {
   const response = await fetch(URL_BASE + ruta, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json'
      }
   });

   return response.json();
}

function rutaRankingRepartidores(periodo, metrica, orden, page, size) {
   const parametros = new URLSearchParams();

   parametros.append('periodo', periodo);
   parametros.append('metrica', metrica);
   parametros.append('orden', orden);
   parametros.append('page', page);
   parametros.append('size', size);

   return '/ranking/repartidores?' + parametros.toString();
}

function primeraFila(tabla) {
   return tabla.hashes()[0];
}

When('se consulta el ranking de repartidores con periodo {string}, metrica {string}, orden {string}, page {int} y size {int}',
   async function (periodo, metrica, orden, page, size) {
      const ruta = rutaRankingRepartidores(periodo, metrica, orden, page, size);

      this.response = await consultarRanking(ruta);
   }
);

Then('la respuesta del ranking debe ser:', function (tabla) {
   const esperado = primeraFila(tabla);

   assert.strictEqual(this.response.status_code, Number(esperado.status_code));
   assert.strictEqual(this.response.status_text, esperado.status_text);
});

Then('el ranking contiene repartidores', function () {
   assert.ok(this.response.data);
   assert.ok(Array.isArray(this.response.data.items));
});

Then('el ranking está vacío', function () {
   assert.ok(this.response.data);
   assert.ok(Array.isArray(this.response.data.items));
   assert.strictEqual(this.response.data.items.length, 0);
});