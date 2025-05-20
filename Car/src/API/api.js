import axios from 'axios';
const { BASE_URL } = "@env";

export const getMotorcycles = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/motorcycles`);
    return response.data;
  } catch (error) {
    console.error('Error fetching motorcycles:', error);
    return [];
  }
};

export const bookMotorcycle = async (bookingData) => {
  try {
    const response = await axios.post(`${BASE_URL}/bookings`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error booking motorcycle:', error);
    return null;
  }
};