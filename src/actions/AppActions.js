import { navigate } from '@reach/router';
import dayjs from 'dayjs';

import { showNewTodoInput } from './CalendarDayActions.js';

export const keyDownEvent = store => e => {
  if (e.keyCode === 27 && window.location.pathname.length > 1) {
    navigate('/');
  }
  if (e.keyCode === 27 && store.showSettingsModal) {
    store.showSettingsModal = false;
  }
  if (e.keyCode === 13 && !e.shiftKey && !store.showSettingsModal) {
    const today = dayjs().format('YYYY-MM-DD');
    showNewTodoInput(store)(e, today);
    e.preventDefault();
  }
};

export const onClick = store => () => {
  store.showUserDropdown = false;
};
