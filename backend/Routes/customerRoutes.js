const express = require('express');
const router = express.Router();
const { getAllCustomers, getCustomerByAccountId} = require('../controllers/customerController');



router.get('/', getAllCustomers);
router.get('/:account_id', getCustomerByAccountId);


module.exports = router;
