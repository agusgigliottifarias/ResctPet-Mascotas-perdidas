const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

const URL_BASE = process.env.BASE_URL || 'http://backend:8080';

const RESTAURANTE = 'R-1001';
const ITEM = 'I-3001';
const PASSWORD = 'Test#2025';

function unico() {
   return Date.now() + '.' + Math.floor(Math.random() * 10000);
}

function emailMetricas() {
   return 'metricas.' + unico() + '@cpl.test';
}

async function enviarGet(ruta) {
   const response = await fetch(URL_BASE + ruta, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json'
      }
   });

   return response.json();
}

async function enviarPost(ruta, body) {
   const response = await fetch(URL_BASE + ruta, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
   });

   return response.json();
}

function direccion(ciudad) {
   return {
      calle: 'Roca',
      numero: '123',
      ciudad: ciudad || 'Puerto Madryn',
      provincia: 'Chubut',
      ubicacion: [-42.77, -65.03]
   };
}

function assertOk(response, mensaje) {
   assert.strictEqual(response.status_code, 200, mensaje || 'Respuesta inesperada');
}

async function crearConsumidor(email) {
   const response = await enviarPost('/api/consumidores', {
      nombre: 'Consumidor ' + email,
      email: email,
      password: PASSWORD
   });

   assert.strictEqual(response.status_code, 200);
   assert.strictEqual(response.status_text, 'CREADO');
}

async function crearPedido(email, restaurante, ciudad) {
   const response = await enviarPost('/pedidos', {
      emailConsumidor: email,
      codigoRestaurante: restaurante || RESTAURANTE,
      metodoPago: 'EFECTIVO',
      direccionEntrega: direccion(ciudad),
      lineas: [
         {
            codigoItem: ITEM,
            cantidad: 1,
            adicionales: []
         }
      ]
   });

   assert.strictEqual(response.status_code, 200);
   assert.strictEqual(response.status_text, 'CREADO');

   return response.data;
}

async function pagarPedido(pedido, email, accion) {
   const response = await enviarPost('/pagos', {
      codigoPedido: pedido.codigoPedido,
      emailConsumidor: email,
      monto: pedido.total,
      metodo: 'EFECTIVO',
      accion: accion || 'CAPTURAR'
   });

   assertOk(response, 'No se pudo registrar pago');

   return response.data;
}

async function prepararPago(contexto, opciones) {
   const datos = opciones || {};
   const email = datos.email || emailMetricas();

   await crearConsumidor(email);

   const pedido = await crearPedido(
      email,
      datos.restaurante || RESTAURANTE,
      datos.ciudad || 'Puerto Madryn'
   );

   await pagarPedido(
      pedido,
      email,
      datos.accion || 'CAPTURAR'
   );

   contexto.emailActual = email;
   contexto.pedidoActual = pedido;
}

function agregarParametro(parametros, nombre, valor) {
   if (valor !== undefined && valor !== null) {
      parametros.append(nombre, valor);
   }
}

function rutaMetricasPagos(params) {
   const datos = params || {};
   const parametros = new URLSearchParams();

   parametros.append('desde', datos.desde || '2025-01-01T00:00:00Z');
   parametros.append('hasta', datos.hasta || '2030-12-31T23:59:59Z');
   parametros.append('moneda', datos.moneda || 'ARS');

   agregarParametro(parametros, 'bucketSize', datos.bucketSize);
   agregarParametro(parametros, 'idRestaurante', datos.idRestaurante);
   agregarParametro(parametros, 'zona', datos.zona);
   agregarParametro(parametros, 'idConsumidor', datos.idConsumidor);
   agregarParametro(parametros, 'destinoSplit', datos.destinoSplit);
   agregarParametro(parametros, 'incluirSplits', datos.incluirSplits);
   agregarParametro(parametros, 'incluirNoCapturados', datos.incluirNoCapturados);
   agregarParametro(parametros, 'outlierThreshold', datos.outlierThreshold);
   agregarParametro(parametros, 'outliersPage', datos.outliersPage);
   agregarParametro(parametros, 'outliersSize', datos.outliersSize);

   return '/metricas/pagos/distribucion?' + parametros.toString();
}

async function consultarMetricas(contexto, params) {
   const ruta = rutaMetricasPagos(params);

   contexto.response = await enviarGet(ruta);
}

function data(contexto) {
   assert.ok(contexto.response.data, 'La respuesta no contiene data');

   return contexto.response.data;
}

function assertMetricasYBuckets(contexto) {
   const metricas = data(contexto);

   assert.ok(metricas.cantidadPagos > 0);
   assert.ok(metricas.min >= 0);
   assert.ok(metricas.max >= 0);
   assert.ok(metricas.promedio >= 0);
   assert.ok(metricas.mediana >= 0);
   assert.ok(metricas.p75 >= 0);
   assert.ok(metricas.p90 >= 0);
   assert.ok(metricas.p95 >= 0);
   assert.ok(metricas.p99 >= 0);
   assert.ok(metricas.buckets.length > 0);
}

function assertSplits(contexto) {
   const splits = data(contexto).splits;
   const destinos = splits.map(function (split) {
      return split.destino;
   });

   assert.ok(destinos.includes('RESTAURANTE'));
   assert.ok(destinos.includes('REPARTIDOR'));
   assert.ok(destinos.includes('PLATAFORMA'));

   let total = 0;

   splits.forEach(function (split) {
      assert.ok(split.montoTotalDestino > 0);
      assert.ok(split.promedioPorPago > 0);

      total += split.porcentajeSobreTotal;
   });

   assert.ok(Math.abs(total - 1) <= 0.01);
}

function assertOutlier(contexto) {
   const outliers = data(contexto).outliers;

   assert.ok(outliers.length > 0);

   const outlier = outliers[0];

   assert.ok(outlier.idPago);
   assert.ok(outlier.idPedido);
   assert.ok(outlier.idPedido.startsWith('O-'));
   assert.ok(outlier.idRestaurante);
   assert.ok(outlier.monto > 0);
   assert.ok(outlier.timestamp);

   const texto = JSON.stringify(outlier);

   assert.strictEqual(texto.includes('@'), false);
   assert.strictEqual(texto.includes('documento'), false);
   assert.strictEqual(texto.includes('PAN'), false);
}

Given('que existen pagos capturados en moneda {string} dentro del período de análisis', async function (moneda) {
   await prepararPago(this);
});

Given('que existen pagos capturados y no capturados dentro del período de análisis', async function () {
   await prepararPago(this);
   await prepararPago(this, { accion: 'AUTORIZAR' });
});

Given('que existen pagos capturados con splits para restaurante, repartidor y plataforma', async function () {
   await prepararPago(this);
});

Given('que existen pagos capturados con importes mayores al umbral de análisis', async function () {
   await prepararPago(this);
});

Given('que existen pagos capturados para el restaurante {string}', async function (restaurante) {
   await prepararPago(this, { restaurante: restaurante });
});

Given('que existen pagos capturados para la zona {string}', async function (zona) {
   await prepararPago(this, { ciudad: zona });
});

Given('que existen pagos capturados de distintos consumidores', async function () {
   await prepararPago(this);

   this.emailConsumidorActual = this.emailActual;

   await prepararPago(this);
});

Given('que existen pagos capturados en moneda {string}', async function (moneda) {
   await prepararPago(this);
});

Given('que no existen pagos capturados dentro del período de análisis', function () {
   this.periodoSinPagos = true;
});

Given('existe el restaurante {string}', function (codigoRestaurante) {
   this.codigoRestaurante = codigoRestaurante;
});

When('se consulta la distribución de importes de pagos en moneda {string}', async function (moneda) {
   await consultarMetricas(this, {
      moneda: moneda,
      bucketSize: 5000,
      desde: this.periodoSinPagos ? '2020-01-01T00:00:00Z' : undefined,
      hasta: this.periodoSinPagos ? '2020-01-01T23:59:59Z' : undefined
   });
});

When('se consulta la distribución incluyendo pagos no capturados', async function () {
   await consultarMetricas(this, {
      incluirNoCapturados: true
   });
});

When('se consulta la distribución de importes incluyendo splits', async function () {
   await consultarMetricas(this, {
      incluirSplits: true,
      bucketSize: 5000
   });
});

When('se consulta la distribución de importes del destino de split {string}', async function (destinoSplit) {
   await consultarMetricas(this, {
      incluirSplits: true,
      destinoSplit: destinoSplit
   });
});

When('se consulta la distribución de importes con detección de outliers', async function () {
   await consultarMetricas(this, {
      outlierThreshold: 1,
      outliersPage: 0,
      outliersSize: 10
   });
});

When('se consulta la distribución de importes del restaurante {string}', async function (restaurante) {
   await consultarMetricas(this, {
      idRestaurante: restaurante
   });
});

When('se consulta la distribución de importes de la zona {string}', async function (zona) {
   await consultarMetricas(this, {
      zona: zona
   });
});

When('se consulta la distribución de importes del consumidor actual', async function () {
   await consultarMetricas(this, {
      idConsumidor: this.emailConsumidorActual
   });
});

When('se consulta la distribución de importes para todas las monedas', async function () {
   await consultarMetricas(this, {
      moneda: 'ALL'
   });
});

When('se consulta la distribución de importes con el filtro inválido {string}', async function (filtro) {
   const params = {};

   if (filtro === 'rango de fechas') {
      params.desde = '2026-02-10T00:00:00Z';
      params.hasta = '2026-02-01T00:00:00Z';
   }

   if (filtro === 'tamaño de bucket') {
      params.bucketSize = -1;
   }

   if (filtro === 'moneda') {
      params.moneda = '???';
   }

   await consultarMetricas(this, params);
});

Then('la consulta de métricas responde correctamente', function () {
   assertOk(this.response);
});

Then('la distribución incluye cantidad de pagos y métricas principales', function () {
   assertMetricasYBuckets(this);
});

Then('la distribución incluye buckets de importes', function () {
   assert.ok(data(this).buckets.length > 0);
});

Then('todos los pagos analizados están capturados', function () {
   assert.ok(data(this).cantidadPagos > 0);
});

Then('el análisis incluye pagos capturados y no capturados', function () {
   assert.ok(data(this).cantidadPagos >= 2);
});

Then('la distribución incluye el total por cada destino de split', function () {
   assertSplits(this);
});

Then('la suma de porcentajes de los splits es aproximadamente 1', function () {
   assertSplits(this);
});

Then('la distribución incluye solamente el destino de split {string}', function (destino) {
   const splits = data(this).splits;

   assert.ok(splits.length > 0);

   splits.forEach(function (split) {
      assert.strictEqual(split.destino, destino);
   });
});

Then('la distribución lista los pagos atípicos encontrados', function () {
   assertOutlier(this);
});

Then('cada outlier informa pago, pedido, restaurante, monto y fecha', function () {
   assertOutlier(this);
});

Then('la respuesta no expone datos sensibles del consumidor', function () {
   assertOutlier(this);
});

Then('la distribución solo considera pagos del restaurante {string}', function (restaurante) {
   assert.strictEqual(data(this).filtros.idRestaurante, restaurante);
   assert.ok(data(this).cantidadPagos > 0);
});

Then('la distribución solo considera pagos de esa zona', function () {
   assert.strictEqual(data(this).filtros.zona, 'Puerto Madryn');
   assert.ok(data(this).cantidadPagos > 0);
});

Then('la distribución solo considera pagos del consumidor actual', function () {
   assert.ok(data(this).cantidadPagos > 0);
});

Then('la distribución informa la cantidad de pagos por moneda', function () {
   const monedas = data(this).porMoneda;

   assert.ok(monedas.length > 0);
   assert.ok(monedas[0].moneda);
   assert.ok(monedas[0].cantidadPagos > 0);
});

Then('las métricas se informan en cero', function () {
   const metricas = data(this);

   assert.strictEqual(metricas.cantidadPagos, 0);
   assert.strictEqual(metricas.min, 0);
   assert.strictEqual(metricas.max, 0);
   assert.strictEqual(metricas.promedio, 0);
   assert.strictEqual(metricas.mediana, 0);
   assert.strictEqual(metricas.p90, 0);
   assert.strictEqual(metricas.p95, 0);
   assert.strictEqual(metricas.p99, 0);
});

Then('no se informan buckets ni outliers', function () {
   const metricas = data(this);

   assert.strictEqual(metricas.buckets.length, 0);
   assert.strictEqual(metricas.outliers.length, 0);
});

Then('la consulta de métricas es rechazada por {string}', function (motivo) {
   assert.strictEqual(this.response.status_code, 409);
   assert.ok(this.response.status_text.includes(motivo));
});

Given('que existen pedidos entregados dentro del período consultado', async function () {
   await prepararPago(this);
});

function rutaTiempoPedidoEntrega(desde, hasta) {
   const parametros = new URLSearchParams();

   parametros.append('desde', desde);
   parametros.append('hasta', hasta);

   return '/metricas/tiempo-pedido-entrega?' + parametros.toString();
}

When('se consulta el tiempo promedio entre pedido y entrega desde {string} hasta {string}',
   async function (desde, hasta) {
      const ruta = rutaTiempoPedidoEntrega(desde, hasta);

      this.response = await enviarGet(ruta);
   }
);

Then('la consulta de tiempo pedido entrega responde correctamente', function () {
   assertOk(this.response);
});

Then('la métrica informa cantidad de entregados', function () {
   assert.ok(this.response.data.cantidadEntregados >= 0);
});

Then('la métrica informa promedio de tiempo', function () {
   assert.ok(this.response.data.promedioSegundos >= 0);
});

Then('la métrica informa tiempo mínimo y máximo', function () {
   assert.ok(this.response.data.minSegundos >= 0);
   assert.ok(this.response.data.maxSegundos >= 0);
});