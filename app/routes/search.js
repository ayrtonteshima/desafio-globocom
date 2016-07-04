import * as searchHandlers from './../handlers/search';

export default {
    method: 'GET',
    path: '/search/{q?}',
    handler: searchHandlers.filter,
};
