const path=require('path');
const dflPort=8989;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const srcPath=path.join(__dirname,'../client');

const isProd = process.env.NODE_ENV ==='production';
const rules = [
  {
    test: /\.jsx?$/,
    loaders:isProd?'babel-loader':'react-hot-loader!babel-loader',
    exclude: /node_modules/,
  },
  {
    test: /\.css$/,
    loaders:isProd?ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use:['css-loader?minimize', 'postcss-loader']
    }):['style-loader', 'css-loader', 'postcss-loader']
  },
  {
    test: /\.less/,
    loaders:isProd?ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use:['css-loader?minimize', 'postcss-loader', 'less-loader']
    }):['style-loader', 'css-loader', 'postcss-loader','less-loader']
  },
  {
    test: /\.(png|jpg|gif|woff|woff2)$/,
    loaders: [
      'url-loader?limit=10000&name=[chunkhash:8].[name].[ext]',
      'image-webpack-loader?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
    ]
  }
]

module.exports={
  publicPath:isProd?'http://odljp7x9v.bkt.clouddn.com/cnode/':'/assets',
  port:dflPort,
  srcPath,
  rules
}
