const path = require('path');
const dayjs = require('dayjs');
const db = require('../config/db');
const promiseDb = require('../config/promiseDb');

// Lấy danh sách xe
exports.getAllVehicles = async (req, res) => {
  try {
    const [rows] = await promiseDb.query('SELECT * FROM car');
    const vehiclesWithFullImagePath = rows.map(car => ({
      ...car,
      image_url: `${req.protocol}://${req.get('host')}/${car.IMG_Motor}`
    }));
    res.json(vehiclesWithFullImagePath);
  } catch (err) {
    console.error(' Lỗi khi lấy danh sách xe:', err);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy thông tin xe.' });
  }
};

// Thêm mới xe
exports.createVehicle = (req, res) => {
  const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const updatedAt = createdAt;

  const {
    barcode,
    parking_spot,
    license_plate,
    brand,
    model,
    year,
    color,
    fuel_type,
    transmission,
    mileage,
    status,
    daily_rental_price,
    insurance_status
  } = req.body;

  const IMG_Motor = req.file ? req.file.path : null;

  if (!barcode || !license_plate || !brand || !model || !IMG_Motor) {
    return res.status(400).json({ message: "Thiếu thông tin xe hoặc ảnh!" });
  }

  const sql = `
    INSERT INTO car 
    (barcode, parking_spot, license_plate, brand, model, year, color, fuel_type, transmission,
     mileage, status, daily_rental_price, insurance_status, created_at, updated_at, IMG_Motor)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    barcode, parking_spot, license_plate, brand, model, year, color,
    fuel_type, transmission, mileage, status, daily_rental_price,
    insurance_status, createdAt, updatedAt, IMG_Motor
  ];

  db.query(sql, values, (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Mã barcode này đã tồn tại, vui lòng chọn mã khác' });
      }
      console.error('Lỗi thêm xe:', err);
      return res.status(500).json({ message: 'Thêm xe thất bại' });
    }

    res.status(201).json({
      message: 'Thêm xe thành công',
      car_id: results.insertId,
      image_url: `${req.protocol}://${req.get('host')}/${IMG_Motor}`
    });
  });
};

exports.getNameAllVehicles = ( req , res ) => {
 
}
