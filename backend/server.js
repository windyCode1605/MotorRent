const express = require('express');
const path = require('path');
const http = require('http');
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'local'}`
});
const { startEmailScheduler } = require('./utils/emailScheduler');
const { initializeSocket } = require('./utils/socketManager');

const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ROUTES
const login              = require('./Routes/authRoutes');
const customerRoutes     = require('./Routes/customerRoutes');
const rentalAddonRoutes  = require('./Routes/rentalAddonsRoutes');
const reservationRoutes  = require('./Routes/reservationRoutes');
const vehicleRoutes      = require('./Routes/vehicleRoutes');
const momoRoutes         = require('./Routes/paymentRoute');
const contractRoute      = require('./Routes/contractRoute');
const maintenanceRoute   = require('./Routes/maintenanceRoute');
const receptionistRoutes = require('./Routes/receptionistRoute');
const serviceRoute       = require('./Routes/serviceRoute');
const bookingRoutes = require('./Routes/bookingVerificationRoute');
const rentalRoutes = require('./Routes/rentalRoutes');

// MIDDLEWARE
const authenticateToken  = require('./middleware/authMiddleware');
const { authorizeRoles } = require('./middleware/roleMiddleware');

// PUBLIC ROUTES
app.use('/', login);
app.use('/customers', authenticateToken ,customerRoutes);
app.use('/rentaladdons', rentalAddonRoutes);

// RENTAL ROUTES
app.use('/booking', authenticateToken, authorizeRoles('admin'), bookingRoutes); 
app.use('/rental', authenticateToken, rentalRoutes);

// PROTECTED ROUTES (yêu cầu đăng nhập)
app.use('/reservation', authenticateToken, reservationRoutes);
app.use('/payment', authenticateToken, momoRoutes);

// VEHICLE ROUTES — Phân quyền rõ ràng
app.use('/' ,vehicleRoutes); 

// CONTRACT ROUTES — Phân quyền rõ ràng
app.use('/contracts', contractRoute);

// MAINTENANCE ROUTES — Phân quyền rõ ràng
app.use('/maintenance', authenticateToken, authorizeRoles('admin', 'staff'), maintenanceRoute);
//Receptionistmaintenance
app.use('/Receptionist', authenticateToken, authorizeRoles('admin'), receptionistRoutes);

app.use('/services', authenticateToken, authorizeRoles('admin'), serviceRoute);
app.use('/rental', authenticateToken, rentalRoutes);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

// SERVER
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  //startEmailScheduler();
  console.log('Socket.IO đã sẵn sàng nhận kết nối');
});
