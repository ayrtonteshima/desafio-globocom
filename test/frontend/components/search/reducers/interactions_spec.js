import reducer from './../../../../../app/frontend/components/search/reducers/';
import {
    LIST_KEY_UP,
    LIST_KEY_DOWN,
    LIST_KEY_LEFT,
    LIST_KEY_RIGHT,
    LIST_KEY_ESC,
    LIST_KEY_ENTER,
    LIST_MOUSE_OVER
} from './../../../../../app/frontend/components/search/constants/ActionsTypes';

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