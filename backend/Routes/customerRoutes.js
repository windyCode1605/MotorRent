const express = require('express');
const router = express.Router();
const { 
    getAllCustomers, 
    getCustomerByAccountId, 
    getCustomerById,
    updateCustomer,
    deleteCustomer
} = require('../controllers/customerController');

// Get all customers
router.get('/', getAllCustomers);

// Get customer by account ID
router.get('/account/:account_id', getCustomerByAccountId);

// Get customer by ID
router.get('/:customer_id', getCustomerById);

// Update customer
router.put('/:customer_id', updateCustomer);

// Delete customer
router.delete('/:customer_id', deleteCustomer);


module.exports = router;
