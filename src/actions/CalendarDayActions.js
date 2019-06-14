import axios from 'axios';

exports.saveTodoOrder = dispatch => (day, todos) => {
  dispatch({ type: 'SORT_SAME_DAY', day, todos });
  axios.put('/api/sort-day', {
    day,
    todoIds: todos.map(todo => todo.id),
  });
};

exports.createNewTodo = dispatch => state => (evt, day) => {
  const todoInput = document.querySelector('.todo-input');
  if (todoInput && todoInput.value !== '') {
    todoInput.focus();
    return evt.preventDefault();
  }
  const todoExists = (state.todos[day] || []).map(todo => todo.id).indexOf(-1) > 1;
  if ((!evt || evt.clientY > 50) && !todoExists) {
    dispatch({ type: 'CREATE_NEW_TODO_INPUT', day });
  }
  return true;
};

exports.saveTodoListOrder = dispatch => state => (day, orderedTodos) => {
  const todos = state.todos;
  todos[day] = orderedTodos;
  const dayTodos = todos[day].map(todo => todo.id);
  dispatch({ type: 'SAVE_SOURCE_TODO_LIST_ORDER', todos, day, dayTodos });
};
