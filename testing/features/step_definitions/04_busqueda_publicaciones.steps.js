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

Given('existen publicaciones registradas con diferentes especies en el sistema', async function () {
  this.precondicionVerificada = true;
});

Given('existen publicaciones de tipo perdida y encontrada en el sistema', async function () {
  this.precondicionVerificada = true;
});

When('se solicita filtrar las publicaciones por especie {string}', async function (especie) {
  this.response = await hacerGet(
    `/api/publicaciones/buscar?especie=${encodeURIComponent(especie)}`
  );
});

When('se solicita filtrar las publicaciones por tipo {string}', async function (tipo) {
  this.response = await hacerGet(
    `/api/publicaciones/buscar?tipoPublicacion=${encodeURIComponent(tipo)}`
  );
});

Then('la respuesta HTTP del filtro debe ser status {int}', function (statusCodeEsperado) {
  assert.strictEqual(
    this.response.httpStatus,
    statusCodeEsperado
  );
});

Then('todas las publicaciones devueltas deben pertenecer a la especie {string}', function (especieEsperada) {
  const data = obtenerPublicaciones(this.response.body);

  assert.ok(
    Array.isArray(data),
    'La respuesta debe contener una lista de publicaciones'
  );

  for (const pub of data) {
    assert.strictEqual(
      pub.especie,
      especieEsperada,
      `Se esperaba especie "${especieEsperada}" pero se encontró "${pub.especie}"`
    );
  }
});

Then('todas las publicaciones devueltas deben ser de tipo {string}', function (tipoEsperado) {
  const data = obtenerPublicaciones(this.response.body);

  assert.ok(
    Array.isArray(data),
    'La respuesta debe contener una lista de publicaciones'
  );

  for (const pub of data) {
    assert.strictEqual(
      pub.tipoPublicacion,
      tipoEsperado,
      `Se esperaba tipo de publicación "${tipoEsperado}" pero se encontró "${pub.tipoPublicacion}"`
    );
  }
});

Then('la lista de publicaciones filtradas debe estar vacía', function () {
  const data = obtenerPublicaciones(this.response.body);

  assert.ok(
    Array.isArray(data),
    'La respuesta debe contener una lista de publicaciones'
  );

  assert.strictEqual(
    data.length,
    0,
    'La lista de publicaciones filtradas debería estar vacía'
  );
});