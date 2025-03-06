import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

dotenv.config();
console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET);
const app = express();
app.use(express.json());
app.use(cors());

// Kết nối MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err);
  } else {
    console.log("✅ Connected to MySQL Database!");
  }
});

// Đăng ký
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ error: "Email đã tồn tại!" });
        res.json({ message: "Đăng ký thành công!" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Đăng nhập
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    if (results.length === 0) return res.status(401).json({ error: "Sai email hoặc mật khẩu" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ error: "Sai email hoặc mật khẩu" });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Đăng nhập thành công!", token });
  });
});

// API lấy danh sách trip
app.get("/api/trips", (req, res) => {
  const { category } = req.query;
  console.log("Received category:", category); // 👈 Kiểm tra dữ liệu từ frontend

  let sql = "SELECT * FROM trip";
  let params = [];

  if (category && category !== "all") { // 👈 Tránh lỗi khi category là 'all'
    sql += " WHERE category = ?";
    params.push(category);
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Lỗi MySQL:", err);
      return res.status(500).json({ error: "Lỗi lấy dữ liệu từ MySQL" });
    }
    res.json(result);
  });
});

// Chạy server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server đang chạy tại http://127.0.0.1:${PORT}`));

