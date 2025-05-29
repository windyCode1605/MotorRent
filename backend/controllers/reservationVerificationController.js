const db = require('../config/db');
const { getIO } = require('../utils/socketManager');

// Lấy danh sách đơn đặt xe cần xác nhận
const getPendingReservations = async (req, res) => {
  try {
    const [reservations] = await db.execute(`
      SELECT 
        r.*,
        c.first_name, c.last_name, c.phone_number, c.email,
        car.license_plate, car.brand, car.model, car.year, car.IMG_Motor
      FROM reservations r
      JOIN customers c ON r.customer_id = c.customer_id
      JOIN car ON r.car_id = car.car_id
      WHERE r.status = 'pending'
      ORDER BY r.created_at DESC
    `);

    if (!reservations.length) {
      return res.status(404).json({ message: 'Không tìm thấy đơn đặt xe nào.' });
    }

  
    const reservationsWithImages = reservations.map(reservation => ({
      ...reservation,
      image_url: `${req.protocol}://${req.get('host')}/${reservation.IMG_Motor}`
    }));

    res.json(reservationsWithImages);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách đơn đặt xe:", err);
    res.status(500).json({ 
      message: 'Đã xảy ra lỗi khi lấy dữ liệu.',
      error: err.message 
    });
  }
};


const updateReservationStatus = async (req, res) => {
  const { reservation_id } = req.params;
  const { status } = req.body;

  if (!['confirmed', 'canceled'].includes(status)) {
    return res.status(400).json({ 
      message: 'Trạng thái không hợp lệ. Trạng thái phải là: confirmed hoặc canceled'
    });
  }

  try {

    await db.beginTransaction();

    const [result] = await db.execute(
      'UPDATE reservations SET status = ?, updated_at = NOW() WHERE reservation_id = ?',
      [status, reservation_id]
    );

    if (result.affectedRows === 0) {
      await db.rollback();
      return res.status(404).json({ message: 'Không tìm thấy đơn đặt xe.' });
    }

    const [updatedReservation] = await db.execute(`
      SELECT r.*, c.customer_id, c.first_name, c.last_name, car.brand, car.model
      FROM reservations r 
      JOIN customers c ON r.customer_id = c.customer_id 
      JOIN car ON r.car_id = car.car_id
      WHERE r.reservation_id = ?
    `, [reservation_id]);

    if (!updatedReservation[0]) {
      await db.rollback();
      return res.status(404).json({ message: 'Không thể tải thông tin đơn đặt xe.' });
    }

    // Cập nhật trạng thái xe
    if (status === 'confirmed') {
      await db.execute(
        'UPDATE car SET status = ? WHERE car_id = ?',
        ['Đã đặt', updatedReservation[0].car_id]
      );
    }

    // Commit transaction
    await db.commit();

    // Gửi thông báo qua socket
    const io = getIO();
    const statusText = status === 'confirmed' ? 'xác nhận' : 'từ chối';
    io.to(`customer_${updatedReservation[0].customer_id}`).emit('reservationStatusUpdated', {
      reservation_id,
      status,
      customer_id: updatedReservation[0].customer_id,
      message: `Đơn đặt xe ${updatedReservation[0].brand} ${updatedReservation[0].model} của bạn đã được ${statusText}.`
    });

    res.json({ 
      message: `Đã ${statusText} đơn đặt xe thành công`,
      reservation: updatedReservation[0]
    });

  } catch (err) {
    await db.rollback();
    console.error("Lỗi khi cập nhật trạng thái:", err);
    res.status(500).json({ 
      message: 'Đã xảy ra lỗi khi cập nhật trạng thái.',
      error: err.message
    });
  }
};

module.exports = {
  getPendingReservations,
  updateReservationStatus
};
