const { When } = require('@cucumber/cucumber');

const URL_BASE = process.env.BASE_URL || 'http://backend:8080';

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

When('se crea la publicación de mascota encontrada:', async function (tabla) {
  const datosPublicacion = primeraFila(tabla);

  this.response = await enviarPost(
    '/api/publicaciones',
    datosPublicacion
  );
});