/* React SSR (after we merge docker containers - webpack and server) */
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
  if (req.query && req.query.code) {
    const userInfo = await google.getGoogleAccountFromCode(req.query.code);
    await api.sso(userInfo);
  }
  let todos = {};
  if (!req.cookies.thydo_user) {
    /* cookie expires after 10 years */
    res.cookie('thydo_user', randomString(16), { maxAge: 10 * 365 * 24 * 60 * 60 * 1000, httpOnly: true });
  } else {
    let schemaExistsForCookie = await api.schemaExists(req.cookies.thydo_user);
    if (schemaExistsForCookie) {
      todos = await api._getAllEvents(req, res);
    }
  }
  let indexHtml = req.headers.host.indexOf('thydo.com') > -1 ? productionIndexHtml : indexHTML(JSON.stringify(todos));
  indexHtml = indexHtml.replace('<!-- json -->', `<script type="application/json" id="todos_data">${JSON.stringify(todos)}</script>`);
  res.send(indexHtml);
});

app.post('/api/todo', api.authenticateMiddleware, api.postTodo);
app.put('/api/sort-day', api.authenticateMiddleware, api.putSortDay);

const auth = google.createConnection();
const url = google.getConnectionUrl(auth);
const googleSsoUrl = url;

(async () => {
  await api.createTables();
  console.log('Tables created...');
})();
