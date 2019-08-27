import * as TodoActions from '../actions/TodoActions.js';
import * as CalendarDayActions from '../actions/CalendarDayActions.js';
import * as AppActions from '../actions/AppActions.js';
import * as MultiDayTextarea from '../actions/MultiDayTextareaActions.js';
import * as TodoModalActions from '../actions/TodoModalActions.js';

const allActions = [TodoActions, CalendarDayActions, AppActions, MultiDayTextarea, TodoModalActions];

const actions = allActions.reduce((prev, curr) => {
  delete curr.default;
  return Object.assign(prev, curr);
}, {});

exports.useActions = store => {
  return Object.keys(actions).reduce((prev, key) => {
    return { ...prev, [key]: actions[key](store) };
  }, {});
};
