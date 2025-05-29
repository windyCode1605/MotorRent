const db = require('../config/db'); 




// Get
exports.getAllServices = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM service');
        res.json(rows);
    } catch (err) {
        console.error('Error getting services:', err);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách dịch vụ', error: err.message });
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
    const {maintenance_id, service_name, unit, quantity, unit_price, notes } = req.body;

    if (!maintenance_id || !service_name || !unit || !quantity || !unit_price) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
    }

    const [result] = await db.execute(
      `INSERT INTO service (maintenance_id, service_name, unit, quantity, unit_price, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [maintenance_id, service_name, unit, quantity, unit_price, notes || null]
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
// cap nhật
exports.updateService = async (req, res) => {
  try {
    const { service_id, service_name, unit, quantity, unit_price, notes } = req.body;
    if (!service_id || !service_name  || !quantity || !unit_price) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
    }
    const [result] = await db.execute(
      `UPDATE service 
       SET service_name = ?, unit = ?, quantity = ?, unit_price = ?, notes = ?
       WHERE service_id = ?`,
      [service_name, unit, quantity, unit_price, notes || null, service_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dịch vụ để cập nhật.' });
    }
    res.json({ message: 'Cập nhật dịch vụ thành công.' });
  } catch (err) {
    res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật dịch vụ.' });
  }
};
// GET /services/by-maintenance/:maintenance_id
exports.getServicesByMaintenanceId = async (req, res) => {
  const { maintenance_id } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT * 
       FROM service
       WHERE maintenance_id = ?`,
      [maintenance_id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi lấy dịch vụ theo maintenance_id:', error);
    res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
};
