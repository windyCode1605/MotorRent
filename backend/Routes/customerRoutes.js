const express = require('express');
const router = express.Router();
const { 
    getAllCustomers, 
    getCustomerByAccountId, 
    getCustomerById,
    updateCustomer,
    deleteCustomer
} = require('../controllers/customerController');


router.get('/', getAllCustomers);
router.get('/account/:account_id', getCustomerByAccountId);
router.get('/:customer_id', getCustomerById);
router.put('/:customer_id', updateCustomer);
router.delete('/:customer_id', deleteCustomer);


module.exports = router;
