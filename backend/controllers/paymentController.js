const axios = require('axios');
const crypto = require('crypto');
const db = require('../config/promiseDb');
require('dotenv').config();

exports.createMoMoPayment = async (req, res) => {
  let connection;
  try {
    const { reservation_id, redirectUrl, ipnUrl } = req.body;

    if (!reservation_id || !redirectUrl || !ipnUrl) {
      return res.status(400).json({ error: 'Thiếu tham số yêu cầu' });
    }

    connection = await db.getConnection();

    // Lấy total_price từ bảng reservations
    const [reservationRows] = await connection.execute(
      'SELECT total_price FROM reservations WHERE reservation_id = ?',
      [reservation_id]
    );

    if (reservationRows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn đặt xe' });
    }

    
    const amount = parseInt(reservationRows[0].total_price);

  
    const accessKey = process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85';
    const secretKey = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const partnerCode = process.env.MOMO_PARTNER_CODE || 'MOMOSANDBOX';
    const requestType = 'payWithMethod';
    const orderInfo = `Thanh toán đơn đặt xe #${reservation_id}`;
    const orderId = `${partnerCode}_${Date.now()}_${reservation_id}`;
    const requestId = orderId;
    const extraData = '';
    const autoCapture = true;
    const lang = 'vi';

    // Tạo rawSignature theo đúng thứ tự yêu cầu
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
    console.log("MoMo config:", { partnerCode, accessKey, secretKey });

    // Gửi request đến MoMo
    const requestBody = {
      partnerCode,
      partnerName: "CarVip App",
      storeId: "CarVipStore",
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      signature
    };

    const momoRes = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!momoRes.data || !momoRes.data.payUrl) {
      console.error('MoMo Error:', momoRes.data);
      return res.status(500).json({ error: 'Không thể tạo liên kết thanh toán từ MoMo' });
    }

    const payUrl = momoRes.data.payUrl;

    // Lưu thông tin thanh toán vào bảng payments
    await connection.execute(
      'INSERT INTO payments (reservation_id, order_id, amount, status, payment_method, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [reservation_id, orderId, amount, 'pending', 'momo']
    );

    return res.status(200).json({ payUrl });

  } catch (error) {
    console.error('=== Lỗi tạo thanh toán MoMo ===');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      return res.status(500).json({
        error: 'Lỗi từ MoMo',
        momoMessage: error.response.data
      });
    } else {
      console.error(error.message);
      return res.status(500).json({ error: 'Không thể tạo thanh toán MoMo', message: error.message });
    }
  } finally {
    if (connection) connection.release();
  }
};




exports.handleMoMoIPN = async (req, res) => {
  const data = req.body;
  const { orderId, resultCode, message } = data;

  try {
    if (!orderId) {
      return res.status(400).json({ error: 'Thiếu orderId' });
    }

    // Cập nhật trạng thái thanh toán dựa vào kết quả
    const newStatus = resultCode === 0 ? 'success' : 'failed';

    await db.execute(
      'UPDATE payments SET status = ?, updated_at = NOW() WHERE order_id = ?',
      [newStatus, orderId]
    );

    return res.status(200).json({ message: 'IPN đã xử lý', resultCode });
  } catch (error) {
    console.error('IPN ERROR:', error);
    return res.status(500).json({ error: 'Lỗi xử lý IPN' });
  }
};
