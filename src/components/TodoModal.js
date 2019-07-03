import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
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

  return (
    <React.Fragment>
      <css.Overlay onClick={onOverlayClick} />
      <css.Modal>
        <css.Form>
          <css.Table>
            <css.TitleCell>{renderTitle()}</css.TitleCell>
            <css.Cell>
              <css.SVG dangerouslySetInnerHTML={{ __html: trashSvg }} />
            </css.Cell>
          </css.Table>
        </css.Form>
        <css.Bottom>
          <Button active svg={checkSvg} title="Done" colorIdx={colorIdx} />
          <Button active={todo.title !== title} title="Save" float="right" colorIdx={colorIdx} />
        </css.Bottom>
      </css.Modal>
    </React.Fragment>
  );
}

TodoModal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default observer(TodoModal);
