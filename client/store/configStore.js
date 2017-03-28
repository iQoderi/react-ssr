import {createStore,applyMiddleware,compose} from 'redux';
import createSagaMiddleware,{END} from 'redux-saga';
import rootReducer from '../reducers';

var configStore = function (initialState) {
  const sagaMiddleware = createSagaMiddleware();
  const middleWare = [sagaMiddleware];
  const store = compose(
    applyMiddleware(...middleWare)
  )(createStore)(rootReducer, initialState);

  store.run = sagaMiddleware.run;
  store.close = ()=>{store.dispatch(END)};
  //热替换
  if (module.hot) {
    module.hot.accept('../reducers', ()=> {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }
  return store;
};

export  default configStore;
