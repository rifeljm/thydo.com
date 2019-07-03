import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import CalendarDay from './CalendarDay.js';
import { toJS } from 'mobx';

import css from '../css/Weeks.css';

function renderDays(week) {
  return week.map(day => {
    return <CalendarDay key={day} day={day} />;
  });
}

const Weeks = ({ dates }) => {
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
};

Weeks.propTypes = {
  dates: PropTypes.array.isRequired,
};

export default observer(Weeks);
