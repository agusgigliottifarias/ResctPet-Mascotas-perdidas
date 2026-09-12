const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
//const { Given, When, Then } = require('cucumber'); // Asegúrate de usar esta sintaxis exacta como en tu archivo prueba.js
const jd = require('json-diff');
const request = require('sync-request');

const API_URL = 'http://backend:8080/api/publicaciones';

Given('que un usuario prepara los siguientes datos de mascota perdida:', function (docString) {
    this.requestBody = JSON.parse(docString);
    return assert.ok(true);
});

When('solicitamos publicar la mascota perdida', function () {
    let res = request(
        'POST',
        API_URL,
        { json: this.requestBody }
    );

    this.response = JSON.parse(res.body, 'utf8');
    this.statusCode = res.statusCode;
    
    return assert.ok(true);
});

Given('que existe una intención de publicar una mascota perdida', function () {
    this.requestBody = {
        tipoPublicacion: "PERDIDA",
        caracteristicas: "Pruebas de validación del formulario 3.1"
    };
    return assert.ok(true);
});

When('solicito publicar con especie {string}, fecha {string}, foto {string}, latitud {string}, longitud {string} y usuario {string}', 
    function (especie, fecha, foto, latitud, longitud, usuarioId) {
        
    if (especie) this.requestBody.especie = especie;
    if (fecha) this.requestBody.fecha = fecha;
    if (foto) this.requestBody.fotografia = foto;
    if (latitud) this.requestBody.latitud = parseFloat(latitud);
    if (longitud) this.requestBody.longitud = parseFloat(longitud);
    if (usuarioId) this.requestBody.usuarioId = parseInt(usuarioId, 10);

    let res = request(
        'POST',
        API_URL,
        { json: this.requestBody }
    );

    this.response = JSON.parse(res.body, 'utf8');
    this.statusCode = res.statusCode;
    
    return assert.ok(true);
});

Then('esperamos recibir estado {int}', function (status) {
    // Validamos tanto el Status Code HTTP como el campo `status` del objeto Response
    assert.equal(this.statusCode, status);
    return assert.equal(this.response.status, status);
});

Then('el mensaje de respuesta {string}', function (message) {
    return assert.equal(this.response.message, message);
});

Then('la publicación generada tiene especie {string} y fecha {string}', function (especie, fecha) {
    let data = this.response.data;
    
    assert.equal(data.especie, especie);
    assert.equal(data.fecha, fecha);
    
    // Aquí el backend (Response DTO) devuelve los datos que se persistieron exitosamente
    return true;
});