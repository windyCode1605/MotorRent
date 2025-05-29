require('dotenv').config();
const { sendReminderEmail } = require('./utils/emailService');

async function testEmail() {
  try {
    console.log('Đang test với email:', process.env.EMAIL_USER);
    
    const testData = {
      email: process.env.EMAIL_USER, // Gửi tới chính email của bạn để test
      customerName: 'Mai Quang Nguyên',
      brand: 'Toyota',
      model: 'Camry',
      license_plate: '51F-123.45',
      color: 'Đen',
      parking_spot: 'A1-01',
      transmission: 'Automatic',
      fuel_type: 'Gasoline',
      start_date: new Date(Date.now() + 24 * 60 * 60 * 1000) // Ngày mai
    };

    console.log('Đang gửi email test...');
    const result = await sendReminderEmail(
      testData.email,
      testData.customerName,
      testData
    );

    if (result) {
      console.log('Email test đã được gửi thành công!');
    } else {
      console.log('Gửi email test thất bại!');
    }
  } catch (error) {
    console.error('Lỗi trong quá trình test:', error);
  }
}

testEmail();
