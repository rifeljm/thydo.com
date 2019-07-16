import React from 'react';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import autosize from 'autosize';

import { trashSvg, checkSvg, descriptionSvg } from '../common/utils.js';
import { useStore } from './Store.js';
import Button from './Button.js';
import { _tr } from '../common/utils.js';

import css from '../css/TodoModal.css';

function TodoModal({ id }) {
  const { actions } = useStore();
  const textareaRef = React.useRef();
  const descRef = React.useRef();
  const todo = actions.getTodoData(id);
  let [title, changeTitle] = React.useState(todo.t);
  let [description, setDescription] = React.useState(todo.d);

  React.useEffect(() => {
    autosize(textareaRef.current);
    autosize(descRef.current);
  }, []);

  if (!todo.id) {
    navigate('/');
    return null;
  }

  const colorIdx = parseInt(todo.day.substring(5, 7), 10) - 1;
  const active = todo.t !== title || (todo.d !== description && description !== '') || (todo.d && description === '');

  function onOverlayClick() {
    navigate('/');
  }

  function onTitleKeyDown(e) {
    if (e.keyCode === 27) {
      changeTitle(todo.t);
      textareaRef.current.blur();
      e.stopPropagation();
    }

    if (e.keyCode === 13) {
      e.stopPropagation();
      if (!e.shiftKey) {
        e.preventDefault();
        saveModal();
      }
    }
  }

  function onDescriptionKeydown(e) {
    if (e.keyCode === 13) {
      e.stopPropagation();
    }
  }

  function onDescriptionBlur(e) {
    if (e.target.value === '') {
      setDescription(undefined);
    }
  }

  function addDescription() {
    setDescription('');
    setTimeout(() => {
      descRef.current.focus();
    }, 0);
  }

  function saveModal() {
    actions.saveModal({ id, title, active, description });
  }

  function renderTitle() {
    return (
      <css.TitleTextarea
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        ref={textareaRef}
        onChange={e => changeTitle(e.target.value)}
        value={title}
        done={todo.f}
        onKeyDown={onTitleKeyDown}
      />
    );
  }

  function renderDescriptionTextarea() {
    return (
      <css.DescriptionTextarea
        onKeyDown={onDescriptionKeydown}
        ref={descRef}
        show={description !== undefined}
        onChange={e => setDescription(e.target.value)}
        value={description}
        onBlur={onDescriptionBlur}
      />
    );
  }

  function renderDescription() {
    return (
      <React.Fragment>
        {renderDescriptionTextarea()}
        <css.AddDescription onClick={addDescription} show={description === undefined}>
          <css.PencilSvg dangerouslySetInnerHTML={{ __html: descriptionSvg }} />
          <css.AddDescriptionText>{_tr('Add description')}</css.AddDescriptionText>
        </css.AddDescription>
      </React.Fragment>
    );
  }

  return (
    <css.Modal>
      <css.Overlay onClick={onOverlayClick} />
      <css.TodoModal>
        <css.Form>
          <css.Table>
            <css.TitleCell>{renderTitle()}</css.TitleCell>
            <css.Cell>
              <css.SVG onClick={() => actions.deleteTodo(todo)} dangerouslySetInnerHTML={{ __html: trashSvg }} />
            </css.Cell>
          </css.Table>
          {renderDescription()}
        </css.Form>
        <css.ModalActions>
          {0 && !todo.to && !todo.f ? <Button active svg={checkSvg} title="Done" colorIdx={colorIdx} /> : null}
          <Button onClick={saveModal} active={active} title="Save" float="right" colorIdx={colorIdx} />
        </css.ModalActions>
      </css.TodoModal>
    </css.Modal>
  );
}

TodoModal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};

export default TodoModal;
