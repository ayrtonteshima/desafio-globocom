import * as searchModel from './../models/search';

const filterHightlights = (term, { hightlights }) => hightlights;

const filterSuggestions = (term, { suggestions }) => suggestions;

function getDataFiltered(term, data) {
    const hightlights = filterHightlights(term, data);
    const suggestions = filterSuggestions(term, data);
    return {
        hightlights,
        suggestions,
    };
}

export function filter(request) {
    return searchModel.get().then(data => {
        const { q } = request.params;
        return Promise.resolve(getDataFiltered(q, data));
    }).catch(err => {
        return Promise.reject(err);
    });
}
