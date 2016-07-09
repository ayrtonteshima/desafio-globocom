import * as searchModel from './../models/search';

/**
 * Remove acentos e converte para minusculo para não ter problemas na hora de buscar o termo
 *
 * @param   {String} s Termo que vai perder os acentos e ser convertido para minusculo.
 * @returns {String} Termo normalizado
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

/**
 * @param  {String} haystack Texto base
 * @param  {String} needle Termo buscado
 * @return {Boolean} Retorna true ou false dependendo se a string buscada
 * conter na na string base
 */
const regExpTextCompare = (haystack = '', needle = '') => (
    new RegExp(`${accentsTidy(needle)}`, 'ig').test(accentsTidy(haystack))
);

/**
 * @param  {Array} arr Array palheiro
 * @param  {String} needle Termo que será buscado
 * @return {Boolean} Retorna true se encontrar, false se não.
 */
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

/**
 * @param  {String} term Termo que será buscado
 * @param  {Array} hightlights Array que contém as queries que serão buscadas
 * @return {Array} Retorna com items filtrados pelas queries com o termo buscado
 */
const filterHightlights = ({ term }, { hightlights }) => {
    /**
     * Se não for passado termo, retorna todos os hightlights
     */
    if (!term) return hightlights;
    return hightlights.filter(({ queries }) => searchTermArray(queries, term));
};

/**
 * @param  {String} term Termo que será buscado
 * @param  {Array} suggestions Array com sugestões que será filtrado
 * @return {Array} Retorna array filtrado que contenha o termo buscado
 */
const filterSuggestions = ({ term }, { suggestions }) => {
    /**
     * Se não for passado termo, retorna todas as sugestões
     */
    if (!term) return suggestions;
    return suggestions.filter((haystack) => regExpTextCompare(haystack, term));
};

/**
 * @param  {Array} request Recebe o payload para trabalhar os parâmetros
 * @return {Promise} Retorna promisse com os dados filtrados
 */
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
