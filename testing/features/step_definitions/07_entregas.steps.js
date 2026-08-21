const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

const URL_BASE = 'http://backend:8080';

const RESTAURANTE = 'R-1001';
const ITEM = 'I-3001';
const PASSWORD = 'Test#2025';

const REPARTIDORES_PRUEBA = [
  'D-100', 'D-101', 'D-102', 'D-103', 'D-104',
  'D-105', 'D-106', 'D-107', 'D-108', 'D-109',
  'D-110', 'D-111', 'D-112', 'D-113', 'D-114',
  'D-115', 'D-116', 'D-117', 'D-118', 'D-119',
  'D-120', 'D-121', 'D-122', 'D-123', 'D-124',
  'D-125', 'D-126', 'D-127', 'D-128', 'D-129',
  'D-130', 'D-131', 'D-132', 'D-133', 'D-134',
  'D-135', 'D-136', 'D-137', 'D-138', 'D-139'
];

function valor(v) {
  return v === undefined || v === null ? '' : String(v).trim();
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

function emailUnico() {
  return `entrega.${Date.now()}.${Math.floor(Math.random() * 10000)}@cpl.test`;
}

async function request(method, endpoint, body) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {})
  };

  const response = await fetch(`${URL_BASE}${endpoint}`, options);
  return response.json();
}

function get(endpoint) {
  return request('GET', endpoint);
}

function post(endpoint, body) {
  return request('POST', endpoint, body);
}

function put(endpoint, body) {
  return request('PUT', endpoint, body);
}

function assertOk(responseBody, mensaje) {
  assert.strictEqual(
    responseBody.status_code,
    200,
    `${mensaje}: ${JSON.stringify(responseBody)}`
  );
}

function assertRespuestaExitosa(responseBody, esperado) {
  assert.strictEqual(
    responseBody.status_code,
    Number(esperado.status_code),
    JSON.stringify(responseBody)
  );

  if (esperado.status_text) {
    assert.strictEqual(
      responseBody.status_text,
      valor(esperado.status_text),
      JSON.stringify(responseBody)
    );
  }
}

function assertRespuestaError(responseBody, esperado) {
  assert.strictEqual(
    responseBody.status_code,
    Number(esperado.status_code),
    JSON.stringify(responseBody)
  );

  assert.ok(
    responseBody.status_text.includes(valor(esperado.status_text)),
    `Se esperaba ${esperado.status_text} pero llegó ${responseBody.status_text}`
  );
}

function data(responseBody) {
  assert.ok(
    responseBody.data,
    `La respuesta no contiene data: ${JSON.stringify(responseBody)}`
  );

  return responseBody.data;
}

function entregaDe(responseBody) {
  return data(responseBody).entrega;
}

function actualizarPedidoActual(contexto) {
  contexto.pedidoActual = contexto.responseBody.data || contexto.pedidoActual;
}

async function crearConsumidor(email) {
  const responseBody = await post('/api/consumidores', {
    nombre: `Consumidor ${valor(email)}`,
    email: valor(email),
    password: PASSWORD
  });

  assertOk(responseBody, 'No se pudo crear consumidor');
  return responseBody.data;
}

async function crearPedido(email) {
  const responseBody = await post('/pedidos', {
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

  assertOk(responseBody, 'No se pudo crear pedido');
  return responseBody.data;
}

async function pagarPedido(pedido, email) {
  const responseBody = await post('/pagos', {
    codigoPedido: pedido.codigoPedido,
    emailConsumidor: valor(email),
    monto: pedido.total,
    metodo: 'EFECTIVO',
    accion: 'CAPTURAR'
  });

  assertOk(responseBody, 'No se pudo pagar pedido');
  return responseBody.data.pedido || responseBody.data;
}

async function aceptarPedido(pedido) {
  const responseBody = await put(
    `/pedidos/${pedido.codigoPedido}/aceptar?codigoRestaurante=${RESTAURANTE}&listoPara=${encodeURIComponent(listoParaEn(20))}`
  );

  assertOk(responseBody, 'No se pudo aceptar pedido');
  return responseBody.data;
}

function consultarPedido(email, codigoPedido) {
  return get(
    `/pedidos/consumidor/${valor(codigoPedido)}?emailConsumidor=${valor(email)}`
  );
}

async function consultarPedidoActual(contexto) {
  const responseBody = await consultarPedido(
    contexto.emailActual,
    contexto.pedidoActual.codigoPedido
  );

  assertOk(responseBody, 'No se pudo consultar pedido');

  contexto.responseBody = responseBody;
  contexto.pedidoActual = responseBody.data;

  return responseBody;
}

async function obtenerTicketDePedido(pedido) {
  const responseBody = await get(`/tickets/pedido/${pedido.codigoPedido}`);

  assertOk(responseBody, 'No se pudo obtener ticket');
  return responseBody.data;
}

async function ejecutarAccionTicket(codigoTicket, accion) {
  const responseBody = await post(
    `/tickets/restaurantes/${RESTAURANTE}/tickets/${valor(codigoTicket)}/${accion}`,
    {}
  );

  assertOk(responseBody, `No se pudo ejecutar acción de ticket ${accion}`);
  return responseBody.data;
}

function iniciarPreparacionTicket(codigoTicket) {
  return ejecutarAccionTicket(codigoTicket, 'en-preparacion');
}

function marcarTicketListo(codigoTicket) {
  return ejecutarAccionTicket(codigoTicket, 'listo');
}

async function prepararPedidoAceptado(contexto) {
  contexto.emailActual = emailUnico();

  await crearConsumidor(contexto.emailActual);

  contexto.pedidoActual = await crearPedido(contexto.emailActual);
  contexto.pedidoActual = await pagarPedido(contexto.pedidoActual, contexto.emailActual);
  contexto.pedidoActual = await aceptarPedido(contexto.pedidoActual);
}

async function prepararPedidoListoParaReparto(contexto) {
  await prepararPedidoAceptado(contexto);

  contexto.ticketActual = await obtenerTicketDePedido(contexto.pedidoActual);
  contexto.codigoTicketActual = contexto.ticketActual.codigo;

  await iniciarPreparacionTicket(contexto.codigoTicketActual);
  await marcarTicketListo(contexto.codigoTicketActual);

  await consultarPedidoActual(contexto);
}

async function detectarRepartidorAsignado(contexto) {
  for (const codigo of REPARTIDORES_PRUEBA) {
    const responseBody = await get(`/pedidos/repartidor/${codigo}`);

    if (responseBody.status_code !== 200 || !Array.isArray(responseBody.data)) {
      continue;
    }

    const encontrado = responseBody.data.find(
      pedido => pedido.codigoPedido === contexto.pedidoActual.codigoPedido
    );

    if (encontrado) {
      contexto.codigoRepartidorActual = codigo;
      contexto.pedidoActual = encontrado;
      contexto.responseBody = {
        status_code: 200,
        status_text: 'OK',
        data: encontrado
      };
      return codigo;
    }
  }

  assert.fail(
    `No se pudo detectar repartidor asignado para ${contexto.pedidoActual.codigoPedido}`
  );
}

async function obtenerRepartidorAsignado(contexto) {
  if (contexto.codigoRepartidorActual) {
    return contexto.codigoRepartidorActual;
  }

  return detectarRepartidorAsignado(contexto);
}

async function obtenerOtroRepartidor(contexto) {
  const asignado = await obtenerRepartidorAsignado(contexto);

  return REPARTIDORES_PRUEBA.find(codigo => codigo !== asignado) || 'D-101';
}

async function accionRepartidor(contexto, accion, codigoRepartidor) {
  contexto.responseBody = await post(
    `/pedidos/${contexto.pedidoActual.codigoPedido}/${accion}?codigoRepartidor=${valor(codigoRepartidor)}`,
    {}
  );

  actualizarPedidoActual(contexto);
  return contexto.responseBody;
}

function aceptarEntrega(contexto, codigoRepartidor) {
  return accionRepartidor(contexto, 'aceptar-entrega', codigoRepartidor);
}

function llegarAlLocal(contexto, codigoRepartidor) {
  return accionRepartidor(contexto, 'tomar', codigoRepartidor);
}

function retirarPedido(contexto, codigoRepartidor) {
  return accionRepartidor(contexto, 'retirar', codigoRepartidor);
}

function entregarPedido(contexto, codigoRepartidor) {
  return accionRepartidor(contexto, 'entregar', codigoRepartidor);
}

async function prepararPedidoAsignadoAutomaticamente(contexto) {
  await prepararPedidoListoParaReparto(contexto);
  await detectarRepartidorAsignado(contexto);
}

async function prepararPedidoAceptadoPorRepartidor(contexto) {
  await prepararPedidoAsignadoAutomaticamente(contexto);

  const codigoRepartidor = await obtenerRepartidorAsignado(contexto);
  const responseBody = await aceptarEntrega(contexto, codigoRepartidor);

  assertOk(responseBody, 'No se pudo aceptar entrega');
}

async function prepararPedidoEnLocal(contexto) {
  await prepararPedidoAceptadoPorRepartidor(contexto);

  const codigoRepartidor = await obtenerRepartidorAsignado(contexto);
  const responseBody = await llegarAlLocal(contexto, codigoRepartidor);

  assertOk(responseBody, 'No se pudo llegar al local');
}

async function prepararPedidoEnTrayecto(contexto) {
  await prepararPedidoEnLocal(contexto);

  const codigoRepartidor = await obtenerRepartidorAsignado(contexto);
  const responseBody = await retirarPedido(contexto, codigoRepartidor);

  assertOk(responseBody, 'No se pudo retirar pedido');
}

async function prepararPedidoEntregado(contexto) {
  await prepararPedidoEnTrayecto(contexto);

  const codigoRepartidor = await obtenerRepartidorAsignado(contexto);
  const responseBody = await entregarPedido(contexto, codigoRepartidor);

  assertOk(responseBody, 'No se pudo entregar pedido');
}

function assertEntregaAsignadaTieneEta(entrega, estado) {
  if (valor(estado) === 'ASIGNADA') {
    assert.ok(
      entrega.tiempoEstimadoArribo,
      'La entrega asignada debe tener tiempoEstimadoArribo'
    );
  }
}

function assertEntrega(responseBody, esperado) {
  const entrega = entregaDe(responseBody);

  assert.ok(entrega, 'La respuesta no contiene entrega');
  assert.strictEqual(entrega.estado, valor(esperado.estado));

  assertEntregaAsignadaTieneEta(entrega, esperado.estado);
}

function assertPedido(responseBody, esperado) {
  assert.strictEqual(
    responseBody.data.estadoPedido,
    valor(esperado.estadoPedido),
    JSON.stringify(responseBody)
  );
}

function assertMarcarEntrega(responseBody, esperado) {
  assert.strictEqual(
    responseBody.status_code,
    Number(esperado.status_code),
    JSON.stringify(responseBody)
  );

  const entrega = entregaDe(responseBody);

  assert.ok(entrega, 'La respuesta no contiene entrega');
  assert.strictEqual(entrega.estado, valor(esperado.estadoEntrega));

  assert.strictEqual(
    responseBody.data.estadoPedido,
    valor(esperado.estadoPedido),
    JSON.stringify(responseBody)
  );
}

function assertNoExponeIdsInternos(responseBody) {
  const pedido = data(responseBody);
  const entrega = pedido.entrega || {};
  const repartidor = pedido.repartidor || {};

  [
    pedido.idPedido,
    pedido.idEntrega,
    pedido.idRepartidor,
    entrega.idEntrega,
    repartidor.idRepartidor
  ].forEach((campo) => assert.strictEqual(campo, undefined));
}

async function consultarHistorial(contexto) {
  const responseBody = await get(
    `/historial/consumidores/${contexto.emailActual}/pedidos`
  );

  assertOk(responseBody, 'No se pudo consultar historial');
  return responseBody;
}

async function assertHistorialEntregado(contexto) {
  const responseBody = await consultarHistorial(contexto);
  const pedidos = responseBody.data.orders;

  const pedidoHistorial = pedidos.find(
    pedido => pedido.codigoPedido === contexto.pedidoActual.codigoPedido
  );

  assert.ok(pedidoHistorial, 'El pedido no aparece en historial');
  assert.strictEqual(pedidoHistorial.estado, 'ENTREGADO');
}

function assertFechaEntregaReal(responseBody) {
  assert.ok(
    responseBody.data.entrega.fechaHoraEntregaReal,
    'La entrega no tiene fechaHoraEntregaReal'
  );
}

function assertRepartidorDisponible(responseBody) {
  assert.ok(
    responseBody.data.repartidor,
    'La respuesta no contiene repartidor'
  );

  assert.strictEqual(
    responseBody.data.repartidor.estado,
    'EN_LINEA'
  );
}

function assertHonorarioLiquidable(responseBody) {
  assert.ok(
    responseBody.data.honorario,
    'La respuesta no contiene honorario'
  );

  assert.strictEqual(responseBody.data.honorario.liquidable, true);

  assert.ok(
    responseBody.data.honorario.fechaLiquidable,
    'El honorario no tiene fechaLiquidable'
  );
}

function assertEntregaTieneEta(responseBody) {
  const entrega = entregaDe(responseBody);

  assert.ok(entrega, 'La respuesta no contiene entrega');

  assert.ok(
    entrega.tiempoEstimadoArribo,
    'La entrega no tiene tiempoEstimadoArribo'
  );
}

function metodoEtaDe(responseBody) {
  const entrega = entregaDe(responseBody);
  return responseBody.data.metodoCalculo || entrega.metodoCalculoEta;
}

function assertMetodoEta(responseBody, metodo) {
  assert.strictEqual(
    metodoEtaDe(responseBody),
    valor(metodo),
    JSON.stringify(responseBody)
  );
}

async function recalcularEta(contexto, servicioExternoDisponible) {
  const entrega = entregaDe(contexto.responseBody);

  const params = new URLSearchParams();
  params.append('timestampCalculo', new Date(Date.now() + 60000).toISOString());
  params.append('servicioExternoDisponible', String(servicioExternoDisponible));
  params.append('cambioEstado', 'true');

  contexto.responseBody = await post(
    `/entregas/${entrega.codigoEntrega}/eta/calcular?${params.toString()}`
  );
}

async function recalcularEtaInmediato(contexto) {
  const entrega = entregaDe(contexto.responseBody);

  const params = new URLSearchParams();
  params.append('timestampCalculo', new Date().toISOString());
  params.append('servicioExternoDisponible', 'true');
  params.append('cambioEstado', 'false');

  contexto.responseBody = await post(
    `/entregas/${entrega.codigoEntrega}/eta/calcular?${params.toString()}`
  );
}

Given('que existe un pedido listo para reparto', async function () {
  await prepararPedidoListoParaReparto(this);
});

Given('que existe un pedido asignado automáticamente', async function () {
  await prepararPedidoAceptadoPorRepartidor(this);
});

Given('que existe un pedido en local para el repartidor asignado', async function () {
  await prepararPedidoEnLocal(this);
});

Given('que existe un pedido en trayecto para el repartidor asignado', async function () {
  await prepararPedidoEnTrayecto(this);
});

Given('que existe para tarjeta 13 un pedido asignado automáticamente', async function () {
  await prepararPedidoAceptadoPorRepartidor(this);
});

Given('que existe para tarjeta 13 un pedido en local para el repartidor asignado', async function () {
  await prepararPedidoEnLocal(this);
});

Given('que existe para tarjeta 13 un pedido en trayecto para el repartidor asignado', async function () {
  await prepararPedidoEnTrayecto(this);
});

Given('que existe para tarjeta 13 un pedido ya entregado por el repartidor asignado', async function () {
  await prepararPedidoEntregado(this);
});

Given('que existe para tarjeta 17 un pedido ya entregado por el repartidor asignado', async function () {
  await prepararPedidoEntregado(this);
});

When('el repartidor asignado acepta la entrega del pedido actual', async function () {
  const codigoRepartidor = await obtenerRepartidorAsignado(this);
  await aceptarEntrega(this, codigoRepartidor);
});

When('el repartidor asignado acepta nuevamente la entrega del pedido actual', async function () {
  const codigoRepartidor = await obtenerRepartidorAsignado(this);

  let responseBody = await aceptarEntrega(this, codigoRepartidor);

  if (responseBody.status_code === 200) {
    responseBody = await aceptarEntrega(this, codigoRepartidor);
  }

  this.responseBody = responseBody;
});

When('el repartidor asignado llega al local para retirar el pedido actual', async function () {
  const codigoRepartidor = await obtenerRepartidorAsignado(this);
  await llegarAlLocal(this, codigoRepartidor);
});

When('el repartidor asignado retira el pedido actual', async function () {
  const codigoRepartidor = await obtenerRepartidorAsignado(this);
  await retirarPedido(this, codigoRepartidor);
});

When('el repartidor asignado entrega el pedido actual', async function () {
  const codigoRepartidor = await obtenerRepartidorAsignado(this);
  await entregarPedido(this, codigoRepartidor);
});

When('otro repartidor intenta retirar el pedido actual', async function () {
  const otroRepartidor = await obtenerOtroRepartidor(this);
  await retirarPedido(this, otroRepartidor);
});

When('el repartidor asignado marca como entregado el pedido de la tarjeta 13', async function () {
  const codigoRepartidor = await obtenerRepartidorAsignado(this);
  await entregarPedido(this, codigoRepartidor);
});

When('otro repartidor marca como entregado el pedido de la tarjeta 13', async function () {
  const otroRepartidor = await obtenerOtroRepartidor(this);
  await entregarPedido(this, otroRepartidor);
});

When('el repartidor {string} marca como entregado un pedido inexistente para tarjeta 13', async function (codigoRepartidor) {
  this.pedidoActual = { codigoPedido: 'O-INEXISTENTE-13' };
  await entregarPedido(this, codigoRepartidor);
});

Given('el servicio externo de ETA no está disponible', function () {
  this.servicioExternoDisponible = false;
});

When('se recalcula el ETA de la entrega actual', async function () {
  await recalcularEta(this, this.servicioExternoDisponible !== false);
});

When('se recalcula inmediatamente el ETA de la entrega actual', async function () {
  await recalcularEtaInmediato(this);
});

When('se calcula el ETA de la entrega actual', async function () {
  await recalcularEta(this, true);
});

Then('la respuesta de reparto debe ser:', function (tabla) {
  assertRespuestaExitosa(this.responseBody, primeraFila(tabla));
});

Then('la respuesta de reparto debe contener error:', function (tabla) {
  assertRespuestaError(this.responseBody, primeraFila(tabla));
});

Then('la respuesta de marcar entrega debe ser:', function (tabla) {
  assertMarcarEntrega(this.responseBody, primeraFila(tabla));
});

Then('la respuesta de marcar entrega debe contener error:', function (tabla) {
  assertRespuestaError(this.responseBody, primeraFila(tabla));
});

Then('la entrega debe quedar:', function (tabla) {
  assertEntrega(this.responseBody, primeraFila(tabla));
});

Then('el pedido debe quedar:', function (tabla) {
  assertPedido(this.responseBody, primeraFila(tabla));
});

Then('el historial debe quedar actualizado', async function () {
  await assertHistorialEntregado(this);
});

Then('la respuesta no debe exponer ids internos', function () {
  assertNoExponeIdsInternos(this.responseBody);
});

Then('la entrega marcada debe tener fecha real de entrega', function () {
  assertFechaEntregaReal(this.responseBody);
});

Then('el repartidor de la entrega marcada debe quedar disponible', function () {
  assertRepartidorDisponible(this.responseBody);
});

Then('el honorario de la entrega marcada debe quedar liquidable', function () {
  assertHonorarioLiquidable(this.responseBody);
});

Then('el historial de la entrega marcada debe quedar actualizado', async function () {
  await assertHistorialEntregado(this);
});

Then('la respuesta de marcar entrega no debe exponer ids internos', function () {
  assertNoExponeIdsInternos(this.responseBody);
});

Then('la entrega debe tener ETA calculado', function () {
  assertEntregaTieneEta(this.responseBody);
});

Then('el ETA de la entrega debe estar calculado con método {string}', function (metodo) {
  assertMetodoEta(this.responseBody, metodo);
});

Then('la respuesta de ETA debe ser:', function (tabla) {
  assertRespuestaExitosa(this.responseBody, primeraFila(tabla));
});

Then('la respuesta de ETA debe contener error:', function (tabla) {
  assertRespuestaError(this.responseBody, primeraFila(tabla));
});

// ============================================================
// Notificaciones ETA integradas a Gestión de entregas
// ============================================================

function datosEta07(contexto) {
  return contexto.responseBody.data || {};
}

function crearNotificacionEta07(contexto, overrides = {}) {
  const pedido = contexto.pedidoActual;
  const entrega = pedido.entrega || {};
  const repartidor = pedido.repartidor || {};

  return {
    eventId: overrides.eventId || `EVT-ETA-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    idPedido: pedido.codigoPedido,
    idEntrega: entrega.codigoEntrega,
    idRepartidor: repartidor.codigoRepartidor,
    nombreRepartidor: repartidor.nombre || 'Repartidor asignado',
    estadoEntrega: overrides.estadoEntrega || 'ASIGNADA',
    eta: overrides.eta,
    timestamp: overrides.timestamp || new Date().toISOString(),
    etaAnterior: overrides.etaAnterior,
    etaNuevo: overrides.etaNuevo
  };
}

async function emitirNotificacionEta07(contexto, evento, body) {

  const params = new URLSearchParams();

  Object.entries(body)
    .filter(([, value]) => value !== undefined && value !== null)
    .forEach(([key, value]) => {
      params.append(key, value);
    });

  contexto.responseBody = await post(
    `/notificaciones/eta/eventos/${evento}?${params.toString()}`
  );
}

Given(
  'existe un pedido aprobado con entrega asignada para notificaciones ETA',
  async function () {
    await prepararPedidoAceptado(this);

    assert.ok(
      this.pedidoActual.entrega,
      `El pedido no tiene entrega asignada: ${JSON.stringify(this.pedidoActual)}`
    );
  }
);

Given('que la entrega todavía no fue notificada', function () {
  this.eventIdEta = `EVT-ETA-INICIAL-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
});

Given('que la entrega ya tenía un ETA informado', function () {
  this.etaAnterior = new Date(Date.now() + 300000).toISOString();
});

When('se informa el primer tiempo estimado de llegada', async function () {
  await emitirNotificacionEta07(
    this,
    'EntregaAsignada',
    crearNotificacionEta07(this, {
      eventId: this.eventIdEta,
      estadoEntrega: 'ASIGNADA',
      eta: new Date(Date.now() + 300000).toISOString(),
      timestamp: new Date(Date.now() + 300000).toISOString()
    })
  );
});

When('el ETA cambia menos de 3 minutos', async function () {
  await emitirNotificacionEta07(
    this,
    'ETAActualizado',
    crearNotificacionEta07(this, {
      eventId: `EVT-ETA-UMBRAL-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      estadoEntrega: 'EN_TRAYECTO',
      etaAnterior: this.etaAnterior,
      etaNuevo: new Date(Date.now() + 420000).toISOString(),
      timestamp: new Date(Date.now() + 300000).toISOString()
    })
  );
});

When('el ETA cambia 3 minutos o más', async function () {
  this.etaNuevo = new Date(Date.now() + 570000).toISOString();

  await emitirNotificacionEta07(
    this,
    'ETAActualizado',
    crearNotificacionEta07(this, {
      eventId: `EVT-ETA-CAMBIO-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      estadoEntrega: 'EN_TRAYECTO',
      etaAnterior: this.etaAnterior,
      etaNuevo: this.etaNuevo,
      timestamp: new Date(Date.now() + 300000).toISOString()
    })
  );
});

Then('se emite una notificación ETA', function () {
  assertOk(this.responseBody, 'No se emitió notificación ETA');

  assert.ok(
    datosEta07(this).eventId,
    JSON.stringify(datosEta07(this))
  );
});

Then('el mensaje indica que el repartidor fue asignado', function () {
  assert.ok(
    datosEta07(this).mensajeUsuario.includes('Repartidor asignado'),
    JSON.stringify(datosEta07(this))
  );
});

Then('la notificación incluye el tiempo restante de llegada', function () {
  assert.ok(
    datosEta07(this).tiempoRemanenteSegundos >= 0,
    JSON.stringify(datosEta07(this))
  );
});

Then('no se emite una nueva notificación ETA', function () {
  assertOk(this.responseBody, 'No debería emitirse una nueva notificación ETA');
});

Then('la respuesta indica {string}', function (texto) {
  assert.ok(
    this.responseBody.status_text.includes(texto),
    `Se esperaba ${texto} pero llegó ${this.responseBody.status_text}`
  );
});

Then('la notificación incluye el nuevo tiempo estimado de llegada', function () {
  assert.strictEqual(
    datosEta07(this).eta,
    this.etaNuevo,
    JSON.stringify(datosEta07(this))
  );
});