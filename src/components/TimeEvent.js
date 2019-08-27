import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { navigate } from '@reach/router';
import dayjs from 'dayjs';

import { descriptionSvg } from '../common/utils.js';

import { useStore } from './Store.js';

import css from '../css/TimeEvent.css';
import cssTodo from '../css/Todo.css';

function TimeEvent({ event, day }) {
  const { store, actions } = useStore();

  function renderDescriptionIcon() {
    return event.d ? <cssTodo.DecriptionIcon dangerouslySetInnerHTML={{ __html: descriptionSvg }} /> : null;
  }

  function onClick(e) {
    e.stopPropagation();
    if (event.id > 0) {
      navigate(`/${event.id}`);
    }
  }

  function onDragStart(e) {
    store.draggedEvent = event.id;
    actions.onDragStartEvent(e, day);
  }

  return (
    <css.timeEvent draggable onDragStart={onDragStart} onClick={onClick} key={event.id} colorIdx={dayjs(day).month()}>
      <css.eventHour colorIdx={dayjs(day).month()}>{event.h}</css.eventHour>
      <css.eventTitle>
        {event.t}
        {renderDescriptionIcon()}
      </css.eventTitle>
    </css.timeEvent>
  );
}

TimeEvent.propTypes = {
  event: PropTypes.object.isRequired,
  day: PropTypes.PropTypes.string.isRequired,
};

export default observer(TimeEvent);
