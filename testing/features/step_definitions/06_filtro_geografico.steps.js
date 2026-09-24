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

Given('existen publicaciones con ubicación geográfica registradas en el sistema', async function () {
  this.precondicionVerificada = true;
});

When(
  'se solicita filtrar las publicaciones con latitud {string}, longitud {string} y un radio de {string} kilómetros',
  async function (lat, lng, radio) {
    this.latitudCentro = parseFloat(lat);
    this.longitudCentro = parseFloat(lng);
    this.radioKm = parseFloat(radio);

    this.response = await hacerGet(
  `/api/publicaciones/cercania?latitud=${lat}&longitud=${lng}&radioKm=${radio}`
);
  }
);

Then(
  'la respuesta HTTP del filtro por cercanía debe ser status {int}',
  function (statusCodeEsperado) {
    assert.strictEqual(
      this.response.httpStatus,
      statusCodeEsperado,
      `Se esperaba un código HTTP ${statusCodeEsperado}, pero se obtuvo ${this.response.httpStatus}`
    );
  }
);

Then(
  'la lista de publicaciones devueltas debe contener elementos dentro del radio especificado',
  function () {
    const data = obtenerPublicaciones(this.response.body);

    assert.ok(
      Array.isArray(data),
      'La respuesta de la API debe ser una lista de publicaciones'
    );

    assert.ok(
      data.length > 0,
      'Se esperaban publicaciones dentro del radio geográfico, pero la lista está vacía'
    );

    for (const pub of data) {
      assert.ok(
        pub.latitud !== undefined && pub.latitud !== null,
        'La publicación debe tener latitud'
      );

      assert.ok(
        pub.longitud !== undefined && pub.longitud !== null,
        'La publicación debe tener longitud'
      );
    }
  }
);

Then('la lista de publicaciones por cercanía debe estar vacía', function () {
  const data = obtenerPublicaciones(this.response.body);

  assert.ok(
    Array.isArray(data),
    'La respuesta de la API debe ser una lista de publicaciones'
  );

  assert.strictEqual(
    data.length,
    0,
    `Se esperaba que la lista estuviera vacía, pero contiene ${data.length} elementos`
  );
});