// frontend/src/services/aboutService.js - UPDATED VERSION
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// OPTIONAL: Add token to requests if available (for logged-in users)
// Remove this interceptor if you don't want ANY authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const aboutService = {
  // Public API - Get About Us data
  getAboutUs: async () => {
    try {
      const response = await api.get('/about/');
      return response.data;
    } catch (error) {
      console.error('Error fetching about us data:', error);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch about us data');
    }
  },

  // Update About Us data (NO AUTHENTICATION REQUIRED)
  updateAboutUs: async (formData) => {
    try {
      console.log('Sending update request...');
      const response = await api.put('/about/update/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update error details:', error.response?.data);
      console.error('Full error:', error);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to update about us data');
    }
  },

  // Upload additional image (NO AUTHENTICATION REQUIRED)
  uploadImage: async (imageData) => {
    try {
      const formData = new FormData();
      formData.append('image', imageData.image);
      formData.append('caption', imageData.caption || '');

      const response = await api.post('/about/images/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to upload image');
    }
  },

  // Delete image (NO AUTHENTICATION REQUIRED)
  deleteImage: async (imageId) => {
    try {
      const response = await api.delete(`/about/images/${imageId}/delete/`);
      return response.data;
    } catch (error) {
      console.error('Delete image error:', error);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to delete image');
    }
  },

  // Update image caption (NO AUTHENTICATION REQUIRED)
  updateImageCaption: async (imageId, caption) => {
    try {
      const response = await api.put(`/about/images/${imageId}/caption/`, {
        caption: caption,
      });
      return response.data;
    } catch (error) {
      console.error('Update caption error:', error);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to update caption');
    }
  },

  // Reorder images (NO AUTHENTICATION REQUIRED)
  reorderImages: async (imageOrders) => {
    try {
      const response = await api.post('/about/images/reorder/', {
        image_orders: imageOrders,
      });
      return response.data;
    } catch (error) {
      console.error('Reorder images error:', error);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to reorder images');
    }
  },
};

// NO AUTHENTICATION VERSION - Remove token interceptor entirely
export const aboutServiceNoAuth = {
  // Create axios instance without auth interceptor
  api: axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  }),

  // All methods without any authentication
  getAboutUs: async function() {
    try {
      const response = await this.api.get('/about/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch about us data');
    }
  },

  updateAboutUs: async function(formData) {
    try {
      const response = await this.api.put('/about/update/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update about us data');
    }
  },

  uploadImage: async function(imageData) {
    try {
      const formData = new FormData();
      formData.append('image', imageData.image);
      formData.append('caption', imageData.caption || '');

      const response = await this.api.post('/about/images/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to upload image');
    }
  },

  deleteImage: async function(imageId) {
    try {
      const response = await this.api.delete(`/about/images/${imageId}/delete/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete image');
    }
  },

  updateImageCaption: async function(imageId, caption) {
    try {
      const response = await this.api.put(`/about/images/${imageId}/caption/`, {
        caption: caption,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update caption');
    }
  },

  reorderImages: async function(imageOrders) {
    try {
      const response = await this.api.post('/about/images/reorder/', {
        image_orders: imageOrders,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to reorder images');
    }
  },
};