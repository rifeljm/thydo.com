import React from 'react';
import PropTypes from 'prop-types';
import autosize from 'autosize';
import { useStore } from './Store.js';

import css from '../css/Todo.js';

Todo.propTypes = {
  idx: PropTypes.number.isRequired,
  todo: PropTypes.object.isRequired,
  mouseEnterTodo: PropTypes.func.isRequired,
  mouseLeaveTodo: PropTypes.func.isRequired,
  day: PropTypes.string.isRequired,
};

function Todo({ idx, todo, mouseEnterTodo, mouseLeaveTodo, day }) {
  const { actions } = useStore();
  const todoRef = React.useRef();
  const todoInputRef = React.useRef();

  React.useEffect(() => {
    if (todo.id === -1) {
      autosize(todoInputRef.current);
      todoInputRef.current.focus();
    }
  }, []);

  function todoInputKeyUp(evt) {
    if ([27, 13, 9].indexOf(evt.keyCode) > -1) {
      evt.preventDefault();
    }
  }

  function todoInputKeyDown(evt) {
    let value = todoInputRef.current.value;
    if (evt.keyCode === 27) {
      evt.preventDefault();
      actions.cancelTodo(day);
    }
    if (evt.keyCode === 13 && !evt.shiftKey) {
      evt.preventDefault();
      evt.stopPropagation();
      todoInputRef.current.value = '';
      actions.saveTodo(day, value);
    }
    if (evt.keyCode === 9) {
      evt.preventDefault();
      if (value) {
        todoInputRef.current.value = '';
        actions.saveTodo(day, value, { createNew: true });
      }
    }
  }

  let textOrInput = todo.title;
  if (todo.id === -1) {
    textOrInput = (
      <css.TodoInput
        className="todo-input"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        rows={1}
        ref={todoInputRef}
        type="text"
      />
    );
  }
  return (
    <css.Todo ref={todoRef} onMouseEnter={() => mouseEnterTodo(idx)} onMouseLeave={() => mouseLeaveTodo(idx)}>
      <css.TodoDash grey={todo.id < -1}>{idx + 1}.</css.TodoDash>
      {todo.id === -1 ? (
        <css.TodoInputCell onKeyDown={todoInputKeyDown} onKeyUp={todoInputKeyUp}>
          {textOrInput}
        </css.TodoInputCell>
      ) : (
        <css.TodoText grey={todo.id < -1}>{textOrInput}</css.TodoText>
      )}
    </css.Todo>
  );
}

export default Todo;
