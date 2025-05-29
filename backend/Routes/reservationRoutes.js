const express = require("express");
const router = express.Router();
const { createReservation, getCustomerReservations, cancelReservation } = require("../controllers/reservationController");

router.post("/", createReservation);
router.get("/customer-reservations", getCustomerReservations);
router.post("/cancel/:reservation_id", cancelReservation);

module.exports = router;
