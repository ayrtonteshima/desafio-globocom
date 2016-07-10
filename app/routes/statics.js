export default {
    method: 'GET',
    path: '/{path*}',
    handler: {
        directory: {
            path: './public',
            listing: false,
            index: false,
        },
    },
};
