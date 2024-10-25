/* React SSR (if we'll need it for optimization anytime in the future) */
// require('@babel/register')({
//   presets: ['@babel/preset-env', '@babel/preset-react'],
//   ignore: [/node_modules/],
// });
// require('babel-polyfill');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const google = require('./googleSSO.js');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const fs = require('fs');
const path = require('path');
const { randomString, indexHTML } = require('./helpers.js');

const distIndexHtml = './dist/index.html';
let productionIndexHtml = '';
if (fs.existsSync(distIndexHtml)) {
  productionIndexHtml = fs.readFileSync(distIndexHtml, 'UTF8');
}

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(favicon(__dirname + '/favicon.ico'));
app.use('/js', express.static(path.join(__dirname, 'dist/js')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.use('/css', express.static(path.join(__dirname, 'css')));

const api = require('./api.js');

const server = http.createServer(app);
const productionPort = 8081;
const serverPort = process.env.NODE_ENV === 'production' ? productionPort : 80;
server.listen(serverPort);
console.log(`Server listening on port ${serverPort}.`);

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  ws.on('message', message => {
    ws.send(`Hello, you sent -> ${message}`);
  });
  ws.send(googleSsoUrl);
});

app.get('/:id?', async (req, res) => {
  const cookie = req.cookies.thydo_user;
  if (req.query && req.query.code) {
    const userInfo = await google.getGoogleAccountFromCode(req.query.code);
    await api.sso(cookie, userInfo);
    res.redirect('/');
    return;
  }
  let data = {};
  if (!cookie) {
    /* cookie expires after 10 years */
    res.cookie('thydo_user', randomString(16), { maxAge: 10 * 365 * 24 * 60 * 60 * 1000, httpOnly: false });
  } else {
    const user = await api.getSchemaForCookie(cookie);
    let schemaExistsForCookie;
    if (!user) {
      schemaExistsForCookie = await api.schemaExists(cookie);
    }
    if (user || schemaExistsForCookie) {
      const email = user ? user.email : null;
      data = await api._getAllEvents(email || cookie);
      if (user) {
        data.user = { ...user, settings: user.settings || {} };
      }
    }
  }
  data.googleSSO = googleSsoUrl;
  let html;
  if (req.headers && req.headers.host && req.headers.host.indexOf('thydo.com') > -1 && req.headers.host.indexOf('dev.thydo.com') === -1) {
    html = productionIndexHtml;
    html = html.replace('<!-- json -->', `<script type="application/json" id="todos_data">${JSON.stringify(data)}</script>`);
  } else {
    html = indexHTML(JSON.stringify(data));
  }
  res.send(html);
});

/**
 * API calls
 */
app.post('/api/todo', api.authenticateMiddleware, api.postTodo);
app.put('/api/sort-day', api.authenticateMiddleware, api.putSortDay);
app.delete('/api/todo', api.authenticateMiddleware, api.deleteTodo);
app.put('/api/todo', api.authenticateMiddleware, api.putTodo);
app.put('/api/settings', api.authenticateMiddleware, api.putSettings);

const auth = google.createConnection();
const url = google.getConnectionUrl(auth);
const googleSsoUrl = url;

(async () => {
  await api.createTables();
  console.log('Tables created...');
})();
