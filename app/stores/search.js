import * as searchModel from './../models/search';

function filterHightlights(term, { hightlights }) {
    return hightlights;
}

function filterSuggestions(term, { suggestions }) {
    return suggestions;
}

function filter(request, data) {
    const hightlights = filterHightlights(request, data);
    const suggestions = filterSuggestions(request, data);
    return {
        hightlights,
        suggestions,
    };
}

export function getDataFiltered(request) {
    return searchModel.get().then((data) => {
        const { q } = request.params;
        const dataFiltered = filter(q, data);
        return Promise.resolve(dataFiltered);
    });
}
