// import axios from 'axios';

// const api = axios.create({
//   baseURL: '/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // About API
// export const getAboutPage = () => api.get('/about/');
// export const updateAboutPage = (data) => api.patch('/about/', data);
// export const getAboutImages = () => api.get('/about/images/');
// export const uploadAboutImage = (imageData) => api.post('/about/images/', imageData, {
//   headers: {
//     'Content-Type': 'multipart/form-data'
//   }
// });

// // Gallery API
// export const getGalleryCategories = () => api.get('/gallery/categories/');
// export const getGalleryImages = (params) => api.get('/gallery/images/', { params });
// export const uploadGalleryImage = (imageData) => api.post('/gallery/images/', imageData, {
//   headers: {
//     'Content-Type': 'multipart/form-data'
//   }
// });

// // Notifications API
// export const getNotifications = () => api.get('/notifications/');
// export const markNotificationAsRead = (id) => api.patch(`/notifications/${id}/`, { is_read: true });
// export const getUnreadCount = () => api.get('/notifications/unread-count/');

// export default api;