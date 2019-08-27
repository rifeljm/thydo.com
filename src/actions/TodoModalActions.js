import { toJS } from 'mobx';
import axios from 'axios';
import { navigate } from '@reach/router';

import { fromToDays, parseHour } from '../common/utils.js';

export const getTodoData = store => id => {
  const multiDay = toJS(store).multiDay || {};
  const timeEvents = toJS(store).timeEvents || {};
  let todo = Object.keys(multiDay).reduce((prev, day) => {
    const found = multiDay[day].reduce((prev2, todo) => {
      return todo.id === parseInt(id, 10) ? { ...todo, day } : prev2;
    }, null);
    return found || prev;
  }, null);
  if (!todo) {
    todo = Object.keys(timeEvents).reduce((prev, day) => {
      return timeEvents[day][id] ? { ...timeEvents[day][id], id, day } : prev;
    }, null);
  }
  if (!todo) {
    const todos = toJS(store).todos || {};
    todo = Object.keys(todos).reduce((prev, day) => {
      const found = todos[day].reduce((prev2, todo) => {
        return todo.id === parseInt(id, 10) ? { ...todo, day } : prev2;
      }, null);
      return found || prev;
    }, null);
  }
  return todo || {};
};

export const deleteTodo = store => todo => {
  const data = {
    day: todo.day,
    id: todo.id,
    multi: !!todo.to,
  };
  navigate('/');
  axios.delete('/api/todo', { data }).then(response => {
    const { id, day, multi } = response.data;
    const dayTodos = toJS(store.todos)[day];
    const dayTimeEvents = toJS(store.timeEvents)[day];
    if (multi) {
      Object.keys(toJS(store.multiDay)).forEach(day => {
        const multiDayTodos = toJS(store.multiDay)[day];
        if (multiDayTodos.map(todo => todo.id).indexOf(id) > -1) {
          store.multiDay[day] = toJS(store.multiDay)[day].filter(todo => todo.id !== id);
        }
      });
    } else if (dayTimeEvents && Object.keys(dayTimeEvents).length) {
      delete store.timeEvents[day][id];
      if (Object.keys(toJS(store.timeEvents)[day]).length === 0) {
        delete store.timeEvents[day];
      }
    } else if (dayTodos && dayTodos.length) {
      const newTodos = dayTodos.filter(todo => todo.id !== id);
      store.todos[day] = newTodos;
    } else {
      delete store.todos[day];
    }
  });
};

export const saveModal = store => ({ id, title, active, description }) => {
  if (!active) return;
  const oldTodo = getTodoData(store)(id);
  const day = oldTodo.day;
  let hour, todo;
  todo = {
    t: title,
    d: description,
  };
  const indexOfSpace = title.indexOf(' ');
  if (indexOfSpace > -1) {
    hour = parseHour(title.substring(0, indexOfSpace));
    if (hour) {
      todo.h = hour;
      todo.t = title.substring(indexOfSpace + 1);
    }
  }
  todo.y = day;
  if (oldTodo.h && !todo.h) {
    delete store.timeEvents[day][id];
    if (Object.keys(toJS(store.timeEvents)[day]).length === 0) {
      delete store.timeEvents[day];
    }
    if (!toJS(store.todos)[day]) {
      store.todos[day] = [];
    }
    store.todos[day] = toJS(store.todos)[day].concat({ ...todo, id });
  }
  axios
    .put('/api/todo/', { id, todo })
    .then(response => {
      const { id, todo } = response.data;
      const newTodo = {
        id,
        t: todo.t,
        d: todo.d,
      };
      if (todo.h) {
        newTodo.h = todo.h;
      }
      if (oldTodo.to) {
        fromToDays(oldTodo.from, oldTodo.to).forEach(day => {
          store.multiDay[day] = toJS(store.multiDay)[day].map(t => {
            return id === t.id ? Object.assign(t, newTodo) : t;
          });
        });
      } else if (newTodo.h) {
        if (!store.timeEvents[day]) {
          store.timeEvents[day] = {};
        }
        store.timeEvents[day][id] = newTodo;
        /* if we added hour to todo, replace todo from sorted todos */
        if (!oldTodo.h && toJS(store.todos)[day] && toJS(store.todos)[day].length) {
          store.todos[day] = toJS(store.todos)[day].filter(todo => todo.id !== id);
          if (store.todos[day].length === 0) {
            delete store.todos[day];
          }
        }
      } else {
        store.todos[day] = toJS(store.todos)[day].map(t => {
          return id === t.id ? Object.assign(t, newTodo) : t;
        });
      }
      navigate('/');
    })
    .catch(error => {
      console.log('CATCH', error);
    });
};
