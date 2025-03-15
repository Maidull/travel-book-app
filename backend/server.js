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

/// API đăng ký
app.post("/api/register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Kiểm tra email đã tồn tại
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) {
        console.error("Lỗi truy vấn:", err);
        return res.status(500).json({ error: "Lỗi server" });
      }
      console.log("Kết quả truy vấn:", results);
      if (results.length > 0) return res.status(400).json({ error: "Email đã tồn tại!" });

      // Nếu email chưa tồn tại, tiếp tục đăng ký
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
        [email, hashedPassword, name],
        (err, result) => {
          if (err) return res.status(500).json({ error: "Lỗi khi đăng ký" });

          // Tạo token
          const token = jwt.sign({ id: result.insertId, email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });

          res.json({ message: "Đăng ký thành công!", token });
        }
      );
    });
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
  const { user_id, content, image_url } = req.body;
  if (!content) return res.status(400).json({ error: "Nội dung không được để trống" });

  const sql = "INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)";
  db.query(sql, [user_id, content, image_url || null], (err, result) => {
    if (err) {
      console.error("Lỗi thêm bài viết:", err);
      return res.status(500).json({ error: "Lỗi thêm bài viết" });
    }
    res.json({ message: "Đã đăng bài thành công!", postId: result.insertId });
  });
});

// API lấy danh sách bài viết
app.get("/api/posts", (req, res) => {
  const sql = `
    SELECT posts.*, users.name, users.image AS user_image,
    (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS likes_count,
    (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS comments_count
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY created_at DESC
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi lấy danh sách bài viết:", err);
      return res.status(500).json({ error: "Lỗi lấy danh sách bài viết" });
    }
    res.json(result);
  });
});

// API thêm comment
app.post("/api/comments", (req, res) => {
  const { post_id, user_id, content } = req.body;
  if (!content) return res.status(400).json({ error: "Nội dung không được để trống" });

  const sql = "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)";
  db.query(sql, [post_id, user_id, content], (err, result) => {
    if (err) {
      console.error("Lỗi thêm comment:", err);
      return res.status(500).json({ error: "Lỗi thêm comment" });
    }

    // Lấy thông tin comment vừa thêm
    const commentId = result.insertId;
    const fetchSql = `
      SELECT comments.*, users.name 
      FROM comments 
      JOIN users ON comments.user_id = users.id 
      WHERE comments.id = ?
    `;
    db.query(fetchSql, [commentId], (fetchErr, fetchResult) => {
      if (fetchErr) {
        console.error("Lỗi lấy comment vừa thêm:", fetchErr);
        return res.status(500).json({ error: "Lỗi lấy comment vừa thêm" });
      }
      res.json({ message: "Đã thêm comment thành công!", comment: fetchResult[0] });
    });
  });
});

// API lấy danh sách comment
app.get("/api/comments/:post_id", (req, res) => {
  const { post_id } = req.params;
  const sql = `
    SELECT comments.*, users.name 
    FROM comments 
    JOIN users ON comments.user_id = users.id 
    WHERE comments.post_id = ? 
    ORDER BY created_at DESC
  `;
  db.query(sql, [post_id], (err, result) => {
    if (err) {
      console.error("Lỗi lấy danh sách comment:", err);
      return res.status(500).json({ error: "Lỗi lấy danh sách comment" });
    }
    res.json(result);
  });
});

// API like bài viết 
app.post("/api/likes", (req, res) => {
  const { post_id, user_id } = req.body;

  // Kiểm tra xem người dùng đã like bài viết chưa
  const checkSql = "SELECT * FROM likes WHERE post_id = ? AND user_id = ?";
  db.query(checkSql, [post_id, user_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi kiểm tra like" });

    if (results.length > 0) {
      return res.status(400).json({ error: "Bạn đã like bài viết này rồi!" });
    }

    // Thêm like vào bảng likes
    const insertSql = "INSERT INTO likes (post_id, user_id) VALUES (?, ?)";
    db.query(insertSql, [post_id, user_id], (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi thích bài viết" });

      // Cập nhật likes_count trong bảng posts
      const updateSql = "UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?";
      db.query(updateSql, [post_id], (err, updateResult) => {
        if (err) return res.status(500).json({ error: "Lỗi cập nhật số lượng like" });

        // Trả về số lượng like mới
        const countSql = "SELECT likes_count FROM posts WHERE id = ?";
        db.query(countSql, [post_id], (err, countResult) => {
          if (err) return res.status(500).json({ error: "Lỗi lấy số lượng like" });
          res.json({ message: "Đã like bài viết!", likes_count: countResult[0].likes_count });
        });
      });
    });
  });
});


// API bỏ like bài viết
app.delete("/api/likes/:post_id/:user_id", (req, res) => {
  const { post_id, user_id } = req.params;

  // Xóa like khỏi bảng likes
  const deleteSql = "DELETE FROM likes WHERE post_id = ? AND user_id = ?";
  db.query(deleteSql, [post_id, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi bỏ like" });

    // Cập nhật likes_count trong bảng posts
    const updateSql = "UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?";
    db.query(updateSql, [post_id], (err, updateResult) => {
      if (err) return res.status(500).json({ error: "Lỗi cập nhật số lượng like" });

      // Trả về số lượng like mới
      const countSql = "SELECT likes_count FROM posts WHERE id = ?";
      db.query(countSql, [post_id], (err, countResult) => {
        if (err) return res.status(500).json({ error: "Lỗi lấy số lượng like" });
        res.json({ message: "Đã bỏ like bài viết!", likes_count: countResult[0].likes_count });
      });
    });
  });
});

// API xóa bài đăng
app.delete("/api/posts/:post_id/:user_id", (req, res) => {
  const { post_id, user_id } = req.params;

  // Kiểm tra xem bài đăng có thuộc về user không
  const checkSql = "SELECT * FROM posts WHERE id = ? AND user_id = ?";
  db.query(checkSql, [post_id, user_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi kiểm tra quyền xóa bài đăng" });

    if (results.length === 0) {
      return res.status(403).json({ error: "Bạn không có quyền xóa bài đăng này!" });
    }

    // Xóa bài đăng
    const deleteSql = "DELETE FROM posts WHERE id = ?";
    db.query(deleteSql, [post_id], (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi xóa bài đăng" });

      res.json({ message: "Đã xóa bài đăng thành công!" });
    });
  });
});

// Chạy server
const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0" , () => console.log(`Server đang chạy tại http://127.0.0.1:${PORT}`));

