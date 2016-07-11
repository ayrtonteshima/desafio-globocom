import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import actions from './actions';
import searchReducer from './reducers';

class Search {
    constructor() {
        this.dom = {};
        this.dom.search = document.getElementsByClassName('search-component')[0];
        this.dom.form = document.getElementsByClassName('search-component__form')[0];
        this.dom.input = document.getElementById('search-component__field');
        this.dom.autocomplete = document.getElementsByClassName('autocomplete')[0];
        this.dom.autocomplete__list = document.getElementsByClassName('autocomplete__list')[0];

        this.handlerInputKeyUp = this.handlerInputKeyUp.bind(this);
        this.handlerFormSubmit = this.handlerFormSubmit.bind(this);
        this.handlerFocusInput = this.handlerFocusInput.bind(this);
        this.handlerBlurInput = this.handlerBlurInput.bind(this);
        this.showAutocomplete = this.showAutocomplete.bind(this);
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

    handlerInputKeyUp(event) {
        event.preventDefault();
        const { value } = event.target;
        // if (value.length > 1) {
        this.store.dispatch(actions(event.which, [value]));
        // }
    }

    handlerFormSubmit(event) {
        event.preventDefault();
    }

    handlerFocusInput(event) {
        this.dom.search.classList.add('search-component--opened');
    }

    handlerBlurInput(event) {
        this.dom.autocomplete.classList.remove('autocomplete--opened');
        this.dom.search.classList.remove('search-component--opened');
    }

    bindEvents() {
        this.dom.input.addEventListener('keyup', this.handlerInputKeyUp);
        this.dom.input.addEventListener("focus", this.handlerFocusInput);
        // this.dom.input.addEventListener("blur", this.handlerBlurInput);
        this.dom.form.addEventListener('submit', this.handlerFormSubmit);
    }

    subscribe() {
        this.store.subscribe(this.showAutocomplete);
        this.store.subscribe(this.render);
    }

    showAutocomplete() {
        const open = this.store.getState().openAutocomplete;
        this.dom
            .autocomplete
            .classList
            .toggle('autocomplete--opened', open);
    }

    renderHightlight({title, logo}) {
        return `<li class="autocomplete__item autocomplete__item-selectable autocomplete__item--hightlights">
                    <img src="${logo}" />
                    <span>${title}</span>
                </li>`;
    }

    renderSuggestion(suggestion) {
        return `<li class="autocomplete__item autocomplete__item-selectable">${suggestion}</li>`;
    }

    renderAutocomplete () {

    }

    render() {
        if (!this.store.getState().openAutocomplete) return null;
        const data = this.store.getState().data.data;
        const term = this.store.getState().term;
        const hightlights = data.hightlights.map(h => this.renderHightlight(h)).join('');
        const suggestions = data.suggestionsMarked.map(s => this.renderSuggestion(s)).join('');
        const html = `
                ${hightlights}
                <li class="autocomplete__item autocomplete__suggestions">
                    <ul>
                        <li class="autocomplete__item autocomplete__item--info">Sugestões de busca</li>
                        ${suggestions}
                    </ul>
                </li>
                <li class="autocomplete__item autocomplete__item-selectable">Busca '${term}' na Globo.com</li>
                <li class="autocomplete__item autocomplete__item-selectable">Busca '${term}' na Web</li>
                `;


        this.dom.autocomplete__list.innerHTML = html;
    }
}

export default new Search;