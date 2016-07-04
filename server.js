import Hapi from 'hapi';
import Vision from 'vision';
import serverConfig from './app/configs/server';
import Routes from './app/routes/routes';

const server = new Hapi.Server();

const plugins = [
    Vision,
];

server.connection(serverConfig);

server.route(Routes);

export default function start(done) {
    server.register(plugins, (err) => {
        if (err) {
            return done(err);
        }

        return server.start(serverErr => {
            if (serverErr) {
                return done(serverErr);
            }

            console.log('Servidor rodando em: ', server.info.uri);

            return done();
        });
    });

    return server;
}
