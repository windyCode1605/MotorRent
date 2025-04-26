const db = require("../config/db");

exports.createReservation = (req, res) => {
  const {
    customer_id,
    car_id,
    start_date,
    end_date,
    status,
    total_price,
    payment_status,
  } = req.body;

  const sql = `INSERT INTO reservations 
    (customer_id, car_id, start_date, end_date, status, total_price, payment_status)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [customer_id, car_id, start_date, end_date, status, total_price, payment_status],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Không thể tạo đơn đặt xe ❌" });
      res.status(201).json({
        success: true,
        message: "Tạo đơn đặt xe thành công ✅",
        reservation_id: result.insertId,
      });
    }
  );
};
