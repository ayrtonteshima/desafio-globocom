import * as searchModel from './../models/search';

/**
 * Remove acentos e converte para minusculo para não ter problemas na hora de buscar o termo
 *
 * @constructor
 * @param   {String} s - Termo que vai perder os acentos e ser convertido par minusculo.
 * @returns {String} - String com alterações
 */
const accentsTidy = (s) => {
    let r = s.toLowerCase();
    r = r.replace(new RegExp(/[àáâãäå]/g), 'a');
    r = r.replace(new RegExp(/ç/g), 'c');
    r = r.replace(new RegExp(/[èéêë]/g), 'e');
    r = r.replace(new RegExp(/[ìíîï]/g), 'i');
    r = r.replace(new RegExp(/[òóôõö]/g), 'o');
    r = r.replace(new RegExp(/[ùúûü]/g), 'u');
    return r;
};

const regExpTextCompare = (haystack, needle) => (
    new RegExp(`${accentsTidy(needle)}`, 'ig').test(accentsTidy(haystack))
);


const searchTermArray = (arr = [], needle = '') => {
    const total = arr.length;
    let found = false;
    let count = 0;
    while (!found) {
        if (count >= total) break;
        found = regExpTextCompare(arr[count++], needle);
    }
    return found;
};


const filterHightlights = ({ term }, { hightlights }) => {
    if (!term) return hightlights;
    return hightlights.filter(({ queries }) => searchTermArray(queries, term));
};


const filterSuggestions = ({ term }, { suggestions }) => {
    if (!term) return suggestions;
    return suggestions.filter((haystack) => regExpTextCompare(haystack, term));
};


export function filter(request) {
    return searchModel.get().then(data => {
        const hightlights = filterHightlights(request.params, data);
        const suggestions = filterSuggestions(request.params, data);

        return Promise.resolve({
            hightlights,
            suggestions,
        }, data);
    }).catch(err => Promise.reject(err));
}
