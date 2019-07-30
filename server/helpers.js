exports.randomString = length => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

exports.indexHTML = json => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Thydo calendar</title>
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico?id=12"/>
    <script type="application/json" id="todos_data">${json}</script>
    <style>
    @font-face {
      font-family: Dosis;
      font-style: normal;
      font-weight: 500;
      src: url('../fonts/dosis-v11-latin-500-extended.woff') format('woff');
      unicode-range: 'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF';
    }
    @font-face {
      font-family: Dosis;
      font-style: normal;
      font-weight: 500;
      src: url('../fonts/dosis-v11-latin-500.woff') format('woff');
      unicode-range: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
    }
    @font-face {
      font-family: Roboto;
      font-style: normal;
      font-weight: 400;
      src: url('../fonts/roboto-v20-latin-regular-extended.woff2') format('woff2');
      unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    @font-face {
      font-family: Roboto;
      font-style: normal;
      font-weight: 400;
      src: url('../fonts/roboto-v20-latin-regular.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    </style>  
  </head>
  <body>
    <div id="main" />
    <script type="text/javascript" src="/js/vendor.js"></script>
    <script type="text/javascript" src="/js/index.js"></script>
  </body>
</html>`;
};
