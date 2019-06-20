import styled from 'styled-components';
import { rgba, setLightness } from 'polished';

const css = {};

const monthColors = [
  '#5061BF',
  '#5CAAD8',
  '#9DC65E',
  '#693E95',
  '#4A9656',
  '#DA4B7E',
  '#8F4C81',
  '#F1B55F',
  '#DF6B46',
  '#DE594B',
  '#644733',
  '#B24143',
];

function borderColor(props) {
  let color = [0, 6].indexOf(props.dayWeekIdx) > -1 ? '#ccc' : rgba(monthColors[props.colorIdx], props.isToday ? 0.6 : 0.25);
  if (props.highlight) {
    color = '#888';
  }
  return color;
}

css.Td = styled.div`
  display: table-cell;
  height: 150px;
  vertical-align: top;
  border-radius: 5px;
  border: 1px solid ${props => borderColor(props)};
  box-shadow: ${props => (props.highlight ? 'inset 0 0 0 5px #eee' : 'default')};
  position: relative;
  width: calc(100% / 7);
  cursor: pointer;
  padding: 5px;
  background-color: ${props => (props.isToday ? setLightness(0.95, monthColors[props.colorIdx]) : '#fdfdfd')};
`;

css.emptyTd = styled.div`
  display: table-cell;
  height: 150px;
`;

css.BottomRightDay = styled.div`
  position: absolute;
  bottom: -3px;
  right: 5px;
  font-size: 80px;
  color: ${props => (props.isToday ? '#fff' : rgba([0, 6].indexOf(props.dayInWeekIdx) > -1 ? '#bbb' : monthColors[props.monthIdx], 0.25))};
`;

css.DayOfWeek = styled.div`
  position: absolute;
  top: -30px;
  border: 0;
  text-align: right;
  font-size: 20px;
  right: 5px;
  color: ${props => (props.isDayOfWeekInColor ? monthColors[props.colorIdx] : '#666')};
`;

css.Month = styled.div`
  position: absolute;
  top: -123px;
  font-size: 50px;
  white-space: nowrap;
  color: #fff;
  left: -2px;
  padding: 5px 10px 5px 10px;
  background-color: ${props => setLightness(0.64, monthColors[props.colorIdx])};
  border-radius: 5px;
`;

css.TodoList = styled.div`
  font-size: 13px;
  position: relative;
  z-index: 2;
  height: 100%;
  > div + div {
    margin-top: 2px;
  }
`;

export default css;
