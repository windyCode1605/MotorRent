const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const { sendPasswordResetEmail } = require("../utils/emailService");
const crypto = require("crypto");

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

// Tạo mã OTP ngẫu nhiên 6 số
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email là bắt buộc" });
  }

  try {
    
    const [accounts] = await db.query("SELECT * FROM accounts WHERE email = ? AND is_active = '1'", [email]);

    if (accounts.length === 0) {
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống" });
    }
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

    await db.query(
      "UPDATE accounts SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
      [otp, otpExpiry, email]
    );

    const emailSent = await sendPasswordResetEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({ message: "Không thể gửi email đặt lại mật khẩu" });
    }

    res.json({ message: "Mã xác nhận đã được gửi đến email của bạn" });
  } catch (err) {
    console.error("Lỗi khi xử lý yêu cầu đặt lại mật khẩu:", err);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

exports.verifyResetToken = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email và mã OTP là bắt buộc" });
  }

  try {
    const [accounts] = await db.query(
      "SELECT * FROM accounts WHERE email = ? AND reset_token = ? AND reset_token_expires > NOW() AND is_active = '1'",
      [email, otp]
    );

    if (accounts.length === 0) {
      return res.status(400).json({ message: "Mã OTP không hợp lệ hoặc đã hết hạn" });
    }

    res.json({ message: "Mã OTP hợp lệ" });
  } catch (err) {
    console.error("Lỗi khi xác thực mã OTP:", err);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }

  try {
    const [accounts] = await db.query(
      "SELECT * FROM accounts WHERE email = ? AND reset_token = ? AND reset_token_expires > NOW() AND is_active = '1'",
      [email, otp]
    );

    if (accounts.length === 0) {
      return res.status(400).json({ message: "Mã OTP không hợp lệ hoặc đã hết hạn" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

  
    await db.query(
      "UPDATE accounts SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ?",
      [hashedPassword, email]
    );

    res.json({ message: "Mật khẩu đã được đặt lại thành công" });
  } catch (err) {
    console.error("Lỗi khi đặt lại mật khẩu:", err);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
