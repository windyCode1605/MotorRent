const express = require("express");
const mysql = require('mysql2');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require('fs');
const path = require('path');
const multer = require('multer');
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || 'local'}`
});

const app = express();
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const promiseDb = db.promise();

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  }
  console.log("✅ MySQL connected");
});

// Middleware
const authenticateToken = require("./middleware/authMiddleware");
const { authorizeRoles } = require("./middleware/roleMiddleware");

// Login "Đăng nhập"
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email và password là bắt buộc" });
  const query = "SELECT * FROM accounts WHERE email = ? AND is_active = '1'";
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi hệ thống" });
    if (results.length === 0) {
      return res.status(401).json({
        message: "Tài khoản không tìm thấy hoặc không hoạt động",
      });
    }
    const accounts = results[0];
    bcrypt.compare(password, accounts.password_hash, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ message: "Thông tin xác thực không hợp lệ!" });
      }
      const token = jwt.sign(
        { 
          account_id: accounts.account_id,
          role: accounts.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || "1h" }
      );
      res.json({
        success: true,
        message: "Đăng nhập thành công",
        token,
        role: accounts.role,
      });
    });
  });
});















app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/vehicles', async (req, res) => {
  try {
    const [rows] = await promiseDb.query('SELECT * FROM car');

    const vehiclesWithFullImagePath = rows.map(car => {
      return {
        ...car,
        image_url: `${req.protocol}://${req.get('host')}/${car.IMG_Motor}`
      };
    });

    res.json(vehiclesWithFullImagePath);
  } catch (err) {
    console.error('❌ Lỗi khi lấy danh sách xe:', err);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy thông tin xe.' });
  }
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage : storage });
// API them moi xe




// Other routes...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});