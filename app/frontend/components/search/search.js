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
        const { target: { value }, which } = event;
        const data = [value];
        if (which === 13) {
            data.push(event.target.getAttribute('data-type'));
        }
        console.log(data);
        this.store.dispatch(actions(which, data));
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
        this.dom.input.addEventListener('focus', this.handlerFocusInput);
        this.dom.input.addEventListener('blur', this.handlerBlurInput);
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

    getClassItemSelected(index) {
        return index === this.store.getState().indexActiveItem ?
                'autocomplete__item--selected' :
                '';
    }

    setValueInputKeyUpAndDown(term) {
        const selected = document.querySelector('.autocomplete__item--selected');
        if (selected && selected.getAttribute('data-title')) {
            this.dom.input.value = document.querySelector('.autocomplete__item--selected').getAttribute('data-title');
        } else {
            this.dom.input.value = term;
        }
    }

    renderHightlight({title, logo}, index) {
        return `<li
                    data-type="hightlight"
                    class="autocomplete__item ${this.getClassItemSelected(index)} autocomplete__item-selectable autocomplete__item--hightlights"
                >
                    <img src="${logo}" />
                    <span>${title}</span>
                </li>`;
    }

    renderHightlights({hightlights}) {
        return hightlights.map((h, index) => this.renderHightlight(h, index)).join('');
    }

    renderSuggestion(suggestionMarked, suggestion, index) {
        return `<li data-type="suggestion" data-title="${suggestion}" class="autocomplete__item ${this.getClassItemSelected(index)} autocomplete__item-selectable">${suggestionMarked}</li>`;
    }

    renderSuggestions({suggestions, suggestionsMarked, hightlights}) {
        const totalHightlights = hightlights.length;
        const suggestionsHtml = suggestionsMarked.map((s, index) => this.renderSuggestion(s, suggestions[index], index+totalHightlights)).join('');

        return `<li class="autocomplete__item autocomplete__suggestions">
                    <ul>
                        <li class="autocomplete__item autocomplete__item--info">Sugestões de busca</li>
                        ${suggestionsHtml}
                    </ul>
                </li>`;
    }

    renderSuggestionGlobo(term, index) {
        return `<li
                    data-type="globo"
                    class="autocomplete__item autocomplete__item-selectable ${this.getClassItemSelected(index)}"
                >
                        Busca '${term}' na Globo.com
                </li>`;
    }

    renderSuggestionWeb(term, index) {
        return `<li data-type="web" class="autocomplete__item autocomplete__item-selectable ${this.getClassItemSelected(index)}">Busca '${term}' na Web</li>`;
    }

    render() {
        if (!this.store.getState().openAutocomplete) return null;

        if (this.store.getState().goTo) {
            window.location.href = this.store.getState().goTo;
        }

        const state = this.store.getState();
        const { term, data: { data } } = state;
        const totalHightlights = data.hightlights.length;
        const totalSuggestions = data.suggestions.length;

        const indexSuggestionGlobo = totalHightlights + totalSuggestions;
        const indexSuggestionWeb = indexSuggestionGlobo + 1;

        const hightlights = this.renderHightlights(data);
        const suggestions = this.renderSuggestions(data);
        const suggestionGlobo = this.renderSuggestionGlobo(term, indexSuggestionGlobo);
        const suggestionWeb = this.renderSuggestionGlobo(term, indexSuggestionWeb);

        const html = `
                ${hightlights}
                ${suggestions}
                ${suggestionGlobo}
                ${suggestionWeb}
                `;


        this.dom.autocomplete__list.innerHTML = html;
        this.setValueInputKeyUpAndDown(term);
    }
}

export default new Search;