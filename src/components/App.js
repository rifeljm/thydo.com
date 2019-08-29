import { hot } from 'react-hot-loader/root';
import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

import { useStore } from './Store.js';
import Header from './Header.js';
import Weeks from './Weeks.js';
import TodoModal from './TodoModal.js';
import SettingsModal from './SettingsModal.js';

history.scrollRestoration = 'manual';

let initialScrollHeight;

function App({ id }) {
  const { store, actions } = useStore();
  const initialTopDates = toJS(store.initialTopDates);
  React.useEffect(() => {
    window.addEventListener('keydown', actions.keyDownEvent);
    window.addEventListener('scroll', actions.onScrollEvent);
    window.addEventListener('click', actions.onClick);
    document.body.addEventListener('mousewheel', actions.onWheel);
    actions.addWeeks(-4); /* useEffect will fix scroll position after weeks render */
    store.initialTopDates = true;
  }, []);

  React.useLayoutEffect(() => {
    /* when adding dates on top of the page for the first time, manually scroll down */
    if (initialTopDates) {
      window.scroll(0, document.body.scrollHeight - initialScrollHeight);
    }
    initialScrollHeight = document.body.scrollHeight;
  }, [initialTopDates]);

  return (
    <React.Fragment>
      {id ? <TodoModal id={parseInt(id, 10)} /> : null}
      {store.showSettingsModal ? <SettingsModal /> : null}
      <Header />
      <Weeks dates={store.dates} />
    </React.Fragment>
  );
}

App.propTypes = {
  id: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default hot(observer(App));
