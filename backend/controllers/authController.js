const pool   = require("../config/db");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middlewares/authMiddleware");

const ADMIN_EMAIL    = "prarthanabhandari2003@gmail.com";
const ADMIN_PASSWORD = "Prv@2003";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields are required" });
    const exists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (exists.rows.length > 0) return res.status(400).json({ error: "Email already registered" });
    const role   = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "admin" : "user";
    const hashed = await bcrypt.hash(password, 12);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role, avatar",
      [name, email, hashed, role]
    );
    const user = result.rows[0];
    res.status(201).json({ ...user, token: generateToken(user.id) });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    // Admin hardcode
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      let result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      let user   = result.rows[0];
      if (!user) {
        const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
        const created = await pool.query(
          "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,'admin') RETURNING *",
          ["Prarthana", ADMIN_EMAIL, hashed]
        );
        user = created.rows[0];
      } else {
        await pool.query("UPDATE users SET role = 'admin' WHERE email = $1", [email]);
        user.role = "admin";
      }
      return res.json({ id:user.id, name:user.name, email:user.email, role:"admin", avatar:user.avatar||"", review_count:user.review_count||0, token:generateToken(user.id) });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: "Invalid email or password" });
    const user  = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid email or password" });
    res.json({ id:user.id, name:user.name, email:user.email, role:user.role, avatar:user.avatar||"", review_count:user.review_count||0, token:generateToken(user.id) });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getMe = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role, avatar, bio, review_count FROM users WHERE id = $1", [req.user.id]);
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { register, login, getMe };