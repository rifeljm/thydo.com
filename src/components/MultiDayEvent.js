import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { navigate } from '@reach/router';
import dayjs from 'dayjs';

import MultiDayTextarea from './MultiDayTextarea.js';

import css from '../css/MultiDayEvent.css';

function MultiDayEvent({ event, day }) {
  function onClick(e) {
    e.stopPropagation();
    if (event.id > 0) {
      navigate(`/${event.id}`);
    }
  }

  let textarea;
  if (event.id === -1 && window.app.multiDayStart === day) {
    textarea = <MultiDayTextarea key={event.id} />;
  }
  return (
    <css.multiDay onClick={onClick} key={event.id} colorIdx={dayjs(day).month()}>
      {textarea || <css.eventTitle>{event.t || ' '}</css.eventTitle>}
    </css.multiDay>
  );
}

MultiDayEvent.propTypes = {
  event: PropTypes.object.isRequired,
  day: PropTypes.PropTypes.string.isRequired,
};

export default observer(MultiDayEvent);
