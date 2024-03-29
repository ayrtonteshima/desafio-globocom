import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {
  handleKeyboard,
  handleMouseOver,
  handleMouseClick,
} from './actions/search';
import { KEY_ENTER } from './constants/KeyNames';
import searchReducer from './reducers';
import { accentsTidy } from './../utils';
import { delegate } from './helpers/utils';

class Search {
  constructor() {
    this.dom = {};
    this.dom.search = document.getElementsByClassName('search-component')[0];
    this.dom.form = document.getElementsByClassName('search-component__form')[0];
    this.dom.input = document.getElementById('search-component__field');
    this.dom.autocomplete = document.getElementsByClassName('autocomplete')[0];
    this.dom.autocomplete__list = document.getElementsByClassName('autocomplete__list')[0];

    this.ignoreBlur = false;

    this.handleInputKeyUp = this.handleInputKeyUp.bind(this);
    this.handleFocusInput = this.handleFocusInput.bind(this);
    this.handleBlurInput = this.handleBlurInput.bind(this);
    this.showAutocomplete = this.showAutocomplete.bind(this);
    this.bindItemOverAutocomplete = this.bindItemOverAutocomplete.bind(this);
    this.bindItemClickAutocomplete = this.bindItemClickAutocomplete.bind(this);
    this.getState = this.getState.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.render = this.render.bind(this);

    this.bindEvents();

    this.store = createStore(
      searchReducer,
      compose(
        applyMiddleware(thunk, logger())
        )
      );

    this.subscribe();
  }

  getState() {
    return this.store.getState().search;
  }

  handleInputKeyUp(event) {
    event.preventDefault();
    const { target: { value }, which } = event;
    const data = [value];
    // Todo: refatorar
    if (which === KEY_ENTER) {
      const el = document.querySelector('.autocomplete__item--selected');
      if (el) {
        const type = el.getAttribute('data-type');
        data.push(type);
      }
    }
    this.store.dispatch(handleKeyboard(which, data));
  }

  handleFormSubmit(event) {
    event.preventDefault();
  }

  handleFocusInput() {
    this.dom.search.classList.add('search-component--opened');
  }

  handleBlurInput() {
    if (!this.ignoreBlur) {
      this.dom.autocomplete.classList.remove('autocomplete--opened');
      this.dom.search.classList.remove('search-component--opened');
    }
  }

  bindEvents() {
    this.dom.input.addEventListener('keyup', this.handleInputKeyUp);
    this.dom.input.addEventListener('focus', this.handleFocusInput);
    this.dom.input.addEventListener('blur', this.handleBlurInput);
    this.dom.form.addEventListener('submit', this.handleFormSubmit);
    this.dom.autocomplete.addEventListener('mousedown', () => {
      this.ignoreBlur = true;
    });
    this.dom.autocomplete.addEventListener('mouseup', () => {
      this.ignoreBlur = false;
      this.handleBlurInput();
    });
    this.bindItemClickAutocomplete();
    this.bindItemOverAutocomplete();
  }

  bindItemOverAutocomplete() {
    const me = this;

    delegate(this.dom.autocomplete, 'autocomplete__item-selectable', 'mouseover', (el) => {
      const currentIndex = me.getState().indexActiveItem;
      const nextIndex = parseInt(el.getAttribute('data-index'), 10);
      if (currentIndex !== nextIndex) {
        me.store.dispatch(handleMouseOver(nextIndex));
      }
      return void 0;
    });
  }

  bindItemClickAutocomplete() {
    const me = this;
    delegate(this.dom.autocomplete, 'autocomplete__item-selectable', 'click', () => {
      const data = [this.dom.input.value];
      const el = document.querySelector('.autocomplete__item--selected');
      if (el) {
        const type = el.getAttribute('data-type');
        data.push(type);
      }
      me.store.dispatch(handleMouseClick(data));
      return void 0;
    });
  }

  subscribe() {
    this.store.subscribe(this.showAutocomplete);
    this.store.subscribe(this.render);
  }

  showAutocomplete() {
    const open = this.getState().openAutocomplete;
    this.dom
    .autocomplete
    .classList
    .toggle('autocomplete--opened', open);
  }

  getClassItemSelected(index) {
    return index === this.getState().indexActiveItem ?
    'autocomplete__item--selected' :
    '';
  }

  setValueInputKeyUpAndDown(term) {
    if (this.getState().completeTerm) {
      this.dom.input.value = this.getState().completeTerm;
    } else {
      const selected = document.querySelector('.autocomplete__item--selected');
      if (selected && selected.getAttribute('data-title')) {
        this.dom.input.value = selected.getAttribute('data-title');
      } else {
        this.dom.input.value = term;
      }
    }
  }

  addMarkTag(text, input) {
    if (text === '') {
      return text;
    }
    const regExp = RegExp(accentsTidy(input.trim()), 'gi');
    return accentsTidy(text).replace(regExp, '<mark>$&</mark>');
  }

  renderHightlight({ title, logo }, index) {
    const classesLi = [
      'autocomplete__item',
      'autocomplete__item-selectable',
      'autocomplete__item--hightlights',
      this.getClassItemSelected(index),
    ].join(' ');
    return `<li
              data-type="hightlights"
              data-index="${index}"
              class="${classesLi}">
              <img src="${logo}" />
              <span>${title}</span>
            </li>`;
  }

  renderHightlights({ hightlights }) {
    return hightlights.map((h, index) => this.renderHightlight(h, index)).join('');
  }

  renderSuggestion(suggestion, index) {
    const classesLi = [
      'autocomplete__item',
      'autocomplete__item-selectable',
      this.getClassItemSelected(index),
    ].join(' ');
    const term = this.getState().term;
    const suggestionMarked = this.addMarkTag(suggestion, term);
    return `<li
              data-type="suggestions"
              data-title="${suggestion}"
              data-index="${index}"
              class="${classesLi}">
                ${suggestionMarked}
            </li>`;
  }

  renderSuggestions({ suggestions, hightlights }) {
    const totalHightlights = hightlights.length;
    const suggestionsHtml = suggestions.map((s, index) => (
      this.renderSuggestion(s, index + totalHightlights))
    ).join('');

    return `<li class="autocomplete__item autocomplete__suggestions">
              <ul>
              <li class="autocomplete__item autocomplete__item--info">Sugestões de busca</li>
              ${suggestionsHtml}
              </ul>
            </li>`;
  }

  renderSuggestionGlobo(term, index) {
    const classesLi = [
      'autocomplete__item',
      'autocomplete__item-selectable',
      this.getClassItemSelected(index),
    ].join(' ');
    return `<li
              data-type="globo"
              data-index="${index}"
              class="${classesLi}"
              >
              Busca '${term}' na Globo.com
            </li>`;
  }

  renderSuggestionWeb(term, index) {
    const classesLi = [
      'autocomplete__item',
      'autocomplete__item-selectable',
      this.getClassItemSelected(index),
    ].join(' ');
    return `<li
              data-type="web"
              data-index="${index}"
              class="${classesLi}">
                Busca '${term}' na Web
            </li>`;
  }

  render() {
    if (this.getState().goTo) {
      window.location.href = this.getState().goTo;
    }
    if (!this.getState().openAutocomplete) return null;

    const state = this.getState();
    const { term, data: { data } } = state;
    const totalHightlights = data.hightlights.length;
    const totalSuggestions = data.suggestions.length;

    const indexSuggestionGlobo = totalHightlights + totalSuggestions;
    const indexSuggestionWeb = indexSuggestionGlobo + 1;

    const hightlights = this.renderHightlights(data);
    const suggestions = this.renderSuggestions(data);
    const suggestionGlobo = this.renderSuggestionGlobo(term, indexSuggestionGlobo);
    const suggestionWeb = this.renderSuggestionWeb(term, indexSuggestionWeb);

    const html = `
    ${hightlights}
    ${suggestions}
    ${suggestionGlobo}
    ${suggestionWeb}
    `;

    this.dom.autocomplete__list.innerHTML = html;
    this.setValueInputKeyUpAndDown(term);

    return null;
  }
}

export default new Search;
