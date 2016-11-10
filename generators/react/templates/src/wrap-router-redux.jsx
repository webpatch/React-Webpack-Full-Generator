/**
 * Created by dz on 16/9/27.
 */

import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux-ie8'
import thunkMiddleware from 'redux-thunk';
import rootReducer from './model/reducer';
import App from './app';
import About from './views/about';
import User from './views/user';

const store = createStore(rootReducer, compose(applyMiddleware(thunkMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f)
);

const history = syncHistoryWithStore(browserHistory, store);

const StoreWrap = () => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="about" component={About} />
        <Route path="user" component={User} />
      </Route>
    </Router>
  </Provider>
);

export default StoreWrap;
