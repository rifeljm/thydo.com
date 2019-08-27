import { toJS, observe } from 'mobx';
import axios from 'axios';
import dayjs from 'dayjs';

import { fromToDays } from '../common/utils.js';

const dayHeight = 156;

const isSafari =
  /constructor/i.test(window.HTMLElement) ||
  (function(p) {
    return p.toString() === '[object SafariRemoteNotification]';
  })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

const addElements = (weekCount, day) => {
  if (weekCount < 0) {
    day = dayjs(day).add(weekCount * 7, 'day');
  }
  return [...Array(Math.abs(weekCount) * 7).keys()].map(idx =>
    dayjs(day)
      .add(idx, 'days')
      .format('YYYY-MM-DD')
  );
};

const getMondayFromDates = (weekCount, dates) => {
  const firstDay = dates[0];
  const lastDay = dates[dates.length - 1];
  return weekCount > 0 ? dayjs(lastDay).add(1, 'day') : firstDay;
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
  const dayInWeek = dayjs(today).day();
  const daysSinceMonday = toJS(store.settings).firstDayInWeek === 'sunday' ? dayInWeek : (dayInWeek + 6) % 7;
  const monday = new Date(today.setDate(today.getDate() - daysSinceMonday));
  const weeks = Math.round(window.innerHeight / 334);
  let dates = addElements(weeks + 4, monday);
  dates.splice(0, 0, ...addElements(-weeks + 1, monday));
  store.dates.splice(0, store.dates.length, ...dates);
  observe(store.dates, () => {
    // console.log('store.dates', toJS(store.dates).length);
    if (window.pageYOffset === window.app.yOffset && window.pageYOffset < 50) {
      window.scrollTo(0, document.body.scrollHeight - window.app.scrollHeight);
    } else if (window.pageYOffset === window.app.yOffset && window.app.scrollDirection === 'down') {
      window.scrollTo(0, window.pageYOffset - (window.app.scrollHeight - document.body.scrollHeight));
    }
    delete window.app.scrollDirection;
    setTimeout(() => {
      window.app.preventWheel = false;
    }, 0);
  });

  store.visibleWeeks = Object.keys(dates).length / 7 + 4;
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
  const initTimeEvents = {};
  if (allEntries.timeEvents) {
    Object.keys(allEntries.timeEvents).forEach(eventId => {
      let event = allEntries.timeEvents[eventId];
      const day = event.y;
      if (!initTimeEvents[day]) {
        initTimeEvents[day] = {};
      }
      delete event.y;
      initTimeEvents[day][eventId] = event;
    });
    delete allEntries.timeEvents;
  }
  store.timeEvents = initTimeEvents;
  window.app.googleSSO = allEntries.googleSSO;
  delete allEntries.googleSSO;
  if (allEntries.user !== undefined) {
    window.app.user = allEntries.user;
    store.settings = allEntries.user.settings;
    dayjs.locale(allEntries.user.settings.language || 'en');
    delete allEntries.user;
  }
  store.todos = allEntries;
};

function scrollUp(store) {
  window.app.scrollDirection = 'up';
  window.app.preventWheel = true;
  window.app.scrollHeight = document.body.scrollHeight;
  window.app.yOffset = window.pageYOffset;
  addWeeks(store)(-4);
  removeWeeks(store)('bottom');
}

export const onScrollEvent = store => () => {
  // console.log('yOffset:', window.pageYOffset);
  const aboveTop = window.pageYOffset < 50;
  const belowBottom = window.pageYOffset >= document.body.scrollHeight - window.innerHeight;
  if (aboveTop) {
    scrollUp(store);
  } else if (belowBottom) {
    addWeeks(store)(4);
    window.app.scrollDirection = 'down';
    window.app.scrollHeight = document.body.scrollHeight;
    window.app.yOffset = window.pageYOffset;
    window.app.preventWheel = true;
    removeWeeks(store)('top');
  }
};

export const scrollToToday = store => force => {
  if (window.app.todayDOM && !force) {
    /* if we have DOM for today, just scroll */
    const scrollTo = window.app.todayDOM.getBoundingClientRect().top - window.innerHeight / 2 + window.pageYOffset + dayHeight / 2;
    window.scroll(0, scrollTo);
  } else {
    /* otherwise, build DOM around today */
    store.toToday = false;
    paintCalendar(store)();
    window.scroll(0, 0);
  }
};

export const onClick = store => () => {
  store.showUserDropdown = false;
};

export const saveSettings = store => settings => {
  store.settings.language = settings.language.value;
  store.settings.firstDayInWeek = settings.firstDayInWeek === 0 ? 'sunday' : 'monday';
  store.showSettingsModal = false;
  dayjs.locale(settings.language.value);
  scrollToToday(store)(true);
  axios.put('/api/settings', { settings: store.settings }).then(() => {
    /* todo: implement response actions */
  });
};

export const onWheel = store => e => {
  if (isSafari && window.app.preventWheel) {
    e.preventDefault();
  }
  return true;
};
