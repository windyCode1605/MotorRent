const express = require('express');
const router = express.Router();
const reservationVerificationController = require('../controllers/reservationVerificationController');


// Lấy danh sách đơn đang chờ xác nhận
router.get('/pending', reservationVerificationController.getPendingReservations);

// Cập nhật trạng thái đơn
router.put('/update/:reservation_id',reservationVerificationController.updateReservationStatus);

module.exports = router;
