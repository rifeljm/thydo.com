import axios from 'axios';
import { toJS } from 'mobx';

exports.showNewTodoInput = store => (evt, day) => {
  const todoInput = document.querySelector('.todo-input');
  if (todoInput) {
    if (todoInput.value !== '') {
      /* if we're editing another todo and there's already some text in it, cancel! */
      todoInput.focus();
      if (evt) {
        return evt.preventDefault();
      }
    } else {
      /* if editing todo is empty, find it in the store, and cancel it */
      Object.keys(toJS(store.todos)).forEach(day => {
        if (
          toJS(store.todos[day])
            .map(todo => todo.id)
            .indexOf(-1) > -1
        ) {
          store.todos[day] = toJS(store.todos[day]).filter(todo => todo.id !== -1);
        }
      });
    }
  }
  const todos = toJS(store.todos[day]) || [];
  const todoExists = todos.map(todo => todo.id).indexOf(-1) > -1;
  if ((!evt || evt.clientY > 50 || evt.keyCode === 13) && !todoExists) {
    if (store.todos[day]) {
      store.todos[day] = toJS(store.todos[day]).concat({ id: -1 });
    } else {
      store.todos[day] = [{ id: -1 }];
    }
  }
};

exports.handleOnSort = store => sortable => {
  let todos, item, source, target;
  let request = {};
  todos = toJS(store.todos[sortable.day]);
  if (window.tempSortable) {
    [source, target] = [window.tempSortable, sortable].sort(a => (a.isSource ? -1 : 1));

    const todosSource = toJS(store.todos)[source.day];
    item = { ...todosSource[source.oldIndex] };
    todosSource.splice(source.oldIndex, 1);
    store.todos[source.day] = todosSource;
    request.days = [{ day: source.day, todoIds: todosSource.map(todo => todo.id) }];

    const todosTarget = toJS(store.todos)[target.day] || [];
    todosTarget.splice(target.newIndex, 0, item);
    store.todos[target.day] = todosTarget;
    request.days.push({ day: target.day, todoIds: todosTarget.map(todo => todo.id) });

    delete window.tempSortable;
  }

  /* SORT ON THE SAME LIST (todos length in state is the same as "this sortable" element count */
  if (sortable.isSource && todos.length === sortable.count) {
    item = todos[sortable.oldIndex];
    todos.splice(sortable.oldIndex, 1);
    todos.splice(sortable.newIndex, 0, item);
    store.todos[sortable.day] = todos;
    request.days = { day: sortable.day, todoIds: todos.map(todo => todo.id) };
  } else if (!request.days) {
    window.tempSortable = sortable;
  }
  if (request.days) {
    axios.put('/api/sort-day', request).then(() => {
      /* TODO: implement server error and cancel sort */
    });
  }
};
