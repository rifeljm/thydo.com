import React from 'react';
import PropTypes from 'prop-types';
import { getDay, format } from 'date-fns';
import axios from 'axios';
import Sortable from 'sortablejs';

import Todo from './Todo.js';

import css from '../css/CalendarDay.css';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

class CalendarDay extends React.PureComponent {
  static propTypes = {
    day: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    setTodaysDOM: PropTypes.func.isRequired,
  };

  state = {
    todos: [],
  };

  componentWillMount() {
    if (typeof this.props.day === 'string') {
      this.props.subscribe(this.props.day, this.updateDay.bind(this));
    }
  }

  componentDidMount() {
    if (this.isToday(this.props.day)) {
      this.props.setTodaysDOM(this.dom);
    }
    if (typeof this.props.day === 'string') {
      this.createSortable();
    }
  }

  componentWillUnmount() {
    if (typeof this.props.day === 'string') {
      Sortable.destroy();
    }
  }

  createSortable() {
    this.sortable = Sortable.create(this.todoList, {
      group: 'todos',
      onSort: this.onSort.bind(this),
    });
  }

  saveTodoOrder(day, todos) {
    axios.put('/api/sort-day', {
      day,
      todoIds: todos.map(todo => todo.id),
    });
  }

  async onSort(evt) {
    /* SORT ON THE SAME LIST (todos length in state is the same as "this sortable" element count */
    if (evt.from === this.todoList && this.state.todos.length === evt.from.childElementCount) {
      const elem = this.state.todos[evt.oldIndex];
      const todos = this.state.todos.reduce((prev, todo, idx) => {
        if (elem === todo) {
          return prev;
        }
        if (idx === evt.newIndex) {
          return evt.oldIndex < evt.newIndex ? prev.concat(todo).concat(elem) : prev.concat(elem).concat(todo);
        }
        return prev.concat(todo);
      }, []);
      this.setState({ todos });
      this.saveTodoOrder(this.props.day, todos);
    }

    /* handle dropped list */
    if (evt.from !== this.todoList && this.state.todos.length < evt.to.childElementCount) {
      evt.item.remove();
      this.props.registerDroppedList({ cb: this.applySort.bind(this), day: this.props.day });
    }
    /* handle source (missing todo) list */
    if (evt.from === this.todoList && this.state.todos.length > evt.from.childElementCount) {
      const removedTodo = this.state.todos[evt.oldIndex];
      evt.from.appendChild(evt.item);
      this.state.todos.splice(evt.oldIndex, 1);
      this.props.moveTodoToDroppedList(removedTodo, evt.newIndex, evt.oldIndex);
      this.forceUpdate();
      this.saveTodoOrder(this.props.day, this.state.todos);
    }
  }

  applySort(droppedTodo, newIndex) {
    const todos = this.state.todos.reduce((prev, todo, idx) => {
      return newIndex === idx ? prev.concat(droppedTodo).concat(todo) : prev.concat(todo);
    }, []);
    if (newIndex >= todos.length) {
      todos.push(droppedTodo);
    }
    this.saveTodoOrder(this.props.day, todos);
    this.setState({ todos });
  }

  async saveTodo(title, obj) {
    const response = await axios.post('/api/todo', { day: this.props.day, title });
    if (response.status === 200) {
      const todos = this.state.todos.filter(todo => todo.id !== -1).concat(response.data);
      this.setState({ todos }, () => {
        if (obj && obj.createNew) {
          this.createNewTodo();
        }
      });
    }
  }

  updateDay(obj) {
    this.state.todos.map((prev, todo) => {
      return todo.id === obj.id ? todo : prev;
    });
    if (this.state.todos.map(todo => todo.id).indexOf(obj.id) === -1) {
      this.state.todos = this.state.todos.concat(obj);
    }
    this.forceUpdate();
  }

  nowDate() {
    return new Date();
  }

  isToday(day) {
    return day === format(this.nowDate(), 'YYYY-MM-DD');
  }

  isThisMonth(day) {
    return day.substring(0, 7) === format(this.nowDate(), 'YYYY-MM');
  }

  isThisDayInWeek(number) {
    return getDay(this.nowDate()) === (number + 1) % 7;
  }

  dayColor(isDayInWeekColor) {
    /* Saturday, Sunday */
    if (this.props.idx > 4 && !isDayInWeekColor) {
      return '#999999';
    }
    const day = typeof this.props.day === 'object' ? this.props.day.day : this.props.day;
    const month = parseInt(day.split('-')[1]);
    const monthColors = [
      '#5061BF',
      '#5CAAD8',
      '#9DC65E',
      '#693E95',
      '#4A9656',
      '#DA4B7E',
      '#8F4C81',
      '#F1B55F',
      '#DF6B46',
      '#DE594B',
      '#644733',
      '#B24143',
    ];
    return monthColors[month - 1];
  }

  createNewTodo(evt) {
    const todoExists = this.state.todos.map(todo => todo.id).indexOf(-1) > 1;
    if ((!evt || (evt.clientY > 50 && !this.preventClick)) && !todoExists) {
      const todos = this.state.todos.concat({ id: -1 });
      this.setState({ todos });
    }
    return true;
  }

  mouseEnterTodo(idx) {
    this.preventClick = true;
  }

  mouseLeaveTodo(idx) {
    this.preventClick = false;
  }

  cancelTodo() {
    this.setState({
      todos: this.state.todos.filter(todo => todo.id !== -1),
    });
  }

  renderMonthName() {
    const monthColor = this.dayColor();
    return <css.Month color={monthColor}>{format(this.props.day, 'MMM YY')}</css.Month>;
  }

  renderMonth() {
    if (
      (this.props.idx === 0 && parseInt(this.props.day.substring(8), 10) < 8) ||
      (parseInt(this.props.day.substring(8), 10) === 1 && this.props.idx < 1)
    ) {
      return this.renderMonthName();
    }
  }

  renderTodos() {
    let todos = this.state.todos;
    let newTodos;
    todos = newTodos || todos;
    return todos.map((todo, idx) => {
      return (
        <Todo
          idx={idx}
          todo={todo}
          key={todo.id}
          color={this.dayColor()}
          saveTodo={this.saveTodo.bind(this)}
          mouseEnterTodo={this.mouseEnterTodo.bind(this)}
          mouseLeaveTodo={this.mouseLeaveTodo.bind(this)}
          cancelTodo={this.cancelTodo.bind(this)}
          createNewTodo={this.createNewTodo.bind(this)}
        />
      );
    });
  }

  render() {
    if (typeof this.props.day === 'object') {
      const color = this.isThisMonth(this.props.day.day) && this.isThisDayInWeek(this.props.day.number) ? this.dayColor(true) : '#444';
      return <css.DayOfWeek color={color}>{weekDays[this.props.day.number]}</css.DayOfWeek>;
    }
    const monthColor = this.dayColor();
    return (
      <css.Td
        isToday={this.isToday(this.props.day)}
        color={monthColor}
        ref={el => {
          this.dom = el;
        }}
        onMouseEnter={() => this.props.dayAction({ action: 'enter', day: this.props.day })}
        onMouseLeave={() => this.props.dayAction({ action: 'leave', day: this.props.day })}
        onClick={this.createNewTodo.bind(this)}
      >
        <css.TodoList
          ref={el => {
            this.todoList = el;
          }}
        >
          {this.renderTodos()}
        </css.TodoList>
        {this.renderMonth()}
        <css.BottomRightDay isToday={this.isToday(this.props.day)} color={monthColor}>
          {this.props.day.substring(8)}
        </css.BottomRightDay>
      </css.Td>
    );
  }
}
export default CalendarDay;
