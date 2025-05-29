const express = require('express');
const router = express.Router();
const reservationVerificationController = require('../controllers/reservationVerificationController');


router.get('/reservations/pending', reservationVerificationController.getPendingReservations);

router.put('/reservations/update/:reservation_id', reservationVerificationController.updateReservationStatus);

module.exports = router;
