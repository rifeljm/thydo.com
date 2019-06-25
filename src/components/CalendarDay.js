import React from 'react';
import PropTypes from 'prop-types';
import { getDay, getMonth, format, differenceInCalendarDays, addDays } from 'date-fns';
import locale from 'date-fns/locale/sl';
import Sortable from 'sortablejs';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

import { useStore } from './Store.js';
import Todo from './Todo.js';
import { _tr, upFirst } from '../common/utils.js';

import css from '../css/CalendarDay.css';
import cssTodo from '../css/Todo';

let preventClick = false;

function isToday(day) {
  return day === format(new Date(), 'YYYY-MM-DD');
}

function isThisMonth(day) {
  return day.substring(0, 7) === format(new Date(), 'YYYY-MM');
}

function isThisDayInWeek(day) {
  return getDay(new Date()) === getDay(day);
}

function mouseEnterTodo() {
  preventClick = true;
}

function mouseLeaveTodo() {
  preventClick = false;
}

/*======================================================================*/
/* MAIN CLASS
/*======================================================================*/
function CalendarDay({ day }) {
  const { store, actions } = useStore();
  const domRef = React.useRef();
  const todoListRef = React.useRef();
  const todos = store.todos[day] || [];

  let sortable;

  React.useEffect(() => {
    if (isToday(day)) {
      window.todayDOM = domRef.current;
      store.toToday = true;
    }
  }, []);

  React.useEffect(() => {
    if (typeof day === 'string') {
      createSortable();
    }
    return () => {
      if (typeof day === 'string') {
        sortable.destroy();
      }
    };
  }, []);

  function createSortable() {
    sortable = Sortable.create(todoListRef.current, {
      group: 'todos',
      onSort: evt => actions.handleOnSort(evt, day, todoListRef.current),
    });
  }

  function onClickEvent(evt) {
    if (window.highlightStartDay) {
      // deselectAllHighlighted();
      actions.showMultiDayInput(day);
      delete window.highlightStartDay;
      return;
    }
    if (preventClick) return;
    if (evt.shiftKey) {
      window.highlightStartDay = day;
      store.highlightObjects[day] = true;
      return;
    }
    actions.showNewTodoInput(evt, day, preventClick);
  }

  function deselectAllHighlighted() {
    Object.keys(toJS(store.highlightObjects)).forEach(day => {
      store.highlightObjects[day] = false;
    });
  }

  function mouseAction({ action, day }) {
    document.querySelector('.header-distance').innerText = action === 'mouseEnter' ? renderDayDistance(day) : '';
    if (window.highlightStartDay) {
      if (action === 'mouseEnter') {
        const [min, max] = [window.highlightStartDay, day].sort();
        [...Array(differenceInCalendarDays(max, min) + 1).keys()].reduce((prev, idx) => {
          store.highlightObjects[format(addDays(min, idx), 'YYYY-MM-DD')] = true;
        }, {});
      }
      if (action === 'mouseLeave') {
        deselectAllHighlighted();
      }
    }
  }

  function onMonthNameClick(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  function onWeekdayNameClick(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  function renderMonthName(day) {
    let monthFormat = 'MMMM YYYY';
    if (parseInt(day.substring(8), 10) > 6) monthFormat = 'MMM YY';
    return (
      <css.Month onClick={onMonthNameClick} colorIdx={getMonth(day)}>
        {upFirst(format(day, monthFormat, { locale }))}
      </css.Month>
    );
  }

  function renderMonth(day) {
    if (getDay(day) === 1 && parseInt(day.substring(8), 10) < 8) {
      return renderMonthName(day);
    }
  }

  function renderDayDistance(day) {
    const diff = differenceInCalendarDays(day, format(new Date(), 'YYYY-MM-DD'));
    let text;
    if (diff === 0) text = _tr('Today');
    if (diff === 1) text = _tr('Tomorrow');
    if (diff === -1) text = _tr('Yesterday');
    if (diff < -1) text = `${Math.abs(diff)} ${_tr('days ago')}`;
    if (diff > 1) text = `${diff} ${_tr('days away')}`;
    return text;
  }

  function renderTodoList() {
    /* We need this element rendered (css.TodoList) even if there are no todos, sortablejs will use it as an empty placeholder! */
    return <css.TodoList ref={todoListRef}>{renderTodos(todos)}</css.TodoList>;
  }

  function renderTodos(todos) {
    return todos.map((todo, idx) => {
      return <Todo idx={idx} todo={todo} key={todo.id} mouseEnterTodo={mouseEnterTodo} mouseLeaveTodo={mouseLeaveTodo} day={day} />;
    });
  }

  if (typeof day === 'number') {
    return <css.emptyTd colSpan={day} />;
  }
  const isTodayBool = isToday(day);
  const isDayOfWeekInColor = isThisMonth(day) && isThisDayInWeek(day);

  function renderDayOfWeek() {
    if (parseInt(day.substring(8), 10) > 7) return null;
    return (
      <css.DayOfWeek onClick={onWeekdayNameClick} isDayOfWeekInColor={isDayOfWeekInColor} colorIdx={getMonth(day)}>
        {format(day, 'dddd', { locale })}
      </css.DayOfWeek>
    );
  }

  function renderMultiDayEvents() {
    let multiDayEvents = toJS(store.multiDay[day]);
    if (Array.isArray(multiDayEvents) && multiDayEvents.length) {
      return multiDayEvents.map((event, idx) => {
        return (
          <css.multiDay key={idx} colorIdx={getMonth(day)}>
            {event.title}
          </css.multiDay>
        );
      });
    }
    // let inputOrText = store.multiDay[day];
    // console.log('InputOrText =>', day, toJS(inputOrText));
    // if (day === window.multiDayStart) {
    //   inputOrText = (
    //     <cssTodo.TodoInput
    //       className="multi-day-input"
    //       autoComplete="off"
    //       autoCorrect="off"
    //       autoCapitalize="off"
    //       spellCheck="false"
    //       rows={1}
    //       type="text"
    //     />
    //   );
    // }
    // if (inputOrText) {
    //   return <css.multiDay colorIdx={getMonth(day)}>{inputOrText}</css.multiDay>;
    // }
    return null;
  }

  return (
    <css.Td
      isToday={isTodayBool}
      colorIdx={getMonth(day)}
      dayWeekIdx={getDay(day)}
      ref={domRef}
      onMouseEnter={() => mouseAction({ action: 'mouseEnter', day: day })}
      onMouseLeave={() => mouseAction({ action: 'mouseLeave', day: day })}
      onClick={onClickEvent}
      highlight={day === window.highlightStartDay || store.highlightObjects[day]}
    >
      {renderDayOfWeek()}
      {renderMultiDayEvents()}
      {renderTodoList()}
      {renderMonth(day)}

      <css.BottomRightDay isToday={isTodayBool} dayInWeekIdx={getDay(day)} monthIdx={getMonth(day)}>
        {day.substring(8).replace(/^0/, '')}
      </css.BottomRightDay>
    </css.Td>
  );
}

CalendarDay.propTypes = {
  day: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default observer(CalendarDay);
