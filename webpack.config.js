var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: __dirname + '/app/frontend/bootstrap.js',
  output: {
    path: __dirname + '/public',
    filename: '/js/bundle.js',
    publicPath: './public/'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'raw-loader!sass-loader')
      },
      {
        test: /\.jade$/,
        loader: 'file?name=[name].html!jade-html'
      },
      {
        test: /\.js$/,
        exclude: 'node_modules',
        loader: 'babel',
        query: {
        presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("/css/main.css")
  ]
};
