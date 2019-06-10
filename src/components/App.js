import { hot } from 'react-hot-loader/root';
import React from 'react';
import { addDays, format } from 'date-fns';
import axios from 'axios';
import { Store } from './Store.js';
import CalendarDay from './CalendarDay.js';
import Header from './Header.js';
import { dayNumbersToObjects } from '../common/utils.js';

import css from '../css/App.js';

window.history.scrollRestoration = 'manual';

const dayHeight = 156;

const registerDropped = {};
let startDay;
let endDay;
let headerPublish = null;
let didMount;
let registerDroppedCallback;
let todaysDOM;
let hasScrolledToToday;
let thisActions;
let appDispatch;

function headerSubscribe(cb) {
  headerPublish = cb;
}

function todayClick() {
  console.log('yahoooooo');
}

function registerDroppedList(obj) {
  registerDroppedCallback = obj;
}

function moveTodoToDroppedList(todo, newIndex, oldIndex) {
  registerDroppedCallback.cb(todo, newIndex);
  registerDroppedCallback = null;
}

function dayAction(actionObject) {
  headerPublish(actionObject);
}

function setTodaysDOM(domElement) {
  todaysDOM = domElement;
}

function scrollToToday(initial) {
  const middle = window.innerHeight / 2;
  const scrollTo = todaysDOM.getBoundingClientRect().top - window.innerHeight / 2 + window.pageYOffset + dayHeight / 2;
  window.scroll(0, scrollTo);
}

function renderDays(week) {
  return week.map((day, idx) => {
    return (
      <CalendarDay
        dayAction={dayAction}
        setTodaysDOM={setTodaysDOM}
        key={typeof day === 'object' ? day.number : day}
        day={day}
        idx={idx}
        registerDroppedList={registerDroppedList}
        moveTodoToDroppedList={moveTodoToDroppedList}
      />
    );
  });
}

function renderWeek(week, idx) {
  let key;
  if (week[0].length > 1) key = week[0];
  if (week[6].length > 1) key = week[6];
  if (typeof week[0] === 'object') {
    key = `${week[0].day}_empty`;
  }
  return <css.Tr key={key}>{renderDays(week)}</css.Tr>;
}

function renderWeeks(dates) {
  return dates.map((week, idx) => {
    return renderWeek(week, idx);
  });
}

function onScrollEvent(evt, dispatch) {
  if (window.pageYOffset < 100) {
    evt.preventDefault();
    const heightBefore = document.body.scrollHeight;
    const pageYOffset = window.pageYOffset;
    dispatch({ type: 'ADD_WEEKS_BEFORE', weekCount: -4 });
    if (window.pageYOffset - pageYOffset !== document.body.scrollHeight - heightBefore) {
      window.scrollTo(0, document.body.scrollHeight - heightBefore + window.pageYOffset);
    }
  } else if (window.pageYOffset / (document.body.scrollHeight - window.innerHeight) > 0.9) {
    dispatch({ type: 'ADD_WEEKS_AFTER', weekCount: 4 });
  }
}

function App() {
  const { state, dispatch } = React.useContext(Store);
  appDispatch = dispatch;
  const headerRef = React.useRef();

  React.useEffect(() => {
    if (!didMount) {
      dispatch({ type: 'INIT_CALENDAR' });
      const todos = JSON.parse(document.getElementById('todos_data').innerHTML);
      dispatch({ type: 'LOAD_INLINE_TODOS', todos });
      didMount = true;
    } else if (!hasScrolledToToday) {
      /* initial scroll to today */
      scrollToToday();
      hasScrolledToToday = true;
      window.addEventListener('scroll', evt => onScrollEvent(evt, dispatch));
    }
  });

  // console.log('render()', state);

  return (
    <React.Fragment>
      <css.GlobalStyle />
      <Header ref={headerRef} sub={headerSubscribe} todayClick={todayClick} />
      <css.MainTableWrapper>
        <css.Table>{renderWeeks(state.dates)}</css.Table>
      </css.MainTableWrapper>
    </React.Fragment>
  );
}

export default hot(App);
