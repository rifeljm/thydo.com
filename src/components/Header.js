import React from 'react';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import { format } from 'date-fns';

import { useStore } from './Store.js';
import { _tr } from '../common/utils.js';

import css from '../css/Header.css';

function Header() {
  const { store, actions } = useStore();

  function toToday() {
    const isTodayDOM = toJS(store.dates).indexOf(format(new Date(), 'YYYY-MM-DD')) > -1;
    if (isTodayDOM) {
      /* if we have DOM for today, just scroll */
      actions.scrollToToday();
    } else {
      /* otherwise, build DOM around today */
      actions.toToday();
    }
  }
  return (
    <css.HeaderWrapper>
      <css.DayDistance className="header-distance" />
      <css.Button onClick={toToday}>{_tr('Today')}</css.Button>
    </css.HeaderWrapper>
  );
}

export default Header;
