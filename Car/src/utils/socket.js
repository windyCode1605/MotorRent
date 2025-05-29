import { io } from 'socket.io-client';
import { BASE_URL } from '@env';

console.log("BASE URL SocketManager:", BASE_URL);

class SocketManager {
  constructor() {
    this.socket = io(BASE_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5
    });
  }

  connect(userId) {
    if (this.socket && !this.socket.connected) {
      this.socket.connect();

      this.socket.on('connect', () => {
        console.log('Socket connected');
        // Join user's room for private messages
        this.socket.emit('join', userId);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      // Lắng nghe sự kiện cập nhật trạng thái đơn hàng
      this.socket.on('bookingStatusChanged', (data) => {
        // Xử lý thông báo ở đây
        console.log('Booking status changed:', data);
      });

      // Lắng nghe tin nhắn chat
      this.socket.on('receiveMessage', (data) => {
        console.log('New message:', data);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Gửi tin nhắn chat
  sendMessage(to, message) {
    if (this.socket) {
      this.socket.emit('sendMessage', {
        to,
        message,
        timestamp: new Date()
      });
    }
  }
}

export const socketManager = new SocketManager();
