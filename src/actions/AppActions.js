import { addDays, format } from 'date-fns';

const addElements = (weekCount, day) => {
  if (weekCount < 0) {
    day = addDays(day, weekCount * 7);
  }
  const newDaysArray = [...Array(Math.abs(weekCount) * 7).keys()].map(x => format(addDays(day, x), 'YYYY-MM-DD'));
  return newDaysArray.reduce((prev, day, idx) => {
    if (idx % 7 === 0) {
      prev.push([day]);
    } else {
      prev[prev.length - 1].push(day);
    }
    return prev;
  }, []);
};

function containsDates(dates, newElements) {
  return (
    dates
      .map(week => (typeof week[0] === 'string' ? week[0] : week[0].day))
      .indexOf(typeof newElements[0][0] === 'string' ? newElements[0][0] : newElements[0][0].day) > -1
  );
}

const getMondayFromDates = (weekCount, dates) => {
  const position = weekCount > 0 ? dates.length - 1 : 0;
  let monday = dates[position][0];
  let sunday = dates[position][6];
  if (typeof monday === 'string') {
    return addDays(monday, weekCount > 0 ? 7 : 0);
  } else if (typeof sunday === 'string') {
    return addDays(sunday, weekCount > 0 ? 1 : -6);
  } else {
    return addDays(monday.day, weekCount > 0 ? 7 : -7);
  }
};

exports.removeWeeks = dispatch => state => where => {
  let dates = [].concat(state.dates);
  if (where === 'bottom') {
    dates.splice(state.visibleWeeks);
  }
  if (where === 'top') {
    dates.splice(0, dates.length - state.visibleWeeks);
  }
  dispatch({ type: 'REMOVE_DATES', dates, where });
};

exports.addWeeks = dispatch => state => (weekCount, day) => {
  let startDay;
  day = getMondayFromDates(weekCount, state.dates);
  let newElements = addElements(weekCount, day || startDay);
  let dates = state.dates;
  if (weekCount > 0) {
    dates = containsDates(state.dates, newElements) ? state.dates : state.dates.concat(newElements);
  } else {
    dates = containsDates(state.dates, newElements) ? state.dates : newElements.concat(state.dates);
  }
  dispatch({ type: 'UPDATE_DATES', dates });
};

exports.initCalendar = dispatch => () => {
  let dates = [];
  const today = new Date();
  const dayInWeek = today.getDay();
  const daysSinceMonday = (dayInWeek + 6) % 7;
  const monday = new Date(today.setDate(today.getDate() - daysSinceMonday));
  const weeks = Math.round(window.innerHeight / 334);
  const newWeeks = addElements(weeks + 4, monday);
  dates = dates.concat(newWeeks);
  dates = addElements(-weeks - 3, monday).concat(dates);
  const state = {
    dates,
    visibleWeeks: dates.length,
  };
  dispatch({ type: 'INIT_CALENDAR', state });
};
