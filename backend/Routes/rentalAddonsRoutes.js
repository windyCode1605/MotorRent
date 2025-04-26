const express = require('express');
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const rentalAddonsController = require('../controllers/rentalAddonsController');

router.get('/getService', rentalAddonsController.getAllAddons);
router.get('/:rental_id', rentalAddonsController.getAddonsByRentalId);
router.post('/', rentalAddonsController.createAddon);
router.put('/:addon_id', authenticateToken, rentalAddonsController.updateAddon);
router.delete('/:addon_id', authenticateToken, rentalAddonsController.deleteAddon);

module.exports = router;
