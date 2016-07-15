import { get } from 'axios';
import serverConfigs from './../../configs/server';
import * as actionsTypes from './../constants/ActionsTypes';
import {
  KEY_ENTER,
  KEY_ESC,
  KEY_LEFT,
  KEY_UP,
  KEY_RIGHT,
  KEY_DOWN,
} from './../constants/KeyNames';

const requestInit = (term) => ({
  type: actionsTypes.REQUEST_INIT,
  term,
});

const requestSuccess = (term, data) => ({
  type: actionsTypes.REQUEST_SUCCESS,
  term,
  data,
});

const actionKeyEnter = ([term, itemType]) => ({
  type: actionsTypes.LIST_KEY_ENTER,
  term,
  itemType,
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
    return get(`http://${serverConfigs.host}:${serverConfigs.port}/search/${term}`)
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

export function handleKeyboard(key, data = []) {
  switch (key) {
    case KEY_ENTER:
      return actionKeyEnter(data);
    case KEY_ESC:
      return {
        type: actionsTypes.LIST_KEY_ESC,
      };
    case KEY_LEFT:
      return actionKeyLeft(data[0]);
    case KEY_UP:
      return {
        type: actionsTypes.LIST_KEY_UP,
      };
    case KEY_RIGHT:
      return actionKeyRight(data[0]);
    case KEY_DOWN:
      return {
        type: actionsTypes.LIST_KEY_DOWN,
      };
    default:
      return fetchIfNeeded(data[0]);
  }
}

export function handleMouseOver(indexActiveItem) {
  return {
    type: actionsTypes.LIST_MOUSE_OVER,
    indexActiveItem,
  };
}

export function handleMouseClick(data) {
  return {
    type: actionsTypes.LIST_MOUSE_CLICK,
    term: data[0],
    itemType: data[1],
  };
}
