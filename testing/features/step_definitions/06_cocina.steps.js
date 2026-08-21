const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

const URL_BASE = process.env.BASE_URL || 'http://backend:8080';

const RESTAURANTE = 'R-1001';
const ITEM = 'I-3001';
const PASSWORD = 'Test#2025';

function valor(v) {
  return v === undefined || v === null
    ? ''
    : String(v).trim();
}

function primeraFila(tabla) {
  return tabla.hashes()[0];
}

function direccionEntregaBase() {
  return {
    calle: 'Roca',
    numero: '123',
    ciudad: 'Puerto Madryn',
    provincia: 'Chubut',
    ubicacion: [-42.77, -65.03]
  };
}

function listoParaEn(minutos) {
  return new Date(Date.now() + minutos * 60000).toISOString();
}

function minutosSegunTiempo(tiempo) {
  if (valor(tiempo) === 'vencido') {
    return -10;
  }

  return 20;
}

async function request(method, endpoint, body) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(URL_BASE + endpoint, options);
  return response.json();
}

async function post(endpoint, body) {
  return request('POST', endpoint, body);
}

async function put(endpoint, body) {
  return request('PUT', endpoint, body);
}

async function get(endpoint) {
  return request('GET', endpoint);
}

function assertPreparacionExitosa(response, mensaje) {
  assert.strictEqual(response.status_code, 200, mensaje);
}

function assertRespuesta(response, esperado) {
  assert.strictEqual(response.status_code, Number(esperado.status_code));
  assert.strictEqual(response.status_text, valor(esperado.status_text));
}

async function crearConsumidor(email) {
  const response = await post('/api/consumidores', {
    nombre: 'Consumidor ' + valor(email),
    email: valor(email),
    password: PASSWORD
  });

  assertPreparacionExitosa(response, 'No se pudo crear consumidor');

  return response.data;
}

async function crearPedido(email) {
  const response = await post('/pedidos', {
    emailConsumidor: valor(email),
    codigoRestaurante: RESTAURANTE,
    metodoPago: 'EFECTIVO',
    direccionEntrega: direccionEntregaBase(),
    lineas: [
      {
        codigoItem: ITEM,
        cantidad: 1,
        adicionales: []
      }
    ]
  });

  assertPreparacionExitosa(response, 'No se pudo crear pedido');
  assert.ok(response.data.codigoPedido);

  return response.data;
}

async function pagarPedido(pedido, email) {
  const response = await post('/pagos', {
    codigoPedido: pedido.codigoPedido,
    emailConsumidor: valor(email),
    monto: pedido.total,
    metodo: 'EFECTIVO',
    accion: 'CAPTURAR'
  });

  assertPreparacionExitosa(response, 'No se pudo pagar pedido');

  return response.data.pedido || pedido;
}

async function aceptarPedido(pedido, codigoRestaurante, minutos) {
  return put(
    '/pedidos/' + pedido.codigoPedido
    + '/aceptar?codigoRestaurante=' + valor(codigoRestaurante)
    + '&listoPara=' + encodeURIComponent(listoParaEn(minutos))
  );
}

async function obtenerTicketDePedido(pedido) {
  const response = await get('/tickets/pedido/' + pedido.codigoPedido);

  assertPreparacionExitosa(response, 'No se pudo obtener ticket');
  assert.ok(response.data.codigo);

  return response.data;
}

async function iniciarPreparacionTicket(codigoTicket, codigoRestaurante) {
  return post(
    '/tickets/restaurantes/' +
    valor(codigoRestaurante) +
    '/tickets/' +
    valor(codigoTicket) +
    '/en-preparacion',
    {}
  );
}

async function marcarTicketListo(codigoTicket, codigoRestaurante) {
  return post(
    '/tickets/restaurantes/' +
    valor(codigoRestaurante) +
    '/tickets/' +
    valor(codigoTicket) +
    '/listo',
    {}
  );
}

async function crearPedidoEntrante(contexto, email) {
  contexto.emailActual = valor(email);

  await crearConsumidor(contexto.emailActual);
  contexto.pedidoActual = await crearPedido(contexto.emailActual);
}

async function pagarPedidoEntrante(contexto, email) {
  contexto.pedidoActual = await pagarPedido(contexto.pedidoActual, email);
}

async function aceptarPedidoEntrante(contexto, codigoRestaurante, minutos) {
  contexto.response = await aceptarPedido(
    contexto.pedidoActual,
    codigoRestaurante,
    minutos
  );

  if (contexto.response.data) {
    contexto.pedidoActual = contexto.response.data;
  }

  return contexto.response;
}

async function aceptarPedidoYObtenerTicket(contexto, codigoRestaurante) {
  const response = await aceptarPedido(
    contexto.pedidoActual,
    codigoRestaurante,
    20
  );

  assertPreparacionExitosa(response, 'No se pudo aceptar pedido');

  contexto.pedidoActual = response.data;
  contexto.ticketActual = await obtenerTicketDePedido(contexto.pedidoActual);
  contexto.codigoTicketActual = contexto.ticketActual.codigo;
}

async function prepararTicketEnPreparacion(contexto, codigoRestaurante) {
  contexto.emailActual = 'ticket.' + Date.now() + '@cpl.test';

  await crearPedidoEntrante(contexto, contexto.emailActual);
  await pagarPedidoEntrante(contexto, contexto.emailActual);
  await aceptarPedidoYObtenerTicket(contexto, codigoRestaurante);

  contexto.response = await iniciarPreparacionTicket(
    contexto.codigoTicketActual,
    codigoRestaurante
  );

  assertPreparacionExitosa(
    contexto.response,
    'No se pudo iniciar preparación'
  );

  contexto.ticketActual = contexto.response.data;
}

async function prepararTicketListo(contexto, codigoRestaurante) {
  await prepararTicketEnPreparacion(contexto, codigoRestaurante);

  contexto.response = await marcarTicketListo(
    contexto.codigoTicketActual,
    codigoRestaurante
  );

  assertPreparacionExitosa(
    contexto.response,
    'No se pudo marcar listo'
  );

  contexto.ticketActual = contexto.response.data;
}

function assertAceptacionPedido(response, esperado) {
  const data = response.data;

  assert.ok(data);
  assert.strictEqual(data.estadoPedido, valor(esperado.estadoPedido));
  assert.strictEqual(data.restaurante.codigoRestaurante, valor(esperado.codigoRestaurante));
  assert.ok(data.ticket);
  assert.strictEqual(data.ticket.estado, valor(esperado.estadoTicket));
}

function assertAceptacionSiCorresponde(response, esperado) {
  if (Number(response.status_code) !== 200) {
    return;
  }

  assertAceptacionPedido(response, esperado);
}

function assertTieneTiempoComprometido(response) {
  assert.ok(response.data.ticket.estimadoListo);
}

function assertTieneTiempoComprometidoSiCorresponde(response) {
  if (Number(response.status_code) !== 200) {
    return;
  }

  assertTieneTiempoComprometido(response);
}

function assertAceptacionNoExponeIds(response) {
  const data = response.data;

  assert.strictEqual(data.idPedido, undefined);
  assert.strictEqual(data.restaurante.idRestaurante, undefined);
  assert.strictEqual(data.ticket.idTicket, undefined);
}

function assertAceptacionNoExponeIdsSiCorresponde(response) {
  if (Number(response.status_code) !== 200) {
    return;
  }

  assertAceptacionNoExponeIds(response);
}

function assertTicketEnEstado(response, estado) {
  const data = response.data;

  assert.ok(data);
  assert.strictEqual(data.estadoTicket || data.estado, valor(estado));
}

function assertTicketTieneListoPara(response) {
  assert.ok(response.data.listoPara);
}

function assertTicketNoExponeIds(response) {
  const data = response.data;

  assert.strictEqual(data.idInterno, undefined);
  assert.strictEqual(data.idTicketInterno, undefined);
}

function assertIdempotente(response) {
  assert.strictEqual(response.data.idempotente, true);
}

Given('que existe un pedido entrante creado para el consumidor {string}', async function (email) {
  await crearPedidoEntrante(this, email);
});

Given('el consumidor {string} paga el pedido entrante actual', async function (email) {
  await pagarPedidoEntrante(this, email);
});

Given('el restaurante acepta previamente el pedido entrante actual', async function () {
  const response = await aceptarPedidoEntrante(this, RESTAURANTE, 20);

  assertPreparacionExitosa(
    response,
    'No se pudo aceptar pedido previamente'
  );
});

Given('si corresponde el consumidor {string} paga el pedido entrante actual según {string}',
  async function (email, requierePago) {
    if (valor(requierePago) !== 'si') {
      return;
    }

    await pagarPedidoEntrante(this, email);
  }
);

Given('si corresponde el restaurante acepta previamente el pedido entrante actual según {string}',
  async function (aceptadoPreviamente) {
    if (valor(aceptadoPreviamente) !== 'si') {
      return;
    }

    const response = await aceptarPedidoEntrante(this, RESTAURANTE, 20);

    assertPreparacionExitosa(
      response,
      'No se pudo aceptar pedido previamente'
    );
  }
);

Given('que existe un ticket en preparación para cocina del restaurante {string}',
  async function (codigoRestaurante) {
    await prepararTicketEnPreparacion(this, codigoRestaurante);
  }
);

Given('que existe un ticket listo para cocina del restaurante {string}',
  async function (codigoRestaurante) {
    await prepararTicketListo(this, codigoRestaurante);
  }
);

When('el restaurante acepta el pedido entrante actual con tiempo comprometido',
  async function () {
    await aceptarPedidoEntrante(this, RESTAURANTE, 20);
  }
);

When('otro restaurante intenta aceptar el pedido entrante actual', async function () {
  await aceptarPedidoEntrante(this, 'R-1002', 20);
});

When('el restaurante intenta aceptar el pedido entrante actual con tiempo comprometido vencido',
  async function () {
    await aceptarPedidoEntrante(this, RESTAURANTE, -10);
  }
);

When('el restaurante acepta nuevamente el pedido entrante actual', async function () {
  await aceptarPedidoEntrante(this, RESTAURANTE, 20);
});

When('el restaurante intenta aceptar el pedido entrante actual usando {string} y tiempo {string}',
  async function (codigoRestaurante, tiempo) {
    await aceptarPedidoEntrante(
      this,
      codigoRestaurante,
      minutosSegunTiempo(tiempo)
    );
  }
);

When('el restaurante intenta aceptar el pedido entrante inexistente {string}',
  async function (codigoPedido) {
    this.response = await put(
      '/pedidos/' + valor(codigoPedido)
      + '/aceptar?codigoRestaurante=' + RESTAURANTE
      + '&listoPara=' + encodeURIComponent(listoParaEn(20))
    );
  }
);

When('el restaurante {string} inicia la preparación del ticket',
  async function (codigoRestaurante) {
    this.response = await iniciarPreparacionTicket(
      this.codigoTicketActual,
      codigoRestaurante
    );

    if (this.response.data) {
      this.ticketActual = this.response.data;
    }
  }
);

When('el restaurante {string} marca listo el ticket',
  async function (codigoRestaurante) {
    this.response = await marcarTicketListo(
      this.codigoTicketActual,
      codigoRestaurante
    );

    if (this.response.data) {
      this.ticketActual = this.response.data;
    }
  }
);

When('el restaurante {string} inicia la preparación del ticket {string}',
  async function (codigoRestaurante, codigoTicket) {
    this.response = await iniciarPreparacionTicket(
      codigoTicket,
      codigoRestaurante
    );
  }
);

Then('la respuesta de aceptar pedido entrante debe ser:', function (tabla) {
  assertRespuesta(this.response, primeraFila(tabla));
});

Then('la aceptación del pedido entrante debe dejar:', function (tabla) {
  assertAceptacionPedido(this.response, primeraFila(tabla));
});

Then('si la aceptación fue exitosa debe dejar:', function (tabla) {
  assertAceptacionSiCorresponde(this.response, primeraFila(tabla));
});

Then('el pedido entrante aceptado debe tener tiempo comprometido', function () {
  assertTieneTiempoComprometido(this.response);
});

Then('si la aceptación fue exitosa debe tener tiempo comprometido', function () {
  assertTieneTiempoComprometidoSiCorresponde(this.response);
});

Then('la respuesta de aceptar pedido entrante no debe exponer ids internos', function () {
  assertAceptacionNoExponeIds(this.response);
});

Then('si la aceptación fue exitosa no debe exponer ids internos', function () {
  assertAceptacionNoExponeIdsSiCorresponde(this.response);
});

Then('la respuesta de ticket debe ser:', function (tabla) {
  assertRespuesta(this.response, primeraFila(tabla));
});

Then('el ticket debe quedar en estado {string}', function (estado) {
  assertTicketEnEstado(this.response, estado);
});

Then('la respuesta del ticket debe contener listoPara', function () {
  assertTicketTieneListoPara(this.response);
});

Then('la respuesta del ticket no debe exponer ids internos', function () {
  assertTicketNoExponeIds(this.response);
});

Then('la respuesta contiene idempotente true', function () {
  assertIdempotente(this.response);
});