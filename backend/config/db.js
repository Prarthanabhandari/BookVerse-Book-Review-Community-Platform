const { Pool } = require("pg");

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
});

pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected!"))
  .catch(err => console.error("❌ PostgreSQL Error:", err.message));

module.exports = pool;