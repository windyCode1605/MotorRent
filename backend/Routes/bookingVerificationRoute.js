const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController')

// Lấy danh sách đơn đang chờ xác nhận
router.get('/pending', bookingController.getPendingRentals);

// Cập nhật trạng thái đơn
router.put('/update/:rental_id', bookingController.updateRentalStatus);

module.exports = router;
