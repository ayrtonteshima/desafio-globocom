export default {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 9000,
    routes: { cors: true },
};

