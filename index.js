require('babel-register');

const startServer = require('./server').default;

startServer(err => {
  if (err) {
    throw err;
  }
});
