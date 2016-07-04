import * as searchStore from './../stores/search';

export function getDataFiltered(request, reply) {
    searchStore.getDataFiltered(request).then((data) => {
        reply(data);
    });
}
