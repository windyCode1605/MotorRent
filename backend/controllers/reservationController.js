const db = require('../config/db'); 

exports.createReservation = async (req, res) => {
  const accountId = req.user.account_id;

  try {
    const [customerRows] = await db.query('SELECT customer_id FROM customers WHERE account_id = ?', [accountId]);

    if (customerRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng.' });
    }

    const customer_id = customerRows[0].customer_id;
    const {
      car_id,
      start_date,
      end_date,
      status,
      total_price,
      payment_status,
      pickup_location,
      return_location
    } = req.body;

    // 🔒 Kiểm tra trùng lịch
    const [overlapping] = await db.query(
      `SELECT * FROM reservations
       WHERE car_id = ?
         AND status IN ('confirmed', 'paid')
         AND (
           (? BETWEEN start_date AND end_date)
           OR (? BETWEEN start_date AND end_date)
           OR (start_date BETWEEN ? AND ?)
           OR (end_date BETWEEN ? AND ?)
         )`,
      [car_id, start_date, end_date, start_date, end_date, start_date, end_date]
    );

    if (overlapping.length > 0) {
      return res.status(409).json({ message: 'Xe đã được đặt trong khoảng thời gian này. Vui lòng chọn thời gian khác.' });
    }

    // Nếu không bị trùng lịch thì cho phép tạo đơn
    const sql = `INSERT INTO reservations 
      (customer_id, car_id, start_date, end_date, status, total_price, payment_status, pickup_location, return_location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.query(sql, [
      customer_id,
      car_id,
      start_date,
      end_date,
      status,
      total_price,
      payment_status,
      pickup_location,
      return_location
    ]);

    const reservation_id = result.insertId;
    res.status(201).json({ success: true, message: 'Đặt xe thành công', reservation_id });
  } catch (err) {
    console.error("Lỗi khi tạo đặt xe:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

