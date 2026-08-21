const assert = require('assert');
const { When, Then } = require('@cucumber/cucumber');

const URL_BASE = process.env.BASE_URL || 'http://backend:8080';

function primeraFila(tabla) {
   return tabla.hashes()[0];
}

function tieneValor(valor) {
   return valor !== undefined && valor !== null && String(valor).trim() !== '';
}

function agregarParametro(parametros, nombre, valor) {
   if (tieneValor(valor)) {
      parametros.append(nombre, String(valor).trim());
   }
}

function rutaRestaurantes(filtros) {
   const parametros = new URLSearchParams();

   agregarParametro(parametros, 'page', filtros.page);
   agregarParametro(parametros, 'size', filtros.size);
   agregarParametro(parametros, 'nombreContiene', filtros.nombre);
   agregarParametro(parametros, 'tipoCocina', filtros.tipoCocina);
   agregarParametro(parametros, 'ciudad', filtros.ciudad);
   agregarParametro(parametros, 'aceptaPedidos', filtros.aceptaPedidos);
   agregarParametro(parametros, 'lat', filtros.lat);
   agregarParametro(parametros, 'lon', filtros.lon);
   agregarParametro(parametros, 'radioKm', filtros.radioKm);

   return '/api/restaurantes?' + parametros.toString();
}

async function consultarRestaurantes(filtros) {
   const ruta = rutaRestaurantes(filtros);

   const response = await fetch(URL_BASE + ruta, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json'
      }
   });

   return response.json();
}

function restaurantesDeLaRespuesta(response) {
   return response.data.restaurants;
}

function paginaDeLaRespuesta(response) {
   return response.data.page;
}

function texto(valor) {
   return String(valor).trim().toLowerCase();
}

function assertRestauranteCumple(restaurante, esperado) {
   if (tieneValor(esperado.nombre)) {
      assert.ok(texto(restaurante.nombre).includes(texto(esperado.nombre)));
   }

   if (tieneValor(esperado.tipoCocina)) {
      assert.strictEqual(restaurante.tipoCocina, esperado.tipoCocina);
   }

   if (tieneValor(esperado.ciudad)) {
      assert.strictEqual(texto(restaurante.ciudad), texto(esperado.ciudad));
   }

   if (tieneValor(esperado.aceptaPedidos)) {
      assert.strictEqual(String(restaurante.aceptaPedidos), esperado.aceptaPedidos);
   }
}

When('se consultan restaurantes:', async function (tabla) {
   this.response = await consultarRestaurantes(primeraFila(tabla));
});

Then('la respuesta de restaurantes debe ser:', function (tabla) {
   const esperado = primeraFila(tabla);

   assert.strictEqual(this.response.status_code, Number(esperado.status_code));
   assert.strictEqual(this.response.status_text, esperado.status_text);
});

Then('la página de restaurantes debe ser:', function (tabla) {
   const esperado = primeraFila(tabla);
   const pagina = paginaDeLaRespuesta(this.response);

   assert.strictEqual(pagina.number, Number(esperado.page));
   assert.strictEqual(pagina.size, Number(esperado.size));
});

Then('existen restaurantes en la respuesta', function () {
   const restaurantes = restaurantesDeLaRespuesta(this.response);

   assert.ok(restaurantes.length > 0);
});

Then('no existen restaurantes en la respuesta', function () {
   const restaurantes = restaurantesDeLaRespuesta(this.response);
   const pagina = paginaDeLaRespuesta(this.response);

   assert.strictEqual(restaurantes.length, 0);
   assert.strictEqual(pagina.totalElements, 0);
});

Then('los restaurantes listados deben cumplir:', function (tabla) {
   const esperado = primeraFila(tabla);
   const restaurantes = restaurantesDeLaRespuesta(this.response);

   restaurantes.forEach(function (restaurante) {
      assertRestauranteCumple(restaurante, esperado);
   });
});

Then('los restaurantes listados no deben exponer ids internos', function () {
   const restaurantes = restaurantesDeLaRespuesta(this.response);

   restaurantes.forEach(function (restaurante) {
      assert.strictEqual(restaurante.idRestaurante, undefined);
      assert.ok(restaurante.codigo);
   });
});