import * as searchModel from './../models/search';

const accentsTidy = (s) => {
    var r=s.toLowerCase();
    r = r.replace(new RegExp(/[àáâãäå]/g),"a");
    r = r.replace(new RegExp(/ç/g),"c");
    r = r.replace(new RegExp(/[èéêë]/g),"e");
    r = r.replace(new RegExp(/[ìíîï]/g),"i");
    r = r.replace(new RegExp(/[òóôõö]/g),"o");
    r = r.replace(new RegExp(/[ùúûü]/g),"u");
    return r;
};

const regExpTextCompare = (value) => new RegExp(`${accentsTidy(value)}`, 'ig');

const searchTermArray = (arr = [], term = '') => {
    let found = false;
    arr.forEach((value) => {
        if (regExpTextCompare(term).test(accentsTidy(value))) {
            found = true;
        }
    })
    return found;
}

const filterHightlights = (term, { hightlights }) => {
    if (!term) return hightlights;
    const hightlightsFiltered = hightlights.filter(({queries}) => searchTermArray(queries, term));

    return hightlightsFiltered;
};

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
