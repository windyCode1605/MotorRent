const db = require('../config/db');

exports.getAllAddons = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM rentaladdons');
    res.json(rows);
  } catch (err) {
    console.error('Lỗi GET all rentaladdons:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getAddonsByRentalId = async (req, res) => {
  const { rental_id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM rentaladdons WHERE rental_id = ?', [rental_id]);
    if (!rows.length) return res.status(404).json({ message: 'Không tìm thấy addon' });
    res.json(rows);
  } catch (err) {
    console.error(`Lỗi GET rentaladdons/${rental_id}:`, err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.createAddon = async (req, res) => {
  try {
    const { rental_id, addon_type, addon_name, addon_price, quantity } = req.body;
    if (!rental_id || !addon_type || !addon_name || addon_price == null || quantity == null) {
      return res.status(400).json({ message: 'Thiếu dữ liệu bắt buộc' });
    }
    const total_price = parseFloat(addon_price) * parseInt(quantity, 10);

    const [result] = await db.query(`
      INSERT INTO rentaladdons
        (rental_id, addon_type, addon_name, addon_price, quantity, total_price)
      VALUES (?, ?, ?, ?, ?, ?)`, [
      rental_id, addon_type, addon_name, addon_price, quantity, total_price
    ]);

    res.status(201).json({
      addon_id: result.insertId,
      rental_id, addon_type, addon_name, addon_price, quantity, total_price
    });
  } catch (err) {
    console.error('Lỗi POST rentaladdons:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.updateAddon = async (req, res) => {
  try {
    const { addon_id } = req.params;
    const { quantity } = req.body;
    if (quantity == null) {
      return res.status(400).json({ message: 'Thiếu quantity' });
    }

    const [[row]] = await db.query('SELECT addon_price FROM rentaladdons WHERE addon_id = ?', [addon_id]);
    if (!row) return res.status(404).json({ message: 'Addon không tồn tại' });

    const total_price = parseFloat(row.addon_price) * parseInt(quantity, 10);
    await db.query('UPDATE rentaladdons SET quantity = ?, total_price = ? WHERE addon_id = ?', [quantity, total_price, addon_id]);

    res.json({ addon_id, quantity, total_price });
  } catch (err) {
    console.error(`Lỗi PUT rentaladdons/${req.params.addon_id}:`, err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.deleteAddon = async (req, res) => {
  try {
    const { addon_id } = req.params;
    const [result] = await db.query('DELETE FROM rentaladdons WHERE addon_id = ?', [addon_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy addon để xóa' });
    }
    res.json({ message: 'Xóa addon thành công' });
  } catch (err) {
    console.error(`Lỗi DELETE rentaladdons/${req.params.addon_id}:`, err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy danh sách dịch vụ bổ sung
exports.getRentalAddons = async (req, res) => {
  try {
    const [addons] = await db.query('SELECT * FROM rentaladdons');
    res.status(200).json(addons);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách dịch vụ bổ sung:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};
