const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

const URL_BASE = process.env.BASE_URL || 'http://localhost:8080';

function primeraFila(tabla) {
  const fila = tabla.hashes()[0];
  const resultado = {};

  for (const key in fila) {
    if (fila[key] === '') {
      resultado[key] = null;
      continue;
    }

    if (key === 'latitud' || key === 'longitud') {
      resultado[key] = parseFloat(fila[key]);
    } else if (key === 'usuarioId') {
      resultado[key] = parseInt(fila[key], 10);
    } else {
      resultado[key] = fila[key];
    }
  }

  return resultado;
}

async function enviarPost(ruta, body) {
  const credenciales = Buffer
    .from('test@resctpet.com:123456')
    .toString('base64');

  const response = await fetch(URL_BASE + ruta, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credenciales}`
    },
    body: JSON.stringify(body)
  });

  const jsonBody = await response.json();

  return {
    httpStatus: response.status,
    body: jsonBody
  };
}

Given('un usuario registrado con id {int}', function (usuarioId) {
  this.usuarioId = usuarioId;
});

When('se crea la publicación de mascota perdida:', async function (tabla) {
  const datosPublicacion = primeraFila(tabla);

  this.response = await enviarPost(
    '/api/publicaciones/perdidas',
    datosPublicacion
  );
});

Then('la respuesta HTTP debe ser status {int}', function (statusCodeEsperado) {
  assert.strictEqual(
    this.response.httpStatus,
    statusCodeEsperado
  );

  assert.strictEqual(
    this.response.body.status,
    statusCodeEsperado
  );
});

Then('el mensaje de la respuesta debe ser {string}', function (mensajeEsperado) {
  assert.strictEqual(
    this.response.body.message,
    mensajeEsperado
  );
});

Then('la respuesta contiene la publicación registrada:', function (tabla) {
  const esperado = primeraFila(tabla);
  const publicacion = this.response.body.data;

  assert.ok(
    publicacion,
    'La respuesta debe contener los datos de la publicación'
  );

  assert.ok(
    publicacion.id,
    'La publicación registrada debe contener un ID generado'
  );

  assert.strictEqual(
    publicacion.tipoPublicacion,
    esperado.tipoPublicacion
  );

  assert.strictEqual(
    publicacion.especie,
    esperado.especie
  );

  if (esperado.raza !== undefined && esperado.raza !== null) {
    assert.strictEqual(
      publicacion.raza,
      esperado.raza
    );
  }

  if (esperado.edad !== undefined && esperado.edad !== null) {
    assert.strictEqual(
      publicacion.edad,
      esperado.edad
    );
  }

  assert.strictEqual(
    publicacion.fecha,
    esperado.fecha
  );

  assert.strictEqual(
    publicacion.caracteristicas,
    esperado.caracteristicas
  );

  assert.strictEqual(
    publicacion.fotografia,
    esperado.fotografia
  );

  assert.strictEqual(
    publicacion.latitud,
    esperado.latitud
  );

  assert.strictEqual(
    publicacion.longitud,
    esperado.longitud
  );

  assert.ok(
    publicacion.fechaCreacion,
    'La publicación debe tener fecha de creación'
  );
});