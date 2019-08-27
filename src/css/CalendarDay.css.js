import styled from 'styled-components';
import { rgba, setLightness } from 'polished';
import { monthColors } from '../common/utils.js';

const css = {};

function borderColor(props) {
  let color = [0, 6].indexOf(props.dayWeekIdx) > -1 ? '#ccc' : rgba(monthColors[props.colorIdx], props.isToday ? 0.6 : 0.25);
  if (props.highlight) {
    color = '#888';
  }
  return color;
}

const dayBg = props => {
  if (props.isToday) {
    return setLightness(0.95, monthColors[props.colorIdx]);
  }
  if (props.highlight) {
    return '#f4f4f4';
  }
  return '#fff';
};

css.Td = styled.div`
  display: table-cell;
  height: 150px;
  vertical-align: top;
  border-radius: 5px;
  border: 2px solid ${props => borderColor(props)};
  position: relative;
  width: calc(100% / 7);
  cursor: pointer;
  padding: 4px;
  background-color: ${props => dayBg(props)};
`;

css.emptyTd = styled.div`
  display: table-cell;
  height: 150px;
`;

css.BottomRightDay = styled.div`
  font-family: Dosis, sans-serif;
  position: absolute;
  bottom: -6px;
  right: 8px;
  font-size: 68px;
  color: ${props => (props.isToday ? '#fff' : rgba([0, 6].indexOf(props.dayInWeekIdx) > -1 ? '#bbb' : monthColors[props.monthIdx], 0.25))};
`;

css.DayOfWeek = styled.div`
  font-family: Dosis, sans-serif;
  position: absolute;
  top: -30px;
  border: 0;
  text-align: right;
  font-size: 20px;
  right: 5px;
  color: ${props => (props.isDayOfWeekInColor ? monthColors[props.colorIdx] : '#666')};
`;

css.Month = styled.div`
  font-family: Dosis, sans-serif;
  position: absolute;
  top: -115px;
  font-size: 45px;
  white-space: nowrap;
  color: #fff;
  left: -2px;
  padding: 5px 10px 5px 10px;
  background-color: ${props => rgba(monthColors[props.colorIdx], 0.7)};
  border-radius: 5px;
`;

css.TodoList = styled.div`
  font-size: 14px;
  position: inherit;
  z-index: 2;
  min-height: 50%;
  > div + div {
    margin-top: 2px;
  }
`;

export default css;
