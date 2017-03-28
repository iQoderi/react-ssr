require('es6-promise').polyfill();
import './style/reset.less';
import './style/markdown.less';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import FastClick from 'fastclick';
import configStore from './store/configStore';
import RouterApp from './route';
import rootSaga from './sagas';

//添加fastclick
window.addEventListener('load', ()=> {
  FastClick.attach(document.body);
});

const store =configStore(INITIAL_STATE);
store.run(rootSaga);

const rootElement = document.querySelector('#app');

render(
  <Provider store={store}>
    {RouterApp}
  </Provider>, rootElement);
