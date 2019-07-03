import axios from 'axios';
import { toJS } from 'mobx';

exports.saveTodo = store => (day, title, options = {}) => {
  const todos = toJS(store.todos[day]);
  if (title === '') {
    store.todos[day] = todos.filter(todo => todo.id !== -1);
    return false;
  }
  const nextMinId = Math.min.apply(Math, todos.map(todo => todo.id)) - 1;

  store.todos[day] = todos.filter(todo => todo.id !== -1);
  store.todos[day].push({ id: nextMinId, title });
  if (options.createNew) {
    store.todos[day].push({ id: -1 });
  }
  axios.post('/api/todo', { day, title }).then(response => {
    if (response.status === 200) {
      store.todos[day] = store.todos[day].map(todo => {
        const id = todo.id === nextMinId ? response.data.id : todo.id;
        return { ...todo, id };
      });
    }
  });
};

export const cancelTodo = store => day => {
  store.todos[day] = toJS(store.todos[day]).filter(todo => todo.id !== -1);
};

export const onBlur = store => (e, day) => {
  if (e.target.value !== '') {
    e.target.focus();
  } else {
    store.todos[day] = store.todos[day].filter(todo => todo.id !== -1);
  }
};
