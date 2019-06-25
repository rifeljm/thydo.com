import { hot } from 'react-hot-loader/root';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { format } from 'date-fns';

import { useStore } from './Store.js';
import Header from './Header.js';
import Weeks from './Weeks.js';

import css from '../css/App.css';

const dayHeight = 156;

function App() {
  const { store, actions } = useStore();

  React.useEffect(() => {
    actions.initCalendar();
    actions.processInitData(JSON.parse(document.getElementById('todos_data').innerHTML));
    window.addEventListener('keydown', keyDownEvent);
    window.addEventListener('scroll', onScrollEvent);
  }, []);

  React.useEffect(() => {
    if (toJS(store.toToday)) {
      scrollToToday();
    }
  }, [toJS(store.toToday)]);

  function onScrollEvent() {
    if (window.pageYOffset < 50) {
      const heightBefore = document.body.scrollHeight;
      actions.addWeeks(-4);
      if (window.pageYOffset === 0) {
        window.scrollTo(0, document.body.scrollHeight - heightBefore + window.pageYOffset);
      }
      actions.removeWeeks('bottom');
    } else if (window.pageYOffset >= document.body.scrollHeight - window.innerHeight) {
      actions.addWeeks(4);
      actions.removeWeeks('top');
    }
  }

  function keyDownEvent(evt) {
    if (evt.keyCode === 13) {
      const today = format(new Date(), 'YYYY-MM-DD');
      actions.showNewTodoInput(evt, today);
      evt.preventDefault();
    }
  }

  function scrollToToday() {
    const scrollTo = window.todayDOM.getBoundingClientRect().top - window.innerHeight / 2 + window.pageYOffset + dayHeight / 2;
    window.scroll(0, scrollTo);
  }

  return (
    <React.Fragment>
      <css.GlobalStyle />
      <Header scrollToToday={scrollToToday} />
      <css.MainTableWrapper>
        <css.Weeks>
          <Weeks dates={store.dates} />
        </css.Weeks>
      </css.MainTableWrapper>
    </React.Fragment>
  );
}

export default hot(observer(App));
