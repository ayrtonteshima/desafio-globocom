import * as searchStore from './../stores/search';

export function filter(request, reply) {
    searchStore.filter(request).then(data => {
        reply({
            statusCode: 200,
            message: 'Resultado retornado com sucesso',
            data,
        });
    }).catch(() => {
        reply({
            statusCode: 404,
            message: 'Ops! erro ao buscar',
            data: [],
        });
    });
}
