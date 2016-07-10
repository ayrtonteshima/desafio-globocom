import { createStore } from 'redux';
import InteractionsAction from './actions/interactions';
import searchReducer from './reducers';

class Search {
    constructor() {
        this.dom = {};
        this.dom.form = document.getElementsByClassName('search-component__form')[0];
        this.dom.input = document.getElementById('search-component__field');
        this.dom.autocomplete = document.getElementsByClassName('autocomplete')[0];

        this.handlerInputKeyUp = this.handlerInputKeyUp.bind(this);
        this.handlerFormSubmit = this.handlerFormSubmit.bind(this);
        this.showAutocomplete = this.showAutocomplete.bind(this);
        this.getState = this.getState.bind(this);
        this.render = this.render.bind(this);
        this.bindEvents();

        this.store = createStore(searchReducer);
        this.store.subscribe(this.showAutocomplete);
        this.store.subscribe(this.render);

    }

    handlerInputKeyUp(event) {
        event.preventDefault();
        const value = event.target.value;
        this.store.dispatch(InteractionsAction(event.which, [value]));
    }

    handlerFormSubmit(event) {
        event.preventDefault();
    }

    bindEvents() {
        this.dom.input.addEventListener('keyup', this.handlerInputKeyUp);
        this.dom.form.addEventListener('submit', this.handlerFormSubmit);
    }

    getState() {
        return this.store.getState().interactions;
    }

    showAutocomplete() {
        const open = this.getState().openAutocomplete;
        this.dom
            .autocomplete
            .classList
            .toggle('autocomplete--opened', open);
    }

    render() {

    }
}

export default new Search;