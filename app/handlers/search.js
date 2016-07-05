import * as searchStore from './../stores/search';
//TODO: Validar retorno com Joi
export function filter(request, reply) {
    searchStore.filter(request).then(data => {
        reply({
            statusCode: 200,
            message: 'Resultado retornado com sucesso',
            data,
        });
    }).catch(err => {
        reply({
            statusCode: 404,
            message: err,
            data: [],
        });
    });
}
