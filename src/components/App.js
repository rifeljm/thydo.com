import { hot } from 'react-hot-loader/root';
import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

import { useStore } from './Store.js';
import Header from './Header.js';
import Weeks from './Weeks.js';
import TodoModal from './TodoModal.js';
import SettingsModal from './SettingsModal.js';

function App({ id }) {
  const { store, actions } = useStore();

  React.useEffect(() => {
    window.addEventListener('keydown', actions.keyDownEvent);
    window.addEventListener('click', actions.onClick);
  }, []);

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
