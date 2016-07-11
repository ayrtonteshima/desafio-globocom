import * as searchModel from './../models/search';
import {
    filterHightlights,
    filterSuggestions,
} from './../utils';

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
