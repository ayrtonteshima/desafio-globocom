import initialState from './../configs/initialState';
import {
  LIST_KEY_ENTER,
  LIST_KEY_OTHER,
  LIST_KEY_LEFT,
  LIST_KEY_UP,
  LIST_KEY_RIGHT,
  LIST_KEY_DOWN,
  LIST_KEY_ESC,
  REQUEST_INIT,
  REQUEST_SUCCESS,
  REQUEST_FAILURE,
} from './../constants/ActionsTypes';
import {
  URL_SEARCH_SUGGESTIONS,
  SEARCH_GLOBO,
  SEARCH_WEB,
} from './../configs/urls';

function getTotalResults({ data }) {
  const { hightlights, suggestions } = data;
  const TOTAL_EXTRA_ITENS = 2;
  return hightlights.length + suggestions.length + TOTAL_EXTRA_ITENS;
}

function handlePrevIndex({ indexActiveItem, data }) {
  if (!data) return -1;
  let index = indexActiveItem;
  if (--index < -1) {
    return -1;
  }
  return index;
}

function handleNextIndex({ totalResults, indexActiveItem, data }) {
  if (!data) return -1;
  let index = indexActiveItem;
  if (++index >= totalResults) {
    index = index - 1;
  }
  return index;
}

function handleData({ data }) {
  if (!data.data) return {};
  const { suggestions, hightlights } = data.data;

  // Ordenando
  suggestions.sort((a, b) => a.length - b.length);
  hightlights.sort((a, b) => a.title.length - b.title.length);

  return Object.assign({}, data, {
    data: {
      hightlights,
      suggestions,
    },
  });
}

function reducerKeyEnter(state, action) {
  // Todo: Refatorar
  const { indexActiveItem, data } = state;
  const { data: { hightlights } } = data;
  const { term, itemType } = action;

  let goTo = '';

  switch (itemType) {
    case 'hightlights':
      goTo = hightlights[indexActiveItem].url;
      break;
    case 'suggestion':
      goTo = `${URL_SEARCH_SUGGESTIONS}/?q=${encodeURI(term)}`;
      break;
    case 'globo':
      goTo = `${SEARCH_GLOBO}/?q=${encodeURI(term)}`;
      break;
    case 'web':
      goTo = `${SEARCH_WEB}/?q=${encodeURI(term)}`;
      break;
    default:
      goTo = `${SEARCH_GLOBO}/?q=${encodeURI(term)}`;
      break;
  }

  return {
    goTo,
  };
}

function requests(state, action) {
  switch (action.type) {
    case REQUEST_INIT:
      return {
        term: action.term,
        loading: true,
      };

    case REQUEST_SUCCESS:
      return {
        term: action.term,
        data: handleData(action),
        openAutocomplete: action.term.length > 1,
        indexActiveItem: -1,
        totalResults: getTotalResults(action.data),
      };

    default:
      return state;
  }
}

function keyPress(state, action) {
  switch (action.type) {
    case LIST_KEY_ENTER:
      return Object.assign({}, state, reducerKeyEnter(state, action));

    case LIST_KEY_OTHER:
      return Object.assign({}, state, {
        term: action.term,
        data: handleData(action),
        openAutocomplete: action.term.length > 1,
        indexActiveItem: -1,
      });

    case LIST_KEY_LEFT:
      return Object.assign({}, state, {});

    case LIST_KEY_UP:
      return Object.assign({}, state, {
        indexActiveItem: handlePrevIndex(state),
      });

    case LIST_KEY_RIGHT:
      return Object.assign({}, state, {});

    case LIST_KEY_DOWN:
      return Object.assign({}, state, {
        indexActiveItem: handleNextIndex(state),
      });

    case LIST_KEY_ESC:
      return Object.assign({}, state, {
        indexActiveItem: -1,
        openAutocomplete: false,
      });
    default:
      return state;
  }
}

export default function (state, action) {
  if (state === undefined) {
    return initialState;
  }

  switch (action.type) {
    case LIST_KEY_ENTER:
    case LIST_KEY_OTHER:
    case LIST_KEY_LEFT:
    case LIST_KEY_UP:
    case LIST_KEY_RIGHT:
    case LIST_KEY_DOWN:
    case LIST_KEY_ESC:
      return Object.assign({}, state, keyPress(state, action));

    case REQUEST_INIT:
    case REQUEST_SUCCESS:
    case REQUEST_FAILURE:
      return Object.assign({}, state, requests(state, action));

    default:
      return Object.assign({}, state, {
        term: action.term,
      });
  }
}
