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

Given('existen publicaciones registradas en el sistema', async function () {
  this.precondicionVerificada = true;
});

Given('que existe una publicación con el id {int} en el sistema', async function (id) {
  this.idBuscado = id;

  const resultado = await hacerGet(`/api/publicaciones/${id}`);

  assert.strictEqual(
    resultado.httpStatus,
    200,
    `La publicación con id ${id} debería existir para esta prueba`
  );
});

When('se solicita la lista de todas las publicaciones', async function () {
  this.response = await hacerGet('/api/publicaciones/buscar');
});

When('se solicita la publicación con id {int}', async function (id) {
  this.idBuscado = id;
  this.response = await hacerGet(`/api/publicaciones/${id}`);
});

Then('la respuesta HTTP para consulta debe ser status {int}', function (statusCodeEsperado) {
  assert.strictEqual(
    this.response.httpStatus,
    statusCodeEsperado
  );
});

Then('la lista de publicaciones no debe estar vacía', function () {
  const data = this.response.body.data || this.response.body;

  const publicaciones = Array.isArray(data)
    ? data
    : data.contenido;

  assert.ok(
    Array.isArray(publicaciones),
    'La respuesta debe contener una lista de publicaciones'
  );

  assert.ok(
    publicaciones.length > 0,
    'La lista de publicaciones no debería estar vacía'
  );
});

Then('los detalles de la publicación deben coincidir con el id {int}', function (idEsperado) {
  const publicacion = this.response.body.data || this.response.body;

  assert.ok(
    publicacion,
    'La respuesta debe contener los detalles de la publicación'
  );

  assert.strictEqual(
    publicacion.id,
    idEsperado,
    `El ID de la publicación devuelta debe ser ${idEsperado}`
  );
});

Then('el mensaje de error de consulta debe ser {string}', function (mensajeEsperado) {
  const cuerpo = this.response.body;
  const mensaje = cuerpo.message || cuerpo.error || cuerpo.raw;

  assert.ok(
    mensaje.includes(mensajeEsperado),
    `Se esperaba un mensaje que contenga "${mensajeEsperado}", pero se obtuvo "${mensaje}"`
  );
});
