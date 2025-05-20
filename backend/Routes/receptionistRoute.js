const express = require('express');
const router = express.Router();
const ReceptionistController = require('../controllers/receptionistController');


router.get('/Receptionist', ReceptionistController.getReceptionists);

module.exports = router;