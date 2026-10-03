const { Given, When, Then } = require('@cucumber/cucumber');

const URL_BASE = process.env.BASE_URL || 'http://backend:8080';

let usuarioLogin;
let respuestaLogin;
let cuerpoLogin;

async function hacerPost(ruta, body) {
  const response = await fetch(URL_BASE + ruta, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  let bodyResponse = null;

  try {
    bodyResponse = await response.json();
  } catch (error) {
    bodyResponse = null;
  }

  return {
    status: response.status,
    body: bodyResponse
  };
}

Given('que existe un usuario registrado para iniciar sesión', async function () {
  usuarioLogin = {
    nombre: 'Usuario',
    apellido: 'Login',
    email: `login.test.${Date.now()}@resctpet.com`,
    password: 'password123'
  };

  const respuestaRegistro = await hacerPost(
    '/api/usuarios/registro',
    usuarioLogin
  );

  if (respuestaRegistro.status !== 201) {
    throw new Error(
      `No se pudo crear el usuario de prueba. Status: ${respuestaRegistro.status}`
    );
  }
});

When(
  'se envían las credenciales correctas al endpoint {string}',
  async function (ruta) {
    respuestaLogin = await hacerPost(ruta, {
      email: usuarioLogin.email,
      password: usuarioLogin.password
    });

    cuerpoLogin = respuestaLogin.body;
  }
);

When(
  'se envía una contraseña incorrecta al endpoint {string}',
  async function (ruta) {
    respuestaLogin = await hacerPost(ruta, {
      email: usuarioLogin.email,
      password: 'password_incorrecta'
    });

    cuerpoLogin = respuestaLogin.body;
  }
);

When(
  'se envía un correo inexistente al endpoint {string}',
  async function (ruta) {
    respuestaLogin = await hacerPost(ruta, {
      email: 'correo.inexistente.999999@resctpet.com',
      password: 'password123'
    });

    cuerpoLogin = respuestaLogin.body;
  }
);

When(
  'se envía una solicitud de login sin correo electrónico',
  async function () {
    respuestaLogin = await hacerPost('/api/usuarios/login', {
      password: usuarioLogin.password
    });

    cuerpoLogin = respuestaLogin.body;
  }
);

When(
  'se envía una solicitud de login sin contraseña',
  async function () {
    respuestaLogin = await hacerPost('/api/usuarios/login', {
      email: usuarioLogin.email
    });

    cuerpoLogin = respuestaLogin.body;
  }
);

Then(
  'la respuesta HTTP del login debe ser status {int}',
  function (statusEsperado) {
    if (respuestaLogin.status !== statusEsperado) {
      throw new Error(
        `Se esperaba status ${statusEsperado}, pero se recibió ${respuestaLogin.status}`
      );
    }
  }
);

Then(
  'el mensaje de respuesta debe ser {string}',
  function (mensajeEsperado) {
    if (!cuerpoLogin || cuerpoLogin.message !== mensajeEsperado) {
      throw new Error(
        `Se esperaba el mensaje "${mensajeEsperado}", pero se recibió "${cuerpoLogin?.message}"`
      );
    }
  }
);

Then(
  'la respuesta debe contener un token de autenticación',
  function () {
    const token = cuerpoLogin?.data?.token;

    if (!token) {
      throw new Error(
        'La respuesta de login no contiene un token de autenticación'
      );
    }

    if (typeof token !== 'string') {
      throw new Error(
        'El token de autenticación no es un texto válido'
      );
    }

    const partes = token.split('.');

    if (partes.length !== 3) {
      throw new Error(
        'El token recibido no tiene el formato JWT esperado'
      );
    }
  }
);

Then(
  'el mensaje de error del login debe ser {string}',
  function (mensajeEsperado) {
    if (!cuerpoLogin || cuerpoLogin.message !== mensajeEsperado) {
      throw new Error(
        `Se esperaba el mensaje "${mensajeEsperado}", pero se recibió "${cuerpoLogin?.message}"`
      );
    }
  }
);