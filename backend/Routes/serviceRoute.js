const express = require('express');
const router = express.Router();
const service = require('../controllers/serviceController');

router.get('/get', service.getAllServices);
router.post('/delete', service.deleteService);
router.post('/create', service.createService);

module.exports = router;