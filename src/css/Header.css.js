import styled, { keyframes } from 'styled-components';

const css = {};

const slide = keyframes`
  0% {
    top: -55px;
  }
  100% {
    top: 0;
  }
`;

css.HeaderWrapper = styled.div`
  position: fixed;
  padding: 10px 0;
  height: 50px;
  width: 100%;
  background: #fff;
  box-shadow: 0 0 3px 0 #000;
  z-index: 6;
  line-height: 50px;
  // animation: ${slide} 0.2s linear;
  top: 0;
`;

css.Button = styled.div`
  float: right;
  border-radius: 5px;
  border: 1px solid #555;
  display: inline-block;
  line-height: 28px;
  padding: 0 10px;
  cursor: pointer;
  color: #555;
  box-shadow: 0 0 2px 0 #555;
  margin-right: 15px;
`;

css.DayDistance = styled.div`
  margin-left: 15px;
  font-size: 15px;
  display: inline-block;
  line-height: 30px;
  vertical-align: top;
`;

export default css;