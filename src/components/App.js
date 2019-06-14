import { hot } from 'react-hot-loader/root';
import React from 'react';
import { format } from 'date-fns';
import { Store } from './Store.js';
import CalendarDayComponent from './CalendarDay.js';
import Header from './Header.js';
import css from '../css/App.js';
import { useEventListener } from '../common/utils.js';

window.history.scrollRestoration = 'manual';

const dayHeight = 156;

let headerPublish = null;
let registerDroppedCallback;
let todaysDOM;
let hasScrolledToToday;
let todos;
let disableEnter = false;
let lastScrollTop = 0;
let cutDatesWhere;
const dayRefs = {};

function registerDroppedList(obj) {
  registerDroppedCallback = obj;
}

function moveTodoToDroppedList(todo, newIndex) {
  registerDroppedCallback.cb(todo, newIndex);
  registerDroppedCallback = null;
}

function dayAction(actionObject) {
  if (headerPublish) {
    headerPublish(actionObject);
  } else {
    console.error('Why is headerPublish missing?!');
  }
}

function setDayDOM(domElement, day, isToday) {
  if (isToday) {
    todaysDOM = domElement;
  }
  dayRefs[day] = domElement;
}

function scrollToToday() {
  if (todaysDOM) {
    const scrollTo = todaysDOM.getBoundingClientRect().top - window.innerHeight / 2 + window.pageYOffset + dayHeight / 2;
    window.scroll(0, scrollTo);
  }
}

function renderDays(week) {
  return week.map((day, idx) => {
    // const CalendarDay = React.memo(
    //   ({ ...props }) => {
    //     return <CalendarDayComponent {...props} />;
    //   },
    //   (prevProps, newProps) => {
    //     return nextProps.todos.length === prevProps.todos.length;
    //   }
    // );
    const key = typeof day === 'object' ? `${day.day}_${day.number}` : day;
    return (
      <CalendarDayComponent
        dayAction={dayAction}
        setDayDOM={setDayDOM}
        key={key}
        day={day}
        idx={idx}
        registerDroppedList={registerDroppedList}
        moveTodoToDroppedList={moveTodoToDroppedList}
        todos={todos[day] || []}
      />
    );
  });
}

function renderWeek(week, idx, key) {
  return <css.Tr key={key}>{renderDays(week)}</css.Tr>;
}

function renderWeeks(dates) {
  return dates.map((week, idx) => {
    let key;
    if (week[0].length > 1) key = week[0];
    if (week[6].length > 1) key = week[6];
    if (typeof week[0] === 'object') {
      key = `${week[0].day}_empty`;
    }
    const firstDayInMonthIdx = week.map(day => day.substring(8)).indexOf('01');
    if (firstDayInMonthIdx > -1) {
      let lastWeek = [...week];
      lastWeek.splice(firstDayInMonthIdx);
      lastWeek = lastWeek.concat([...Array(7 - lastWeek.length).keys()]);
      let firstWeek = [...week];
      firstWeek.splice(0, firstDayInMonthIdx);
      firstWeek = [...Array(firstDayInMonthIdx).keys()].concat(firstWeek);
      return (
        <React.Fragment key={key}>
          {renderWeek(lastWeek, idx, `${key}_lastWeek`)}
          {renderWeek(firstWeek, idx, `${key}_firstWeek`)}
        </React.Fragment>
      );
    } else {
      return renderWeek(week, idx, key);
    }
  });
}

function App() {
  const { state, dispatch, actions } = React.useContext(Store);
  todos = state.todos;

  React.useEffect(() => {
    window.addEventListener('keydown', keyDownEvent);
    actions.initCalendar();
    const todos = JSON.parse(document.getElementById('todos_data').innerHTML);
    dispatch({ type: 'LOAD_INLINE_TODOS', todos });
  }, []);

  React.useEffect(() => {
    disableEnter = state.todoInputMode;
  }, [state.todoInputMode]);

  React.useEffect(() => {
    if (state.tempTodosOrder.length > 1) {
      dispatch({ type: 'CLEAR_TEMP_TODO_LIST_ORDER' });
    }
  }, [state.tempTodosOrder]);

  React.useEffect(() => {
    if (!hasScrolledToToday && state.dates.length) {
      /* initial scroll to today */
      scrollToToday();
      hasScrolledToToday = true;
    }
    if (state.dates.length && cutDatesWhere) {
      actions.removeWeeks(cutDatesWhere);
      cutDatesWhere = null;
    }
  }, [state.dates]);

  React.useEffect(() => {
    if (state.navigateToToday) {
      scrollToToday();
      dispatch({ type: 'NAVIGATE_TO_TODAY', on: false });
    }
  }, [state.navigateToToday]);

  useEventListener('scroll', onScrollEvent);

  function onScrollEvent(evt) {
    let scrolledDown = window.pageYOffset - lastScrollTop > 0;
    if (window.pageYOffset < 50 && !scrolledDown) {
      evt.preventDefault();
      const heightBefore = document.body.scrollHeight;
      const pageYOffset = window.pageYOffset;
      actions.addWeeks(-4);
      cutDatesWhere = 'bottom';
      if (window.pageYOffset - pageYOffset !== document.body.scrollHeight - heightBefore) {
        window.scrollTo(0, document.body.scrollHeight - heightBefore + window.pageYOffset);
      }
    } else if (window.pageYOffset > document.body.scrollHeight - window.innerHeight && scrolledDown) {
      actions.addWeeks(4);
      cutDatesWhere = 'top';
    }
    lastScrollTop = window.pageYOffset <= 0 ? 0 : window.pageYOffset;
  }

  function keyDownEvent(evt) {
    if (evt.keyCode === 13 && !disableEnter) {
      dispatch({ type: 'CREATE_NEW_TODO_INPUT', day: format(new Date(), 'YYYY-MM-DD') });
      evt.preventDefault();
    }
  }

  return (
    <React.Fragment>
      <css.GlobalStyle />
      <Header scrollToToday={scrollToToday} />
      <css.MainTableWrapper>
        <css.Table>{renderWeeks(state.dates)}</css.Table>
      </css.MainTableWrapper>
    </React.Fragment>
  );
}

export default hot(App);
