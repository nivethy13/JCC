// frontend/src/services/notificationService.js
import axios from 'axios';

export const getNotifications = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get('/api/notifications/', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const markNotificationRead = async (id) => {
  const token = localStorage.getItem('token');
  await axios.patch(`/api/notifications/${id}/`, { is_read: true }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

