import * as AppActions from '../actions/AppActions.js';
import * as WeeksActions from '../actions/WeeksActions.js';
import * as TodoActions from '../actions/TodoActions.js';
import * as CalendarDayActions from '../actions/CalendarDayActions.js';
import * as StoreActions from '../actions/StoreActions.js';
import * as MultiDayTextarea from '../actions/MultiDayTextareaActions.js';
import * as TodoModalActions from '../actions/TodoModalActions.js';
import * as HeaderActions from '../actions/HeaderActions.js';
import * as SettingsModalActions from '../actions/SettingsModalActions.js';

const allActions = [
  AppActions,
  StoreActions,
  WeeksActions,
  TodoActions,
  CalendarDayActions,
  MultiDayTextarea,
  TodoModalActions,
  HeaderActions,
  SettingsModalActions,
];

const actions = allActions.reduce((prev, curr) => {
  delete curr.default;
  return Object.assign(prev, curr);
}, {});

exports.useActions = store => {
  return Object.keys(actions).reduce((prev, key) => {
    if (actions[key].toString().indexOf('return function') > -1) {
      return { ...prev, [key]: actions[key](store) };
    }
    return { ...prev, [key]: actions[key] };
  }, {});
};
