import * as ActionsTypes from './../constants/ActionsTypes';
import initialState from './../configs/initialState';
import { SEARCH_BASE } from './../configs/urls';

export default function(state, action) {
    if (state == undefined) {
        return initialState;
    }

    switch(action.type) {
        case ActionsTypes.LIST_KEY_ENTER:
            return Object.assign({}, state, {
                goTo: `${SEARCH_BASE}/${encodeURI(action.term)}`
            });
        default: 
            return Object.assign({}, state, {
                term: action.term
            });
    }
};