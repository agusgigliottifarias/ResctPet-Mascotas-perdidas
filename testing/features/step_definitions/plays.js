const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const jd = require('json-diff');
const request = require('sync-request');

Given('que existe la obra {string}', function (codigo) {
    
    let res = request(
        'GET',
        'http://backend:8080/plays/'+codigo
    );

    this.aPlay = JSON.parse(res.body, 'utf8').data;
    
    // FIXME:
    return assert.ok(true);
});

When(
    'solicitamos recuperar la lista de obras',
    function () {
        // Write code here that turns the phrase above into concrete actions
        let res = request(
            'GET',
            'http://backend:8080/plays'
        );

        this.response = JSON.parse(res.body, 'utf8');

        return assert.equal(res.statusCode, 200);
    }
);


When('solicito recuperar la obra con {string}', function (codigo) {
    let res = request(
        'GET',
        'http://backend:8080/plays/'+codigo
    );

    this.response = JSON.parse(res.body, 'utf8');

    return assert.equal(res.statusCode, 200);
});

When('solicito cambiar el nombre {string} de la obra con {string}',
    function (nuevo_nombre, _codigo) {
        this.aPlay.name = nuevo_nombre;
        
        let res = request(
            'PUT',
            'http://backend:8080/plays',
            {json: this.aPlay}
        );
    
        this.response = JSON.parse(res.body, 'utf8');
    
        return assert.equal(res.statusCode, 200);
    });



Then('esperamos recibir estado {int}', function (status) {
    return assert.equal(this.response.status, status);
});

Then('el mensaje de respuesta {string}', function (message) {
    // Write code here that turns the phrase above into concrete actions
    return assert.equal(this.response.message, message);
});

Then('los siguientes datos:', function (docString) {
    // Write code here that turns the phrase above into concrete actions
    let obras = JSON.parse(docString);

    for (let o of this.response.data) {
        delete o.id;
    }

    obras = obras.sort((a, b) => a.code.localeCompare(b.code));
    this.response.data = this.response.data.sort((a, b) => a.code.localeCompare(b.code));

    // console.log(JSON.stringify(obras,null, 3));
    // console.log(JSON.stringify(this.response,null, 3));

    let d = jd.diff(
        obras,
        this.response.data);

    // console.log(d);

    return assert.equal(d, null);
});



Then('la obra con {string}, {string}, {string}', function (codigo, nombre, tipo) {
    
    if (this.response.status == 200){
        assert.equal(this.response.data.code, codigo);
        assert.equal(this.response.data.name, nombre);
        assert.equal(this.response.data.type, tipo);
    }

    return true;
});