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

Given(
  'que existe una publicación con el id {int} en el sistema para buscar coincidencias',
  async function (id) {
    this.idPublicacion = id;

    const resultado = await hacerGet(`/api/publicaciones/${id}`);

    assert.strictEqual(
      resultado.httpStatus,
      200,
      `La publicación con id ${id} debería existir para realizar la prueba de coincidencias`
    );
  }
);

When(
  'se solicita la búsqueda de coincidencias para la publicación con id {int}',
  async function (id) {
    this.idPublicacion = id;

    this.response = await hacerGet(
      `/api/publicaciones/${id}/validar-y-buscar`
    );
  }
);

Then(
  'la respuesta HTTP de coincidencias debe ser status {int}',
  function (statusCodeEsperado) {
    assert.strictEqual(
      this.response.httpStatus,
      statusCodeEsperado,
      `Se esperaba un código HTTP ${statusCodeEsperado}, pero se obtuvo ${this.response.httpStatus}`
    );
  }
);

Then(
  'la lista de coincidencias devuelta debe tener una estructura válida',
  function () {
    const data = this.response.body.data || this.response.body;

    assert.ok(
      Array.isArray(data),
      'La respuesta de la API para coincidencias debe ser una lista (array)'
    );
  }
);

Then(
  'el mensaje de error de coincidencias debe ser {string}',
  function (mensajeEsperado) {
    const cuerpo = this.response.body;
    const mensaje = cuerpo.message || cuerpo.error || cuerpo.raw;

    assert.ok(
      mensaje.includes(mensajeEsperado),
      `Se esperaba un mensaje que contenga "${mensajeEsperado}", pero se obtuvo "${mensaje}"`
    );
  }
);