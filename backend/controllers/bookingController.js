const db = require('../config/db');
const { getIO } = require('../utils/socketManager');

// Lấy danh sách đơn cần kiểm duyệt
const getPendingRentals = async (req, res) => {
  try {
    const [rentals] = await db.execute(`
      SELECT 
        r.*,
        c.first_name, c.last_name, c.phone_number, c.email,
         car.license_plate, car.brand, car.model, car.year,
        res.start_date
      FROM rental r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN car ON r.car_id = car.car_id
      LEFT JOIN reservations res ON r.reservation_id = res.reservation_id
      WHERE r.status = ?
      ORDER BY r.created_at DESC
    `, ['Chờ xác nhận']);

    if (!rentals) {
      return res.status(404).json({ message: 'Không tìm thấy đơn nào.' });
    }

    res.json(rentals);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách đơn cần kiểm duyệt:", err);
    res.status(500).json({ 
      message: 'Đã xảy ra lỗi khi lấy dữ liệu.', 
      error: err.message 
    });
  }
};

// Cập nhật trạng thái đơn thuê
const { notifyBookingStatusChange } = require('../utils/socketManager');

const updateRentalStatus = async (req, res) => {
  const { rental_id } = req.params;
  const { status } = req.body;
  console.log('Updating rental status:', { rental_id, status });

  if (!['Đã xác nhận', 'Hủy', 'Từ chối'].includes(status)) {
    return res.status(400).json({ 
      message: 'Trạng thái không hợp lệ. Trạng thái phải là: Đã xác nhận, Hủy hoặc Từ chối',
      allowedStatuses: ['Đã xác nhận', 'Hủy', 'Từ chối']
    });
  }

  try {
    const [result] = await db.execute(
      'UPDATE rental SET status = ? WHERE rental_id = ?',
      [status, rental_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn thuê.' });
    }    // Lấy thông tin đơn hàng sau khi cập nhật
    const [updatedRental] = await db.execute(`
      SELECT r.*, c.customer_id, c.first_name, c.last_name 
      FROM rental r 
      JOIN customers c ON r.customer_id = c.customer_id 
      WHERE r.rental_id = ?
    `, [rental_id]);    // Gửi thông báo qua socket
    if (updatedRental[0]) {
      console.log('Sending notification to customer:', updatedRental[0].customer_id);
      
      const notificationData = {
        rental_id,
        status,
        message: `Đơn hàng của bạn đã được cập nhật thành ${status}`
      };
      
      console.log('Notification data:', notificationData);
      
      notifyBookingStatusChange(updatedRental[0].customer_id, notificationData);
    } else {
      console.log('No rental found with ID:', rental_id);
    }

    // Emit socket event to specific customer
    const io = getIO();
    io.to(`customer_${updatedRental[0].customer_id}`).emit('bookingStatusUpdated', {
      rental_id,
      status,
      message: `Đơn đặt xe của bạn đã được ${status === "Đã xác nhận" ? "xác nhận" : "từ chối"}.`
    });

    res.json({ 
      message: `Cập nhật trạng thái thành công thành "${status}"`,
      rental: updatedRental[0]
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật trạng thái:", err);
    res.status(500).json({ 
      message: 'Đã xảy ra lỗi khi cập nhật trạng thái.',
      error: err.message
    });
  }
};

module.exports = {
  getPendingRentals,
  updateRentalStatus,
};
