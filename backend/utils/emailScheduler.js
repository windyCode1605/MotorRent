const cron = require('node-cron');
const db = require('../config/db');
const { sendReminderEmail } = require('./emailService');

const startEmailScheduler = () => {
  
  cron.schedule('* * * * *', async () => {
    try {
    
      const [rentals] = await db.execute(`
        SELECT 
          r.rental_id, r.start_date, r.status,
          c.first_name, c.last_name, c.email, c.phone_number,
          car.brand, car.model, car.license_plate, car.color,
          car.parking_spot, car.transmission, car.fuel_type
        FROM rental r
        JOIN customers c ON r.customer_id = c.customer_id
        JOIN car ON r.car_id = car.car_id
        WHERE 
          DATE(r.start_date) = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
          AND r.status = ?
      `, ['Đã xác nhận']);

      console.log(`Tìm thấy ${rentals.length} đơn thuê xe cho ngày mai`);

      // Gửi email cho từng khách hàng
      for (const rental of rentals) {
        const customerName = `${rental.first_name} ${rental.last_name}`;
        await sendReminderEmail(rental.email, customerName, rental);
      }
    } catch (error) {
      console.error('Lỗi trong quá trình gửi email nhắc nhở:', error);
    }
  }, {
    timezone: "Asia/Ho_Chi_Minh"
  });

  console.log('Đã khởi động hệ thống gửi email tự động');
};

module.exports = { startEmailScheduler };
