// routes/vehicle.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getAllVehicles, createVehicle, getVehicleById, updateVehicle, deleteVehicle } = require('../controllers/vehiclesController');
const authenticateToken  = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.use('/uploads', express.static('uploads'));
router.get('/vehicles', authenticateToken, getAllVehicles);
router.post('/addNewMotor', authenticateToken, authorizeRoles('admin'), upload.single('IMG_Motor'), createVehicle);
router.get('/vehicles/:carId', authenticateToken, authorizeRoles('admin'), getVehicleById);
router.put('/vehicles/:carId', authenticateToken, authorizeRoles('admin'), upload.single('IMG_Motor'), updateVehicle);
router.delete('/vehicles/:carId', authenticateToken, authorizeRoles('admin'), deleteVehicle);

module.exports = router;
