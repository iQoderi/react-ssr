const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const baseConfig = require('./webpack.config.base');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://127.0.0.1:' + baseConfig.port,
    'webpack/hot/only-dev-server',
    path.join(__dirname, '../client/index.js')
  ],
  output: {
    path: path.join(__dirname, '../dist/assets'),
    filename: 'bundle.js',
    chunkFilename: '[name].[chunkhash:8].js',
    publicPath: baseConfig.publicPath
  },
  context: path.join(__dirname),
  cache: true,
  devtool: 'source-map',
  module: {
    rules:baseConfig.rules
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: function () {
          return [autoprefixer];
        }
      }
    }),
    new webpack.DefinePlugin({
      __DEV__:true,
      __DEVCLIENT__: true,
      __DEVSERVER__: false
    }),
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
  devServer: {
    contentBase: path.join(__dirname, "../client"),
    compress: true,
    historyApiFallback: true,
    port: baseConfig.port,
    host: "0.0.0.0",
    hot: true,
    noInfo: false,
    publicPath: baseConfig.publicPath
  }
}
