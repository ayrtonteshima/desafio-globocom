import * as actionsTypes from './../constants/ActionsTypes';
import initialState from './../configs/initialState';
import { SEARCH_BASE } from './../configs/urls';
import {
    accentsTidy,
    filterHightlights,
    filterSuggestions,
} from './../../../../utils';

const addMarkTag = (text, input) => (
    text === '' ?
    text :
    text.replace(RegExp(input.trim(), "gi"), "<mark>$&</mark>")
);

const normalizeData = ({term, data}) => {
    if (!data.data) return {};
    let { suggestions } = data.data; 
    const suggestionsMarked = suggestions.map((sg) => addMarkTag(accentsTidy(sg), accentsTidy(term)));
    return Object.assign({}, data, {
        data: {
            hightlights: data.data.hightlights,
            suggestions,
            suggestionsMarked
        }
    });

};

export default function(state, action) {
    if (state == undefined) {
        return initialState;
    }

    switch(action.type) {
        case actionsTypes.LIST_KEY_ENTER:
            return Object.assign({}, state, {
                goTo: `${SEARCH_BASE}/${encodeURI(action.term)}`
            });

        case actionsTypes.LIST_KEY_OTHER:
            return Object.assign({}, state, {
                term: action.term,
                data: normalizeData(action),
                openAutocomplete: action.term.length > 1
            });

        case actionsTypes.REQUEST_INIT:
            return Object.assign({}, state, {
                term: action.term,
                loading: true
            });

        case actionsTypes.REQUEST_SUCCESS:
            return Object.assign({}, state, {
                term: action.term,
                data: normalizeData(action),
                openAutocomplete: action.term.length > 1
            });

        default: 
            return Object.assign({}, state, {
                term: action.term
            });
    }
};