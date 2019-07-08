import React from 'react';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import autosize from 'autosize';

import { trashSvg, checkSvg } from '../common/utils.js';
import { useStore } from './Store.js';
import Button from './Button.js';

import css from '../css/TodoModal.css';

function TodoModal({ id }) {
  const { actions } = useStore();
  const textareaRef = React.useRef();
  const todo = actions.getTodoData(id);
  let [title, changeTitle] = React.useState(todo.title);
  const colorIdx = parseInt(todo.day.substring(5, 7), 10) - 1;

  React.useEffect(() => {
    autosize(textareaRef.current);
  }, []);

  function onOverlayClick() {
    navigate('/');
  }

  function renderTitle() {
    return (
      <css.TitleTextarea
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        ref={textareaRef}
        onKeyDown={onKeyDown}
        onChange={e => changeTitle(e.target.value)}
        value={title}
        done={todo.f}
      />
    );
  }

  function onKeyDown(e) {
    if (e.keyCode === 27) {
      changeTitle(todo.title);
      textareaRef.current.blur();
      e.stopPropagation();
    }

    if (e.keyCode === 13) {
      e.stopPropagation();
      if (!e.shiftKey) {
        e.preventDefault();
      }
    }
  }

  const active = todo.title !== title;
  const day = todo.day;

  return (
    <React.Fragment>
      <css.Overlay onClick={onOverlayClick} />
      <css.Modal>
        <css.Form>
          <css.Table>
            <css.TitleCell>{renderTitle()}</css.TitleCell>
            <css.Cell>
              <css.SVG onClick={() => actions.deleteTodo(todo)} dangerouslySetInnerHTML={{ __html: trashSvg }} />
            </css.Cell>
          </css.Table>
        </css.Form>
        <css.Bottom>
          {!todo.to && !todo.f ? <Button active svg={checkSvg} title="Done" colorIdx={colorIdx} /> : null}
          <Button onClick={() => actions.saveModal({ id, title, day, active })} active={active} title="Save" float="right" colorIdx={colorIdx} />
        </css.Bottom>
      </css.Modal>
    </React.Fragment>
  );
}

TodoModal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};

export default TodoModal;
