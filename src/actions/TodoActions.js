import axios from 'axios';

exports.saveTodo = dispatch => state => (day, title, obj) => {
  /* remove input */
  dispatch({ type: 'REMOVE_NEW_TODO_INPUT', day });
  /* optimistically show it at the end of todo list */
  const nextMinId = Math.min.apply(Math, state.todos[day].map(todo => todo.id)) - 1;
  dispatch({ type: 'NEW_TODO_INPUT_END', day, todo: { title, id: nextMinId } });
  if (obj && obj.createNew) {
    /* on tab key, create new input and show it */
    dispatch({ type: 'CREATE_NEW_TODO_INPUT', day, tabKeyPress: true });
  }
  axios.post('/api/todo', { day, title }).then(response => {
    if (response.status === 200) {
      dispatch({ type: 'SET_TODO_ID_FROM_CREATE_TODO', day, id: response.data.id, minId: nextMinId });
    }
  });
};
