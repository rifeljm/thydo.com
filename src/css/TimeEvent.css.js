import styled from 'styled-components';
import { rgba } from 'polished';

import { monthColors } from '../common/utils.js';

const css = {};

css.timeEvent = styled.div`
  background-color: #f2f2f2;
  border-radius: 3px;
  color: #444;
  font-size: 14px;
  margin: 1px 0;
  margin-bottom: 2px;
  padding: 2px 2px 2px 5px;
  vertical-align: top;
  white-space: pre-wrap;
  width: 100%;
  z-index: 5;
`;

css.eventTitle = styled.div`
  display: inline;
  line-height: 18px;
  margin-left: -1px;
  padding: 2px 2px 1px 0;
`;

css.eventHour = styled.div`
  background-color: ${props => rgba(monthColors[props.colorIdx], 0.7)};
  // color: ${props => rgba(monthColors[props.colorIdx], 0.8)};
  color: #fff;
  border-radius: 2px;
  display: inline;
  padding: 1px 3px;
  position: relative;
  left: -5px;
`;

export default css;
