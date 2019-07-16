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
  padding: 0;
  height: 51px;
  width: 100%;
  background: #fff;
  box-shadow: 0 0 3px 0 #000;
  z-index: 4;
  // animation: ${slide} 0.2s linear;
  top: 0;
`;

css.ButtonToday = styled.a`
  margin-top: 10px;
  border-radius: 5px;
  display: inline-block;
  padding: 5px 10px;
  height: 32px;
  cursor: pointer;
  color: #555;
  margin-right: 15px;
  white-space: nowrap;
  vertical-align: top;
  background: #eaeaea;
  line-height: 22px;
`;

css.ButtonGoogle = styled(css.ButtonToday)`
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
  float: right;
`;

css.googleSsoText = styled.div`
  margin: 0 5px;
  display: inline-block;
  vertical-align: top;
`;

css.GoogleAvatar = styled.img`
  position: relative;
  top: 4px;
  height: 42px;
  margin-right: 22px;
  border-radius: 50%;
  cursor: pointer;
`;

css.GoogleNameEmail = styled.div`
  background: #eaeaea;
  border-radius: 5px;
  cursor: pointer;
  display: inline-block;
  left: 60px;
  line-height: 16px;
  margin-right: 12px;
  margin-top: 6px;
  padding: 2px 60px 4px 10px;
  position: relative;
  text-align: right;
  vertical-align: top;
`;

css.GoogleName = styled.div`
  font-size: 14px;
  color: #444;
  display: inline-block;
`;

css.GoogleEmail = styled.div`
  font-size: 13px;
  color: #666;
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
