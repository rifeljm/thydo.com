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
`;

css.TodoTr = styled.tr`
  background: rgba(0, 0, 0, 0.05);
`;

css.TodoDashTd = styled.td`
  line-height: 18px;
  padding: 2px 0 0 3px;
  vertical-align: top;
  border-radius: ${normalRadius} 0 0 ${normalRadius};
  width: 10px;
  color: ${props => (props.grey ? '#aaa' : 'inherit')};
  text-decoration: ${props => (props.done ? 'line-through' : 'inherit')};
`;

css.TodoText = styled.td`
  padding: 2px;
  vertical-align: top;
  border-radius: 0 ${normalRadius} ${normalRadius} 0;
  z-index: 5;
  white-space: pre-wrap;
  color: ${props => (props.grey ? '#aaa' : 'inherit')};
  line-height: 18px;
  text-decoration: ${props => (props.done ? 'line-through' : 'inherit')};
  cursor: pointer;
`;

css.TodoInputCell = styled(css.TodoText)`
  padding: 0 4px 0 3px;
  padding-bottom: 1px;
`;

css.TodoTextarea = styled.textarea`
  border: 0;
  outline: none;
  background: rgba(0, 0, 0, 0.005);
  font-size: 14px;
  font-weight: 400;
  width: 100%;
  line-height: 18px;
  vertical-align: bottom;
  padding: 2px 0 1px 2px;
  resize: none;
  margin: 0 0 0 -3px;
  color: ${penColor};
  height: 18px;
`;

css.MultipleTextarea = styled(css.TodoTextarea)`
  color: #fff;
`;

css.DecriptionIcon = styled.span`
  margin-left: 3px;
  svg {
    width: 11px;
    height: 11px;
    position: relative;
    top: 1px;
    path {
      fill: #666;
    }
  }
`;

export default css;

