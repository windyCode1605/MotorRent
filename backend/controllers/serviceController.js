const db = require('../config/db'); 




// Get all services
exports.getAllServices = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM service');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// xóaxóa
exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute('DELETE FROM service WHERE service_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy dv' });
        }
        res.json({ message: 'Xóa thành công ' });

    } catch (error) {
        
    }
}
// thêm mới 
exports.createService = async (req, res) => {
  try {
    const { service_name, unit, quantity, unit_price, notes } = req.body;

    if (!service_name || !unit || !quantity || !unit_price) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
    }

    const [result] = await db.execute(
      `INSERT INTO service (service_name, unit, quantity, unit_price, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [service_name, unit, quantity, unit_price, notes || null]
    );

    res.status(201).json({
      message: 'Thêm dịch vụ thành công.',
      service_id: result.insertId,
    });
  } catch (err) {
    console.error('Lỗi khi thêm service:', err.message);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm dịch vụ.' });
  }
};