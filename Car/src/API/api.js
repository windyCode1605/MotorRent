import axios from 'axios';

const API_URL = 'http://192.168.1. :3000/api'; // Thay đổi nếu cần

export const getMotorcycles = async () => {
  try {
    const response = await axios.get(`${API_URL}/motorcycles`);
    return response.data;
  } catch (error) {
    console.error('Error fetching motorcycles:', error);
    return [];
  }
};

export const bookMotorcycle = async (bookingData) => {
  try {
    const response = await axios.post(`${API_URL}/bookings`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error booking motorcycle:', error);
    return null;
  }
};