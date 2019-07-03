import ReactDOM from '@hot-loader/react-dom';
import 'babel-polyfill';
import React from 'react';
import { Router } from '@reach/router';

import { StoreProvider } from './components/Store.js';

import App from './components/App.js';

window.app = window.app || {};

ReactDOM.render(
  <StoreProvider>
    <Router>
      <App path="/" />
      <App path=":id" />
    </Router>
  </StoreProvider>,
  document.getElementById('main')
);
