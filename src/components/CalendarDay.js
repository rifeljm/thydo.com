import React from 'react';
import PropTypes from 'prop-types';
import Sortable from 'sortablejs';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import dayjs from 'dayjs';

import { useStore } from './Store.js';
import Todo from './Todo.js';
import { upFirst } from '../common/utils.js';
import MultiDayEvent from './MultiDayEvent.js';
import TimeEvent from './TimeEvent.js';

import css from '../css/CalendarDay.css';

let preventClick = false;

function isToday(day) {
  return day === dayjs().format('YYYY-MM-DD');
}

function isThisMonth(day) {
  return day.substring(0, 7) === dayjs().format('YYYY-MM');
}

function isThisDayInWeek(day) {
  return dayjs(new Date()).day() === dayjs(day).day();
}

function timeEventSortFn(a, b) {
  const aPad = a.h.indexOf(':') < 2 ? `0${a.h}` : a.h;
  const bPad = b.h.indexOf(':') < 2 ? `0${b.h}` : b.h;
  return aPad > bPad ? 1 : -1;
}

function CalendarDay({ day }) {
  const { store, actions } = useStore();
  const domRef = React.useRef();
  const todoListRef = React.useRef();
  const todos = store.todos[day] || [];

  let sortable;

  React.useEffect(() => {
    if (isToday(day)) {
      window.app.todayDOM = domRef.current;
      store.toToday = true;
    }
    return () => {
      window.app.todayDOM = null;
    };
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
    if (window.app.highlightStartDay && !window.app.highlightEndDay) {
      deselectAllHighlighted();
      actions.showMultiDayInput(day);
      window.app.highlightEndDay = day;
      return;
    }
    if (preventClick) {
      return;
    }
    if (evt.shiftKey) {
      actions.cancelTodo();
      window.app.highlightStartDay = day;
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
    // document.querySelector('.header-distance').innerText = action === 'mouseEnter' ? renderDayDistance(day) : '';
    if (window.app.highlightStartDay && !window.app.highlightEndDay) {
      if (action === 'mouseEnter') {
        const [min, max] = [window.app.highlightStartDay, day].sort();
        [...Array(dayjs(max).diff(dayjs(min), 'day') + 1).keys()].reduce((prev, idx) => {
          store.highlightObjects[
            dayjs(min)
              .add(idx, 'day')
              .format('YYYY-MM-DD')
          ] = true;
        }, {});
      }
      if (action === 'mouseLeave' && !window.app.highlightEndDay) {
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
      <css.Month onClick={onMonthNameClick} colorIdx={dayjs(day).month()}>
        {upFirst(dayjs(day).format(monthFormat))}
      </css.Month>
    );
  }

  function renderMonth(day) {
    if (dayjs(day).day() === (toJS(store.settings).firstDayInWeek === 'sunday' ? 0 : 1) && parseInt(day.substring(8), 10) < 8) {
      return renderMonthName(day);
    }
  }

  // function renderDayDistance(day) {
  //   const diff = differenceInCalendarDays(day, formatLocale(new Date(), 'yyyy-MM-dd'));
  //   let text;
  //   if (diff === 0) text = _tr('Today');
  //   if (diff === 1) text = _tr('Tomorrow');
  //   if (diff === -1) text = _tr('Yesterday');
  //   if (diff < -1) text = `${Math.abs(diff)} ${_tr('days ago')}`;
  //   if (diff > 1) text = `${diff} ${_tr('days away')}`;
  //   return text;
  // }

  function renderTodoList() {
    /* We need this element rendered (css.TodoList) even if there are no todos, sortablejs will use it as an empty placeholder! */
    return <css.TodoList ref={todoListRef}>{renderTodos(todos)}</css.TodoList>;
  }

  function renderTodos(todos) {
    return todos.map((todo, idx) => {
      return (
        <Todo
          idx={idx}
          todo={todo}
          key={todo.id}
          mouseEnterTodo={() => (preventClick = true)}
          mouseLeaveTodo={() => (preventClick = false)}
          day={day}
        />
      );
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
      <css.DayOfWeek onClick={onWeekdayNameClick} isDayOfWeekInColor={isDayOfWeekInColor} colorIdx={dayjs(day).month()}>
        {dayjs(day).format('dddd')}
        {/*store.dayNames[dayjs(day).day()] */}
      </css.DayOfWeek>
    );
  }

  function renderMultiDayEvents() {
    let multiDayEvents = toJS(store.multiDay[day]);
    if (Array.isArray(multiDayEvents) && multiDayEvents.length) {
      return multiDayEvents.map(event => {
        return <MultiDayEvent key={event.id} event={event} day={day} />;
      });
    }
    return null;
  }

  function renderTimeEvents() {
    let timeEvents = toJS(store.timeEvents)[day];
    if (timeEvents && Object.keys(timeEvents).length) {
      return Object.keys(timeEvents)
        .map(eventId => {
          return { ...timeEvents[eventId], id: eventId };
        })
        .sort(timeEventSortFn)
        .map(event => {
          return <TimeEvent key={event.id} event={event} day={day} />;
        });
    }
  }

  return (
    <css.Td
      isToday={isTodayBool}
      colorIdx={dayjs(day).month()}
      dayWeekIdx={dayjs(day).day()}
      ref={domRef}
      onMouseEnter={() => mouseAction({ action: 'mouseEnter', day: day })}
      onMouseLeave={() => mouseAction({ action: 'mouseLeave', day: day })}
      onClick={onClickEvent}
      highlight={store.highlightObjects[day]}
      onDrop={e => actions.onDropEvent(e, day)}
      onDragOver={e => actions.onDragOverEvent(e, day)}
      onDragLeave={e => actions.onDragLeaveEvent(e, day)}
    >
      {renderDayOfWeek()}
      {renderMultiDayEvents()}
      {renderTimeEvents()}
      {renderTodoList()}
      {renderMonth(day)}
      <css.BottomRightDay isToday={isTodayBool} dayInWeekIdx={dayjs(day).day()} monthIdx={dayjs(day).month()}>
        {day.substring(8).replace(/^0/, '')}
      </css.BottomRightDay>
    </css.Td>
  );
}

CalendarDay.propTypes = {
  day: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default observer(CalendarDay);
