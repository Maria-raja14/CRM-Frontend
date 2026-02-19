import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const sendWhatsAppMessage = async (data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/whatsapp/send`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getMessageHistory = async (phoneNumber) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/whatsapp/history/${phoneNumber}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};