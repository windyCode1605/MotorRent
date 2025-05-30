const path = require('path');
const dayjs = require('dayjs');
const db = require('../config/db');
const promiseDb = require('../config/promiseDb');
const fs = require('fs').promises;


exports.getAllVehicles = async (req, res) => {
  try {
    const { search, status, brand, priceMin, priceMax } = req.query;
    
    let query = 'SELECT * FROM car WHERE 1=1';
    const params = [];


    if (search) {
      query += ' AND (brand LIKE ? OR model LIKE ? OR license_plate LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }


    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }


    if (brand) {
      query += ' AND brand = ?';
      params.push(brand);
    }

    if (priceMin) {
      query += ' AND daily_rental_price >= ?';
      params.push(parseFloat(priceMin));
    }
    if (priceMax) {
      query += ' AND daily_rental_price <= ?';
      params.push(parseFloat(priceMax));
    }


    query += ' ORDER BY updated_at DESC';

    const [rows] = await promiseDb.execute(query, params);
    
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





exports.getVehicleById = async (req, res) => {
  const { carId } = req.params;
  try {
    const [rows] = await promiseDb.execute(
      `SELECT * FROM car WHERE car_id = ?`,
      [carId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy xe." });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Lỗi truy vấn xe theo ID:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};



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


exports.updateVehicle = async (req, res) => {
  const { carId } = req.params;
  const updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

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

  try {
  
    const [existingCar] = await promiseDb.execute(
      'SELECT IMG_Motor FROM car WHERE car_id = ?',
      [carId]
    );

    if (existingCar.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy xe' });
    }

    let IMG_Motor = existingCar[0].IMG_Motor;
 
    if (req.file) {
   
      if (IMG_Motor) {
        try {
          await fs.unlink(IMG_Motor);
        } catch (err) {
          console.error('Lỗi khi xóa file ảnh cũ:', err);
        }
      }
      IMG_Motor = req.file.path;
    }

    const sql = `
      UPDATE car 
      SET barcode = ?, parking_spot = ?, license_plate = ?, brand = ?, 
          model = ?, year = ?, color = ?, fuel_type = ?, transmission = ?,
          mileage = ?, status = ?, daily_rental_price = ?, insurance_status = ?, 
          updated_at = ?, IMG_Motor = ?
      WHERE car_id = ?
    `;

    const values = [
      barcode, parking_spot, license_plate, brand, model, year, color,
      fuel_type, transmission, mileage, status, daily_rental_price,
      insurance_status, updatedAt, IMG_Motor, carId
    ];

    await promiseDb.execute(sql, values);

    res.status(200).json({
      message: 'Cập nhật xe thành công',
      image_url: IMG_Motor ? `${req.protocol}://${req.get('host')}/${IMG_Motor}` : null
    });

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Mã barcode này đã tồn tại, vui lòng chọn mã khác' });
    }
    console.error('Lỗi cập nhật xe:', err);
    res.status(500).json({ message: 'Lỗi khi cập nhật thông tin xe' });
  }
};

// Xóa xe
exports.deleteVehicle = async (req, res) => {
  const { carId } = req.params;

  try {

    const [existingCar] = await promiseDb.execute(
      'SELECT IMG_Motor FROM car WHERE car_id = ?',
      [carId]
    );

    if (existingCar.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy xe' });
    }

    if (existingCar[0].IMG_Motor) {
      try {
        await fs.unlink(existingCar[0].IMG_Motor);
      } catch (err) {
        console.error('Lỗi khi xóa file ảnh:', err);
      }
    }


    await promiseDb.execute('DELETE FROM car WHERE car_id = ?', [carId]);

    res.status(200).json({ message: 'Xóa xe thành công' });
  } catch (err) {
    console.error('Lỗi khi xóa xe:', err);
    res.status(500).json({ message: 'Lỗi khi xóa xe' });
  }
};


