import React from 'react';
import PropTypes from 'prop-types';
import { getDay, getMonth, format, differenceInCalendarDays, addDays } from 'date-fns';
import locale from 'date-fns/locale/sl';
import Sortable from 'sortablejs';

import { Store } from './Store.js';
import Todo from './Todo.js';
import { _tr, upFirst } from '../common/utils.js';

import css from '../css/CalendarDay';

let sortable;
let preventClick = false;

function nowDate() {
  return new Date();
}

function isToday(day) {
  return day === format(nowDate(), 'YYYY-MM-DD');
}

function isThisMonth(day) {
  return day.substring(0, 7) === format(nowDate(), 'YYYY-MM');
}

function isThisDayInWeek(number) {
  return getDay(nowDate()) === (number + 1) % 7;
}

function mouseEnterTodo() {
  preventClick = true;
}

function mouseLeaveTodo() {
  preventClick = false;
}

function renderMonthName(day) {
  let monthFormat = 'MMMM YYYY';
  if (parseInt(day.substring(8), 10) > 6) monthFormat = 'MMM YY';
  return <css.Month colorIdx={getMonth(day)}>{upFirst(format(day, monthFormat, { locale }))}</css.Month>;
}

function renderMonth(day, idx) {
  if ((idx === 0 && parseInt(day.substring(8), 10) < 8) || (parseInt(day.substring(8), 10) === 1 && idx < 1)) {
    return renderMonthName(day);
  }
}

function renderDayDistance(day) {
  const diff = differenceInCalendarDays(day, format(new Date(), 'YYYY-MM-DD'));
  let text;
  if (diff === 1) text = _tr('Tomorrow');
  if (diff === -1) text = _tr('Yesterday');
  if (diff < -1) text = `${Math.abs(diff)} ${_tr('days ago')}`;
  if (diff > 1) text = `${diff} ${_tr('days away')}`;
  return text;
}

/*======================================================================*/
/* MAIN CLASS
/*======================================================================*/
function CalendarDay({ day, setDayDOM, idx, registerDroppedList, moveTodoToDroppedList }) {
  const domRef = React.useRef();
  const todoListRef = React.useRef();
  const { state, actions } = React.useContext(Store);

  let todos = state.todos[day] || [];

  React.useEffect(() => {
    setDayDOM(domRef.current, day, isToday(day));
    if (typeof day === 'string') {
      createSortable();
    }
    /* Unmount */
    return () => {
      if (typeof day === 'string') {
        // sortable.destroy();
      }
    };
  }, []);

  function createSortable() {
    sortable = Sortable.create(todoListRef.current, {
      group: 'todos',
      onSort: onSort,
    });
  }

  function dayAction({ action, day }) {
    document.querySelector('.header-distance').innerText = action === 'enter' ? renderDayDistance(day) : '';
  }

  function applySort(droppedTodo, newIndex) {
    const newTodos = todos.reduce((prev, todo, idx) => {
      return newIndex === idx ? prev.concat(droppedTodo).concat(todo) : prev.concat(todo);
    }, []);
    if (newIndex >= newTodos.length) {
      newTodos.push(droppedTodo);
    }
    actions.saveTodoListOrder(day, newTodos);
    // saveTodoOrder(day, todos);
  }

  function onSort(evt) {
    let todos = state.todos[day];
    /* SORT ON THE SAME LIST (todos length in state is the same as "this sortable" element count */
    if (evt.from === todoListRef.current && todos.length === evt.from.childElementCount) {
      const elem = todos[evt.oldIndex];
      const newTodos = todos.reduce((prev, todo, idx) => {
        if (elem === todo) {
          return prev;
        }
        if (idx === evt.newIndex) {
          return evt.oldIndex < evt.newIndex ? prev.concat(todo).concat(elem) : prev.concat(elem).concat(todo);
        }
        return prev.concat(todo);
      }, []);
      actions.saveTodoOrder(day, newTodos);
    }
    /* handle dropped list */
    if (evt.from !== todoListRef.current && todos.length < evt.to.childElementCount) {
      evt.item.remove();
      registerDroppedList({ cb: applySort, day });
    }
    /* handle source (missing todo) list */
    if (evt.from === todoListRef.current && todos.length > evt.from.childElementCount) {
      const removedTodo = todos[evt.oldIndex];
      evt.from.appendChild(evt.item); /* yes, add it back, because react's re-render will fail on mutated DOM */
      todos.splice(evt.oldIndex, 1);
      moveTodoToDroppedList(removedTodo, evt.newIndex, evt.oldIndex);
      actions.saveTodoListOrder(day, todos);
    }
  }

  function renderTodos(todos) {
    return todos.map((todo, idx) => {
      return <Todo day={day} idx={idx} todo={todo} key={todo.id} mouseEnterTodo={mouseEnterTodo} mouseLeaveTodo={mouseLeaveTodo} />;
    });
  }

  if (typeof day === 'number') {
    return <css.emptyTd colSpan={day} />;
  }
  // if (typeof day === 'object') {
  //   const isDayOfWeekInColor = isThisMonth(day.day) && isThisDayInWeek(day.number);
  //   return (
  //     <css.DayOfWeek idx={idx} isDayOfWeekInColor={isDayOfWeekInColor} colorIdx={getMonth(day.day)}>
  //       {format(addDays('1975-09-22', idx), 'dddd', { locale })}
  //     </css.DayOfWeek>
  //   );
  // }
  const isTodayBool = isToday(day);
  const isDayOfWeekInColor = isThisMonth(day) && isThisDayInWeek(idx);

  function dayOfWeek() {
    if (parseInt(day.substring(8), 10) > 7) return null;
    return (
      <css.DayOfWeek isDayOfWeekInColor={isDayOfWeekInColor} colorIdx={getMonth(day)}>
        {format(addDays('1975-09-22', idx), 'dddd', { locale })}
      </css.DayOfWeek>
    );
  }

  return (
    <css.Td
      isToday={isTodayBool}
      colorIdx={getMonth(day)}
      dayWeekIdx={idx}
      ref={domRef}
      onMouseEnter={() => dayAction({ action: 'enter', day: day })}
      onMouseLeave={() => dayAction({ action: 'leave', day: day })}
      onClick={evt => !preventClick && actions.createNewTodo(evt, day)}
    >
      {dayOfWeek()}
      <css.TodoList ref={todoListRef}>{renderTodos(todos)}</css.TodoList>
      {renderMonth(day, idx)}
      <css.BottomRightDay isToday={isTodayBool} dayInWeekIdx={idx} monthIdx={getMonth(day)}>
        {day.substring(8).replace(/^0/, '')}
      </css.BottomRightDay>
    </css.Td>
  );
}

CalendarDay.propTypes = {
  day: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setDayDOM: PropTypes.func.isRequired,
  idx: PropTypes.number.isRequired,
  registerDroppedList: PropTypes.func.isRequired,
  moveTodoToDroppedList: PropTypes.func.isRequired,
};

export default CalendarDay;
