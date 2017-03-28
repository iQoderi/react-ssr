const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const baseConfig = require('./webpack.config.base');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
  entry: {
    bundle: '../client/index.js',
    vendor1:['react','react-dom'],
    vendor2:['react-router','redux','react-redux','redux-saga']
  },
  output: {
    path: path.join(__dirname, '../dist/client'),
    filename: 'bundle.[chunkhash:8].js',
    chunkFilename: 'chunk.[name].[chunkhash:8].js',
    publicPath: baseConfig.publicPath
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
    new webpack.optimize.CommonsChunkPlugin({
      name:['vendor1','vendor2'],
      filename:'[name].[chunkhash:8].js',
    }),
    new webpack.DefinePlugin({
      __DEV__: false,
      __DEVCLIENT__: false,
      __DEVSERVER__: false,
      'process.env.NODE_ENV':'"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false,  // remove all comments
      },
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
      }
    }),
    new ExtractTextPlugin({
      filename:'style.[contenthash:8].css',
      allChunks: true
    }),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
    new webpack.optimize.MinChunkSizePlugin({minChunkSize:1000})
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
  }
}
