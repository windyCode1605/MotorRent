const express = require('express');
const router = express.Router();
const { getAllCustomers, getCustomerByAccountId} = require('../controllers/customerController');
const authenticateToken = require('../middleware/authMiddleware');


router.get('/', getAllCustomers);
router.get('/:account_id', authenticateToken, getCustomerByAccountId);


module.exports = router;
