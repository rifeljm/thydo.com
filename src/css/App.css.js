import { createGlobalStyle } from 'styled-components';

const css = {};

const fontFamily = `'Roboto', sans-serif`;

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

  [type="radio"]:checked,
  [type="radio"]:not(:checked) {
      position: absolute;
      left: -9999px;
  }
  [type="radio"]:checked + label,
  [type="radio"]:not(:checked) + label
  {
      position: relative;
      padding-left: 24px;
      cursor: pointer;
      line-height: 20px;
      display: inline-block;
      color: #666;
  }
  [type="radio"]:checked + label:before,
  [type="radio"]:not(:checked) + label:before {
      content: '';
      position: absolute;
      left: 0;
      top: 1px;
      width: 16px;
      height: 16px;
      border: 1px solid #ccc;
      border-radius: 100%;
      background: #fff;
  }
  [type="radio"]:checked + label:after,
  [type="radio"]:not(:checked) + label:after {
      content: '';
      width: 10px;
      height: 10px;
      background: #777;
      position: absolute;
      top: 5px;
      left: 4px;
      border-radius: 100%;
      -webkit-transition: all 0.2s ease;
      transition: all 0.2s ease;
  }
  [type="radio"]:not(:checked) + label:after {
      opacity: 0;
      -webkit-transform: scale(0);
      transform: scale(0);
  }
  [type="radio"]:checked + label:after {
      opacity: 1;
      -webkit-transform: scale(1);
      transform: scale(1);
  }
`;

export default css;
