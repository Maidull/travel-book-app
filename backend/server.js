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

    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || "Guest", 
        image: user.image || null, 
      },
    });
  });
});

// API cập nhật avatar
app.post("/api/update-avatar", (req, res) => {
  const { user_id, image } = req.body;

  if (!user_id || !image) {
    return res.status(400).json({ error: "Thiếu user_id hoặc link ảnh" });
  }

  const sql = "UPDATE users SET image = ? WHERE id = ?";

  db.query(sql, [image, user_id], (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật avatar:", err);
      return res.status(500).json({ error: "Lỗi khi cập nhật avatar" });
    }

    res.json({ message: "Cập nhật avatar thành công" });
  });
});

// API lấy danh sách trip
app.get("/api/trips", (req, res) => {
  const { category, search } = req.query;

  let sql = "SELECT * FROM trip WHERE 1=1";
  const params = [];

  if (category && category !== "all") {
    sql += " AND category = ?";
    params.push(category);
  }

  if (search) {
    sql += " AND name LIKE ?";
    params.push(`%${search}%`);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách trips:", err);
      return res.status(500).json({ error: "Lỗi khi lấy danh sách trips" });
    }
    res.json(results);
  });
});

// API lấy danh sách trip theo id
app.get("/api/trip/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM trip WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("MySQL Error:", err);
      return res.status(500).json({ error: "Failed to fetch trip data" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Trip not found" });
    }
    res.json(result[0]);
  });
});

// API đặt chuyến đi
app.post("/api/book", (req, res) => {
  const { user_id, trip_id } = req.body;

  if (!user_id || !trip_id) {
      return res.status(400).json({ error: "Thiếu user_id hoặc trip_id" });
  }

  const sql = "INSERT INTO users_trip (user_id, trip_id, status) VALUES (?, ?, 'booked')";

  db.query(sql, [user_id, trip_id], (err, result) => {
      if (err) {
          console.error("Lỗi khi book trip:", err);
          return res.status(500).json({ error: "Lỗi khi book trip" });
      }
      res.json({ message: "Đặt chuyến đi thành công", booking_id: result.insertId });
  });
});

// API hủy chuyến đi
app.post("/api/cancel", (req, res) => {
  const { user_id, trip_id } = req.body;

  if (!user_id || !trip_id) {
      return res.status(400).json({ error: "Thiếu user_id hoặc trip_id" });
  }

  const sql = "UPDATE users_trip SET status = 'cancelled' WHERE user_id = ? AND trip_id = ?";

  db.query(sql, [user_id, trip_id], (err, result) => {
      if (err) {
          console.error("Lỗi khi hủy trip:", err);
          return res.status(500).json({ error: "Lỗi khi hủy trip" });
      }
      res.json({ message: "Hủy chuyến đi thành công" });
  });
});

// API lấy status danh sách các chuyến đi đã đặt
app.get("/api/book-status/:trip_id", (req, res) => {
  const { trip_id } = req.params;
  const { user_id } = req.query;

  if (!user_id || !trip_id) {
    return res.status(400).json({ error: "Thiếu user_id hoặc trip_id" });
  }

  const sql = `
    SELECT status FROM users_trip
    WHERE user_id = ? AND trip_id = ? AND status = 'booked'
  `;

  db.query(sql, [user_id, trip_id], (err, result) => {
    if (err) {
      console.error("Lỗi khi kiểm tra trạng thái trip:", err);
      return res.status(500).json({ error: "Lỗi khi kiểm tra trạng thái trip" });
    }

    res.json({ isBooked: result.length > 0 });
  });
});

// API lấy danh sách các chuyến đi đã đặt
app.get("/api/booked-trips/:user_id", (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ error: "Thiếu user_id" });
  }

  const sql = `
    SELECT t.id, t.name, t.image, t.location, t.price, t.duration, t.rating
    FROM trip t
    INNER JOIN users_trip ut ON t.id = ut.trip_id
    WHERE ut.user_id = ? AND ut.status = 'booked'
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách booked trips:", err);
      return res.status(500).json({ error: "Lỗi khi lấy danh sách booked trips" });
    }

    res.json(result);
  });
});

// API thêm bài viết
app.post("/api/posts", (req, res) => {
  const { user_id, title, content, image_url, location } = req.body;
  const sql = "INSERT INTO posts (user_id, title, content, image_url, location) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [user_id, title, content, image_url, location], (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi thêm bài viết" });
      res.json({ message: "Đã đăng bài thành công!", postId: result.insertId });
  });
});

// API lấy danh sách bài viết
app.get("/api/posts", (req, res) => {
  const sql = "SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id ORDER BY created_at DESC";
  db.query(sql, (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi lấy danh sách bài viết" });
      res.json(result);
  });
});

// API cmt bài viết
app.post("/api/comments", (req, res) => {
  const { post_id, user_id, content } = req.body;
  const sql = "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)";
  db.query(sql, [post_id, user_id, content], (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi bình luận" });
      res.json({ message: "Đã bình luận thành công!" });
  });
});

// API like bài viết 
app.post("/api/likes", (req, res) => {
  const { post_id, user_id } = req.body;
  const sql = "INSERT INTO likes (post_id, user_id) VALUES (?, ?)";
  db.query(sql, [post_id, user_id], (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi thích bài viết" });
      res.json({ message: "Đã like bài viết!" });
  });
});

// API bỏ like bài viết
app.delete("/api/likes", (req, res) => {
  const { post_id, user_id } = req.body;
  const sql = "DELETE FROM likes WHERE post_id = ? AND user_id = ?";
  db.query(sql, [post_id, user_id], (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi bỏ like" });
      res.json({ message: "Đã bỏ like bài viết!" });
  });
});

// Chạy server
const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0" , () => console.log(`Server đang chạy tại http://127.0.0.1:${PORT}`));

