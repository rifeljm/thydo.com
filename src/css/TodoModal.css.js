import styled from 'styled-components';

const css = {};

css.Modal = styled.div`
  position: fixed;
  width: 600px;
  background: #fff;
  box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  z-index: 6;
  top: 50%;
  left: 50%;
  margin-top: ${props => (props.modalHeight ? `${-(props.modalHeight / 2)}px` : '-100px')};
  margin-left: -300px;
  color: #555;
  min-height: 200px;
  max-height: ${() => `${window.innerHeight - 30}px`};
`;

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

css.Overlay = styled.div`
  background: rgba(0, 0, 0, 0.15);
  width: 100%;
  height: 100%;
  z-index: 5;
  position: fixed;
  top: 0;
  left: 0;
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

css.Bottom = styled.div`
  bottom: 15px;
  width: 100%;
  position: absolute;
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
