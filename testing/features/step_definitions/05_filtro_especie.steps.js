const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

const URL_BASE = process.env.BASE_URL || 'http://backend:8080';

async function hacerGet(ruta) {
  const response = await fetch(URL_BASE + ruta, {
    method: 'GET'
  });

  const textoRespuesta = await response.text();
  let jsonBody = null;

  try {
    jsonBody = JSON.parse(textoRespuesta);
  } catch (e) {
    jsonBody = { raw: textoRespuesta };
  }

  return {
    httpStatus: response.status,
    body: jsonBody
  };
}

function obtenerPublicaciones(body) {
  const data = body.data || body;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.contenido)) {
    return data.contenido;
  }

  return [];
}

Given('que existen publicaciones de diferentes especies registradas en el sistema', async function () {
  this.precondicionVerificada = true;
});

When('se realiza una consulta filtrando por la especie {string}', async function (especie) {
  this.especieConsultada = especie;

  this.response = await hacerGet(
    `/api/publicaciones/especie/${encodeURIComponent(especie)}`
  );
});

Then('la respuesta HTTP del filtro por especie debe ser status {int}', function (statusCodeEsperado) {
  assert.strictEqual(
    this.response.httpStatus,
    statusCodeEsperado,
    `Se esperaba un código HTTP ${statusCodeEsperado}, pero se obtuvo ${this.response.httpStatus}`
  );
});

Then('todas las publicaciones obtenidas deben corresponder a la especie {string}', function (especieEsperada) {
  const data = obtenerPublicaciones(this.response.body);

  assert.ok(
    Array.isArray(data),
    'La respuesta de la API debe ser una lista de publicaciones'
  );

  assert.ok(
    data.length > 0,
    `Se esperaban publicaciones para la especie ${especieEsperada}, pero la lista está vacía`
  );

  for (const publicacion of data) {
    assert.strictEqual(
      publicacion.especie,
      especieEsperada,
      `Se encontró una publicación con especie "${publicacion.especie}", la cual no coincide con el filtro "${especieEsperada}"`
    );
  }
});

Then('la lista de publicaciones filtradas por especie debe estar vacía', function () {
  const data = obtenerPublicaciones(this.response.body);

  assert.ok(
    Array.isArray(data),
    'La respuesta de la API debe ser una lista de publicaciones'
  );

  assert.strictEqual(
    data.length,
    0,
    `Se esperaba que la lista estuviera vacía para la especie consultada, pero contiene ${data.length} elementos`
  );
});