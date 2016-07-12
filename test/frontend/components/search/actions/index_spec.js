import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import actions from './../../../../../app/frontend/components/search/actions';
import {
    LIST_KEY_UP,
    LIST_KEY_DOWN,
    LIST_KEY_LEFT,
    LIST_KEY_RIGHT,
    LIST_KEY_ESC,
    LIST_KEY_ENTER,
    LIST_MOUSE_OVER,
    REQUEST_INIT,
    REQUEST_SUCCESS,
    REQUEST_FAILURE,
} from './../../../../../app/frontend/components/search/constants/ActionsTypes';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe("Testando action creators de interactions do teclado", () => {
    const KEY_ENTER     = 13;
    const KEY_ESC       = 27;
    const KEY_LEFT      = 37;
    const KEY_UP        = 38;
    const KEY_RIGHT     = 39;
    const KEY_DOWN      = 40;

    it("Testa quando pressiona ENTER em um item da lista no autocomplete aberto", () => {
        const expectedAction = {
            type: LIST_KEY_ENTER,
            term: 'musica de anderson freire'
        };

        expect(actions(KEY_ENTER, ['musica de anderson freire', 1])).toEqual(expectedAction);
    });


    it("Testa quando pressiona ESC dentro do autocomplete aberto", () => {
        const expectedAction = {
            type: LIST_KEY_ESC
        };

        expect(actions(KEY_ESC)).toEqual(expectedAction);
    });

    it("Testa quando pressiona para cima dentro do autocomplete aberto", () => {
        const expectedAction = {
            type: LIST_KEY_UP
        };

        expect(actions(KEY_UP)).toEqual(expectedAction);
    });

    it("Testa quando pressiona para baixo dentro do autocomplete aberto", () => {
        const expectedAction = {
            type: LIST_KEY_DOWN
        };

        expect(actions(KEY_DOWN)).toEqual(expectedAction);
    });

    it("Testa quando pressiona para esquerda dentro do autocomplete aberto", () => {
        const expectedAction = {
            type: LIST_KEY_LEFT,
            term: 'mús'
        };

        expect(actions(KEY_LEFT, ['mús'])).toEqual(expectedAction);
    });

    it("Testa quando pressiona para direita dentro do autocomplete aberto", () => {
        const expectedAction = {
            type: LIST_KEY_RIGHT,
            term: 'mús'
        };
        expect(actions(KEY_RIGHT, ['mús'])).toEqual(expectedAction);
    });

});

describe("Testando action creators de interações do mouse", () => {
    it("Testa quando mouse passa em cima do terceiro item da lista do autocomplete", () => {
        const expectedAction = {
            type: LIST_MOUSE_OVER,
            index: 3
        };

        expected(actions(LIST_MOUSE_OVER).toEqual(expectedAction));
    });
});

describe("Testando async action de requests", () => {
    // Estado inicial da store
    const stateStore = {
        openAutocomplete: false,
        term: '',
        indexActiveItem: -1,
        loading: false
    };

    afterEach(() => {
        nock.cleanAll();
    });

    it("Testa sucesso da requisição quando estiver completa", () => {
        const data = {
            hightlights: [
                {
                     title: "Pop & Art",
                     url: "http://g1.globo.com/pop-arte/index.html",
                     logo: "http://s.glbimg.com/bu/i/fc/5fb2e18d-a47f-4bb8-9a7e-b66871cf53c0.png",
                     queries: [
                        "música",
                        "pop",
                        "art",
                        "arte",
                        "cultura",
                        "shows"
                     ]
                }
            ],
            suggestions: [
                "musica",
                "musica de anderson freire",
                "musica que neymar pediu"
            ]
        };

        // Intercepta requisição e retorna o objeto passado em reply
        nock("http://localhost:9000")
            .get("/search/mús")
            .reply(200, {
                statusCode: 200,
                message: 'Resultado retornado com sucesso',
                data
            });

        const store = mockStore(stateStore);

        const expectedActions = [
            { type: REQUEST_INIT, term: 'mú' },
            {
                type: REQUEST_SUCCESS,
                term: 'mú', 
                statusCode: 200,
                message: 'Resultado retornado com sucesso',
                data
            }
        ];

        return store.dispatch(actions(119, ['mú']))
                .then(() => {
                    expect(store.getActions()).toEqual(expectedActions);
                });
    });
});
