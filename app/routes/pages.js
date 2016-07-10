export default {
    method: 'GET',
    path: '/',
    config: {
        handler: function(request, reply) {
            reply.file(process.cwd() + '/public/index.html');
        },
    },
};
