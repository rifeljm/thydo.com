import { toJS } from 'mobx';

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
  return todo;
};
