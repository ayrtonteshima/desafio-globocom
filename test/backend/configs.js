var HOST = process.env.HOST || 'localhost';
var PORT = process.env.PORT || 8080;

module.exports = {
    host: HOST,
    port: PORT,
    baseApiUrl: 'http://' + HOST + ':' + PORT + '/'
};
