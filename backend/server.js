// server.js
const express = require('express');
const path = require('path');
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'local'}`
});

const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const login              = require('./Routes/authRoutes');
const customerRoutes     = require('./Routes/customerRoutes');
const rentalAddonRoutes  = require('./Routes/rentalAddonsRoutes');
const reservationRoutes  = require('./Routes/reservationRoutes');
const vehicleRoutes      = require('./Routes/vehicleRoutes');


const authenticateToken  = require('./middleware/authMiddleware');
const { authorizeRoles } = require('./middleware/roleMiddleware');


app.use('/', login);
app.use('/customers', authenticateToken, customerRoutes);
app.use('/rentaladdons', rentalAddonRoutes);
app.use('/reservations', reservationRoutes);
app.use('/', authenticateToken,  vehicleRoutes);
app.use('/', authenticateToken, authorizeRoles('admin') ,vehicleRoutes);

// chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
