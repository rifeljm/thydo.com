import styled from 'styled-components';

const css = {};

const penColor = '#334955';
const normalRadius = '3px';

css.TodoTable = styled.table`
  border-collapse: separate;
  border-spacing: 0 1px;
  width: 100%;
  color: ${penColor};
  border-radius: ${normalRadius};
  // background: rgba(0, 0, 0, 0.05);
`;

css.TodoTr = styled.tr`
  background: rgba(0, 0, 0, 0.05);
`;

css.TodoDashTd = styled.td`
  padding: 2px 0 3px 3px;
  vertical-align: top;
  border-radius: ${normalRadius} 0 0 ${normalRadius};
  width: 10px;
  color: ${props => (props.grey ? '#aaa' : 'inherit')};
`;

css.TodoText = styled.td`
  // background: rgba(0, 0, 0, 0.05);
  padding: 3px;
  vertical-align: top;
  border-radius: 0 ${normalRadius} ${normalRadius} 0;
  z-index: 5;
  white-space: pre-wrap;
  color: ${props => (props.grey ? '#aaa' : 'inherit')};
  line-height: 15px;
`;

css.TodoInputCell = styled(css.TodoText)`
  padding: 0 4px 0 3px;
  padding-bottom: 1px;
`;

css.TodoTextarea = styled.textarea`
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