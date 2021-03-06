import styled from 'styled-components';
import { rgba } from 'polished';

import { monthColors } from '../common/utils.js';

const css = {};

css.multiDay = styled.div`
  background-color: ${props => rgba(monthColors[props.colorIdx], 0.6)};
  border-radius: 3px;
  color: #fff;
  padding: 0 2px 1px 5px;
  vertical-align: top;
  z-index: 5;
  white-space: pre-wrap;
  margin-bottom: 2px;
  width: 100%;
  font-size: 14px;
  margin: 1px 0;
`;

css.eventTitle = styled.div`
  padding: 2px 2px 1px 0;
  line-height: 18px;
  margin-left: -1px;
`;

export default css;
