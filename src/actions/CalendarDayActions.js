import axios from 'axios';
import { toJS } from 'mobx';
import { navigate } from '@reach/router';
import dayjs from 'dayjs';

/**
 * find editing todo in the store and cancel it
 */
export const cancelTodo = store => () => {
  Object.keys(toJS(store.todos)).forEach(day => {
    const dayTodos = toJS(store.todos)[day] || [];
    if (dayTodos.map(todo => todo.id).indexOf(-1) > -1) {
      store.todos[day] = dayTodos.filter(todo => todo.id !== -1);
    }
  });
};

export const showNewTodoInput = store => (evt, day) => {
  const todoInput = document.querySelector('.todo-input');
  if (todoInput) {
    if (todoInput.value !== '') {
      /* if we're editing another todo and there's already some text in it, cancel! */
      todoInput.focus();
      if (evt) {
        return evt.preventDefault();
      }
    } else {
      cancelTodo(store)();
    }
  }
  const todos = toJS(store.todos[day]) || [];
  const todoExists = todos.map(todo => todo.id).indexOf(-1) > -1;
  if ((!evt || evt.clientY > 50 || evt.keyCode === 13) && !todoExists) {
    if (store.todos[day]) {
      store.todos[day] = toJS(store.todos[day]).concat({ id: -1 });
    } else {
      store.todos[day] = [{ id: -1 }];
    }
  }
};

exports.handleOnSort = store => (evt, day, dom) => {
  const isSource = evt.from === dom; /* is this the list we took the element from? */
  const sortable = {
    count: evt.from.childElementCount,
    isSource,
    newIndex: evt.newIndex,
    oldIndex: evt.oldIndex,
    day,
  };
  /* put elements back in DOM first */
  if (isSource) {
    /* append child only if it was removed from list (sort on the same list doesn't remove it) */
    if ([...evt.from.children].indexOf(evt.item) === -1) {
      evt.item.style.display = 'none';
      evt.from.appendChild(evt.item);
    }
  } else {
    /* remove added child on target list */
    evt.item.remove();
  }

  let todos, item, source, target;
  let request = {};
  todos = toJS(store.todos[day]);
  if (window.app.tempSortable) {
    [source, target] = [window.app.tempSortable, sortable].sort(a => (a.isSource ? -1 : 1));

    const todosSource = toJS(store.todos)[source.day];
    item = { ...todosSource[source.oldIndex] };
    todosSource.splice(source.oldIndex, 1);
    store.todos[source.day] = todosSource;
    request.days = [{ day: source.day, todoIds: todosSource.map(todo => todo.id) }];

    const todosTarget = toJS(store.todos)[target.day] || [];
    todosTarget.splice(target.newIndex, 0, item);
    store.todos[target.day] = todosTarget;
    request.days.push({ day: target.day, todoIds: todosTarget.map(todo => todo.id) });

    delete window.app.tempSortable;
  }

  /* SORT ON THE SAME LIST (todos length in state is the same as "this sortable" element count */
  if (sortable.isSource && todos.length === sortable.count) {
    item = todos[sortable.oldIndex];
    todos.splice(sortable.oldIndex, 1);
    todos.splice(sortable.newIndex, 0, item);
    store.todos[day] = todos;
    request.days = { day, todoIds: todos.map(todo => todo.id) };
  } else if (!request.days) {
    window.app.tempSortable = sortable;
  }
  if (request.days) {
    axios.put('/api/sort-day', request).then(() => {
      /* TODO: implement server error and cancel sort */
    });
  }
};

exports.showMultiDayInput = store => day => {
  const [startDay, endDay] = [day, window.app.highlightStartDay].sort();
  const diff = dayjs(endDay).diff(dayjs(startDay), 'day');
  [...Array(diff + 1).keys()]
    .map(idx =>
      dayjs(startDay)
        .add(idx, 'day')
        .format('YYYY-MM-DD')
    )
    .forEach(day => {
      let multiDayArray = store.multiDay[day] || [];
      multiDayArray.splice(0, 0, { id: -1, t: '' });
      store.multiDay[day] = multiDayArray;
    });
  window.app.multiDayStart = startDay;
};

export const keyDownEvent = store => e => {
  if (e.keyCode === 27 && window.location.pathname.length > 1) {
    navigate('/');
  }
  if (e.keyCode === 27 && store.showSettingsModal) {
    store.showSettingsModal = false;
  }
  if (e.keyCode === 13 && !e.shiftKey && !store.showSettingsModal) {
    const today = dayjs().format('YYYY-MM-DD');
    showNewTodoInput(store)(e, today);
    e.preventDefault();
  }
};

export const onDragOverEvent = store => (e, day) => {
  e.preventDefault();
  if (day !== store.draggedDay && !store.highlightObjects[day] && store.draggedEvent) {
    store.highlightObjects[day] = true;
  }
};

export const onDragLeaveEvent = store => (e, day) => {
  if (store.highlightObjects[day]) {
    delete store.highlightObjects[day];
  }
};

export const onDropEvent = store => (e, targetDay) => {
  /* time event only! (because drop event on this day cell fires on todos too) */
  if (store.draggedEvent && toJS(store.draggedDay) !== targetDay) {
    const id = store.draggedEvent;
    if (!toJS(store.timeEvents)[targetDay]) {
      store.timeEvents[targetDay] = {};
    }
    let todo = { ...store.timeEvents[store.draggedDay][id], y: targetDay };
    store.timeEvents[targetDay][id] = todo;
    delete store.timeEvents[store.draggedDay][id];
    delete store.draggedEvent;
    delete store.draggedDay;
    delete store.highlightObjects[targetDay];
    axios.put('/api/todo', { id, todo, moved: true });
  }
};

export const onDragStartEvent = store => (e, day) => {
  store.draggedDay = day;
};
