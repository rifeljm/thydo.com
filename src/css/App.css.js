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
    @font-face {
      font-family: 'Dosis';
      font-style: normal;
      font-weight: 500;
      src: url('../fonts/dosis-v11-latin-500.eot'); /* IE9 Compat Modes */
      src: local(''),
           url('../fonts/dosis-v11-latin-500.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
           url('../fonts/dosis-v11-latin-500.woff2') format('woff2'), /* Super Modern Browsers */
           url('../fonts/dosis-v11-latin-500.woff') format('woff'), /* Modern Browsers */
           url('../fonts/dosis-v11-latin-500.ttf') format('truetype'), /* Safari, Android, iOS */
           url('../fonts/dosis-v11-latin-500.svg#Dosis') format('svg'); /* Legacy iOS */
    }
    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 400;
      src: url('../fonts/roboto-v20-latin-regular.eot'); /* IE9 Compat Modes */
      src: local('Roboto'), local('Roboto-Regular'),
           url('../fonts/roboto-v20-latin-regular.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
           url('../fonts/roboto-v20-latin-regular.woff2') format('woff2'), /* Super Modern Browsers */
           url('../fonts/roboto-v20-latin-regular.woff') format('woff'), /* Modern Browsers */
           url('../fonts/roboto-v20-latin-regular.ttf') format('truetype'), /* Safari, Android, iOS */
           url('../fonts/roboto-v20-latin-regular.svg#Roboto') format('svg'); /* Legacy iOS */
    }
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
  .bottom-right-day {
    font-family: Dosis;
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
