import { hot } from 'react-hot-loader/root';
import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

import { useStore } from './Store.js';
import Header from './Header.js';
import Weeks from './Weeks.js';
import TodoModal from './TodoModal.js';

import css from '../css/App.css';

history.scrollRestoration = 'manual';

function App({ id }) {
  const { store, actions } = useStore();

  React.useEffect(() => {
    window.addEventListener('keydown', actions.keyDownEvent);
    window.addEventListener('scroll', actions.onScrollEvent);
    window.addEventListener('click', actions.onClick);
  }, []);

  React.useEffect(() => {
    if (toJS(store.toToday)) {
      actions.scrollToToday();
    }
  }, [toJS(store.toToday)]);

  return (
    <React.Fragment>
      <css.GlobalStyle />
      {id ? <TodoModal id={parseInt(id, 10)} /> : null}
      <Header />
      <Weeks dates={store.dates} />
    </React.Fragment>
  );
}

App.propTypes = {
  id: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default hot(observer(App));
