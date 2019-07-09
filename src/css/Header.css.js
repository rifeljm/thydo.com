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
  z-index: 4;
  // animation: ${slide} 0.2s linear;
  top: 0;
`;

css.Button = styled.div`
  float: right;
  border-radius: 5px;
  border: 1px solid #aaa;
  display: inline-block;
  padding: 5px 10px;
  height: 32px;
  cursor: pointer;
  color: #555;
  box-shadow: 0 0 2px 0 #aaa;
  margin-right: 15px;
  white-space: nowrap;
  vertical-align: top;
`;

css.DayDistance = styled.div`
  margin-left: 15px;
  font-size: 15px;
  display: inline-block;
  line-height: 30px;
  vertical-align: top;
`;

css.googleSsoSvg = styled.div`
  display: inline-block;
  padding-top: 1px;
`;

css.googleSsoText = styled.div`
  margin: 0 5px;
  display: inline-block;
  vertical-align: top;
`;

export default css;
