import { get } from 'axios';
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

const actionKeyEnter = ([term]) => ({
  type: actionsTypes.LIST_KEY_ENTER,
  term,
});

const actionKeyOther = (term) => (dispatch, getState) => dispatch({
  type: actionsTypes.LIST_KEY_OTHER,
  term,
  data: getState().data || {},
});

const actionKeyLeft = (term) => ({
  type: actionsTypes.LIST_KEY_LEFT,
  term,
});

const actionKeyRight = (term) => ({
  type: actionsTypes.LIST_KEY_RIGHT,
  term,
});


function fetch(term) {
  return (dispatch) => {
    dispatch(requestInit(term));
    return get(`http://localhost:9000/search/${term}`)
    .then(response => {
      dispatch(requestSuccess(term, response.data));
    });
  };
}

function fetchIfNeeded(term) {
  // Todo: Cachear dados e verificar antes de fazer requisição no servidor
  if (term.length > 1) {
    return fetch(term);
  }
  return actionKeyOther(term);
}

function search(key, data = []) {
  switch (key) {
    case 13:
      return actionKeyEnter(data);
    case 27:
      return {
        type: actionsTypes.LIST_KEY_ESC,
      };
    case 37:
      return actionKeyLeft(data[0]);
    case 38:
      return {
        type: actionsTypes.LIST_KEY_UP,
      };
    case 39:
      return actionKeyRight(data[0]);
    case 40:
      return {
        type: actionsTypes.LIST_KEY_DOWN,
      };
    default:
      return fetchIfNeeded(data[0]);
  }
}

export default search;
