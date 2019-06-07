const { Pool, Client } = require('pg');

const pool = new Pool();

const { randomString } = require('./helpers.js');

const api = {};

api.createUserTable = async id => {
  let sql;
  sql = `CREATE SCHEMA "${id}";`;
  await pool.query(sql);
  sql = `CREATE TABLE "${id}".todos (id serial not null,
                                   todo jsonb,
                                   time timestamp,
                                   trash bool,
                                   first_id int,
                                   primary key(id));`;
  await pool.query(sql);
  sql = `CREATE TABLE "${id}".todo_ids(id serial not null,
                                       day text,
                                       todos int[],
                                       trash bool);`;
  await pool.query(sql);
  await pool.query('COMMIT');
  return true;
};

api.sso = async user => {
  let sql = `
    SELECT google_id
      FROM users
     WHERE google_id = $1
  `;
  const result = await pool.query(sql, [user.googleId]);
  const randomCookie = randomString();
  if (!result.rows.length) {
    sql = `
      INSERT INTO users (email, display_name, avatar, lang, tokens, cookie, creation_time)
           VALUES ($1, $2, $3, $4, $5, NOW())
           RETURNING id
    `;
    const insertedId = await pool.query(sql, [user.googleId, user.email, user.displayName, user.avatar, user.tokens, randomCookie]);
  }
  return true;
};

api.authenticateMiddleware = async (req, res, next) => {
  if (!req.cookies.thydo_user) {
    /* in 90% of the cases, this will happen only when user manually deletes the cookie in the browser */
    return res.status(500).json({ error: 'Missing cookie.' });
  }
  sql = `SELECT id,
                cookie,
                user_id,
                time
           FROM sessions
          WHERE cookie = $1`;
  const result = await pool.query(sql, [req.cookies.thydo_user]);
  /* if we have no session yet, this also means we have to create data table for this user */
  if (result.rows && result.rows.length === 0) {
    if (req.method === 'POST') {
      await pool.query('BEGIN');
      sql = `INSERT INTO sessions (cookie, time)
                  VALUES ($1, NOW())`;
      const insertSession = await pool.query(sql, [req.cookies.thydo_user]);
      await api.createUserTable(req.cookies.thydo_user);
    }
    if (req.method === 'GET') {
      res.send({});
      return;
    }
  }
  next();
};

api.postTodo = async (req, res) => {
  const cookie = req.cookies.thydo_user;
  const day = req.body.day;
  const newTodo = { ...req.body };
  delete newTodo.day;
  let sql, rows, response;
  sql = 'BEGIN;';
  await pool.query(sql);
  sql = `INSERT INTO "${cookie}".todos (todo, time)
              VALUES ($1, NOW())
           RETURNING id`;
  const newTodoResult = await pool.query(sql, [newTodo]);
  let insertId;
  if (newTodoResult.rows && newTodoResult.rows.length) {
    insertId = newTodoResult.rows[0].id;
    sql = `SELECT todos
             FROM "${cookie}".todo_ids
            WHERE day = $1
              AND trash IS NULL`;
    const todosSortResult = await pool.query(sql, [day]);
    rows = todosSortResult.rows;
    if (rows && !rows.length) {
      sql = `INSERT INTO "${cookie}".todo_ids (day, todos)
                  VALUES ($1, $2)`;
      await pool.query(sql, [day, [insertId]]);
    } else {
      sql = `UPDATE "${cookie}".todo_ids
                SET todos = $1
              WHERE day = $2
                AND trash IS NULL`;
      await pool.query(sql, [rows[0].todos.concat(insertId), day]);
    }
    sql = `SELECT id,
                  todo
             FROM "${cookie}".todos
            WHERE id = $1`;
    const insertedTodoResult = await pool.query(sql, [insertId]);
    if (insertedTodoResult.rows && insertedTodoResult.rows.length) {
      response = {
        ...insertedTodoResult.rows[0].todo,
        id: insertedTodoResult.rows[0].id,
      };
    }
  }
  sql = 'COMMIT;';
  await pool.query(sql);
  if (response) {
    res.send(response);
  } else {
    return res.status(500).json({ error: 'Error saving todo.' });
  }
};

api._getTodos = async (req, res) => {
  const cookie = req.cookies.thydo_user;
  if (!cookie) {
    return {};
  }
  let sql;
  let todosResult = {};
  sql = `
    SELECT t.id,
           t.todo,
           ti.day
      FROM "${cookie}".todos t,
           (SELECT day,
                   unnest(todos) AS tid
              FROM "${cookie}".todo_ids
             WHERE trash IS NULL
          ORDER BY day) ti
     WHERE ti.tid = t.id;
  `;
  try {
    todosResult = await pool.query(sql);
  } catch (e) {
    console.log(`Probably session tables don't exist yet:`, e.message);
    res.send({});
    return;
  }
  let todosResponse = {};
  if (todosResult.rows && todosResult.rows.length) {
    console.log(todosResult.rows);
    todosResult.rows.forEach(row => {
      const day = row.day;
      if (!todosResponse[day]) todosResponse[day] = [];
      const obj = row.todo;
      delete obj.day;
      obj.id = row.id;
      todosResponse[day].push(obj);
    });
  }
  return todosResponse;
};

api.getTodos = async (req, res) => {
  const todosResponse = await api._getTodos(req, res);
  res.send(todosResponse);
};

api.putSortDay = async (req, res) => {
  const cookie = req.cookies.thydo_user;
  const todoIds = req.body.todoIds;
  const day = req.body.day;
  let sql, result;
  sql = 'BEGIN;';
  await pool.query(sql);
  /* first put existing sorts in trash */
  sql = `UPDATE "${cookie}".todo_ids
            SET trash = true
          WHERE day = $1`;
  await pool.query(sql, [day]);
  sql = `INSERT INTO "${cookie}".todo_ids (day, todos)
              VALUES ($1, $2)`;
  result = await pool.query(sql, [day, todoIds]);
  sql = 'COMMIT;';
  await pool.query(sql);
  res.send([day, todoIds]);
};

module.exports = api;
