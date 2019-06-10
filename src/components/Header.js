import React from 'react';
import { _tr } from '../common/utils.js';
// import PropTypes from 'prop-types';
import { format, differenceInCalendarDays } from 'date-fns';

import css from '../css/Header.js';

class Header extends React.Component {
  state = {
    dayDistance: null,
  };

  componentDidMount() {
    this.props.sub(this.applyChanges.bind(this));
  }

  applyChanges({ action, day }) {
    if (action === 'enter') {
      this.setState({ dayDistance: day });
    } else {
      this.setState({ dayDistance: null });
    }
  }

  renderDayDistance() {
    const diff = differenceInCalendarDays(this.state.dayDistance, format(new Date(), 'YYYY-MM-DD'));
    let text;
    if (diff === 1) text = _tr('Tomorrow');
    if (diff === -1) text = _tr('Yesterday');
    if (diff < -1) text = `${Math.abs(diff)} ${_tr('days ago')}`;
    if (diff > 1) text = `${diff} ${_tr('days away')}`;
    return this.state.dayDistance ? text : null;
  }

  render() {
    return (
      <css.HeaderWrapper
        ref={el => {
          this.dom = el;
        }}
      >
        <css.DayDistance>{this.renderDayDistance()}</css.DayDistance>
        <css.Button onClick={this.props.todayClick}>{_tr('Today')}</css.Button>
      </css.HeaderWrapper>
    );
  }
}
export default Header;
