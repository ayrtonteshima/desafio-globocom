import { get } from 'axios';
import { SEARCH_BASE } from './../configs/urls';
import * as actionsTypes from './../constants/ActionsTypes'; 

const requestInit = (term) => ({
    type: actionsTypes.REQUEST_INIT,
    term,
});

const requestSuccess = (term, data) => ({
    type: actionsTypes.REQUEST_SUCCESS,
    term,
    data,
});

const actionKeyEnter = (term) => ({
    type: actionsTypes.LIST_KEY_ENTER,
    term
});

const actionKeyOther = (term) => (dispatch, getState) => dispatch({
    type: actionsTypes.LIST_KEY_OTHER,
    term,
    data: getState().data || {}
});

function fetch(term) {
    return (dispatch) => {
        dispatch(requestInit(term));
        return get(`http://localhost:9000/search/${term}`)
            .then(response => {
                dispatch(requestSuccess(term, response.data))
            })
    }
}

function fetchIfNeeded(term) {
    // Todo: Cachear dados e verificar antes de fazer requisição no servidor
    if (term.length > 1) {
        return fetch(term);
    }
    return actionKeyOther(term);
}

function search(key, data = array) {
    switch (key) {
        case 13:
            return actionKeyEnter(data[0]);
        default:
            return fetchIfNeeded(data[0])
    }
}

export default search;
