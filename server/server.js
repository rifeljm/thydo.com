const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const google = require('./googleSSO.js');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { randomString, indexHTML } = require('./helpers.js');

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

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
    // console.log('USERINFO: ==========>', userInfo);
    const createUser = await api.sso(userInfo);
  }
  if (!req.cookies.thydo_user) {
    res.cookie('thydo_user', randomString(16), { maxAge: 365 * 24 * 60 * 60, httpOnly: true });
  }
  res.send(indexHTML());
});

app.post('/api/todo', api.authenticateMiddleware, api.postTodo);
app.put('/api/sort-day', api.authenticateMiddleware, api.putSortDay);
app.get('/api/todos', api.authenticateMiddleware, api.getTodos);

const auth = google.createConnection();
const url = google.getConnectionUrl(auth);
const googleSsoUrl = url;

// console.log('------------------------->', url);
