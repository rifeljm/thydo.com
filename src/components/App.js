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

let initialScrollHeight;

function App({ id }) {
  const { store, actions } = useStore();

  React.useEffect(() => {
    window.addEventListener('keydown', actions.keyDownEvent);
    window.addEventListener('scroll', actions.onScrollEvent);
    window.addEventListener('click', actions.onClick);
    actions.addWeeks(-4); /* useEffect will fix scroll position after weeks render */
    store.initialTopDates = true;
  }, []);

  React.useLayoutEffect(() => {
    if (toJS(store.toToday)) {
      actions.scrollToToday();
    }
  }, [toJS(store.toToday)]);

  React.useLayoutEffect(() => {
    /* when adding dates on top of the page for the first time, manually scroll down */
    if (store.initialTopDates) {
      window.scroll(0, document.body.scrollHeight - initialScrollHeight);
    }
    initialScrollHeight = document.body.scrollHeight;
  }, [toJS(store.initialTopDates)]);

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
