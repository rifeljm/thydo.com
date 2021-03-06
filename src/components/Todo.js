import React from 'react';
import PropTypes from 'prop-types';
import autosize from 'autosize';
import { toJS } from 'mobx';
import { navigate } from '@reach/router';

import { useStore } from './Store.js';

import css from '../css/Todo.css';

import { descriptionSvg } from '../common/utils.js';

Todo.propTypes = {
  idx: PropTypes.number.isRequired,
  todo: PropTypes.object.isRequired,
  mouseEnterTodo: PropTypes.func.isRequired,
  mouseLeaveTodo: PropTypes.func.isRequired,
  day: PropTypes.string.isRequired,
};

let mouseDown, todoDoneHappened;
let cancelMouseUp = 0;

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
      mouseLeaveTodo();
      actions.cancelTodo();
    }
    if (evt.keyCode === 13 && !evt.shiftKey) {
      evt.preventDefault();
      evt.stopPropagation();
      todoInputRef.current.value = '';
      actions.postTodo(day, value);
    }
    if (evt.keyCode === 9) {
      evt.preventDefault();
      if (value) {
        todoInputRef.current.value = '';
        actions.postTodo(day, value, { createNew: true });
      }
    }
  }

  function onMouseDown(e) {
    if (e.button === 0) {
      mouseDown = true;
      cancelMouseUp = 0;
      setTimeout(() => {
        /* long click */
        if (cancelMouseUp < 2 && mouseDown) {
          todoDoneHappened = true;
          actions.toggleTodoDone(e, todo, day);
        }
        mouseDown = false;
        cancelMouseUp = 0;
      }, 400);
    }
  }

  function onMouseMove() {
    if (mouseDown) {
      cancelMouseUp++;
    }
  }

  function onMouseUp(e) {
    if (e.button === 0) {
      e.preventDefault();
      e.stopPropagation();
      if (!todoDoneHappened && !cancelMouseUp) {
        if (todo.id > -1) {
          navigate(`/${toJS(todo).id}`);
        }
        todoDoneHappened = false;
      }
      cancelMouseUp = 0;
      todoDoneHappened = false;
      mouseDown = false;
    }
  }

  function onClick(e) {
    e.stopPropagation();
  }

  function renderDescriptionIcon(todo) {
    return todo.d ? <css.DecriptionIcon dangerouslySetInnerHTML={{ __html: descriptionSvg }} /> : null;
  }

  function renderTextOrInput() {
    let textOrInput = (
      <React.Fragment>
        {todo.t}
        {renderDescriptionIcon(todo)}
      </React.Fragment>
    );
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
          onBlur={e => actions.onBlur(e, day)}
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
    return (
      <css.TodoText done={!!todo.f} grey={toJS(todo).id < -1}>
        {textOrInput}
      </css.TodoText>
    );
  }

  return (
    <css.TodoTable
      ref={todoRef}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onClick={onClick}
      onMouseEnter={mouseEnterTodo}
      onMouseLeave={mouseLeaveTodo}
    >
      <tbody>
        <css.TodoTr>
          <css.TodoDashTd done={!!todo.f} grey={toJS(todo).id < -1}>
            {idx + 1}.
          </css.TodoDashTd>
          {renderTextOrInput()}
        </css.TodoTr>
      </tbody>
    </css.TodoTable>
  );
}

export default Todo;
