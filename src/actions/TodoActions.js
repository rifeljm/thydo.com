import axios from 'axios';
import { toJS } from 'mobx';
import { parseHour } from '../common/utils.js';

/**
 * find editing todos in the store and cancel them
 */
export const cancelTodo = store => () => {
  Object.keys(toJS(store.todos)).forEach(day => {
    const dayTodos = toJS(store.todos)[day] || [];
    store.todos[day] = dayTodos.filter(todo => todo.id > -1);
  });
};

exports.postTodo = store => (day, title, options = {}) => {
  let nextMinId;
  const todos = toJS(store.todos)[day];
  store.todos[day] = todos.filter(todo => todo.id !== -1);
  if (title === '') {
    return false;
  }
  const splitSpace = title.split(' ');
  let hour, newTitle;
  if (splitSpace.length > 1) {
    hour = parseHour(splitSpace[0]);
  }
  if (hour) {
    /* time events */
    newTitle = title.substring(title.indexOf(' ') + 1);
    const timeEvents = toJS(store.timeEvents)[day];
    nextMinId = timeEvents ? Math.min.apply(Math, Object.keys(timeEvents)) - 1 : -1;
    if (!toJS(store.timeEvents)[day]) {
      store.timeEvents[day] = {};
    }
    store.timeEvents[day][nextMinId] = { id: nextMinId, t: newTitle, h: hour };
  } else {
    /* todos */
    nextMinId = Math.min.apply(Math, todos.map(todo => todo.id)) - 1;
    store.todos[day].push({ id: nextMinId, t: title });
    if (options.createNew) {
      store.todos[day].push({ id: -1 });
    }
  }
  const todoObj = { day, t: title, h: hour };
  if (hour) {
    todoObj.h = hour;
    todoObj.t = newTitle;
  }
  axios.post('/api/todo', todoObj).then(response => {
    if (response.status === 200) {
      if (response.data.h) {
        const day = response.data.y;
        delete store.timeEvents[day][nextMinId];
        store.timeEvents[day][response.data.id] = response.data;
      } else {
        store.todos[day] = toJS(store.todos)[day].map(todo => {
          const id = todo.id === nextMinId ? response.data.id : todo.id;
          return { ...todo, id };
        });
      }
    }
  });
};

export const onBlur = store => (e, day) => {
  if (e.target.value !== '') {
    e.target.focus();
  } else {
    store.todos[day] = store.todos[day].filter(todo => todo.id !== -1);
  }
};

export const toggleTodoDone = store => (e, todo, day) => {
  store.todos[day] = toJS(store.todos)[day].map(tempTodo => {
    return tempTodo.id === todo.id ? { ...tempTodo, f: !tempTodo.f } : tempTodo;
  });
  axios.put('/api/todo', { id: todo.id, todo: { f: !todo.f }, day }).then(() => {
    /* todo: handle error */
  });
};
