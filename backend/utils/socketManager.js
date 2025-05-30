const socketIO = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);


    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
      socket.join(`customer_${userId}`); // Add for booking notifications
      console.log(`User ${userId} joined their room`);
    });

   
    socket.on('bookingStatusChange', (data) => {
      const { rental_id, status, message } = data;
      socket.broadcast.emit('bookingStatusUpdated', {
        rental_id,
        status,
        message
      });
    });

   
    socket.on('sendMessage', async (data) => {
      const { from, to, message } = data;
    
      io.to(`user_${to}`).emit('receiveMessage', {
        from,
        message,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};


const notifyContractApproval = (userId, contractData) => {
  if (!io) return;
  io.to(`user_${userId}`).emit('contractApproved', contractData);
};


const notifyBookingStatusChange = (userId, bookingData) => {
  if (!io) return;
  io.to(`user_${userId}`).emit('bookingStatusChanged', bookingData);
};

module.exports = {
  initializeSocket,
  getIO,
  notifyContractApproval,
  notifyBookingStatusChange
};
