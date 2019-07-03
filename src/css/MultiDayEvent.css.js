import styled from 'styled-components';
import { setLightness } from 'polished';

import { monthColors } from '../common/utils.js';

const css = {};

css.multiDay = styled.div`
  background-color: ${props => setLightness(0.64, monthColors[props.colorIdx])};
  border-radius: 3px;
  color: #fff;
  padding: 0 2px 1px 5px;
  vertical-align: top;
  z-index: 5;
  white-space: pre-wrap;
  margin-bottom: 2px;
  width: 100%;
  font-size: 13px;
  margin: 1px 0;
`;

css.eventTitle = styled.div`
  padding: 2px 1px 1px 0;
  line-height: 17px;
  margin-left: -1px;
`;

export default css;
