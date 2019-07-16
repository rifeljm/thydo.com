import React from 'react';
import PropTypes from 'prop-types';
import { useLocalStore } from 'mobx-react-lite';
import { useActions } from '../actions/actions.js';

const StoreContext = React.createContext();

const createStore = () => {
  const store = {
    dates: [],
    todos: {},
    highlightObjects: {},
    visibleWeeks: null,
    multiDay: {},
    showUserDropdown: false,
    initialTopDates: false,
    settings: {},
    showSettingsModal: false,
  };
  return store;
};

export const StoreProvider = ({ children }) => {
  const store = useLocalStore(createStore);
  const actions = useActions(store);
  actions.processInitData(JSON.parse(document.getElementById('todos_data').innerHTML));
  actions.paintCalendar();
  return <StoreContext.Provider value={{ store, actions }}>{children}</StoreContext.Provider>;
};

StoreProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export const useStore = () => {
  return React.useContext(StoreContext);
};
