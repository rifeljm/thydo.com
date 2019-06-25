import { addDays, format } from 'date-fns';
import { toJS } from 'mobx';
import { fromToDays } from '../common/utils.js';

const addElements = (weekCount, day) => {
  if (weekCount < 0) {
    day = addDays(day, weekCount * 7);
  }
  return [...Array(Math.abs(weekCount) * 7).keys()].map(idx => format(addDays(day, idx), 'YYYY-MM-DD'));
};

const getMondayFromDates = (weekCount, dates) => {
  const firstDay = dates[0];
  const lastDay = dates[dates.length - 1];
  return weekCount > 0 ? addDays(lastDay, 1) : firstDay;
};

exports.removeWeeks = store => where => {
  if (where === 'bottom') {
    store.dates.splice(store.visibleWeeks * 7);
  }
  if (where === 'top') {
    store.dates.splice(0, store.dates.length - store.visibleWeeks * 7);
  }
};

exports.addWeeks = store => weekCount => {
  let day = getMondayFromDates(weekCount, toJS(store.dates));
  let newElements = addElements(weekCount, day);
  if (weekCount > 0) {
    store.dates.push(...newElements);
  } else {
    store.dates.splice(0, 0, ...newElements);
  }
};

export const initCalendar = store => () => {
  const today = new Date();
  const dayInWeek = today.getDay();
  const daysSinceMonday = (dayInWeek + 6) % 7;
  const monday = new Date(today.setDate(today.getDate() - daysSinceMonday));
  const weeks = Math.round(window.innerHeight / 334);
  let dates = addElements(weeks + 3, monday);
  dates.splice(0, 0, ...addElements(-weeks - 3, monday));
  store.dates = dates;
  store.visibleWeeks = Object.keys(dates).length / 7;
};

export const toToday = store => () => {
  store.toToday = false;
  initCalendar(store)();
};

export const processInitData = store => allEntries => {
  const initMultiDay = {};
  allEntries.multiDay.forEach(todo => {
    fromToDays(todo.from, todo.to).forEach(day => {
      if (!initMultiDay[day]) {
        initMultiDay[day] = [];
      }
      initMultiDay[day].push(todo);
    });
  });
  store.multiDay = initMultiDay;
  delete allEntries.multiDay;
  store.todos = allEntries;
};
