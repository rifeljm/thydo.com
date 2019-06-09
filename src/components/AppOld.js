import { hot } from 'react-hot-loader/root';
import React from 'react';
import { addDays, format } from 'date-fns';
import axios from 'axios';
import { Store } from './Store.js';
import CalendarDay from './CalendarDay.js';
import Header from './Header.js';
import { dayNumbersToObjects } from '../common/utils.js';

import css from '../css/App.css';

history.scrollRestoration = 'manual';

const dayHeight = 156;

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

  componentWillMount() {
    const today = new Date();
    const dayInWeek = today.getDay();
    const daysSinceMonday = (dayInWeek + 6) % 7;
    const monday = new Date(today.setDate(today.getDate() - daysSinceMonday));
    this.state.endDay = this.state.startDay = monday;
    const weeks = Math.round(window.innerHeight / 334);
    this.addWeeks(weeks + 3);
    this.addWeeks(-weeks - 2);
    this.cutWeeksCountTo = this.state.dates.length;
  }

  componentDidMount() {
    this.todos = JSON.parse(document.getElementById('todos_data').innerHTML);
    Object.keys(this.todos).forEach(day => {
      this.todos[day].forEach(todo => {
        if (this.pubSubDays[day]) {
          this.createTodo({ ...todo, day });
        }
      });
    });
    if (this.headerRef) {
      this.headerRef.current.dom.style.top = 0;
    }
    this.onScroll = this.onScrollEvent.bind(this);
    this.scrollToToday(true);
    const ws = new WebSocket('ws://thydo.com');
    ws.onopen = () => {
      ws.send('Message to send');
    };
    ws.onmessage = function(evt) {
      // console.log('Message received:', evt.data);
    };
  }

  createTodo(obj) {
    this.pubSubDays[obj.day](obj);
  }

  subscribeDay(day, cb) {
    this.pubSubDays[day] = cb;
  }

  onScrollEvent(evt) {
    this.scrollHeight = document.body.scrollHeight;
    if (window.pageYOffset / document.body.scrollHeight < 0.1) {
      const heightBefore = document.body.scrollHeight;
      const pageYOffset = window.pageYOffset;
      this.addWeeks(-4, true, () => {
        this.cutWeeks('top');
      });
      if (window.pageYOffset - pageYOffset !== document.body.scrollHeight - heightBefore) {
        window.scrollTo(0, document.body.scrollHeight - heightBefore + window.pageYOffset);
      }
    } else {
      if (window.pageYOffset / (document.body.scrollHeight - window.innerHeight) > 0.9) {
        this.addWeeks(4, true, () => {
          this.cutWeeks('bottom');
        });
      }
    }
  }

  cutWeeks(where) {
    if (where === 'bottom') {
      this.state.dates.splice(0, this.state.dates.length - this.cutWeeksCountTo);
      const firstArray = this.state.dates[0];
      this.state.startDay = new Date(`${typeof firstArray[0] === 'object' ? firstArray[0].day : firstArray[0]} 12:00`);
    }
    if (where === 'top') {
      this.state.dates.splice(this.cutWeeksCountTo);
      const lastArray = this.state.dates[this.state.dates.length - 1];
      const lastMonday = new Date(`${typeof lastArray[0] === 'object' ? lastArray[0].day : lastArray[0]} 12:00`);
      this.state.endDay = addDays(lastMonday, 7);
    }
    this.forceUpdate();
  }

  addWeeks(weeks, force, cb) {
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
      console.log(addElements, this.state.startDay, this.state.endDay);
      this.setState({
        endDay: this.state.endDay,
        startDay: this.state.startDay,
        dates,
      });
      if (cb) {
        setTimeout(() => {
          const days = addElements.flat().filter(day => {
            return typeof day === 'string';
          });
          days.forEach(day => {
            if (this.todos[day]) {
              this.todos[day].forEach(todo => {
                if (this.pubSubDays[day]) {
                  this.createTodo({ ...todo, day });
                }
              });
            }
          });
          window.requestAnimationFrame(cb);
        }, 0);
      }
    } else {
      /* on componentDidMount */
      weeks > 0 ? this.state.dates.push.apply(this.state.dates, addElements) : this.state.dates.unshift.apply(this.state.dates, addElements);
    }
  }

  scrollToToday(initial) {
    const middle = window.innerHeight / 2;
    const scrollTo = this.todaysDOM.getBoundingClientRect().top - window.innerHeight / 2 + window.pageYOffset + dayHeight / 2;
    if (initial) {
      window.scroll(0, scrollTo);
      window.addEventListener('scroll', this.onScroll);
    }
  }

  jumpToToday() {
    console.log(this.state.dates);
  }

  setTodaysDOM(domElement) {
    this.todaysDOM = domElement;
  }

  todayClick() {
    this.jumpToToday();
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
      let trKey;
      if (week[0].length > 1) trKey = week[0];
      if (week[6].length > 1) trKey = week[6];
      if (typeof week[0] === 'object') {
        trKey = `${week[0].day}_empty`;
      }
      // console.log('.....', trKey);
      return <css.Tr key={trKey}>{days}</css.Tr>;
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
