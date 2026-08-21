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

function rutaRankingRestaurantes(periodo, metrica, orden, zona, pagina, tamano) {
   const parametros = new URLSearchParams();

   parametros.append('periodo', periodo);
   parametros.append('metrica', metrica);
   parametros.append('orden', orden);
   parametros.append('zona', zona);
   parametros.append('page', pagina);
   parametros.append('size', tamano);

   return '/ranking/restaurantes?' + parametros.toString();
}

function primeraFila(tabla) {
   return tabla.hashes()[0];
}

When('se consulta el ranking de restaurantes con periodo {string}, metrica {string}, orden {string}, zona {string}, pagina {int} y tamaño {int}',
   async function (periodo, metrica, orden, zona, pagina, tamano) {
      const ruta = rutaRankingRestaurantes(
         periodo,
         metrica,
         orden,
         zona,
         pagina,
         tamano
      );

      this.response = await consultarRanking(ruta);
   }
);

Then('la respuesta del ranking de restaurantes debe ser:', function (tabla) {
   const esperado = primeraFila(tabla);

   assert.strictEqual(this.response.status_code, Number(esperado.status_code));
   assert.strictEqual(this.response.status_text, esperado.status_text);
});

Then('el ranking de restaurantes contiene la metrica {string}', function (metrica) {
   assert.ok(this.response.data);
   assert.strictEqual(this.response.data.metrica, metrica);
});

Then('el ranking de restaurantes contiene el periodo {string}', function (periodo) {
   assert.ok(this.response.data);
   assert.strictEqual(this.response.data.periodo, periodo);
});

Then('el ranking de restaurantes contiene la zona {string}', function (zona) {
   assert.ok(this.response.data);
   assert.strictEqual(this.response.data.zona, zona);
});

Then('el ranking de restaurantes contiene items', function () {
   assert.ok(this.response.data);
   assert.ok(Array.isArray(this.response.data.items));
});

Then('el ranking de restaurantes está vacío', function () {
   assert.ok(this.response.data);
   assert.ok(Array.isArray(this.response.data.items));
   assert.strictEqual(this.response.data.items.length, 0);
});