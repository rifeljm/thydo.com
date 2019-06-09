import { hot } from 'react-hot-loader/root';
import React from 'react';
import { addDays, format } from 'date-fns';
import axios from 'axios';
import { Store } from './Store.js';
import CalendarDay from './CalendarDay.js';
import Header from './Header.js';
import { dayNumbersToObjects } from '../common/utils.js';

import css from '../css/App.css';

history.scrollRestoration = 'manual';

const dayHeight = 156;

const pubSubDays = {};
const registerDropped = {};
let startDay;
let endDay;
let headerPublish = null;
let init;
let registerDroppedCallback;
let todaysDOM;
let scrolledToToday;
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

function subscribeDay(day, cb) {
  pubSubDays[day] = cb;
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

function renderDays(state) {
  return state.dates.map((week, idx) => {
    const days = week.map((day, idx) => {
      return (
        <CalendarDay
          subscribe={subscribeDay}
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
    let trKey;
    if (week[0].length > 1) trKey = week[0];
    if (week[6].length > 1) trKey = week[6];
    if (typeof week[0] === 'object') {
      trKey = `${week[0].day}_empty`;
    }
    return <css.Tr key={trKey}>{days}</css.Tr>;
  });
}

function onScrollEvent(evt) {
  this.scrollHeight = document.body.scrollHeight;
  if (window.pageYOffset / document.body.scrollHeight < 0.1) {
    appDispatch({ type: 'ADD_WEEKS_BEFORE', weekCount: -4 });
  } else if (window.pageYOffset / (document.body.scrollHeight - window.innerHeight) > 0.9) {
    appDispatch({ type: 'ADD_WEEKS_AFTER', weekCount: 4 });
  }
}

function App() {
  const { state, dispatch } = React.useContext(Store);
  appDispatch = dispatch;
  const headerRef = React.useRef();

  React.useEffect(() => {
    if (!init) {
      dispatch({ type: 'INIT_CALENDAR' });
      init = true;
    } else if (!scrolledToToday) {
      /* initial scroll to today */
      scrollToToday();
      scrolledToToday = true;
      window.addEventListener('scroll', onScrollEvent);
    }
  });

  return (
    <React.Fragment>
      <css.GlobalStyle />
      <Header ref={headerRef} sub={headerSubscribe} todayClick={todayClick} />
      <css.MainTableWrapper>
        <css.Table>{renderDays(state)}</css.Table>
      </css.MainTableWrapper>
    </React.Fragment>
  );
}

export default hot(App);
