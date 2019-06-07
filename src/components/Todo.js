import React from 'react';
import PropTypes from 'prop-types';
import autosize from 'autosize';

import css from '../css/Todo.css';

class Todo extends React.Component {
  static propTypes = {
    color: PropTypes.string.isRequired,
    todo: PropTypes.object.isRequired,
    idx: PropTypes.number.isRequired,
    mouseEnterTodo: PropTypes.func.isRequired,
    mouseLeaveTodo: PropTypes.func.isRequired,
  };

  state = {
    mouseX: null,
    mouseY: null,
    width: null,
    leftDistance: null,
    topDistance: null,
  };

  componentDidMount() {
    if (this.props.todo.id === -1) {
      autosize(this.todoInput);
      this.todoInput.focus();
    }
  }

  async todoInputKeyDown(evt) {
    if (evt.keyCode === 27) {
      this.props.cancelTodo();
      evt.preventDefault();
    }
    if (evt.keyCode === 13) {
      evt.preventDefault();
      this.props.saveTodo(this.todoInput.value);
    }
    if (evt.keyCode === 9) {
      evt.preventDefault();
      this.props.saveTodo(this.todoInput.value, { createNew: true });
    }
  }

  render() {
    let textOrInput = this.props.todo.title;
    if (this.props.todo.id === -1) {
      textOrInput = (
        <css.TodoInput
          rows={1}
          ref={el => {
            this.todoInput = el;
          }}
          type="text"
        />
      );
    }

    return (
      <css.Todo
        ref={el => {
          this.todo = el;
        }}
        color={this.props.color}
        onMouseEnter={() => this.props.mouseEnterTodo(this.props.idx)}
        onMouseLeave={() => this.props.mouseLeaveTodo(this.props.idx)}
        hidden={this.props.todo.clone}
      >
        <css.TodoDash hidden={this.props.todo.clone}>{this.props.idx + 1}.</css.TodoDash>
        {this.props.todo.id === -1 ? (
          <css.TodoInputCell onKeyDown={this.todoInputKeyDown.bind(this)}>{textOrInput}</css.TodoInputCell>
        ) : (
          <css.TodoText hidden={this.props.todo.clone}>{textOrInput}</css.TodoText>
        )}
      </css.Todo>
    );
  }
}

export default Todo;
