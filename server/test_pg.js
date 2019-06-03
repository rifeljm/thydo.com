const { Pool, Client } = require('pg');

// pools will use environment variables
// for connection information
const pool = new Pool();

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res);
//   pool.end();
// });
(async () => {
  const res = await pool.query('CREATE DATABASE bebo');
  console.log('RESPONSE:', res);
  await pool.end();
})();
