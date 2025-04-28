const db = require("../config/db");

exports.createReservation = (req, res) => {
  const { customer_id, car_id , start_date, end_date, status, total_price, payment_status , pickupLocation, returnLocation } = req.body;

  const sql = `INSERT INTO reservations 
    (customer_id, car_id, start_date, end_date, status, total_price, payment_status, pickup_location, return_location)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.query( sql , [customer_id, car_id , start_date, end_date, status, total_price, payment_status, pickupLocation, returnLocation], 
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Khong the tao don dat xe 🤦‍♂️"});
      } else {
        res.status(201).json({
          success: true,
          message: "Tao don dat xe thanh cong 🤷‍♂️",
          revervation_id: result.insertId,
        });
      }
    }
  );
};
