import { paintCalendar } from './StoreActions.js';

export const dropdownAction = store => actionType => {
  store.showUserDropdown = false;
  if (actionType === 'logout') {
    document.cookie = 'thydo_user=; expires=-999999999';
    document.location = '/';
  }
  if (actionType === 'settings') {
    store.showSettingsModal = true;
  }
};

export const googleSsoClick = store => e => {
  e.stopPropagation();
  store.showUserDropdown = !store.showUserDropdown;
};

export const scrollToToday = store => force => {
  if (window.app.todayDOM && !force) {
    /* if we have DOM for today, just scroll */
    const scrollTo = window.app.todayDOM.getBoundingClientRect().top - window.innerHeight / 2 + window.pageYOffset + dayHeight / 2;
    window.scroll(0, scrollTo);
  } else {
    /* otherwise, build DOM around today */
    store.toToday = false;
    paintCalendar(store)();
    window.scroll(0, 0);
  }
};
