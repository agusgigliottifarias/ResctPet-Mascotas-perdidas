const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

const URL_BASE = process.env.BASE_URL || 'http://localhost:8080';

function primeraFila(tabla) {
  const fila = tabla.hashes()[0];
  const resultado = {};
  
  for (const key in fila) {
    if (fila[key] !== '') {
      // Convertir coordenadas y IDs numéricos si están presentes
      if (key === 'latitud' || key === 'longitud') {
        resultado[key] = parseFloat(fila[key]);
      } else if (key === 'usuarioId') {
        resultado[key] = parseInt(fila[key], 10);
      } else {
        resultado[key] = fila[key];
      }
    } else {
      resultado[key] = null;
    }
  }
  return resultado;
}

async function enviarPost(ruta, body) {
  const response = await fetch(URL_BASE + ruta, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const statusCode = response.status;
  const jsonBody = await response.json();
  
  return {
    httpStatus: statusCode,
    body: jsonBody
  };
}

Given('un usuario registrado con id {int}', function (usuarioId) {
  this.usuarioId = usuarioId;
});

When('se crea la publicación de mascota perdida:', async function (tabla) {
  const datosPublicacion = primeraFila(tabla);
  this.response = await enviarPost('/api/publicaciones', datosPublicacion);
});

Then('la respuesta HTTP debe ser status {int}', function (statusCodeEsperado) {
  assert.strictEqual(this.response.httpStatus, statusCodeEsperado);
  assert.strictEqual(this.response.body.status, statusCodeEsperado);
});

Then('el mensaje de la respuesta debe ser {string}', function (mensajeEsperado) {
  assert.strictEqual(this.response.body.message, mensajeEsperado);
});

Then('la respuesta contiene la publicación registrada:', function (tabla) {
  const esperado = primeraFila(tabla);
  const publicacion = this.response.body.data;

  assert.ok(publicacion.id, 'La publicación registrada debe contener un ID generado');
  assert.strictEqual(publicacion.tipoPublicacion, esperado.tipoPublicacion);
  assert.strictEqual(publicacion.especie, esperado.especie);
  assert.strictEqual(publicacion.fecha, esperado.fecha);
  assert.strictEqual(publicacion.caracteristicas, esperado.caracteristicas);
});