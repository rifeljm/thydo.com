const { Pool } = require('pg');

const pool = new Pool();

const api = {};

api.createTables = async () => {
  let sql = `
    CREATE TABLE IF NOT EXISTS public.users (
    id serial NOT NULL,
    email text,
    display_name text,
    avatar text,
    lang text,
    cookie text,
    tokens jsonb,
    settings jsonb,
    google_id text,
    creation_time timestamp without time zone,
    "time" timestamp without time zone default now(),
    primary key(id))`;
  await pool.query(sql);
  sql = `
    CREATE TABLE IF NOT EXISTS public.sessions (
    id serial NOT NULL,
    cookie text,
    user_id integer,
    "time" timestamp without time zone,
    primary key(id))`;
  await pool.query(sql);
};

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

api.sso = async (cookie, user) => {
  await pool.query('BEGIN');
  let sql = `
    SELECT id,
           google_id
      FROM users
     WHERE google_id = $1
  `;
  let result = await pool.query(sql, [user.googleId]);
  if (!result.rows.length) {
    sql = `
      INSERT INTO users (google_id, email, display_name, avatar, lang, tokens, cookie, creation_time)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
           RETURNING id
    `;
    result = await pool.query(sql, [user.googleId, user.email, user.displayName, user.avatar, user.lang, user.tokens, cookie]);
    if (result && result.rows && result.rows.length) {
      sql = `ALTER SCHEMA "${cookie}" RENAME TO "${user.email}"`;
      await pool.query(sql);
    }
  }
  /* at this point WE WILL HAVE user's id (userId) from google SSO */
  const userId = result.rows[0].id;
  sql = `SELECT id
           FROM sessions
          WHERE cookie = $1`;
  result = await pool.query(sql, [cookie]);
  if (result && result.rows && result.rows.length) {
    sql = `UPDATE sessions
              SET user_id = $1
            WHERE cookie = $2`;
    await pool.query(sql, [userId, cookie]);
  } else {
    sql = `INSERT INTO sessions
                       (cookie, user_id)
                VALUES ($1, $2)`;
    await api.createUserTable(cookie);
    await pool.query(sql, [cookie, userId]);
  }
  await pool.query('COMMIT;');
};

api.getSchemaForCookie = async schema => {
  let sql = `SELECT u.email,
                    u.display_name,
                    u.avatar,
                    u.lang
               FROM sessions s,
                    users u
              WHERE s.user_id = u.id
                AND s.cookie = $1`;
  const result = await pool.query(sql, [schema]);
  if (result && result.rows && result.rows.length) {
    return result.rows[0];
  }
  return null;
};

api.authenticateMiddleware = async (req, res, next) => {
  let sql;
  if (!req.cookies.thydo_user) {
    /* in 90% of the cases, this will happen only when user manually deletes the cookie in the browser */
    return res.status(500).json({ error: 'Missing cookie.' });
  }
  const user = await api.getSchemaForCookie(req.cookies.thydo_user);
  if (user) {
    res.locals.schema = user.email;
  } else {
    sql = `SELECT id,
                    cookie,
                    user_id,
                    time
               FROM sessions
              WHERE cookie = $1`;
    const result = await pool.query(sql, [req.cookies.thydo_user]);
    if (result.rows && result.rows.length === 0) {
      /* if we have no session yet, this also means we have to create data table for this user */
      if (req.method === 'POST') {
        await pool.query('BEGIN');
        sql = `INSERT INTO sessions (cookie, time)
                    VALUES ($1, NOW())`;
        await pool.query(sql, [req.cookies.thydo_user]);
        await api.createUserTable(req.cookies.thydo_user);
      }
      if (req.method === 'GET') {
        res.send({});
        return;
      }
    }
    res.locals.schema = req.cookies.thydo_user;
  }
  next();
};

api.postTodo = async (req, res) => {
  const schema = res.locals.schema;
  const day = req.body.day;
  const newTodo = { ...req.body };
  delete newTodo.day;
  let sql, rows, response;
  sql = 'BEGIN;';
  await pool.query(sql);
  sql = `INSERT INTO "${schema}".todos (todo, time)
              VALUES ($1, NOW())
           RETURNING id`;
  const newTodoResult = await pool.query(sql, [newTodo]);
  let insertId = newTodoResult && newTodoResult.rows && newTodoResult.rows.length && newTodoResult.rows[0].id;
  if (day && newTodoResult.rows && newTodoResult.rows.length) {
    sql = `SELECT todos
             FROM "${schema}".todo_ids
            WHERE day = $1
              AND trash IS NULL`;
    const todosSortResult = await pool.query(sql, [day]);
    rows = todosSortResult.rows;
    if (rows && !rows.length) {
      sql = `INSERT INTO "${schema}".todo_ids (day, todos)
                  VALUES ($1, $2)`;
      await pool.query(sql, [day, [insertId]]);
    } else {
      sql = `UPDATE "${schema}".todo_ids
                SET todos = $1
              WHERE day = $2
                AND trash IS NULL`;
      await pool.query(sql, [rows[0].todos.concat(insertId), day]);
    }
  }
  if (insertId) {
    sql = `SELECT id,
                  todo
             FROM "${schema}".todos
            WHERE id = $1`;
    const insertedTodoResult = await pool.query(sql, [insertId]);
    if (insertedTodoResult.rows && insertedTodoResult.rows.length) {
      response = {
        ...insertedTodoResult.rows[0].todo,
        id: insertedTodoResult.rows[0].id,
      };
    }
    await pool.query('COMMIT;');
  } else {
    await pool.query('ROLLBACK;');
  }
  if (response) {
    res.send(response);
  } else {
    return res.status(500).json({ error: 'Error saving todo.' });
  }
};

api._getAllEvents = async schema => {
  const responseObject = await api._getTodos(schema);
  const multiDayArray = await api._getMultipleDayEvents(schema);
  responseObject.multiDay = multiDayArray;
  return responseObject;
};

api._getTodos = async schema => {
  let sql;
  let todosResult = {};
  sql = `
    SELECT t.id,
           t.todo,
           substring(t.time::text, 1, 16) AS time,
           ti.day
      FROM "${schema}".todos t,
           (SELECT day,
                   unnest(todos) AS tid
              FROM "${schema}".todo_ids
             WHERE trash IS NULL
          ORDER BY day) ti
     WHERE ti.tid = t.id
       AND t.trash IS NULL
  `;
  try {
    todosResult = await pool.query(sql);
  } catch (e) {
    console.log(`Probably session tables don't exist yet:`, e.message);
    return {};
  }
  let todosResponse = {};
  if (todosResult.rows && todosResult.rows.length) {
    todosResult.rows.forEach(row => {
      const day = row.day;
      if (!todosResponse[day]) todosResponse[day] = [];
      const obj = row.todo;
      delete obj.day;
      obj.id = row.id;
      obj.c = row.time.replace(/:|-| /g, ''); /* creation time */
      todosResponse[day].push(obj);
    });
  }
  return todosResponse;
};

api._getMultipleDayEvents = async schema => {
  let sql = `
    SELECT id,
           todo
      FROM "${schema}".todos
     WHERE todo->>'to' IS NOT NULL
       AND trash IS NULL
  `;
  const result = await pool.query(sql);
  if (result && result.rows && result.rows.length) {
    return result.rows.map(row => {
      return { ...row.todo, id: row.id };
    });
  }
  return [];
};

api.putSortDay = async (req, res) => {
  const schema = res.locals.schema;
  const actions = Array.isArray(req.body.days) ? req.body.days : [req.body.days];
  let sql = 'BEGIN;';
  await pool.query(sql);
  /* first put existing sorts in trash */
  for (let i = 0; i < actions.length; i++) {
    sql = `UPDATE "${schema}".todo_ids
              SET trash = true
            WHERE day = $1`;
    await pool.query(sql, [actions[i].day]);
    sql = `INSERT INTO "${schema}".todo_ids (day, todos)
                VALUES ($1, $2)`;
    await pool.query(sql, [actions[i].day, actions[i].todoIds]);
  }
  sql = 'COMMIT;';
  await pool.query(sql);
  res.send(req.body.days);
};

api.deleteTodo = async (req, res) => {
  const schema = res.locals.schema;
  const { day, id, multi } = req.body;
  let sql = 'BEGIN;';
  await pool.query(sql);
  if (!multi) {
    sql = `SELECT id,
                  todos
             FROM "${schema}".todo_ids
            WHERE day = $1
              AND trash IS NULL`;
    const result = await pool.query(sql, [day]);
    if (result && Array.isArray(result.rows) && result.rows.length) {
      const row = result.rows[0];
      const newTodos = row.todos.filter(todoId => id !== todoId);
      if (newTodos.length) {
        sql = `UPDATE "${schema}".todo_ids
                  SET trash = $1
                WHERE id = $2`;
        await pool.query(sql, [true, row.id]);
        sql = `INSERT INTO "${schema}".todo_ids
                           (day, todos)
                    VALUES ($1, $2)`;
        await pool.query(sql, [day, newTodos]);
      }
    }
  }
  sql = `UPDATE "${schema}".todos
            SET trash = $1
            WHERE id = $2`;
  await pool.query(sql, [true, id]);
  sql = 'COMMIT;';
  await pool.query(sql);
  res.send(req.body);
};

api.schemaExists = async cookie => {
  let sql = `
    SELECT schema_name
      FROM information_schema.schemata
     WHERE schema_name = $1`;
  const result = await pool.query(sql, [cookie]);
  if (result && result.rows && result.rows.length) {
    return true;
  }
  return false;
};

api.putTodo = async (req, res) => {
  await pool.query('BEGIN');
  const schema = res.locals.schema;
  let sql = `
    SELECT todo
      FROM "${schema}".todos
     WHERE id = $1
       AND trash IS NULL`;
  let result = await pool.query(sql, [req.body.id]);
  if (result && result.rows && result.rows.length) {
    const todo = result.rows[0].todo;
    sql = `UPDATE "${schema}".todos
              SET todo = $1
            WHERE id = $2`;
    await pool.query(sql, [Object.assign(todo, req.body.todo), req.body.id]);
  }
  await pool.query('COMMIT');
  res.send(req.body);
};

module.exports = api;
