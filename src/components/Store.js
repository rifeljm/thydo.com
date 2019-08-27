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
    timeEvents: {},
    showUserDropdown: false,
    initialTopDates: false,
    settings: {},
    showSettingsModal: false,
    draggedDay: null,
    draggedEvent: null,
    showTodoModal: null,
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
