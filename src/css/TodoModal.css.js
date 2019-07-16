import styled from 'styled-components';

import common from './common.css';

const css = {};

css.Modal = common.ModalWrapper;

css.TodoModal = styled(common.Modal)`
  width: 600px;
`;

css.Overlay = common.Overlay;

css.ModalActions = common.ModalActions;

css.SVG = styled.div`
  display: inline-block;
  padding: 3px 3px 1px 3px;
  border-radius: 5px;
  svg {
    width: 25px;
    height: 25px;
    path {
      fill: #555;
    }
  }
  &:hover {
    background: #eee;
    cursor: pointer;
  }
`;

css.Footer = styled.div`
  padding: 10px;
  float: right;
`;

css.Title = styled.div`
  font-size: 18px;
  cursor: text;
`;

css.Form = styled.div`
  color: #333;
  padding: 15px;
  display: inline-block;
  width: 100%;
`;

css.TitleTextarea = styled.textarea`
  width: 100%;
  border: 0;
  outline: 0;
  font-size: 18px;
  resize: none;
  display: block;
  text-decoration: ${props => (props.done ? 'line-through' : 'inherit')};
`;

css.Table = styled.div`
  display: table;
`;

css.Cell = styled.div`
  display: table-cell;
  vertical-align: top;
`;

css.TitleCell = styled(css.Cell)`
  width: 100%;
  padding-top: 2px;
`;

css.PencilSvg = styled.span`
  svg {
    width: 16px;
    height: 16px;
    position: relative;
    margin-right: 4px;
    top: 3px;
    path {
      fill: #999;
    }
  }
`;

css.AddDescriptionText = styled.span`
  color: #777;
  font-size: 14px;
`;

css.AddDescription = styled.span`
  cursor: pointer;
  display: ${props => (props.show ? 'inline-block' : 'none')};
`;

css.DescriptionTextarea = styled.textarea`
  display: ${props => (props.show ? 'block' : 'none')};
  outline: none;
  border: 0;
  background: #f2f2f2;
  border-radius: 3px;
  padding 7px;
  width: 100%;
  resize: none;
  font-size: 14px;
  color: #333;
  max-height: 400px;
  margin-bottom: 50px;
`;

export default css;
