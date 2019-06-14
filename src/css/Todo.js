import styled from 'styled-components';
import { rgba, lighten } from 'polished';

const css = {};

const penColor = '#114466';
const normalRadius = '3px';

css.Todo = styled.div`
  display: table;
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.05);
  color: ${penColor};
  border-radius: ${normalRadius};
`;

css.TodoDash = styled.div`
  padding: 2px 0 3px 3px;
  display: table-cell;
  vertical-align: top;
  border-radius: ${normalRadius} 0 0 ${normalRadius};
  width: 10px;
  // color: ${props => (props.grey ? '#aaa' : penColor)};
`;

css.TodoText = styled.div`
  padding: 3px;
  display: table-cell;
  vertical-align: top;
  border-radius: 0 ${normalRadius} ${normalRadius} 0;
  z-index: 5;
  white-space: pre-wrap;
  // color: ${props => (props.grey ? '#aaa' : penColor)};
  line-height: 15px;
`;

css.TodoInputCell = styled(css.TodoText)`
  padding: 0 4px 0 3px;
  padding-bottom: 1px;
`;

css.TodoInput = styled.textarea`
  border: 0;
  outline: none;
  background: rgba(0, 0, 0, 0.005);
  font-size: 13px;
  font-weight: 400;
  width: 100%;
  line-height: 15px;
  vertical-align: bottom;
  padding: 3px 4px 1px 3px;
  resize: none;
  margin: 0 0 0 -3px;
  color: ${penColor};
  height: 15px;
`;

export default css;
