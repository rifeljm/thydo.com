import { toJS, observe } from 'mobx';
import dayjs from 'dayjs';

import { fromToDays } from '../common/utils.js';
import { addElements } from './WeeksActions.js';

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
