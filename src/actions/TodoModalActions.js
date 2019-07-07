import { toJS } from 'mobx';
import axios from 'axios';
import { navigate } from '@reach/router';

export const getTodoData = store => id => {
  const multiDay = toJS(store).multiDay || {};
  let todo = Object.keys(multiDay).reduce((prev, day) => {
    const found = multiDay[day].reduce((prev2, todo) => {
      return todo.id === parseInt(id, 10) ? { ...todo, day } : prev2;
    }, null);
    return found || prev;
  }, null);
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
  axios.delete('/api/todo', { data }).then(response => {
    navigate('/');
    const { id, day, multi } = response.data;
    const dayTodos = toJS(store.todos)[day];
    if (multi) {
      Object.keys(toJS(store.multiDay)).forEach(day => {
        const multiDayTodos = toJS(store.multiDay)[day];
        if (multiDayTodos.map(todo => todo.id).indexOf(id) > -1) {
          store.multiDay[day] = toJS(store.multiDay)[day].filter(todo => todo.id !== id);
        }
      });
    } else if (dayTodos.length > 1) {
      const newTodos = dayTodos.filter(todo => todo.id !== id);
      store.todos[day] = newTodos;
    } else {
      delete store.todos[day];
    }
  });
};
