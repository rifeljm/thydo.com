import { toJS } from 'mobx';
import dayjs from 'dayjs';

const isSafari =
  /constructor/i.test(window.HTMLElement) ||
  (function(p) {
    return p.toString() === '[object SafariRemoteNotification]';
  })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

export const onWheel = () => e => {
  if (isSafari && window.app.preventWheel) {
    e.preventDefault();
  }
  return true;
};

export const onScrollEvent = store => () => {
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

function scrollUp(store) {
  window.app.scrollDirection = 'up';
  window.app.preventWheel = true;
  window.app.scrollHeight = document.body.scrollHeight;
  window.app.yOffset = window.pageYOffset;
  addWeeks(store)(-4);
  removeWeeks(store)('bottom');
}

export const removeWeeks = store => where => {
  if (where === 'bottom') {
    store.dates.splice(store.visibleWeeks * 7);
  }
  if (where === 'top') {
    store.dates.splice(0, store.dates.length - store.visibleWeeks * 7);
  }
};

export const addElements = (weekCount, day) => {
  if (weekCount < 0) {
    day = dayjs(day).add(weekCount * 7, 'day');
  }
  return [...Array(Math.abs(weekCount) * 7).keys()].map(idx =>
    dayjs(day)
      .add(idx, 'days')
      .format('YYYY-MM-DD')
  );
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

const getMondayFromDates = (weekCount, dates) => {
  const firstDay = dates[0];
  const lastDay = dates[dates.length - 1];
  return weekCount > 0 ? dayjs(lastDay).add(1, 'day') : firstDay;
};
