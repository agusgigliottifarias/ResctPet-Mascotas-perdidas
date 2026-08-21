const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

const URL_BASE = process.env.BASE_URL || 'http://backend:8080';

const RESTAURANTE = 'R-1001';
const ITEM = 'I-3001';
const PASSWORD = 'Test#2025';

function limpiar(valor) {
  return valor === undefined || valor === null
    ? ''
    : String(valor).trim();
}

function fila(tabla) {
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
  return await response.json();
}

async function post(endpoint, body) {
  return await request('POST', endpoint, body);
}

async function get(endpoint) {
  return await request('GET', endpoint);
}

async function registrarConsumidor(email) {
  const responseBody = await post('/api/consumidores', {
    nombre: 'Consumidor ' + limpiar(email),
    email: limpiar(email),
    password: PASSWORD
  });

  assert.strictEqual(
    responseBody.status_code,
    200,
    `No se pudo preparar consumidor: ${JSON.stringify(responseBody)}`
  );

  return responseBody.data;
}

async function crearPedido(email, metodoPago = 'TARJETA_VISA') {
  const responseBody = await post('/pedidos', {
    emailConsumidor: limpiar(email),
    codigoRestaurante: RESTAURANTE,
    metodoPago,
    direccionEntrega: direccionEntregaBase(),
    lineas: [
      {
        codigoItem: ITEM,
        cantidad: 1,
        adicionales: []
      }
    ]
  });

  assert.strictEqual(
    responseBody.status_code,
    200,
    `No se pudo crear pedido: ${JSON.stringify(responseBody)}`
  );

  assert.ok(
    responseBody.data.codigoPedido,
    'El pedido creado no contiene codigoPedido'
  );

  return responseBody.data;
}

async function prepararPedidoPagable(contexto, email) {
  contexto.emailActual = limpiar(email);

  await registrarConsumidor(contexto.emailActual);
  contexto.pedidoActual = await crearPedido(contexto.emailActual);
}

function bodyPagoBase(contexto, email) {
  return {
    codigoPedido: contexto.pedidoActual.codigoPedido,
    emailConsumidor: limpiar(email),
    monto: contexto.pedidoActual.total,
    metodo: 'TARJETA_VISA',
    accion: 'CAPTURAR'
  };
}

async function registrarPago(contexto, email, cambios = {}) {
  const response = await post('/pagos', {
    ...bodyPagoBase(contexto, email),
    ...cambios
  });

  contexto.response = response;

  if (response.data) {
    contexto.pagoActual = response.data;
  }

  return response;
}

async function consultarPedidoActual(contexto) {
  contexto.response = await get(
    '/pedidos/consumidor/' +
    contexto.pedidoActual.codigoPedido +
    '?emailConsumidor=' +
    contexto.emailActual
  );

  return contexto.response;
}

async function consultarPagoActual(contexto) {
  assert.ok(
    contexto.pagoActual && contexto.pagoActual.codigoPago,
    'No existe pagoActual para consultar'
  );

  contexto.response = await get('/pagos/' + contexto.pagoActual.codigoPago);

  return contexto.response;
}

async function consultarHistorial(email, estado) {
  const filtro = estado ? '?estado=' + limpiar(estado) : '';

  return get(
    '/historial/consumidores/' +
    limpiar(email) +
    '/pedidos' +
    filtro
  );
}

async function cancelarPedido(contexto, email, motivo) {

  const parametros = new URLSearchParams();

  parametros.append(
    'emailConsumidor',
    limpiar(email)
  );

  parametros.append(
    'motivoCancelacion',
    limpiar(motivo)
  );

  contexto.response = await post(
    '/pedidos/' +
    contexto.pedidoActual.codigoPedido +
    '/cancelar?' +
    parametros.toString(),
    {}
  );

  return contexto.response;
}

async function crearTicketPrevio(contexto) {
  contexto.response = await post(
    '/tickets/pedido/' + contexto.pedidoActual.codigoPedido + '/crear-previo',
    {}
  );

  return contexto.response;
}

function assertPreparacionExitosa(responseBody, mensaje) {
  assert.strictEqual(
    responseBody.status_code,
    200,
    `${mensaje}: ${JSON.stringify(responseBody)}`
  );
}

function assertRespuesta(responseBody, esperado) {
  assert.ok(responseBody, 'No existe responseBody');

  assert.strictEqual(responseBody.status_code, Number(esperado.status_code));
  assert.strictEqual(responseBody.status_text, limpiar(esperado.status_text));
}

function assertPago(responseBody, esperado) {
  const data = responseBody.data;

  assert.ok(
    data,
    `La respuesta no contiene data: ${JSON.stringify(responseBody)}`
  );

  assert.strictEqual(data.estadoPago, limpiar(esperado.estadoPago));
  assert.strictEqual(data.estadoPedido, limpiar(esperado.estadoPedido));
  assert.strictEqual(data.metodo, limpiar(esperado.metodo));
}

function assertNoExponeIdsInternos(responseBody) {
  const data = responseBody.data;

  assert.ok(
    data,
    `La respuesta no contiene data: ${JSON.stringify(responseBody)}`
  );

  assert.strictEqual(data.idPago, undefined);
  assert.strictEqual(data.idPedido, undefined);
  assert.strictEqual(data.idTicket, undefined);

  if (Array.isArray(data.splits)) {
    data.splits.forEach((split) => {
      assert.strictEqual(split.idSplitPago, undefined);
    });
  }
}

function assertSplitsCapturados(responseBody) {
  const data = responseBody.data;

  assert.ok(
    data,
    `La respuesta no contiene data: ${JSON.stringify(responseBody)}`
  );

  assert.ok(
    Array.isArray(data.splits),
    'La respuesta no contiene splits'
  );

  assert.strictEqual(data.splits.length, 3);

  const destinos = data.splits.map((split) => split.destino);

  assert.ok(destinos.includes('RESTAURANTE'));
  assert.ok(destinos.includes('REPARTIDOR'));
  assert.ok(destinos.includes('PLATAFORMA'));

  data.splits.forEach((split) => {
    assert.strictEqual(split.monto.moneda, data.monto.moneda);

    assert.ok(
      split.monto.monto !== undefined,
      `El split ${split.destino} no informa monto`
    );

    assert.ok(
      split.referenciaDestino !== undefined,
      `El split ${split.destino} no informa referenciaDestino`
    );
  });
}

function assertSplitsSiCorresponde(responseBody) {
  const data = responseBody.data;

  assert.ok(
    data,
    `La respuesta no contiene data: ${JSON.stringify(responseBody)}`
  );

  if (data.estadoPago !== 'CAPTURADO') {
    assert.ok(
      !data.splits || data.splits.length === 0,
      'Un pago no capturado no debería contener splits'
    );

    return;
  }

  assertSplitsCapturados(responseBody);
}

function assertRechazoPago(responseBody, esperado) {
  const data = responseBody.data;

  assert.ok(
    data,
    `La respuesta no contiene data: ${JSON.stringify(responseBody)}`
  );

  assert.strictEqual(data.estadoPago, limpiar(esperado.estadoPago));
  assert.strictEqual(data.estadoPedido, limpiar(esperado.estadoPedido));
  assert.strictEqual(data.sugerencia, limpiar(esperado.sugerencia));
}

function assertPedidoEnEstado(responseBody, estadoEsperado) {
  assert.strictEqual(
    responseBody.data.estadoPedido,
    limpiar(estadoEsperado)
  );
}

function assertPedidoRechazadoConMotivo(responseBody, motivo) {
  assert.strictEqual(responseBody.status_code, 200);
  assert.strictEqual(responseBody.data.estadoPedido, 'RECHAZADO');
  assert.strictEqual(responseBody.data.motivoRechazo, limpiar(motivo));
}

function assertPedidoApareceEnHistorial(responseBody, pedidoActual, estadoEsperado) {
  assert.strictEqual(responseBody.status_code, 200);

  const pedidos = responseBody.data.orders;

  const pedido = pedidos.find(
    (pedidoHistorial) => pedidoHistorial.codigoPedido === pedidoActual.codigoPedido
  );

  assert.ok(
    pedido,
    `No apareció el pedido ${pedidoActual.codigoPedido} en historial`
  );

  assert.strictEqual(pedido.estado, estadoEsperado);
}

function assertSinTicket(responseBody) {
  assert.strictEqual(responseBody.status_code, 200);
  assert.strictEqual(responseBody.data.ticket, null);
}

function assertSinEntrega(responseBody) {
  assert.strictEqual(responseBody.status_code, 200);
  assert.strictEqual(responseBody.data.entrega, null);
}

function assertExisteTicket(responseBody) {
  const data = responseBody.data;

  assert.ok(
    data,
    `La respuesta no contiene data: ${JSON.stringify(responseBody)}`
  );

  assert.ok(
    data.codigoTicket || data.ticket,
    `No se generó ticket: ${JSON.stringify(responseBody)}`
  );
}

Given(
  'que existe el consumidor para pago {string}',
  async function (email) {
    await registrarConsumidor(email);
  }
);

Given(
  'que existe un pedido pagable del consumidor {string}',
  async function (email) {
    await prepararPedidoPagable(this, email);
  }
);

Given(
  'que existe un pedido pendiente de aprobación por pago del consumidor {string}',
  async function (email) {
    await prepararPedidoPagable(this, email);
  }
);

Given(
  'que existe un pedido pagable para rechazo de pago del consumidor {string}',
  async function (email) {
    await prepararPedidoPagable(this, email);
  }
);

Given(
  'el consumidor {string} ya pagó el pedido actual',
  async function (email) {
    const responseBody = await registrarPago(this, email, {
      accion: 'CAPTURAR',
      metodo: 'TARJETA_VISA'
    });

    assertPreparacionExitosa(responseBody, 'No se pudo preparar pago capturado');
  }
);

Given(
  'que existe un pago capturado del consumidor {string}',
  async function (email) {
    await prepararPedidoPagable(this, email);

    const responseBody = await registrarPago(this, email, {
      accion: 'CAPTURAR',
      metodo: 'TARJETA_VISA'
    });

    assertPreparacionExitosa(responseBody, 'No se pudo crear pago capturado');
  }
);

Given(
  'el consumidor {string} ya registró el pago capturado del pedido pendiente',
  async function (email) {
    const responseBody = await registrarPago(this, email, {
      accion: 'CAPTURAR',
      metodo: 'TARJETA_VISA'
    });

    assertPreparacionExitosa(responseBody, 'No se pudo preparar pago capturado');
  }
);

Given(
  'ya existe un ticket de cocina para el pedido pendiente',
  async function () {
    await crearTicketPrevio(this);
  }
);

Given(
  'el consumidor {string} ya tuvo un pago rechazado del pedido pagable',
  async function (email) {
    const responseBody = await registrarPago(this, email, {
      simulacion: {
        forzarResultado: 'RECHAZADO',
        codigoMotivo: 'FONDOS_INSUFICIENTES',
        detalleMotivo: 'Fondos insuficientes'
      }
    });

    assert.strictEqual(
      responseBody.status_code,
      409,
      `No se pudo preparar pago rechazado: ${JSON.stringify(responseBody)}`
    );
  }
);

Given(
  'que existe un pedido rechazado por pago fallido del consumidor {string}',
  async function (email) {
    await prepararPedidoPagable(this, email);

    const responseBody = await registrarPago(this, email, {
      simulacion: {
        forzarResultado: 'RECHAZADO',
        codigoMotivo: 'FONDOS_INSUFICIENTES',
        detalleMotivo: 'Fondos insuficientes'
      }
    });

    assert.strictEqual(
      responseBody.status_code,
      409,
      `No se pudo preparar pedido rechazado: ${JSON.stringify(responseBody)}`
    );
  }
);

Given(
  'que existe un pedido cancelado no reintentable del consumidor {string}',
  async function (email) {
    await prepararPedidoPagable(this, email);

    const responseBody = await cancelarPedido(
      this,
      email,
      'CANCELACION_CONSUMIDOR'
    );

    assertPreparacionExitosa(responseBody, 'No se pudo preparar pedido cancelado');
  }
);

Given(
  'que existe un pedido no pagable del consumidor {string} en estado {string}',
  async function (email, estadoPedido) {
    await prepararPedidoPagable(this, email);

    if (limpiar(estadoPedido) === 'CANCELADO') {
      const responseBody = await cancelarPedido(
        this,
        email,
        'NO_REINTENTABLE'
      );

      assertPreparacionExitosa(responseBody, 'No se pudo preparar pedido cancelado');
    }

    if (limpiar(estadoPedido) === 'APROBADO') {
      const responseBody = await registrarPago(this, email, {
        simulacion: {
          forzarResultado: 'CAPTURADO'
        }
      });

      assertPreparacionExitosa(responseBody, 'No se pudo preparar pedido aprobado');
    }
  }
);

When(
  'el consumidor {string} paga el pedido actual con acción {string} y método {string}',
  async function (email, accion, metodo) {
    await registrarPago(this, email, {
      accion: limpiar(accion),
      metodo: limpiar(metodo)
    });
  }
);

When(
  'el consumidor {string} intenta pagar el pedido actual con:',
  async function (email, tabla) {
    const datos = fila(tabla);

    await registrarPago(this, email, {
      monto: {
        monto: Number(datos.monto),
        moneda: limpiar(datos.moneda)
      },
      metodo: limpiar(datos.metodo),
      accion: limpiar(datos.accion)
    });
  }
);

When(
  'el consumidor {string} intenta pagar el pedido inexistente {string}',
  async function (email, codigoPedido) {
    this.response = await post('/pagos', {
      codigoPedido: limpiar(codigoPedido),
      emailConsumidor: limpiar(email),
      monto: {
        monto: 10000,
        moneda: 'ARS'
      },
      metodo: 'TARJETA_VISA',
      accion: 'CAPTURAR'
    });
  }
);

When(
  'se consulta el pago actual',
  async function () {
    await consultarPagoActual(this);
  }
);

When(
  'el consumidor {string} registra el pago del pedido pendiente con acción {string} y método {string}',
  async function (email, accion, metodo) {
    await registrarPago(this, email, {
      accion: limpiar(accion),
      metodo: limpiar(metodo)
    });
  }
);

When(
  'el consumidor {string} registra nuevamente el pago del pedido pendiente con acción {string} y método {string}',
  async function (email, accion, metodo) {
    await registrarPago(this, email, {
      accion: limpiar(accion),
      metodo: limpiar(metodo)
    });
  }
);

When(
  'el consumidor {string} intenta registrar el pago del pedido pendiente con:',
  async function (email, tabla) {
    const datos = fila(tabla);

    await registrarPago(this, email, {
      monto: {
        monto: Number(datos.monto),
        moneda: limpiar(datos.moneda)
      },
      accion: limpiar(datos.accion),
      metodo: limpiar(datos.metodo)
    });
  }
);

When(
  'el consumidor {string} registra el pago del pedido pendiente forzando resultado de proveedor {string}',
  async function (email, resultadoProveedor) {
    await registrarPago(this, email, {
      simulacion: {
        forzarResultado: limpiar(resultadoProveedor)
      }
    });
  }
);

When(
  'el consumidor {string} registra el pago del pedido pendiente forzando error al generar ticket',
  async function (email) {
    await registrarPago(this, email, {
      simulacion: {
        forzarErrorGenerandoTicket: true
      }
    });
  }
);

When(
  'el consumidor {string} intenta pagar el pedido pagable forzando rechazo con:',
  async function (email, tabla) {
    const datos = fila(tabla);

    await registrarPago(this, email, {
      metodo: limpiar(datos.metodo),
      simulacion: {
        forzarResultado: 'RECHAZADO',
        codigoMotivo: limpiar(datos.codigoMotivo),
        detalleMotivo: limpiar(datos.detalleMotivo)
      }
    });
  }
);

When(
  'el consumidor {string} intenta pagar el pedido pagable forzando error de proveedor con:',
  async function (email, tabla) {
    const datos = fila(tabla);

    await registrarPago(this, email, {
      metodo: limpiar(datos.metodo),
      simulacion: {
        forzarResultado: 'ERROR',
        detalleMotivo: limpiar(datos.detalleMotivo)
      }
    });
  }
);

When(
  'el consumidor {string} reintenta pagar el pedido rechazado con método {string}',
  async function (email, metodo) {
    await registrarPago(this, email, {
      metodo: limpiar(metodo),
      simulacion: {
        forzarResultado: 'CAPTURADO'
      }
    });
  }
);

When(
  'el consumidor {string} reintenta pagar el pedido no reintentable',
  async function (email) {
    await registrarPago(this, email);
  }
);

When(
  'el consumidor {string} intenta pagar el pedido no pagable',
  async function (email) {
    await registrarPago(this, email);
  }
);

When(
  'el consumidor {string} intenta pagar un pedido inexistente',
  async function (email) {
    this.response = await post('/pagos', {
      codigoPedido: 'O-9999',
      emailConsumidor: limpiar(email),
      monto: {
        monto: 12000,
        moneda: 'ARS'
      },
      metodo: 'TARJETA_VISA',
      accion: 'CAPTURAR'
    });
  }
);

When(
  'el consumidor {string} intenta pagar el pedido pagable de otro consumidor',
  async function (email) {
    await registrarConsumidor(email);
    await registrarPago(this, email);
  }
);

Then('la respuesta de pago debe ser:', function (tabla) {
  assertRespuesta(this.response, fila(tabla));
});

Then('la respuesta de registrar pago debe ser:', function (tabla) {
  assertRespuesta(this.response, fila(tabla));
});

Then('la respuesta de rechazo de pago debe ser:', function (tabla) {
  assertRespuesta(this.response, fila(tabla));
});

Then('la respuesta de reintento de pago debe ser:', function (tabla) {
  assertRespuesta(this.response, fila(tabla));
});

Then('el pago debe quedar:', function (tabla) {
  assertPago(this.response, fila(tabla));
});

Then('el registro de pago debe quedar:', function (tabla) {
  assertPago(this.response, fila(tabla));
});

Then('el reintento de pago debe quedar:', function (tabla) {
  assertPago(this.response, fila(tabla));
});

Then('el rechazo de pago debe quedar:', function (tabla) {
  assertRechazoPago(this.response, fila(tabla));
});

Then('si el pago fue capturado debe contener splits consistentes', function () {
  assertSplitsSiCorresponde(this.response);
});

Then('el pago capturado debe contener splits consistentes', function () {
  assertSplitsCapturados(this.response);
});

Then('la respuesta de pago no debe exponer ids internos', function () {
  assertNoExponeIdsInternos(this.response);
});

Then('la respuesta de registrar pago no debe exponer ids internos', function () {
  assertNoExponeIdsInternos(this.response);
});

Then('la respuesta de rechazo de pago no debe exponer ids internos', function () {
  assertNoExponeIdsInternos(this.response);
});

Then(
  'el pedido aprobado debe aparecer en el historial del consumidor {string}',
  async function (email) {
    this.response = await consultarHistorial(email, 'APROBADO');

    assertPedidoApareceEnHistorial(
      this.response,
      this.pedidoActual,
      'APROBADO'
    );
  }
);

Then(
  'el pedido pendiente debe quedar en estado {string}',
  async function (estadoEsperado) {
    await consultarPedidoActual(this);
    assertPedidoEnEstado(this.response, estadoEsperado);
  }
);

Then(
  'el pedido rechazado por pago debe poder consultarse con motivo {string}',
  async function (motivo) {
    await consultarPedidoActual(this);
    assertPedidoRechazadoConMotivo(this.response, motivo);
  }
);

Then(
  'no debe existir ticket de cocina para el pedido rechazado por pago',
  async function () {
    await consultarPedidoActual(this);
    assertSinTicket(this.response);
  }
);

Then(
  'no debe existir entrega para el pedido rechazado por pago',
  async function () {
    await consultarPedidoActual(this);
    assertSinEntrega(this.response);
  }
);

Then(
  'el pedido rechazado debe aparecer en el historial del consumidor {string}',
  async function (email) {
    this.response = await consultarHistorial(email, 'RECHAZADO');

    assertPedidoApareceEnHistorial(
      this.response,
      this.pedidoActual,
      'RECHAZADO'
    );
  }
);

Then(
  'debe existir ticket de cocina para el pedido aprobado por reintento',
  function () {
    assertExisteTicket(this.response);
  }
);

Then(
  'el pedido aprobado por reintento debe poder consultarse',
  async function () {
    await consultarPedidoActual(this);

    assert.strictEqual(this.response.status_code, 200);
    assert.strictEqual(this.response.data.estadoPedido, 'APROBADO');
  }
);

When(
  'se ejecuta nuevamente el split para ese pago',
  async function () {

    this.response = await post(
      '/pagos/' + this.pagoActual.codigoPago + '/split'
    );
  }
);

Then(
  'el pago queda en estado {string}',
  function (estado) {

    assert.strictEqual(
      this.response.data.estadoPago,
      estado
    );
  }
);

Then(
  'la respuesta contiene {int} splits',
  function (cantidad) {

    assert.strictEqual(
      this.response.data.splits.length,
      cantidad
    );
  }
);

Then(
  'existen splits para los destinos:',
  function (tabla) {

    const destinos =
      this.response.data.splits
        .map(split => split.destino);

    tabla.hashes().forEach(fila => {
      assert.ok(
        destinos.includes(fila.destino)
      );
    });
  }
);

Then(
  'la suma de los splits coincide con el monto del pago',
  function () {

    const totalSplits =
      this.response.data.splits
        .map(split => split.monto.monto)
        .reduce((a, b) => a + b, 0);

    assert.ok(
      Math.abs(
        totalSplits -
        this.response.data.monto.monto
      ) <= 0.01
    );
  }
);

Then(
  'la respuesta indica idempotencia',
  function () {

    assert.strictEqual(
      this.response.data.idempotente,
      true
    );
  }
);

// ============================================================
// 34_comisiones_plataforma
// ============================================================

function itemPorRestaurante(codigoRestaurante) {
  if (codigoRestaurante === 'R-1002') {
    return 'I-3003';
  }

  return ITEM;
}

async function crearPedidoEnRestaurante(email, codigoRestaurante) {
  const responseBody = await post('/pedidos', {
    emailConsumidor: limpiar(email),
    codigoRestaurante: limpiar(codigoRestaurante),
    metodoPago: 'TARJETA_VISA',
    direccionEntrega: direccionEntregaBase(),
    lineas: [
      {
        codigoItem: itemPorRestaurante(limpiar(codigoRestaurante)),
        cantidad: 1,
        adicionales: []
      }
    ]
  });

  assert.strictEqual(
    responseBody.status_code,
    200,
    `No se pudo crear pedido en restaurante ${codigoRestaurante}: ${JSON.stringify(responseBody)}`
  );

  return responseBody.data;
}

function splitPlataforma(responseBody) {
  const splits = responseBody.data.splits || [];

  const split = splits.find(
    (s) => s.destino === 'PLATAFORMA'
  );

  assert.ok(
    split,
    `No existe split de plataforma: ${JSON.stringify(responseBody)}`
  );

  return split;
}

Given(
  'que existe un pago capturado del consumidor {string} para el restaurante {string}',
  async function (email, codigoRestaurante) {
    this.emailActual = limpiar(email);

    await registrarConsumidor(this.emailActual);

    this.pedidoActual = await crearPedidoEnRestaurante(
      this.emailActual,
      codigoRestaurante
    );

    const responseBody = await registrarPago(this, this.emailActual, {
      accion: 'CAPTURAR',
      metodo: 'TARJETA_VISA'
    });

    assertPreparacionExitosa(
      responseBody,
      'No se pudo crear pago capturado con comisión'
    );
  }
);

Then(
  'el pago debe contener comisión de plataforma',
  function () {
    const data = this.response.data;

    assert.ok(
      data.comisionPlataforma,
      `La respuesta no contiene comisionPlataforma: ${JSON.stringify(this.response)}`
    );

    assert.ok(
      data.comisionPlataforma.montoAplicado !== undefined,
      'La comisión no informa montoAplicado'
    );

    assert.ok(
      data.comisionPlataforma.reglaAplicada,
      'La comisión no informa reglaAplicada'
    );
  }
);

Then(
  'el split de plataforma debe registrar regla aplicada {string}',
  function (reglaEsperada) {
    const split = splitPlataforma(this.response);

    assert.strictEqual(
      split.reglaAplicada || this.response.data.comisionPlataforma.reglaAplicada,
      limpiar(reglaEsperada)
    );
  }
);

Then(
  'existe auditoría de comisión con motivo {string}',
  function (motivo) {
    assert.ok(
      this.response.data.comisionPlataforma,
      `No se generó comisión para auditar: ${JSON.stringify(this.response)}`
    );

    assert.ok(
      this.response.data.comisionPlataforma.montoAplicado >= 0,
      `La comisión quedó inválida para motivo ${motivo}`
    );
  }
);

When(
  'se consulta el resumen de comisiones para moneda {string} y restaurante {string}',
  async function (moneda, idRestaurante) {
    this.response = await get(
      '/comisiones/resumen?desde=2020-01-01T00:00:00Z&hasta=2030-01-01T00:00:00Z&moneda=' +
      limpiar(moneda) +
      '&idRestaurante=' +
      limpiar(idRestaurante)
    );
  }
);

When(
  'se consulta el resumen de comisiones para un período sin datos en moneda {string}',
  async function (moneda) {
    this.response = await get(
      '/comisiones/resumen?desde=2000-01-01T00:00:00Z&hasta=2000-01-02T00:00:00Z&moneda=' +
      limpiar(moneda)
    );
  }
);

Then(
  'la respuesta de comisiones debe ser:',
  function (tabla) {
    assertRespuesta(this.response, fila(tabla));
  }
);

Then(
  'el resumen de comisiones debe tener cantidad de pagos mayor a 0',
  function () {
    assert.ok(
      this.response.data.cantidadPagos > 0,
      `Cantidad inválida: ${JSON.stringify(this.response)}`
    );
  }
);

Then(
  'el resumen de comisiones debe tener total mayor a 0',
  function () {
    assert.ok(
      this.response.data.totalComisiones > 0,
      `Total inválido: ${JSON.stringify(this.response)}`
    );
  }
);

Then(
  'el resumen de comisiones debe tener total 0 y cantidad 0',
  function () {
    assert.strictEqual(this.response.data.totalComisiones, 0);
    assert.strictEqual(this.response.data.cantidadPagos, 0);
  }
);

When(
  'se reembolsa el pago actual',
  async function () {
    assert.ok(
      this.pagoActual && this.pagoActual.codigoPago,
      'No existe pagoActual para reembolsar'
    );

    this.response = await post(
      '/pagos/' + this.pagoActual.codigoPago + '/reembolsar',
      {}
    );
  }
);

Then(
  'los splits del pago quedan no liquidables',
  function () {
    assert.strictEqual(
      this.response.data.estadoPago,
      'REEMBOLSO_PENDIENTE'
    );

    assert.ok(
      Array.isArray(this.response.data.splits),
      'La respuesta no contiene splits'
    );
  }
);