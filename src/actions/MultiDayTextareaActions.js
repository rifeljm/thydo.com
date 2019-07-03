import axios from 'axios';
import { toJS } from 'mobx';
import { fromToDays } from '../common/utils.js';

exports.saveMultiDay = store => () => {
  const multiTodo = {
    from: window.app.highlightStartDay,
    to: window.app.highlightEndDay,
    title: store.multiDay[window.app.highlightStartDay].reduce((prev, todo) => {
      return todo.id === -1 ? todo.title : prev;
    }, ''),
  };
  axios.post('/api/todo', multiTodo).then(response => {
    if (response.status === 200) {
      const [min, max] = [window.app.highlightStartDay, window.app.highlightEndDay].sort();
      fromToDays(min, max).forEach(day => {
        store.multiDay[day] = toJS(store.multiDay)[day].map(event => {
          return event.id === -1 ? response.data : event;
        });
      });
      delete window.app.highlightStartDay;
      delete window.app.highlightEndDay;
      delete window.app.multiDayStart;
    }
  });
};
