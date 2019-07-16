import styled from 'styled-components';

const css = {};

css.ModalWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: 100%;
`;

css.Modal = styled.div`
  position: fixed;
  background: #fff;
  box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  z-index: 5;
  color: #555;
  min-height: 200px;
  max-height: ${() => `${window.innerHeight - 30}px`};
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

css.ModalActions = styled.div`
  bottom: 15px;
  width: 100%;
  position: absolute;
  padding: 0 15px;
`;

export default css;
