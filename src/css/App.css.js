import { createGlobalStyle } from 'styled-components';

const css = {};

const fontFamily = 'sans-serif';
// const fontFamily = `'Lato', sans-serif`;

css.GlobalStyle = createGlobalStyle`
  * {
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
       box-sizing: border-box;
  }
  body {
    padding: 0;
    margin: 0;
    font-family: ${fontFamily};
    font-size: 15px;
    font-weight: 400;
    ::-webkit-scrollbar {
      display: none;
    }
    user-select: none;
    background: #fbfbfb;
  }
  input, textarea {
    font-family: ${fontFamily};
    font-weight: 400;
  }
  .sortable-ghost {
    background: rgba(255, 255, 255, 0);
    color: rgba(255, 255, 255, 0);
  }
`;

export default css;
