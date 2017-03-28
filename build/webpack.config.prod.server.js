const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const baseConfig = require('./webpack.config.base');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
  entry: {
    server:['babel-polyfill','../server/server.prod.js']
  },
  output: {
    path: path.join(__dirname, '../dist/server'),
    filename: 'server.prod.js',
    publicPath: baseConfig.publicPath,
    chunkFilename: 'chunk.[name].js',
    libraryTarget: "commonjs2"
  },
  target:'node',
  node: {
    __filename: true,
    __dirname: true
  },
  context: path.join(__dirname),
  devtool: false,
  module: {
    rules: baseConfig.rules
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: function () {
          return [autoprefixer];
        }
      }
    }),
    new webpack.DefinePlugin({
      __DEV__: false,
      __DEVCLIENT__: false,
      __DEVSERVER__: false,
      'process.env.NODE_ENV':"'production'"
    }),
    new ExtractTextPlugin({
      filename:'style.[contenthash:8].css',
      allChunks: true
    })
  ],

  resolve: {
    extensions: [' ', '.js', '.jsx'],
    alias: {
      actions: `${baseConfig.srcPath}/actions/`,
      components: `${baseConfig.srcPath}/components/`,
      reducers: `${baseConfig.srcPath}/reducers/`,
      sources: `${baseConfig.srcPath}/sources/`,
      stores: `${baseConfig.srcPath}/stores/`,
      styles: `${baseConfig.srcPath}/styles/`,
    }
  },
  externals:_externals()
}

function _externals() {
  let manifest = require('../package.json');
  let dependencies = manifest.dependencies;
  let externals = {};
  for (let p in dependencies) {
    externals[p] = 'commonjs ' + p;
  }
  return externals;
}
