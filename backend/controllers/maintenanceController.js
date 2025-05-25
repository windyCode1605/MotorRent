const promiseDb = require('../config/promiseDb');

exports.getAllMaintenance = async (req, res) => {
    try {
        const [results] = await promiseDb.query('SELECT * FROM maintenance');
        res.json(results);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Lỗi truy vấn dữ liệu.');
    }
}
exports.createMaintenance = async (req, res) => {
    try {
        const {
            maintenance_id,
            car_id,
            maintenance_date,
            description,
            cost,
            status,
            next_maintenance_date,
            receptionist_id
        } = req.body;
        console.log('Received data:', req.body);

        if (!maintenance_id ||
            !car_id ||
            !maintenance_date ||
            cost === undefined || 
            !next_maintenance_date||  
            !status ||
            !receptionist_id
        ) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
        }

        const [result] = await promiseDb.execute(
            `INSERT INTO maintenance 
            (maintenance_id, car_id, maintenance_date, description, cost, status, next_maintenance_date, receptionist_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                maintenance_id,
                car_id,
                maintenance_date,
                description,
                cost,
                status,
                next_maintenance_date,
                receptionist_id
            ]
        );
        res.status(201).json({
            message: "Thêm mới bảo dưỡng thành công.",
            maintenance_id: maintenance_id,
        });
    } catch (err) {
        console.error('Lỗi thêm bảo dưỡng:', err);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm bảo dưỡng.' });
    }
};


exports.updateCost = async (req, res) => {
  const { maintenance_id } = req.params;
  const { cost } = req.body;

  try {
    await promiseDb.execute(
      `UPDATE maintenance SET cost = ? WHERE maintenance_id = ?`,
      [cost, maintenance_id]
    );
    res.status(200).json({ message: 'Cập nhật chi phí thành công.' });
  } catch (error) {
    console.error('Lỗi cập nhật chi phí:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật chi phí.' });
  }
};
