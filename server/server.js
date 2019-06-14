const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const google = require('./googleSSO.js');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');

const { randomString, indexHTML } = require('./helpers.js');

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(favicon(__dirname + '/favicon.ico'));

const api = require('./api.js');

const server = http.createServer(app);
server.listen(80);

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  ws.on('message', message => {
    ws.send(`Hello, you sent -> ${message}`);
  });
  ws.send(googleSsoUrl);
});

app.get('/', async (req, res) => {
  if (req.query && req.query.code) {
    const userInfo = await google.getGoogleAccountFromCode(req.query.code);
    await api.sso(userInfo);
  }
  let todos = {};
  if (!req.cookies.thydo_user) {
    res.cookie('thydo_user', randomString(16), { maxAge: 365 * 24 * 60 * 60, httpOnly: true });
  } else {
    let schemaExistsForCookie = await api.schemaExists(req.cookies.thydo_user);
    if (schemaExistsForCookie) {
      todos = await api._getTodos(req, res);
    }
  }
  res.send(indexHTML(JSON.stringify(todos)));
});

app.post('/api/todo', api.authenticateMiddleware, api.postTodo);
app.put('/api/sort-day', api.authenticateMiddleware, api.putSortDay);
app.get('/api/todos', api.authenticateMiddleware, api.getTodos);

const auth = google.createConnection();
const url = google.getConnectionUrl(auth);
const googleSsoUrl = url;

// console.log('------------------------->', url);
