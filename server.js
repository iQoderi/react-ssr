'use strict';
require('core-js/fn/object/assign');
require('./setup');
const webpack = require('webpack');
const Koa =require('koa');
const json =require('koa-json');
const logger= require('koa-logger');
const compress=require('koa-compress');
var favicon = require('koa-favicon');
const serve = require('koa-static');
const path = require('path');
const views = require('koa-views');

const WebpackDevServer = require('webpack-dev-server');
const config = require('./build/webpack.config.dev.client');
const baseConfig=require('./build/webpack.config.base');
const open = require('open');
const isProd = process.env.NODE_ENV === 'production';

if(!isProd){
  new WebpackDevServer(webpack(config), config.devServer)
    .listen(baseConfig.port,config.devServer.host, (err) => {
      if (err) {
        console.log(err);
      }
      console.log('Listening at localhost:' +baseConfig.port);
      console.log(`
                                  _oo0oo_        
                                 088888880
                                 88" . "88
                                 (| -_- |)
                                  0\ = /0
                               ___/'---'\___
                             .' \\\\|     |// '.
                            / \\\\|||  :  |||// \\
                           /_ ||||| -:- |||||- \\
                          |   | \\\\\\  -  /// |   |
                          | \_|  ''\---/''  |_/ |
                          \  .-\__  '-'  __/-.  /
                        ___'. .'  /--.--\  '. .'___
                     ."" '<  '.___\_<|>_/___.' >'  "".
                    | | : '-  \'.;'\ _ /';.'/ - ' : | |
                    \  \ '_.   \_ __\ /__ _/   .-' /  /
                ====='-.____'.___ \_____/___.-'____.-'=====
                                  '=---='
   
   
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                        佛祖保佑    iii    永无BUG
`);
      console.log('Opening your system browser...');
      open('http://localhost:' +baseConfig.port + '/webpack-dev-server/');
    });
}else{
  const app = new Koa();
  const clientRoute  = require('./dist/server/server.prod');
  const port = process.env.port || 3000;
  app.use(compress());
  app.use(json());
  app.use(logger());
  app.use(views(path.resolve(__dirname, './dist/views'), {map: {html: 'ejs'}}));
  app.use(serve(path.resolve(__dirname, './dist/assets')));
  app.use(favicon(path.join(__dirname,'./dist/favicon.ico')));
  app.use(clientRoute);
  // app.use(clientRoute);
  app.listen(port);
  console.log(`\n==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.\n`)
}
