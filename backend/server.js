const express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123456789",
  database: process.env.DB_NAME || "carvip2",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection error:", err);
    return;
  }
  console.log("✅ MySQL connected");
});


// Đăng nhập
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email và password là bắt buộc" });

  const query = "SELECT * FROM user WHERE email = ? AND status = 'Active'";
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi hệ thống" });
    if (results.length === 0)
      return res.status(400).json({
        message: "Tài khoản không tìm thấy hoặc không hoạt động",
      });

    const user = results[0];
    const bcrypt = require("bcrypt");

    const plainPassword = password;
    bcrypt.hash(plainPassword, 10, (err, hash) => {
      if (err) {
        console.error("Lỗi khi hash:", err);
      } else {
        console.log("Hash của 'adminpass':", hash);
      }
    });

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err)
        return res.status(500).json({ message: "Lỗi hệ thống khi so sánh mật khẩu" });

      if (!isMatch)
        return res.status(400).json({ message: "Thông tin xác thực không hợp lệ!" });

      const token = jwt.sign(
        { user_id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || "1h" }
      );

      return res.json({
        success: true,
        message: "Đăng nhập thành công",
        token,
        role: user.role,
      });
    });
  });
});



























const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});