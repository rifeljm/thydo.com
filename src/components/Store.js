import React from 'react';
import { addDays, format } from 'date-fns';

import { dayNumbersToObjects } from '../common/utils.js';

const initialState = {
  dates: [],
  startDay: null,
  endDay: null,
  todos: [],
};

const addElements = (weekCount, startDay) => {
  const newDaysArray = [...Array(Math.abs(weekCount) * 7).keys()].map(x => format(addDays(startDay, x), 'YYYY-MM-DD'));
  return newDaysArray.reduce((prev, day, idx) => {
    if (idx % 7 === 0) {
      if (new Date(day).getDay() === 1 && day.substring(8) == '01') {
        const dayNumbers = dayNumbersToObjects([...Array(7).keys()], day);
        prev.push(dayNumbers);
      }
      prev.push([day]);
    } else {
      if (day.substring(8) == '01') {
        const rightDayNumbers = [...Array(7 - (idx % 7)).keys()].map(x => x + (idx % 7));
        prev[prev.length - 1] = prev[prev.length - 1].concat(dayNumbersToObjects(rightDayNumbers, day));
        const leftDayNumbers = dayNumbersToObjects([...Array(idx % 7).keys()], day);
        prev.push(leftDayNumbers.concat(day));
      } else {
        prev[prev.length - 1].push(day);
      }
    }
    return prev;
  }, []);
};

function addWeeks(weekCount, start, end) {
  let endDay = end;
  let startDay = weekCount > 0 ? end : addDays(start, weekCount * 7);
  if (weekCount > 0) {
    endDay = addDays(endDay, weekCount * 7);
  } else {
    startDay = addDays(start, weekCount * 7);
  }
  return { newElements: addElements(weekCount, startDay), startDay, endDay };
}

function initCalendar() {
  let dates = [];
  const today = new Date();
  const dayInWeek = today.getDay();
  const daysSinceMonday = (dayInWeek + 6) % 7;
  const monday = new Date(today.setDate(today.getDate() - daysSinceMonday));
  const weeks = Math.round(window.innerHeight / 334);
  let obj = addWeeks(weeks + 3, monday, monday);
  dates = dates.concat(obj.newElements);
  obj = addWeeks(-weeks - 2, obj.startDay, obj.endDay);
  dates = obj.newElements.concat(dates);
  return {
    startDay: obj.startDay,
    endDay: obj.endDay,
    dates,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'INIT_CALENDAR': {
      return Object.assign({}, state, initCalendar());
    }
    case 'LOAD_INLINE_TODOS': {
      return Object.assign({}, state, { todos: action.todos });
    }
    case 'ADD_WEEKS_AFTER': {
      const { newElements, endDay } = addWeeks(action.weekCount, state.startDay, state.endDay);
      const dates = state.dates.concat(newElements);
      return Object.assign({}, state, { dates, endDay });
    }
    case 'ADD_WEEKS_BEFORE': {
      const { newElements, startDay } = addWeeks(action.weekCount, state.startDay, state.endDay);
      const dates = newElements.concat(state.dates);
      return Object.assign({}, state, { dates, startDay });
    }
  }
}

const Store = React.createContext(initialState);

function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return <Store.Provider value={{ state, dispatch }}>{props.children}</Store.Provider>;
}

export { Store, StoreProvider };
