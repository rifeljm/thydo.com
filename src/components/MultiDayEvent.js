import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { navigate } from '@reach/router';
import { getMonth } from 'date-fns';

import MultiDayTextarea from './MultiDayTextarea.js';

import css from '../css/MultiDayEvent.css';

function MultiDayEvent({ event, day }) {
  function onClick(e) {
    e.stopPropagation();
    navigate(`/${event.id}`);
  }

  let textarea;
  if (event.id === -1 && window.app.multiDayStart === day) {
    textarea = <MultiDayTextarea key={event.id} />;
  }
  return (
    <css.multiDay onClick={onClick} key={event.id} colorIdx={getMonth(day)}>
      {textarea || <css.eventTitle>{event.title || ' '}</css.eventTitle>}
    </css.multiDay>
  );
}

MultiDayEvent.propTypes = {
  event: PropTypes.object.isRequired,
  day: PropTypes.PropTypes.string.isRequired,
};

export default observer(MultiDayEvent);