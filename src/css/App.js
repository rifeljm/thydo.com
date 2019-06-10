import styled, { createGlobalStyle } from 'styled-components';

const css = {};

const fontFamily = `'Roboto', sans-serif`;
// const fontFamily = `'Domine', sans-serif`;
// const fontFamily = `sans-serif`;
// const fontFamily = `'Lato', sans-serif`;
// const fontFamily = `'Oswald', sans-serif`;
// const fontFamily = `'Montserrat', sans-serif`;
// const fontFamily = `'Lucida Grande'`;

css.GlobalStyle = createGlobalStyle`
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

css.MainTableWrapper = styled.div`
  padding: 0 10px;
`;

css.Table = styled.div`
  margin-top: 200px;
  display: table;
  position: relative;
  width: 100%;
  border-collapse: separate;
  border-spacing: 5px;
  font-family: ${fontFamily};
  font-weight: 400;
`;

css.Tr = styled.div`
  display: table-row;
`;

export default css;
