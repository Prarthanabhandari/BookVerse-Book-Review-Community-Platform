require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
require("./config/db");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");
const authRoutes   = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth",    authRoutes);
app.use("/api/reviews", reviewRoutes);
app.get("/api/health",  (_, res) => res.json({ status: "ok" }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ BookVerse API running on http://localhost:${PORT}`));