const express = require('express');
const router = express.Router();
const { 
    getCustomerRentals, 
    cancelRental,
    getRentalDetails,
    updateRentalStatus
} = require('../controllers/rentalController');
const authenticateToken = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Lấy danh sách đơn thuê xe của khách hàng
router.get('/customer-rentals', authenticateToken, getCustomerRentals);

// Lấy chi tiết đơn thuê xe
router.get('/details/:rental_id', authenticateToken, getRentalDetails);

// Hủy đơn thuê xe
router.post('/cancel/:rental_id', authenticateToken, cancelRental);

// Cập nhật trạng thái đơn hàng (chỉ dành cho admin và staff)
router.put('/status/:rental_id', 
    authenticateToken, 
    authorizeRoles('admin', 'staff'), 
    updateRentalStatus);

module.exports = router;
