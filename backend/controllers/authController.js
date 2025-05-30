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
exports.register = async (req, res) => {
    console.log("\n--- Xử lý yêu cầu đăng ký ---");
    try {
      
        const {
            email,
            password,
            fullname, 
            phone_number,
            date_of_birth,
            gender,
            address,
            driver_license_number, 
        } = req.body;
        console.log("Đăng ký: Nhận dữ liệu:", {
            email,
            fullname, 
            phone_number,
            date_of_birth,
            gender,
            address,
            driver_license_number,
        });


        if (
            !email ||
            !password ||
            !fullname ||
            !phone_number

        ) {
            console.log("Đăng ký: Thiếu thông tin bắt buộc.");
            return res.status(400).json({

                success: false,
                message:
                    "Vui lòng điền đầy đủ các trường bắt buộc (Email, Mật khẩu, Họ và tên, Số điện thoại).", // Cập nhật thông báo lỗi
            });
        }

        console.log("Đăng ký: Kiểm tra email đã tồn tại chưa:", email);
        const [existingAccounts] = await db.query(
            "SELECT account_id FROM accounts WHERE email = ?",
            [email]
        );

        if (existingAccounts.length > 0) {
            console.log("Đăng ký: Email đã tồn tại:", email);
            return res.status(409).json({
                // 409 Conflict
                success: false,
                message: "Email đã tồn tại.",
            });
        }

        console.log(
            "Đăng ký: Kiểm tra số điện thoại đã tồn tại trong customers chưa:",
            phone_number
        );
        const [existingCustomersByPhone] = await db.query(
            "SELECT customer_id FROM customers WHERE phone_number = ?",
            [phone_number]
        );
        if (existingCustomersByPhone.length > 0) {
            console.log("Đăng ký: Số điện thoại đã tồn tại:", phone_number);
            return res.status(409).json({
          
                success: false,
                message: "Số điện thoại đã được sử dụng.",
            });
        }

        console.log("Đăng ký: Mã hóa mật khẩu...");
  
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Đăng ký: Mã hóa mật khẩu thành công.");

        
        await db.beginTransaction();
        console.log("Đăng ký: Bắt đầu giao dịch database");

        console.log("Đăng ký: Chèn dữ liệu vào bảng accounts");
        const [accountResult] = await db.query(
            "INSERT INTO accounts (email, password_hash, role, is_active, created_at) VALUES (?, ?, ?, ?, NOW())",
            [email, hashedPassword, "customer", "1"] );
        const newAccountId = accountResult.insertId; 
        console.log(
            "Đăng ký: Chèn vào accounts thành công, account_id:",
            newAccountId
        );

     
        console.log("Đăng ký: Chèn dữ liệu vào bảng customers");

        // Xử lý tách họ và tên
        const nameParts = fullname.trim().split(" ");
        const firstName = nameParts.slice(0, -1).join(" ") || fullname;
        const lastName = nameParts.slice(-1)[0] || fullname; 

        const [customerResult] = await db.query(
            "INSERT INTO customers (account_id, first_name, last_name, email, phone_number, date_of_birth, gender, address, driver_license_number, password, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                newAccountId,
                firstName,
                lastName,
                email,
                phone_number.trim(),
                date_of_birth ? date_of_birth.trim() : null,
                gender || null,
                address ? address.trim() : null,
                driver_license_number ? driver_license_number.trim() : null,
                hashedPassword,
                "",
            ]
        );
        const newCustomerId = customerResult.insertId;
        console.log(
            "Đăng ký: Chèn vào customers thành công, customer_id:",
            newCustomerId
        );

    
        await db.commit();
        console.log("Đăng ký: Giao dịch hoàn tất (commit)");

        console.log("Đăng ký: Đăng ký thành công cho email:", email);
      
        res.status(201).json({
            // 201 Created
            success: true,
            message: "Đăng ký tài khoản thành công!",
            account_id: newAccountId,
        });
    } catch (error) {
       
        await db.rollback();
        console.error("Đăng ký: Lỗi xử lý yêu cầu (đã rollback):", error);

     
        if (error.code === "ER_DUP_ENTRY") {

            return res.status(409).json({
                success: false,
                message:
                    "Dữ liệu đã tồn tại (ví dụ: số điện thoại hoặc số giấy phép lái xe đã được sử dụng).",
            });
        }

        res.status(500).json({
         
            success: false,
            message: "Lỗi hệ thống. Không thể đăng ký tài khoản.",
        });
    } finally {
        console.log("--- Kết thúc xử lý yêu cầu đăng ký ---\n");
    }
};