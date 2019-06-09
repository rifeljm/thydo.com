import ReactDOM from '@hot-loader/react-dom';
import React from 'react';
import 'babel-polyfill';

import { StoreProvider } from './components/Store.js';

import App from './components/App.js';

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById('main')
);
