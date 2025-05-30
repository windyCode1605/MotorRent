const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Middleware for admin and staff only


// Lấy tất cả hợp đồng
router.get('/', contractController.getAllContracts);


// Cập nhật hợp đồng
router.put('/:id', contractController.updateContract);

// Xóa hợp đồng
router.delete('/:id', contractController.deleteContract);

module.exports = router;