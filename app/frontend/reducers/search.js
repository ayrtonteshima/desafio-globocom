import initialState from './../configs/searchInitialState';
import {
  LIST_KEY_ENTER, LIST_KEY_OTHER,
  LIST_KEY_LEFT, LIST_KEY_UP,
  LIST_KEY_RIGHT, LIST_KEY_DOWN,
  LIST_KEY_ESC, LIST_MOUSE_OVER,
  LIST_MOUSE_CLICK, REQUEST_SUCCESS,
  REQUEST_FAILURE, REQUEST_INIT,
} from './../constants/ActionsTypes';
import {
  URL_SEARCH_SUGGESTIONS, SEARCH_GLOBO,
  SEARCH_WEB,
} from './../configs/urls';

/**
 * Calcula total de resultados toda vez que é filtrado
 * @param  {Object} options.data Objeto que retorna o array de hightlights e suggestions
 * @return {Number} Retorna total
 */
function getTotalResults({ data }) {
  const { hightlights, suggestions } = data;
  const TOTAL_EXTRA_ITENS = 2;
  return hightlights.length + suggestions.length + TOTAL_EXTRA_ITENS;
}

/**
 * Retorna posição anterior do item selecionado no autocomplete
 * @param  {Number} options.indexActiveItem Posição atual
 * @param  {Object} options.data            Objeto com os dados,
 *                                          usado para verificar se tem algum resultado
 * @return {Number}                         Retorna posição anterior
 */
function handlePrevIndex({ indexActiveItem, data }) {
  if (!data) return -1;
  let index = indexActiveItem;
  if (--index < -1) {
    return -1;
  }
  return index;
}

/**
 * Pega o primeiro termo de sugestões quando clicado para a direita no teclado
 * @param  {Object} state Estado da store
 * @return {Object}       Primeiro termo de sugestões
 */
function handleKeyRight(state) {
  if (state.indexActiveItem !== -1) {
    return state;
  }
  const completeTerm = state.data.data && state.data.data.suggestions.length > 0 ?
                      state.data.data.suggestions[0] :
                      null;
  return {
    completeTerm,
  };
}

/**
 * Retorna próxima posição do item selecionado no autocomplete
 * @param  {Number} options.totalResults    Total de resultados depois de filtrados
 * @param  {Number} options.indexActiveItem Posição atual
 * @param  {Object} options.data            Objeto com os dados, usado
 *                                          para verificar se tem algum resultado
 * @return {Number}                         Retorna próxima posição
 */
function handleNextIndex({ totalResults, indexActiveItem, data }) {
  if (!data) return -1;
  let index = indexActiveItem;
  if (++index >= totalResults) {
    index = index - 1;
  }
  return index;
}


/**
 * Ordena resultado
 * @param  {Object} options.data Objeto com hightlights e suggestions
 * @return {Object}              Retorna resultado ordenado
 */
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

/**
 * Gera estado com o link para qual o usuário será redirecionado
 * @param  {Object} state  Estado atual da store
 * @param  {Action} action Ação passada para reducer processar
 * @return {Object}        Novo estado
 */
function handleGoto(state, action) {
  const { indexActiveItem, data } = state;
  const { data: { hightlights } } = data;
  const { term, itemType } = action;

  let goTo = '';

  const sufixLink = `/?q=${encodeURI(term)}`;

  switch (itemType) {
    case 'hightlights':
      goTo = hightlights[indexActiveItem].url;
      break;
    case 'suggestions':
      goTo = `${URL_SEARCH_SUGGESTIONS}${sufixLink}`;
      break;
    case 'globo':
      goTo = `${SEARCH_GLOBO}${sufixLink}`;
      break;
    case 'web':
      goTo = `${SEARCH_WEB}${sufixLink}`;
      break;
    default:
      goTo = `${URL_SEARCH_SUGGESTIONS}${sufixLink}`;
      break;
  }

  return {
    goTo,
    term,
    openAutocomplete: false,
    indexActiveItem: -1,
  };
}

/**
 * Reducer para requisições ajax
 * @param  {Object} state  Estado atual da store
 * @param  {Object} action Ação com payload passada para reducer processar
 * @return {Object}        Objeto com os dados processados
 */
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

/**
 * Reducer para interações com o teclado
 * @param  {Object} state  Estado atual da store
 * @param  {Action} action Ação com payload passada para reducer processar
 * @return {Object}        Objeto com os dados processados
 */
function keyPress(state, action) {
  switch (action.type) {
    case LIST_KEY_ENTER:
      return Object.assign({}, state, handleGoto(state, action));

    case LIST_KEY_OTHER:
      return Object.assign({}, state, {
        term: action.term,
        data: handleData(action),
        openAutocomplete: action.term.length > 1,
        indexActiveItem: -1,
      });

    case LIST_KEY_LEFT:
      if (state.indexActiveItem !== -1) {
        return state;
      }
      return Object.assign({}, state, {
        completeTerm: null,
      });

    case LIST_KEY_UP:
      if (!state.openAutocomplete) {
        return state;
      }
      return Object.assign({}, state, {
        indexActiveItem: handlePrevIndex(state),
        totalResults: getTotalResults(state.data),
        completeTerm: null,
      });

    case LIST_KEY_RIGHT:
      return Object.assign({}, state, handleKeyRight(state));

    case LIST_KEY_DOWN:
      if (!state.openAutocomplete) {
        return state;
      }
      return Object.assign({}, state, {
        indexActiveItem: handleNextIndex(state),
        totalResults: getTotalResults(state.data),
        completeTerm: null,
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

/**
 * Reducer principal para todo o componente de livesearch
 * @param  {Object} state  Estado atual da store
 * @param  {Object} action Ação com payload passada reducer processar
 * @return {Object}        Objeto com novo estado da store
 */
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

    case LIST_MOUSE_OVER:
      return Object.assign({}, state, {
        indexActiveItem: parseInt(action.indexActiveItem, 10),
        openAutocomplete: true,
      });

    case LIST_MOUSE_CLICK:
      return Object.assign({}, state, handleGoto(state, action));

    default:
      return Object.assign({}, state, {
        term: action.term,
      });
  }
}
