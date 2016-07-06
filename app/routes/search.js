import * as searchHandlers from './../handlers/search';
import searchSchema from './../validation-schemas/search';

export default {
    method: 'GET',
    path: '/search/{term?}',
    config: {
        handler: searchHandlers.filter,
        validate: {
            params: searchSchema,
        },
    },
};
