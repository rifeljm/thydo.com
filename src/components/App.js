import { hot } from 'react-hot-loader/root';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { format } from 'date-fns';

import { useStore } from './Store.js';
import Header from './Header.js';
import Weeks from './Weeks.js';

import css from '../css/App.js';

let lastScrollTop;

const dayHeight = 156;

function App() {
  const { store, actions } = useStore();

  React.useEffect(() => {
    window.addEventListener('keydown', keyDownEvent);
    actions.initCalendar();
    const todos = JSON.parse(document.getElementById('todos_data').innerHTML);
    store.todos = todos;
    window.addEventListener('scroll', onScrollEvent);
    return () => {
      window.removeEventListener('keydown', keyDownEvent);
    };
  }, []);

  React.useEffect(() => {
    if (toJS(store.toToday)) {
      scrollToToday();
    }
  }, [toJS(store.toToday)]);

  function onScrollEvent(evt) {
    let scrolledDown = window.pageYOffset - lastScrollTop > 0;
    if (window.pageYOffset < 50 && !scrolledDown) {
      evt.preventDefault();
      const heightBefore = document.body.scrollHeight;
      const pageYOffset = window.pageYOffset;
      actions.addWeeks(-4);
      if (window.pageYOffset - pageYOffset !== document.body.scrollHeight - heightBefore) {
        window.scrollTo(0, document.body.scrollHeight - heightBefore + window.pageYOffset);
      }
      actions.removeWeeks('bottom');
    } else if (window.pageYOffset >= document.body.scrollHeight - window.innerHeight && scrolledDown) {
      actions.addWeeks(4);
      actions.removeWeeks('top');
    }
    lastScrollTop = window.pageYOffset <= 0 ? 0 : window.pageYOffset;
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
