const express = require('express');
const router = express.Router();
const receptionistController = require('../controllers/receptionistController');


// Get all receptionists
router.get('/receptionist', receptionistController.getReceptionists);


// Create new receptionist
router.post('/receptionist', receptionistController.createReceptionist);

// Update receptionist
router.put('/receptionist/:id', receptionistController.updateReceptionist);

// Delete receptionist
router.delete('/receptionist/:id', receptionistController.deleteReceptionist);

module.exports = router;