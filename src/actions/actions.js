import * as TodoActions from '../actions/TodoActions.js';
import * as CalendarDayActions from '../actions/CalendarDayActions.js';
import * as AppActions from '../actions/AppActions.js';

const allActions = [TodoActions, CalendarDayActions, AppActions];

const actions = allActions.reduce((prev, curr) => {
  delete curr.default;
  return Object.assign(prev, curr);
}, {});

exports.useActions = (dispatch, state) => {
  return Object.keys(actions).reduce((prev, key) => {
    const fnString = actions[key](dispatch).toString();
    if (fnString.substring(0, 16) === 'function (state)') {
      return Object.assign(prev, { [key]: actions[key](dispatch)(state) });
    }
    return Object.assign(prev, { [key]: actions[key](dispatch) });
  }, {});
};
