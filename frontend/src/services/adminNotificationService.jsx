// // src/services/adminNotificationService.js
// import axios from 'axios';

// export const getAdminNotifications = async (status = '', search = '') => {
//   const token = localStorage.getItem('token');
//   const res = await axios.get(`/api/admin/notifications/?status=${status}&search=${search}`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return Array.isArray(res.data) ? res.data : [];
// };

// export const markAdminNotificationRead = async (id) => {
//   const token = localStorage.getItem('token');
//   await axios.patch(`/api/admin/notifications/${id}/read/`, {}, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };

// export const deleteAdminNotification = async (id) => {
//   const token = localStorage.getItem('token');
//   await axios.delete(`/api/admin/notifications/${id}/delete/`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };

import axios from "axios";

const BASE_URL = "http://localhost:8000"; // Django backend

export const getAdminNotifications = async (status = "", search = "") => {
  const res = await axios.get(
    `${BASE_URL}/api/admin/notifications/?status=${status}&search=${search}`
  );
  console.log("Backend response:", res.data); // for debugging
  return Array.isArray(res.data) ? res.data : [];
};

export const markAdminNotificationRead = async (id) => {
  await axios.patch(`${BASE_URL}/api/admin/notifications/${id}/read/`);
};

export const deleteAdminNotification = async (id) => {
  await axios.delete(`${BASE_URL}/api/admin/notifications/${id}/delete/`);
};
