import React from 'react';
import autosize from 'autosize';
import { toJS } from 'mobx';

import { useStore } from './Store.js';

import { fromToDays } from '../common/utils.js';

import css from '../css/Todo.css';

export default function MultiDayTextarea() {
  const { store, actions } = useStore();
  const textareaRef = React.useRef();

  React.useEffect(() => {
    autosize(textareaRef.current);
    textareaRef.current.focus();
  }, []);

  function updateOtherDays(evt) {
    let { value } = evt.target;
    const [min, max] = [window.app.highlightStartDay, window.app.highlightEndDay].sort();
    fromToDays(min, max).forEach(day => {
      if (Array.isArray(toJS(store.multiDay)[day]) && toJS(store.multiDay)[day].length) {
        let tempDay = toJS(store.multiDay)[day].map(event => {
          return event.id === -1 ? { ...event, t: value } : event;
        });
        store.multiDay[day] = tempDay;
      }
    });
  }

  function cancelEvent() {
    const [min, max] = [window.app.highlightStartDay, window.app.highlightEndDay].sort();
    fromToDays(min, max).forEach(day => {
      if (Array.isArray(toJS(store.multiDay)[day]) && toJS(store.multiDay)[day].length) {
        store.multiDay[day] = toJS(store.multiDay)[day].filter(event => event.id !== -1);
      }
    });
    delete window.app.highlightStartDay;
    delete window.app.highlightEndDay;
  }

  function onKeyDown(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.stopPropagation();
      e.preventDefault();
      actions.saveMultiDay();
    }
    if (e.keyCode === 27) {
      cancelEvent();
    }
  }

  function onBlur(e) {
    if (e.target.value === '') {
      cancelEvent();
    } else {
      e.target.focus();
    }
  }

  return <css.MultipleTextarea onBlur={onBlur} ref={textareaRef} onChange={updateOtherDays} onKeyDown={onKeyDown} />;
}
