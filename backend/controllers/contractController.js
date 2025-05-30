const db = require('../config/db');

// Lấy tất cả hợp đồng
exports.getAllContracts = async (req, res) => {
    try {
        const [contracts] = await db.execute(`
            SELECT 
                r.rental_id,
                r.start_date,
                r.end_date,
                r.total_price,
                r.payment_status,
                r.status,
                CONCAT(c.first_name, ' ', c.last_name) as fullName,
                car.brand,
                car.model,
                car.license_plate
            FROM rental r
            JOIN customers c ON r.customer_id = c.customer_id
            JOIN car ON r.car_id = car.car_id
            ORDER BY r.created_at DESC
        `);

        res.json(contracts);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách hợp đồng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Lấy chi tiết hợp đồng
exports.getContractDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const [contract] = await db.execute(`
            SELECT 
                r.*,
                CONCAT(c.first_name, ' ', c.last_name) as fullName,
                c.phone_number,
                c.email,
                car.brand,
                car.model,
                car.license_plate,
                car.color
            FROM rental r
            JOIN customers c ON r.customer_id = c.customer_id
            JOIN car ON r.car_id = car.car_id
            WHERE r.rental_id = ?
        `, [id]);

        if (contract.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        }

        const [addons] = await db.execute(`
            SELECT * FROM rental_addons 
            WHERE rental_id = ?
        `, [id]);

        res.json({
            ...contract[0],
            addons
        });

    } catch (error) {
        console.error('Lỗi khi lấy chi tiết hợp đồng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};


exports.updateContract = async (req, res) => {
  const { id } = req.params;
  const { status, payment_status } = req.body;

  try {
    const [exist] = await db.execute('SELECT * FROM rental WHERE rental_id = ?', [id]);
    if (exist.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
    }

    await db.execute(
      `UPDATE rental SET status = ?, payment_status = ?, updated_at = NOW() WHERE rental_id = ?`,
      [status, payment_status, id]
    );

    res.json({ message: 'Cập nhật hợp đồng thành công' });
  } catch (error) {
    console.error('Lỗi cập nhật hợp đồng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


exports.deleteContract = async (req, res) => {
  const { id } = req.params;

  try {
    const [exist] = await db.execute('SELECT * FROM rental WHERE rental_id = ?', [id]);
    if (exist.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
    }

    await db.execute('DELETE FROM rental WHERE rental_id = ?', [id]);

    res.json({ message: 'Xóa hợp đồng thành công' });
  } catch (error) {
    console.error('Lỗi xóa hợp đồng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
