// load environment variables from .env file.
require('dotenv').config({ silent: true });
// these environment variables will go to process.env global object.
var getClientEnvironment = require('./config/env');
var env = getClientEnvironment();

var webpack = require('webpack');
var path    = require('path');
var config  = require('./config/config');



module.exports = {
  entry: "./src/entry.js",
  output: {
      path: path.join(__dirname, 'public'),
      filename: "bundle.js",
  },
  resolve: {
    modules: ['node_modules', 'src/javascripts', 'src/stylesheets', 'src'],
    extensions: ['.js', '.jsx', '.sass'],
    alias: {
      config: path.resolve('./config/config.js'),
    }
  },
  plugins: [
    new webpack.DefinePlugin(env),
  ],
  devtool: 'source-map',
  module: {
      loaders: [
          {
              test: /\.jsx?$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel-loader',
          },
          {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
          },
          {
            test: /\.sass$/,
            loader: 'style-loader!css-loader!sass-loader?indentedSyntax&sourceMap'
          },
      ]
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: false,
  }
};
