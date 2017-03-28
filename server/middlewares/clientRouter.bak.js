import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, RouterContext} from 'react-router';
import {Provider} from 'react-redux';
import routes from '../../client/route';
import waitAll from '../../client/sagas/waitAll';
import configureStore from '../../client/store/configStore';
const q = require('q');

function fetchAllStaticFun(components, params,req) {
  return new Promise((resolve)=>{
    const preloaders = components
      .filter((component) => component && component.preload)
      .map((component) => component.preload(params,req))
      .reduce((result, preloader) => result.concat(preloader), []);
    resolve(preloaders);
  });

}

const store = configureStore();

async function clientRoute(ctx, next) {
  let _renderProps;
  let defered = q.defer();
  await match({routes:routes,location: ctx.url},(error, redirectLocation, renderProps) => {
    _renderProps = renderProps
  });
  if (_renderProps) {
    const preLoaders = await fetchAllStaticFun(_renderProps.components,_renderProps.params,ctx.req);
    store.run(waitAll(preLoaders)).done.then(async ()=>{
      const initialView =renderToString(
        <Provider store={store}>
          <RouterContext {..._renderProps}/>
        </Provider>
      );
      const initialState = store.getState();
      defered.resolve(ctx.render('index',{
        _html_: initialView,
        _state_:initialState
      }));
    }).catch((err)=>{
      console.log(err);
    });

    await defered.promise;
  } else {
    await next()
  }
}

export default clientRoute;
