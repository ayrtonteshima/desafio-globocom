import * as searchStore from './../stores/search';

export function filter(request, reply) {
    searchStore.filter(request).then(data => {
        reply(data);
    });
}
