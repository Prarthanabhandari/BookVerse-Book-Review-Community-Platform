const jwt  = require("jsonwebtoken");
const pool = require("../config/db");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token         = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result  = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1", [decoded.id]);
      if (result.rows.length === 0) return res.status(401).json({ error: "User not found" });
      req.user = result.rows[0];
      next();
    } catch { return res.status(401).json({ error: "Not authorized, token failed" }); }
  } else { return res.status(401).json({ error: "Not authorized, no token" }); }
};

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      const token   = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result  = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1", [decoded.id]);
      if (result.rows.length > 0) req.user = result.rows[0];
    } catch {}
  }
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  res.status(403).json({ error: "Admin access required" });
};

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

module.exports = { protect, optionalAuth, adminOnly, generateToken };