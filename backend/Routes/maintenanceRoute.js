const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

router.get('/', maintenanceController.getAllMaintenance);
router.post('/create', maintenanceController.createMaintenance);
router.put('/updateCost/:maintenance_id', maintenanceController.updateCost);


module.exports = router;