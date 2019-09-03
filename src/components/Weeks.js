import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import CalendarDay from './CalendarDay.js';
import { toJS } from 'mobx';

import { useStore } from './Store.js';

import css from '../css/Weeks.css';

history.scrollRestoration = 'manual';

function renderDays(week) {
  return week.map(day => {
    return <CalendarDay key={day} day={day} />;
  });
}

let initialScrollHeight;

function Weeks({ dates }) {
  const { store, actions } = useStore();
  const initialTopDates = toJS(store.initialTopDates);

  React.useEffect(() => {
    window.addEventListener('scroll', actions.onScrollEvent);
    document.body.addEventListener('mousewheel', actions.onWheel);
    actions.addWeeks(-4); /* after we added content on top, useLayoutEffect will fix scroll position */
    store.initialTopDates = true;
  }, []);

  React.useLayoutEffect(() => {
    /* when adding dates on top of the page for the first time, manually scroll down */
    if (initialTopDates) {
      window.scroll(0, document.body.scrollHeight - initialScrollHeight);
    }
    initialScrollHeight = document.body.scrollHeight;
  }, [initialTopDates]);

  const arrayedDates = dates.reduce((prev, day, idx) => {
    if (idx % 7 === 0) {
      prev.push([day]);
    } else {
      prev[prev.length - 1].push(day);
    }
    return prev;
  }, []);

  const renderDates = arrayedDates.map(week => {
    let key;
    if (week[0].length > 1) key = week[0];
    if (week[6].length > 1) key = week[6];
    if (typeof week[0] === 'object') {
      key = `${toJS(week[0]).day}_empty`;
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
          <css.Tr key={`${key}_lastWeek`}>{renderDays(lastWeek)}</css.Tr>
          <css.Tr key={`${key}_firstWeek`}>{renderDays(firstWeek)}</css.Tr>
        </React.Fragment>
      );
    } else {
      return <css.Tr key={key}>{renderDays(week)}</css.Tr>;
    }
  });
  return (
    <css.MainTableWrapper>
      <css.WeeksTable>{renderDates}</css.WeeksTable>
    </css.MainTableWrapper>
  );
}

Weeks.propTypes = {
  dates: PropTypes.array.isRequired,
};

export default observer(Weeks);
