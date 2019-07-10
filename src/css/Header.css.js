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

css.Button = styled.a`
  border-radius: 5px;
  border: 1px solid #aaa;
  display: inline-block;
  padding: 5px 10px;
  height: 32px;
  cursor: pointer;
  color: #555;
  box-shadow: 0 0 1px 0 #999;
  margin-right: 15px;
  white-space: nowrap;
  vertical-align: top;
`;

css.ButtonGoogle = styled(css.Button)`
  float: right;
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

css.DropdownSvg = styled.div`
  display: inline-block;
  width: 18px;
  height: 18px;
  vertical-align: middle;
`;

css.DropdownText = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
`;

css.GoogleSSO = styled.div`
  display: inline-block;
  cursor: pointer;
  float: right;
`;

css.googleSsoText = styled.div`
  margin: 0 5px;
  display: inline-block;
  vertical-align: top;
`;

css.GoogleAvatar = styled.img`
  position: relative;
  top: -3px;
  height: 38px;
  margin-right: 15px;
  border-radius: 50%;
`;

css.GoogleNameEmail = styled.div`
  text-align: right;
  display: inline-block;
  margin-right: 15px;
  vertical-align: top;
`;

css.GoogleName = styled.div`
  font-size: 14px;
  color: #444;
  display: inline-block;
`;

css.GoogleEmail = styled.div`
  font-size: 12px;
  color: #777;
`;

css.accountDropdownModal = styled.div`
  border-radius: 3px;
  background: #fff;
  box-shadow: 0 5px 7px 1px rgba(0, 0, 0, 0.14), 0 2px 10px 3px rgba(0, 0, 0, 0.12), 0 3px 5px -3px rgba(0, 0, 0, 0.2);
  position: fixed;
  display: inline-block;
  right: 5px;
  top: 47px;
  border: 1px solid #aaa;
  padding: 0;
  min-width: 120px;
  font-size: 14px;
  color: #444;
`;

css.DropdownElement = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f2f2f2;
  }
`;

export default css;
