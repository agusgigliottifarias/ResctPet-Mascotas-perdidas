const assert = require('assert');
const { When, Then } = require('@cucumber/cucumber');

const URL_BASE = process.env.BASE_URL || 'http://backend:8080';

function primeraFila(tabla) {
   return tabla.hashes()[0];
}

function texto(valor) {
   if (valor === undefined || valor === null) {
      return '';
   }

   return String(valor).trim();
}

function tieneValor(valor) {
   return texto(valor) !== '';
}

function agregarParametro(parametros, nombre, valor) {
   if (tieneValor(valor)) {
      parametros.append(nombre, texto(valor));
   }
}

function rutaMenuPrincipal(codigoRestaurante) {
   return '/restaurantes/' + codigoRestaurante + '/menus/principal';
}

function rutaMenuEspecifico(codigoRestaurante, codigoMenu) {
   return '/restaurantes/' + codigoRestaurante + '/menus/' + codigoMenu;
}

function rutaListadoMenus(codigoRestaurante, filtros) {
   const parametros = new URLSearchParams();

   agregarParametro(parametros, 'activo', filtros.activo);
   agregarParametro(parametros, 'page', filtros.page);
   agregarParametro(parametros, 'size', filtros.size);

   return '/restaurantes/' + codigoRestaurante + '/menus?' + parametros.toString();
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

function menuDeLaRespuesta(response) {
   return response.data.menu;
}

function itemsDelMenu(response) {
   return menuDeLaRespuesta(response).items || [];
}

function adicionalesDelItem(item) {
   return item.adicionales || [];
}

function menusDeLaRespuesta(response) {
   return response.data.menus;
}

function paginaDeLaRespuesta(response) {
   return response.data.page;
}

function assertMenuEsperado(response, esperado) {
   const data = response.data;
   const menu = menuDeLaRespuesta(response);

   assert.strictEqual(data.codigoRestaurante, texto(esperado.codigoRestaurante));
   assert.strictEqual(data.nombreRestaurante, texto(esperado.nombreRestaurante));
   assert.strictEqual(menu.codigo, texto(esperado.codigoMenu));
   assert.strictEqual(menu.nombre, texto(esperado.nombreMenu));
   assert.strictEqual(String(menu.activo), texto(esperado.activoMenu));
}

function assertMenuNoExponeIds(response) {
   const data = response.data;
   const menu = menuDeLaRespuesta(response);

   assert.strictEqual(data.idRestaurante, undefined);
   assert.strictEqual(menu.idMenu, undefined);
   assert.ok(menu.codigo);

   itemsDelMenu(response).forEach(function (item) {
      assert.strictEqual(item.idItem, undefined);
      assert.ok(item.codigo);

      adicionalesDelItem(item).forEach(function (adicional) {
         assert.strictEqual(adicional.idAdicional, undefined);
         assert.ok(adicional.codigo);
      });
   });
}

When('se consulta el menú principal del restaurante {string}', async function (codigoRestaurante) {
   const ruta = rutaMenuPrincipal(codigoRestaurante);

   this.response = await enviarGet(ruta);
});

When('se consulta el menú {string} del restaurante {string}', async function (codigoMenu, codigoRestaurante) {
   const ruta = rutaMenuEspecifico(codigoRestaurante, codigoMenu);

   this.response = await enviarGet(ruta);
});

When('se listan menús del restaurante {string} con activo {string} página {string} tamaño {string}',
   async function (codigoRestaurante, activo, page, size) {
      const ruta = rutaListadoMenus(
         codigoRestaurante,
         {
            activo: activo,
            page: page,
            size: size
         }
      );

      this.response = await enviarGet(ruta);
   }
);

Then('la respuesta de menú debe ser:', function (tabla) {
   const esperado = primeraFila(tabla);

   assert.strictEqual(this.response.status_code, Number(esperado.status_code));
   assert.strictEqual(this.response.status_text, texto(esperado.status_text));
});

Then('la respuesta contiene el menú:', function (tabla) {
   const esperado = primeraFila(tabla);

   assertMenuEsperado(this.response, esperado);
});

Then('el menú contiene solo ítems disponibles', function () {
   const items = itemsDelMenu(this.response);

   assert.ok(items.length > 0);

   items.forEach(function (item) {
      assert.strictEqual(item.disponible, true);
   });
});

Then('el menú no expone ids internos', function () {
   assertMenuNoExponeIds(this.response);
});

Then('la página de menús debe ser:', function (tabla) {
   const esperado = primeraFila(tabla);
   const pagina = paginaDeLaRespuesta(this.response);

   assert.strictEqual(pagina.number, Number(esperado.page));
   assert.strictEqual(pagina.size, Number(esperado.size));
});

Then('existen menús en la respuesta', function () {
   const menus = menusDeLaRespuesta(this.response);

   assert.ok(menus.length > 0);
});

Then('no existen menús en la respuesta', function () {
   const menus = menusDeLaRespuesta(this.response);
   const pagina = paginaDeLaRespuesta(this.response);

   assert.strictEqual(menus.length, 0);
   assert.strictEqual(pagina.totalElements, 0);
});

Then('la lista de menús debe tener activo {string}', function (activo) {
   const menus = menusDeLaRespuesta(this.response);

   if (!tieneValor(activo)) {
      return;
   }

   menus.forEach(function (menu) {
      assert.strictEqual(String(menu.activo), texto(activo));
   });
});

Then('la lista de menús no expone ids internos', function () {
   const menus = menusDeLaRespuesta(this.response);

   menus.forEach(function (menu) {
      assert.strictEqual(menu.idMenu, undefined);
      assert.ok(menu.codigo);
   });
});