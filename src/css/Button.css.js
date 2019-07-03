import styled from 'styled-components';
import { setLightness } from 'polished';
import { monthColors } from '../common/utils.js';

const css = {};

function bgColor(colorIdx, active) {
  if (!colorIdx) return 'initial';
  return active ? setLightness(0.64, monthColors[colorIdx]) : '#eee';
}

function hoverColor(colorIdx, active) {
  if (!colorIdx) return 'initial';
  return active ? setLightness(0.68, monthColors[colorIdx]) : '#eee';
}

css.Button = styled.div`
  text-align: center;
  min-width: 100px;
  margin: 0 15px;
  float: ${props => (props.float ? props.float : 'initial')};
  display: inline-block;
  background-color: ${props => bgColor(props.colorIdx, props.active)};
  color: ${props => (props.active ? '#fff' : '#333')};
  svg {
    display: inline-block;
  }
  border-radius: 5px;
  padding: 0 10px;
  cursor: pointer;
  &:hover {
    background-color: ${props => (props.active ? hoverColor(props.colorIdx, props.active) : '#eee')};
  }
`;

css.ButtonText = styled.div`
  line-height: 32px;
  display: inline-block;
`;

css.ButtonSvg = styled.div`
  display: inline-block;
  vertical-align: middle;
  line-height: 16px;
  svg {
    width: 16px;
    height: 16px;
    path {
      fill: #fff;
    }
    margin-right: 5px;
  }
`;

export default css;
