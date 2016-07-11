import reducer from './../../../../../app/frontend/components/search/reducers';
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
    REQUEST_FAILURE
} from './../../../../../app/frontend/components/search/constants/ActionsTypes';

describe("Requests reducers de requests", () => {
    const term = 'mús';
    const initialState = {
      openAutocomplete: false,
      term: '',
      indexActiveItem: -1,
      loading: false,
      completeTerm: null,
      goTo: null,
    };

    it("Deve retornar o estado inicial", () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it("Reducer REQUEST_INIT: Espera state correto para início da requisição", () => {
        expect(reducer(state, {
            type: REQUEST_INIT,
            term
        })).toEqual({
            loading: true,
            term,
            openAutocomplete: false
        });
    });

    it("Reducer REQUEST_SUCCESS: Espera que retorno tenha o state correto com o termo nas suggestions envolvidas pela tag mark", () => {
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

        const expectedData = {
            hightlights: [
                {
                     "title":"Pop & Art",
                     "url":"http://g1.globo.com/pop-arte/index.html",
                     "logo":"http://s.glbimg.com/bu/i/fc/5fb2e18d-a47f-4bb8-9a7e-b66871cf53c0.png",
                     "queries":[
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
                "<mark>mus</mark>ica",
                "<mark>mus</mark>ica de anderson freire",
                "<mark>mus</mark>ica que neymar pediu"
            ]
        };

        const previosState = Object.assign({}, initialState, {
            term: 'mús'
        });

        expect(reducer(previosState, {
            type: REQUEST_SUCCESS,
            term,
            data: { data }
        })).toEqual({
            openAutocomplete: false,
            term,
            indexActiveItem: -1,
            loading: false,
            completeTerm: null,
            goTo: null,
            data: {data: expectedData },
        });
    });

    it("Reducer REQUEST_FAILURE", () => {
        expect(reducer({
            type: REQUEST_FAILURE,
            term,
            data: []
        })).toEqual({
            loading: false,
            term: 'mús',
            openAutocomplete: true
        });
    });
});

describe("Testando reducers de interactions", () => {
    const initialState = {
        term: 'mús',
        openAutocomplete: true,
        indexActiveItem: 2,
        goto: null,
        completeTerm: null
    };

    it("Valida retorno quando LIST_MOUSE_OVER", () => {
        expect(reducer(undefined, {
            type: LIST_MOUSE_OVER,
            index: 3
        })).toEqual({
            term: 'mús',
            openAutocomplete: true,
            indexItemActive: 3,
            goTo: null,
            completeTerm: null
        });
    });

    it("Valida retorno quando LIST_KEY_DOWN", () => {
        expect(reducer(initialState, {
            type: LIST_KEY_DOWN
        })).toEqual({
            term: 'mús',
            openAutocomplete: true,
            indexActiveItem: 3,
            goTo: null,
            completeTerm: null
        })
    });

    it("Valida retorno quando LIST_KEY_UP", () => {
        expect(reducer(initialState, {
            type: LIST_KEY_UP
        })).toEqual({
            term: 'mús',
            openAutocomplete: true,
            indexActiveItem: 1,
            goTo: null,
            completeTerm: null
        })
    });

    it("Valida retorno quando LIST_KEY_ENTER", () => {
        const state = Object.assign({}, initialState, {
            indexActiveItem: 1
        });

        expect(reducer(state, {
            type: LIST_KEY_ENTER,
            term: 'musica de anderson freire'
        })).toEqual({
            term: 'musica de anderson freire',
            openAutocomplete: false,
            indexActiveItem: -1,
            goTo: 'http://g1.globo.com/busca/?q=musica%20de%20anderson%20freire',
            completeTerm: null
        });
    });

    it("Valida retorno quando LIST_MOUSE_CLICK", () => {
        const state = Object.assign({}, initialState, {
            indexActiveItem: 1
        });

        expect(reducer(state, {
            type: LIST_MOUSE_CLICK,
            term: 'musica de anderson freire'
        })).toEqual({
            term: 'musica de anderson freire',
            openAutocomplete: false,
            goTo: 'http://g1.globo.com/busca/?q=musica%20de%20anderson%20freire',
            indexItemActive: -1,
            completeTerm: null
        });
    });

    it("Valida retorno quando LIST_KEY_LEFT", () => {
        const previousState = Object.assign({}, initialState, {
            term: 'mús',
            completeTerm: 'musica'
        });

        expect(reducer(previousState, {
            type: LIST_KEY_LEFT
        })).toEqual({
            term: 'mús',
            openAutocomplete: true,
            goTo: null,
            indexItemActive: state.indexActiveItem,
            completeTerm: null
        });
    });

    it("Valida retorno quando LIST_KEY_RIGHT", () => {
        const previousState = Object.assign({}, initialState, {
            term: 'mús'
        });

        expect(reducer(previousState, {
            type: LIST_KEY_RIGHT
        })).toEqual({
            term: 'mús',
            openAutocomplete: true,
            goTo: null,
            indexItemActive: state.indexActiveItem,
            completeTerm: 'musica'
        });
    });
});