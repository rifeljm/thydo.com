import styled from 'styled-components';

import common from './common.css';

const css = {};

css.Modal = common.ModalWrapper;

css.SettingsModal = styled(common.Modal)`
  width: 600px;
`;

css.Overlay = common.Overlay;

css.ModalTitle = styled.div`
  font-size: 18px;
  margin-bottom: 15px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
`;

css.Table = styled.div`
  display: table;
`;
css.Row = styled.div`
  display: table-row;
  > div + div {
    padding-left: 10px;
  }
`;
css.Cell = styled.div`
  display: table-cell;
  position: relative;
  padding: 0 0 15px 0;
`;

css.Select = styled.select`
  outline: none;
  font-family: sans-serif;
  font-size: 14px;
  color: #555;
`;

css.Radio = styled.label`
  margin-right: 25px;
`;

css.Content = styled.div`
  padding: 15px;
`;

css.ModalActions = common.ModalActions;

export default css;
