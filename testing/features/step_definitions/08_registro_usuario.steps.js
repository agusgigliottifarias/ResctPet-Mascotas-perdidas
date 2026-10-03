const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

const URL_BASE = process.env.BASE_URL || 'http://backend:8080';

async function hacerPost(ruta, datos) {
  const response = await fetch(URL_BASE + ruta, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  });

  const textoRespuesta = await response.text();

  let jsonBody = null;

  try {
    jsonBody = JSON.parse(textoRespuesta);
  } catch (e) {
    jsonBody = {
      raw: textoRespuesta
    };
  }

  return {
    httpStatus: response.status,
    body: jsonBody
  };
}

Given(
  'que se cuenta con un nuevo usuario con nombre {string}, apellido {string}, correo {string} y contraseña {string}',
  function (nombre, apellido, email, password) {

    this.usuarioRequest = {
      nombre: nombre,
      apellido: apellido,
      email: email,
      password: password
    };
  }
);

Given(
  'se cuenta con un nuevo usuario con nombre {string}, apellido {string}, correo {string} y contraseña {string}',
  function (nombre, apellido, email, password) {

    this.usuarioRequest = {
      nombre: nombre,
      apellido: apellido,
      email: email,
      password: password
    };
  }
);

Given(
  'que ya existe un usuario registrado con el correo {string}',
  async function (email) {

    const usuarioDuplicado = {
      nombre: 'Usuario',
      apellido: 'Base',
      email: email,
      password: 'password123'
    };

    await hacerPost(
      '/api/usuarios/registro',
      usuarioDuplicado
    );
  }
);

When(
  'se envía la solicitud de registro al endpoint {string}',
  async function (ruta) {

    this.response = await hacerPost(
      ruta,
      this.usuarioRequest
    );
  }
);

Then(
  'la respuesta HTTP del registro debe ser status {int}',
  function (statusCodeEsperado) {

    assert.strictEqual(
      this.response.httpStatus,
      statusCodeEsperado,
      `Se esperaba un código HTTP ${statusCodeEsperado}, pero se obtuvo ${this.response.httpStatus}`
    );
  }
);

Then(
  'el cuerpo de la respuesta debe contener el correo {string}',
  function (emailEsperado) {

    const data =
      this.response.body.data ||
      this.response.body;

    assert.ok(
      data,
      'El cuerpo de la respuesta no debe estar vacío'
    );

    assert.strictEqual(
      data.email,
      emailEsperado,
      `Se esperaba el correo ${emailEsperado}, pero se obtuvo ${data.email}`
    );
  }
);

Then(
  'el mensaje de error del registro debe indicar que el correo electrónico ya se encuentra registrado',
  function () {

    const mensaje =
      this.response.body.message ||
      this.response.body.raw ||
      '';

    assert.ok(
      mensaje.includes(
        'correo electrónico ya se encuentra registrado'
      ),
      `Se esperaba un mensaje de error por correo duplicado, pero se obtuvo: "${mensaje}"`
    );
  }
);