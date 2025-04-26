// controllers/auth.controller.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "Email và password là bắt buộc" });

  try {
    const [results] = await db.query("SELECT * FROM accounts WHERE email = ? AND is_active = '1'", [email]);

    if (results.length === 0) {
      return res.status(401).json({ message: "Tài khoản không tìm thấy hoặc không hoạt động" });
    }

    const account = results[0];
    const isMatch = await bcrypt.compare(password, account.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Thông tin xác thực không hợp lệ!" });
    }

    const token = jwt.sign(
      {
        account_id: account.account_id,
        role: account.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "1h" }
    );

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      role: account.role,
      account_id: account.account_id,
    });
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
