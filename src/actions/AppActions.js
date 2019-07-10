import { addDays, format } from 'date-fns';
import { toJS } from 'mobx';
import { fromToDays } from '../common/utils.js';

const dayHeight = 156;

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

export const removeWeeks = store => where => {
  if (where === 'bottom') {
    store.dates.splice(store.visibleWeeks * 7);
  }
  if (where === 'top') {
    store.dates.splice(0, store.dates.length - store.visibleWeeks * 7);
  }
};

export const addWeeks = store => weekCount => {
  let day = getMondayFromDates(weekCount, toJS(store.dates));
  let newElements = addElements(weekCount, day);
  if (weekCount > 0) {
    store.dates.push(...newElements);
  } else {
    store.dates.splice(0, 0, ...newElements);
  }
};

export const paintCalendar = store => () => {
  const today = new Date();
  const dayInWeek = today.getDay();
  const daysSinceMonday = (dayInWeek + 6) % 7;
  // const daysSinceMonday = dayInWeek; /* SUNDAY AS FIRST DAY OF THE WEEK */
  const monday = new Date(today.setDate(today.getDate() - daysSinceMonday));
  const weeks = Math.round(window.innerHeight / 334);
  let dates = addElements(weeks + 4, monday);
  dates.splice(0, 0, ...addElements(-weeks - 3, monday));
  store.dates = dates;
  store.visibleWeeks = Object.keys(dates).length / 7;
};

export const toToday = store => () => {
  store.toToday = false;
  paintCalendar(store)();
};

export const processInitData = store => allEntries => {
  const initMultiDay = {};
  if (allEntries.multiDay) {
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
  }
  window.app.googleSSO = allEntries.googleSSO;
  delete allEntries.googleSSO;
  if (allEntries.user) {
    window.app.user = allEntries.user;
    delete allEntries.user;
  }
  store.todos = allEntries;
};

export const onScrollEvent = store => () => {
  if (window.pageYOffset < 50) {
    const offsetBefore = window.pageYOffset;
    let heightBefore = document.body.scrollHeight;
    addWeeks(store)(-4);
    if (window.pageYOffset === 0) {
      window.scrollTo(0, document.body.scrollHeight - heightBefore + window.pageYOffset);
    }
    heightBefore = document.body.scrollHeight;
    removeWeeks(store)('bottom');
    if (offsetBefore === window.pageYOffset) {
      window.scrollTo(0, heightBefore - document.body.scrollHeight);
    }
  } else if (window.pageYOffset >= document.body.scrollHeight - window.innerHeight) {
    addWeeks(store)(4);
    window.pageYOffset; /* do not remove this line! browser won't scroll as it should if removed */
    removeWeeks(store)('top');
  }
};

export const scrollToToday = () => () => {
  const scrollTo = window.app.todayDOM.getBoundingClientRect().top - window.innerHeight / 2 + window.pageYOffset + dayHeight / 2;
  window.scroll(0, scrollTo);
};

export const onClick = store => () => {
  store.showUserDropdown = false;
};
