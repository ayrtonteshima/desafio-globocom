var frisby = require('frisby');

var URL = require('../configs').baseApiUrl;

var urlSearch = URL + 'search';

/****************************************************************/
/****************************************************************/

frisby.create('Testa formato da API')
    .get(urlSearch, {
        q: 'apu'
    })
    .expectStatus(200)
    .expectJSONTypes({
        statusCode: Number,
        message: String,
        data: {
            hightlights: Array,
            suggestions: Array
        }
    })
    .expectJSONTypes('data.*', {
        title: String,
        url: String,
        logo: String,
        queries: Array
    })
    .toss();


/****************************************************************/
/****************************************************************/

frisby.create('Deve retornar hightlights com title de Política')
        .get(urlSearch, {
            q: 'apu'
        })
        .expectJSONTypes({
            hightlights: Array
        })
        .expectJSON('hightlights.?', {
            title:'Política',
            url:'http://g1.globo.com/politica/index.html',
            logo: 'http://s.glbimg.com/bu/i/fc/5fb2e18d-a47f-4bb8-9a7e-b66871cf53c0.png',
            queries:[
                'eleições',
                'política',
                'dilma',
                'aécio',
                'apuração'
            ]
        })
        .toss();


/****************************************************************/
/****************************************************************/

frisby.create('Testando suggestions, deve retornar termos iniciando com "mus"')
        .get(urlSearch, {
            q: 'mus'
        })
        .expectJSONTypes({
            suggestions: Array
        })
        .expectJSON({
            suggestions: function(val) {
                expect(val).toContain('musica');
                expect(val).toContain('musica de anderson freire');
                expect(val).toContain('musica que neymar pediu');
            }
        })
        .toss();