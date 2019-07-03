import React from 'react';
import PropTypes from 'prop-types';

import css from '../css/Button.css';

import { _tr } from '../common/utils.js';

function Button({ active, title, svg, colorIdx, float }) {
  return (
    <css.Button colorIdx={colorIdx} float={float} active={active}>
      {svg ? <css.ButtonSvg dangerouslySetInnerHTML={{ __html: svg }} /> : null}
      <css.ButtonText>{_tr(title)}</css.ButtonText>
    </css.Button>
  );
}

Button.propTypes = {
  active: PropTypes.bool,
  title: PropTypes.string.isRequired,
  svg: PropTypes.string,
  colorIdx: PropTypes.number,
  float: PropTypes.string,
};

export default Button;
