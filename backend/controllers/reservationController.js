// controllers/reservationController.js
const db = require('../config/db');

// Tạo đơn đặt xe mới
exports.createReservation = async (req, res) => {
  const accountId = req.user.account_id;

  try {
    const [customerRows] = await db.query(
      'SELECT customer_id FROM customers WHERE account_id = ?',
      [accountId]
    );

    if (customerRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng.' });
    }

    const customer_id = customerRows[0].customer_id;
    const {
      car_id,
      start_date,
      end_date,
      total_price,
      payment_status,
      pickup_location,
      return_location
    } = req.body;

    const status = 'pending';

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

// Lấy danh sách đơn đặt xe của khách hàng
exports.getCustomerReservations = async (req, res) => {
  try {
    const { account_id } = req.user;

    const [customers] = await db.execute(
      'SELECT customer_id FROM customers WHERE account_id = ?',
      [account_id]
    );

    if (customers.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin khách hàng' });
    }

    const customer_id = customers[0].customer_id;

    const [reservations] = await db.execute(`
      SELECT 
        r.*, 
        c.brand AS vehicle_name, 
        c.license_plate, 
        p.status AS payment_status,
        r.total_price,
        r.start_date AS start_date,
        r.end_date AS end_date,
        r.created_at
      FROM reservations r
      JOIN car c ON r.car_id = c.car_id
      LEFT JOIN payments p ON r.reservation_id = p.reservation_id
      WHERE r.customer_id = ?
      ORDER BY r.created_at DESC
    `, [customer_id]);

    res.json(reservations);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn đặt:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Hủy đơn đặt xe
exports.cancelReservation = async (req, res) => {
  try {
    const { reservation_id } = req.params;
    const { account_id } = req.user;

    // Check if reservation exists and belongs to user
    const [reservations] = await db.execute(
      'SELECT r.*, p.status as payment_status FROM reservations r LEFT JOIN payments p ON r.reservation_id = p.reservation_id WHERE r.reservation_id = ? AND r.customer_id IN (SELECT customer_id FROM customers WHERE account_id = ?)',
      [reservation_id, account_id]
    );

    if (reservations.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn đặt xe hoặc không phải của bạn.' });
    }

    const reservation = reservations[0];

    // Check if reservation can be canceled
    if (reservation.status !== 'pending' && reservation.status !== 'confirmed') {
      return res.status(400).json({ message: 'Chỉ có thể hủy đơn đặt xe ở trạng thái chờ xác nhận hoặc đã xác nhận.' });
    }

    // If payment was made, initiate refund
    if (reservation.payment_status === 'success') {
      await db.execute(
        'INSERT INTO refunds (payment_id, amount, status) SELECT p.payment_id, p.amount, "pending" FROM payments p WHERE p.reservation_id = ?',
        [reservation_id]
      );
    }

    // Cancel the reservation
    await db.execute(
      'UPDATE reservations SET status = "canceled", updated_at = NOW() WHERE reservation_id = ?',
      [reservation_id]
    );

    res.json({ success: true, message: 'Đã hủy đơn đặt xe thành công.' });
  } catch (error) {
    console.error('Lỗi khi hủy đơn đặt:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
}
