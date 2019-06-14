import React from 'react';
import PropTypes from 'prop-types';
import { useActions } from '../actions/actions.js';

const initialState = {
  dates: [],
  todos: [],
  todoInputMode: false,
  visibleWeeks: 0,
  tempTodosOrder: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT_CALENDAR': {
      return Object.assign({}, state, action.state);
    }
    case 'LOAD_INLINE_TODOS': {
      return Object.assign({}, state, { todos: action.todos });
    }
    case 'UPDATE_DATES': {
      return Object.assign({}, state, { dates: action.dates });
    }
    case 'REMOVE_DATES': {
      return Object.assign({}, state, { dates: action.dates });
    }
    case 'CREATE_NEW_TODO_INPUT': {
      let todos = state.todos;
      const canceledDay = Object.keys(todos).reduce((prev, day) => {
        return todos[day].map(todo => todo.id).indexOf(-1) > -1 ? day : prev;
      }, null);
      if (canceledDay) {
        todos = { ...todos, [canceledDay]: todos[canceledDay].filter(todo => todo.id !== -1) };
      }
      todos = { ...todos, [action.day]: (state.todos[action.day] || []).concat([{ id: -1 }]) };
      return Object.assign({}, state, { todos, todoInputMode: true });
    }
    case 'REMOVE_NEW_TODO_INPUT': {
      const todos = state.todos;
      const dayTodos = state.todos[action.day];
      if (dayTodos && dayTodos.length === 1) {
        delete todos[action.day];
      } else {
        todos[action.day] = dayTodos.filter(todo => todo.id !== -1);
      }
      return { ...state, todos, todoInputMode: false };
    }
    case 'NEW_TODO_INPUT_END': {
      const todos = { ...state.todos, [action.day]: (state.todos[action.day] || []).concat(action.todo) };
      return { ...state, todos };
    }
    case 'SORT_SAME_DAY': {
      let todos = state.todos;
      todos[action.day] = action.todos;
      return { ...state, todos };
    }
    case 'SET_TODO_ID_FROM_CREATE_TODO': {
      let todos = state.todos;
      todos[action.day] = todos[action.day].map(todo => {
        return todo.id === action.minId ? { ...todo, id: action.id } : todo;
      });
      return { ...state, todos };
    }
    case 'SAVE_SOURCE_TODO_LIST_ORDER': {
      const temp = state.tempTodosOrder;
      const obj = {
        day: action.day,
        todos: action.dayTodos,
      };
      return { ...state, todos: action.todos, tempTodosOrder: temp.concat(obj) };
    }
    case 'CLEAR_TEMP_TODO_LIST_ORDER': {
      return { ...state, tempTodosOrder: [] };
    }
    case 'NAVIGATE_TO_TODAY': {
      return { ...state, navigateToToday: action.on };
    }
  }
};

const Store = React.createContext(initialState);

function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const actions = useActions(dispatch, state);
  return <Store.Provider value={{ state, dispatch, actions }}>{props.children}</Store.Provider>;
}

StoreProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export { Store, StoreProvider };
