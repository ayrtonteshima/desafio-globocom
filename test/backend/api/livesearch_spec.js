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
    .toss();


/****************************************************************/
/****************************************************************/

frisby.create('Testa retorno com os tipos corretos na propriedade hightlights')
    .get(urlSearch)
    .expectStatus(200)
    .expectJSONTypes('data.hightlights.*', {
        title: String,
        url: String,
        logo: String,
        queries: Array
    })
    .toss();


/****************************************************************/
/****************************************************************/

frisby.create('Testa se hightlights retorna dados corretos quando passado Política como title')
        .get(urlSearch, {
            q: 'apu'
        })
        .expectStatus(200)
        .expectJSONTypes({
            hightlights: Array
        })
        .expectJSON('data.hightlights.?', {
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
        .expectJSONLength('data.hightlights', 1)
        .toss();


/****************************************************************/
/****************************************************************/

frisby.create('Testa suggestions, deve retornar termos iniciando com "mus"')
        .get(urlSearch, {
            q: 'mus'
        })
        .expectStatus(200)
        .expectJSON('data', {
            suggestions: function(suggestion) {
                expect(suggestion).toContain('musica');
                expect(suggestion).toContain('musica de anderson freire');
                expect(suggestion).toContain('musica que neymar pediu');
            }
        })
        .expectJSONLength('data.suggestions', 3)
        .toss();