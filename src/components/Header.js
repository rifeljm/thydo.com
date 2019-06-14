import React from 'react';
import PropTypes from 'prop-types';

import { Store } from './Store.js';
import { _tr } from '../common/utils.js';

import css from '../css/Header.js';
function Header({ scrollToToday }) {
  const { dispatch, actions } = React.useContext(Store);
  function toToday() {
    actions.initCalendar();
    dispatch({ type: 'NAVIGATE_TO_TODAY', on: true });
  }
  return (
    <css.HeaderWrapper>
      <css.DayDistance className="header-distance" />
      <css.Button onClick={toToday}>{_tr('Today')}</css.Button>
    </css.HeaderWrapper>
  );
}

Header.propTypes = {
  scrollToToday: PropTypes.func.isRequired,
};

export default Header;
