import React from 'react';
import PropTypes from 'prop-types';
import autosize from 'autosize';
import { toJS } from 'mobx';

import { useStore } from './Store.js';

import css from '../css/Todo.css';

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

  function renderTextOrInput() {
    let textOrInput = todo.title;
    if (todo.id === -1) {
      textOrInput = (
        <css.TodoTextarea
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
    if (todo.id === -1) {
      return (
        <css.TodoInputCell onKeyDown={todoInputKeyDown} onKeyUp={todoInputKeyUp}>
          {textOrInput}
        </css.TodoInputCell>
      );
    }
    return <css.TodoText grey={toJS(todo).id < -1}>{textOrInput}</css.TodoText>;
  }

  return (
    <css.TodoTable ref={todoRef} onMouseEnter={() => mouseEnterTodo(idx)} onMouseLeave={() => mouseLeaveTodo(idx)}>
      <tbody>
        <css.TodoTr>
          <css.TodoDashTd grey={toJS(todo).id < -1}>{idx + 1}.</css.TodoDashTd>
          {renderTextOrInput()}
        </css.TodoTr>
      </tbody>
    </css.TodoTable>
  );
}

export default Todo;
