const nodemailer = require('nodemailer');
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'local'}`
});

// Kiểm tra thông tin email config
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('Thiếu thông tin cấu hình email trong file .env');
  throw new Error('Email configuration missing');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('Lỗi kết nối mail server:', error);
  } else {
    console.log('Mail server sẵn sàng nhận tin nhắn');
  }
});

const sendReminderEmail = async (customerEmail, customerName, rentalInfo) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: 'Nhắc nhở: Lịch thuê xe ngày mai',
      html: `
        <h2>Xin chào ${customerName},</h2>
        <p>Chúng tôi xin nhắc nhở bạn về lịch thuê xe vào ngày mai:</p>
        <ul>
          <li>Xe: ${rentalInfo.brand} ${rentalInfo.model}</li>
          <li>Biển số: ${rentalInfo.license_plate}</li>
          <li>Màu sắc: ${rentalInfo.color}</li>
          <li>Vị trí đỗ: ${rentalInfo.parking_spot}</li>
          <li>Hộp số: ${rentalInfo.transmission}</li>
          <li>Nhiên liệu: ${rentalInfo.fuel_type}</li>
          <li>Thời gian nhận xe: ${new Date(rentalInfo.start_date).toLocaleString('vi-VN')}</li>
        </ul>
        <p>Vui lòng đến đúng giờ để nhận xe.</p>
        <p>Trân trọng,<br>CarVip Team</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email đã được gửi:', info.messageId);
    return true;
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    return false;
  }
};

const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Yêu cầu đặt lại mật khẩu',
      html: `
        <h2>Đặt lại mật khẩu</h2>
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
        <p>Mã xác nhận của bạn là: <strong>${resetToken}</strong></p>
        <p>Mã này sẽ hết hạn sau 15 phút.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        <p>Trân trọng,<br>CarVip Team</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email đặt lại mật khẩu đã được gửi:', info.messageId);
    return true;
  } catch (error) {
    console.error('Lỗi khi gửi email đặt lại mật khẩu:', error);
    return false;
  }
};

module.exports = {
  sendReminderEmail,
  sendPasswordResetEmail
};
