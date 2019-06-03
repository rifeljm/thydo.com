import { hot } from 'react-hot-loader/root';
import React from 'react';
import { addDays, format } from 'date-fns';
import axios from 'axios';

import CalendarDay from './CalendarDay.js';
import Header from './Header.js';

import css from '../css/App.css';

history.scrollRestoration = 'manual';

const dayHeight = 156;

const dayNumbersToObjects = (number, day) => {
  return number.map(number => {
    return {
      number,
      day,
    };
  });
};

class App extends React.Component {
  state = {
    dates: [],
    startDay: null,
    endDay: null,
  };

  constructor(props) {
    super(props);
    this.headerRef = React.createRef();
    this.pubSubDays = {};
    this.registerDropped = {};
  }

  async componentWillMount() {
    const today = new Date();
    const dayInWeek = today.getDay();
    const daysSinceMonday = (dayInWeek + 6) % 7;
    const monday = new Date(today.setDate(today.getDate() - daysSinceMonday));
    this.state.endDay = this.state.startDay = monday;
    this.addWeeks(4);
    this.addWeeks(-4);
    const todosResponse = await axios.get('/api/todos');
    const todos = todosResponse.data;
    Object.keys(todos).forEach(day => {
      todos[day].forEach(todo => {
        this.createTodo({ ...todo, day });
      });
    });
  }

  componentDidMount() {
    if (this.headerRef) {
      this.headerRef.current.dom.style.top = 0;
    }
    this.onScroll = this.onScrollEvent.bind(this);
    window.addEventListener('scroll', this.onScroll);
    this.scrollToToday(true);
    const ws = new WebSocket('ws://thydo.com');
    ws.onopen = () => {
      ws.send('Message to send');
    };
    ws.onmessage = function(evt) {
      console.log('Message received:', evt.data);
    };
  }

  createTodo(obj) {
    this.pubSubDays[obj.day](obj);
  }

  subscribeDay(day, cb) {
    this.pubSubDays[day] = cb;
  }

  onScrollEvent(evt) {
    if (this.toTodayInterval) return;
    if (window.pageYOffset / document.body.scrollHeight < 0.1) {
      const heightBefore = document.body.scrollHeight;
      const pageYOffset = window.pageYOffset;
      this.addWeeks(-4, true);
      if (window.pageYOffset - pageYOffset !== document.body.scrollHeight - heightBefore) {
        window.scrollTo(0, document.body.scrollHeight - heightBefore + window.pageYOffset);
      }
    } else if (window.pageYOffset + 100 > document.body.scrollHeight - window.innerHeight) {
      this.addWeeks(4, true);
    }
  }

  addWeeks(weeks, force) {
    const startDay = weeks > 0 ? this.state.endDay : addDays(this.state.startDay, weeks * 7);
    const newDaysArray = [...Array(Math.abs(weeks) * 7).keys()].map(x => format(addDays(startDay, x), 'YYYY-MM-DD'));
    if (weeks > 0) {
      this.state.endDay = addDays(this.state.endDay, weeks * 7);
    } else {
      this.state.startDay = addDays(this.state.startDay, weeks * 7);
    }
    const addElements = newDaysArray.reduce((prev, day, idx) => {
      if (idx % 7 === 0) {
        if (new Date(day).getDay() === 1 && day.substring(8) == '01') {
          const dayNumbers = dayNumbersToObjects([...Array(7).keys()], day);
          prev.push(dayNumbers);
        }
        prev.push([day]);
      } else {
        if (day.substring(8) == '01') {
          const rightDayNumbers = [...Array(7 - (idx % 7)).keys()].map(x => x + (idx % 7));
          prev[prev.length - 1] = prev[prev.length - 1].concat(dayNumbersToObjects(rightDayNumbers, day));
          const leftDayNumbers = dayNumbersToObjects([...Array(idx % 7).keys()], day);
          prev.push(leftDayNumbers.concat(day));
        } else {
          prev[prev.length - 1].push(day);
        }
      }
      return prev;
    }, []);
    let dates;
    if (force) {
      const dates = weeks > 0 ? this.state.dates.concat(addElements) : addElements.concat(this.state.dates);
      this.setState({
        endDay: this.state.endDay,
        startDay: this.state.startDay,
        dates,
      });
    } else {
      weeks > 0 ? this.state.dates.push.apply(this.state.dates, addElements) : this.state.dates.unshift.apply(this.state.dates, addElements);
    }
  }

  scrollToToday(initial) {
    const middle = window.innerHeight / 2;
    const scrollTo = this.todaysDOM.getBoundingClientRect().top - window.innerHeight / 2 + window.pageYOffset + dayHeight / 2;
    if (initial) {
      window.scroll(0, scrollTo);
      return;
    }
    let x = 0;
    let tempScroll = window.pageYOffset;
    const step = (scrollTo - window.pageYOffset) / 50;
    this.toTodayInterval = setInterval(() => {
      x++;
      tempScroll = tempScroll + step;
      window.scroll(0, tempScroll);
      if (x >= 50) {
        clearInterval(this.toTodayInterval);
        this.toTodayInterval = null;
      }
    }, 8);
  }

  setTodaysDOM(domElement) {
    this.todaysDOM = domElement;
  }

  todayClick() {
    if (!this.toTodayInterval) {
      this.scrollToToday();
    }
  }

  headerSubscribe(cb) {
    this.headerPublish = cb;
  }

  dayAction(actionObject) {
    this.headerPublish(actionObject);
  }

  registerDroppedList(obj) {
    this.registerDroppedCallback = obj;
  }

  moveTodoToDroppedList(todo, newIndex, oldIndex) {
    this.registerDroppedCallback.cb(todo, newIndex);
    this.registerDroppedCallback = null;
  }

  renderDays() {
    return this.state.dates.map((week, idx) => {
      const days = week.map((day, idx) => {
        return (
          <CalendarDay
            subscribe={this.subscribeDay.bind(this)}
            dayAction={this.dayAction.bind(this)}
            setTodaysDOM={this.setTodaysDOM.bind(this)}
            key={typeof day === 'object' ? day.number : day}
            day={day}
            idx={idx}
            registerDroppedList={this.registerDroppedList.bind(this)}
            moveTodoToDroppedList={this.moveTodoToDroppedList.bind(this)}
          />
        );
      });
      let trIdx = idx;
      if (week[0].length > 1) trIdx = week[0];
      if (week[6].length > 1) trIdx = week[6];
      return <css.Tr key={trIdx}>{days}</css.Tr>;
    });
  }

  render() {
    return (
      <React.Fragment>
        <css.GlobalStyle />
        <Header ref={this.headerRef} sub={this.headerSubscribe.bind(this)} todayClick={this.todayClick.bind(this)} />
        <css.MainTableWrapper>
          <css.Table>{this.renderDays()}</css.Table>
        </css.MainTableWrapper>
      </React.Fragment>
    );
  }
}

export default hot(App);
