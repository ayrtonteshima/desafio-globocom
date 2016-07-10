import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import * as requestsAction from './../../../../../app/frontend/components/search/actions/requests';
import {
    REQUEST_INIT,
    REQUEST_SUCCESS,
    REQUEST_FAILURE
} from './../../../../../app/frontend/components/search/constants/ActionsTypes';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe("Testando async action de requests", () => {
    // Estado inicial da store
    const initialState = {
        openAutocomplete: false,
        term: '',
        indexActiveItem: -1,
        loading: false
    };

    afterEach(() => {
        nock.clearAll();
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
        nock("http://localhost:8080")
            .get("/search/mús")
            .reply(200, {
                statusCode: 200,
                message: 'Resultado retornado com sucesso',
                data
            });

        const store = mockStore(initialState);

        const expectedActions = [
            { type: REQUEST_INIT, term: 'mús' },
            {
                type: REQUEST_SUCCESS,
                term: 'mús', 
                statusCode: 200,
                message: 'Resultado retornado com sucesso',
                data
            }
        ];

        return store.dispatch(requestsAction.fetch('mús'))
                .then(() => {
                    expect(store.getActions()).toEqual(expectedActions);
                });
    });


    it("Testa falha da requisição", () => {
        nock("http://localhost:8080")
            .get("/search/mús")
            .reply(404, {
                statusCode: 404,
                message: 'Ops! erro ao buscar',
                data: []
            });

        const store = mockStore(initialState);

        const expectedActions = [
            { type: REQUEST_INIT, term: 'mús' },
            {
                type: REQUEST_FAILURE,
                term: 'mús',
                data: []
            }
        ];

        return store.dispatch(requestsAction.fetch('mús'))
                .catch(() => {
                    expect(store.getActions()).toEqual(expectedActions);
                });
    });
});

