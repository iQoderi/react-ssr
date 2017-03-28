// Provide custom regenerator runtime and core-js
require('babel-core/register');
require('babel-polyfill');


// Node babel source map support
require("source-map-support").install();

// Javascript require hook
require('babel-register')({
  presets: ['es2015', 'react', 'stage-0'],
  plugins: ['transform-runtime','add-module-exports','transform-decorators-legacy']
});

// Css require hook
require('css-modules-require-hook')({
  extensions: ['.less']
});

// Image require hook
require('asset-require-hook')({
  extensions: ['jpg', 'png', 'gif', 'webp'],
  limit: 8000
});

//define dev
global.__DEV__ = true;
global__DEVCLIENT__=true;
global.__DEVSERVER__=false;

const app = require('./app.js'),
  convert = require('koa-convert'),
  webpack = require('webpack'),
  fs = require('fs'),
  path = require('path'),
  devMiddleware = require('koa-webpack-dev-middleware'),
  hotMiddleware = require('koa-webpack-hot-middleware'),
  views = require('koa-views'),
  clientRoute = require('./middlewares/clientRouter'),
  config = require('../build/webpack.config.dev.client'),
  port = process.env.port || 5000,
  compiler = webpack(config)

// Webpack hook event to write html file into `/views/dev` from `/views/tpl` due to server render
compiler.plugin('emit', (compilation, callback) => {
  const assets = compilation.assets
  let file, data

  Object.keys(assets).forEach(key => {
    if (key.match(/\.html$/)) {
      file = path.resolve(__dirname, key)
      data = assets[key].source()
      fs.writeFileSync(file, data)
    }
  })
  callback()
})

app.use(views(path.resolve(__dirname, '../client'), {map: {html: 'ejs'}}));
app.use(clientRoute);
console.log(`\n==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.\n`)
app.use(convert(devMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
})));

app.use(convert(hotMiddleware(compiler)));
app.listen(port);
