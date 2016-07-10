export default {
    method: 'GET',
    path: '/',
    config: {
        handler: (request, reply) => {
            reply.file(`${process.cwd()}/public/index.html`);
        },
    },
};
