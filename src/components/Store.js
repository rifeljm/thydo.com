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
  };
  return store;
};

export const StoreProvider = ({ children }) => {
  const store = useLocalStore(createStore);
  const actions = useActions(store);
  return <StoreContext.Provider value={{ store, actions }}>{children}</StoreContext.Provider>;
};

StoreProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export const useStore = () => {
  return React.useContext(StoreContext);
};
