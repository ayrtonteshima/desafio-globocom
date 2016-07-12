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

const handlePrevIndex = ({ indexActiveItem, data }) => {
    return --indexActiveItem < -1 ? -1 : indexActiveItem
}

const handleNextIndex = ({ indexActiveItem, data }) => {
    if (!data) return -1;
    const { data: { hightlights, suggestions }} = data;
    const total = hightlights.length + suggestions.length + 2;

    if (++indexActiveItem >= total) {
        indexActiveItem = indexActiveItem - 1;
    }

    return indexActiveItem;
}

const handleData = ({term, data}) => {
    if (!data.data) return {};
    let { suggestions, hightlights } = data.data;

    // Ordenando
    suggestions.sort((a, b) => a.length - b.length);
    hightlights.sort((a, b) => a.title.length - b.title.length);

    const suggestionsMarked = suggestions.map((sg) => addMarkTag(accentsTidy(sg), accentsTidy(term)));
    return Object.assign({}, data, {
        data: {
            hightlights,
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
                goTo: `${SEARCH_BASE}/?q=${encodeURI(action.term)}`
            });

        case actionsTypes.LIST_KEY_OTHER:
            return Object.assign({}, state, {
                term: action.term,
                data: handleData(action),
                openAutocomplete: action.term.length > 1,
                indexActiveItem: -1
            });

        case actionsTypes.LIST_KEY_LEFT:
            return Object.assign({}, state, {});

        case actionsTypes.LIST_KEY_UP:
            return Object.assign({}, state, {
                indexActiveItem: handlePrevIndex(state)
            });

        case actionsTypes.LIST_KEY_RIGHT:
            return Object.assign({}, state, {});

        case actionsTypes.LIST_KEY_DOWN:
            return Object.assign({}, state, {
                indexActiveItem: handleNextIndex(state)
            });

        case actionsTypes.LIST_KEY_ESC:
            return Object.assign({}, state, {
                indexActiveItem: -1,
                openAutocomplete: false
            });

        case actionsTypes.REQUEST_INIT:
            return Object.assign({}, state, {
                term: action.term,
                loading: true
            });

        case actionsTypes.REQUEST_SUCCESS:
            return Object.assign({}, state, {
                term: action.term,
                data: handleData(action),
                openAutocomplete: action.term.length > 1,
                indexActiveItem: -1
            });

        default: 
            return Object.assign({}, state, {
                term: action.term
            });
    }
};