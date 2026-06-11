const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    })
  : new Pool({
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT,
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASS,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    });

pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected!"))
  .catch(err => console.error("❌ PostgreSQL Error:", err.message));

module.exports = pool;