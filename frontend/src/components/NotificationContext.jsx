// NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!(token && user));
  };

  // Get auth headers for API calls
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch notifications (works for both authenticated and guest users)
  const fetchNotifications = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, ...filters });
      
      let response;
      if (isAuthenticated) {
        // Fetch user notifications
        response = await axios.get(`/api/notifications/?${params}`, {
          headers: getAuthHeaders()
        });
      } else {
        // Fetch guest notifications
        response = await axios.get(`/api/guest-notifications/?${params}`);
      }
      
      if (page === 1) {
        setNotifications(response.data.notifications);
      } else {
        setNotifications(prev => [...prev, ...response.data.notifications]);
      }
      
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      // If authentication fails, try guest mode
      if (error.response?.status === 401 && isAuthenticated) {
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Retry as guest
        fetchNotifications(page, filters);
      }
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      if (isAuthenticated) {
        await axios.patch(`/api/notifications/${notificationId}/`, {
          is_read: true
        }, {
          headers: getAuthHeaders()
        });
      } else {
        // Mark guest notification as read
        await axios.patch(`/api/guest-notifications/${notificationId}/`, {
          is_read: true
        });
      }
      
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      if (isAuthenticated) {
        await axios.post('/api/notifications/mark-all-read/', {}, {
          headers: getAuthHeaders()
        });
      } else {
        await axios.post('/api/guest-notifications/mark-all-read/');
      }
      
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      let response;
      if (isAuthenticated) {
        response = await axios.get('/api/notifications/unread-count/', {
          headers: getAuthHeaders()
        });
      } else {
        response = await axios.get('/api/guest-notifications/unread-count/');
      }
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Add new notification (for real-time updates)
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.is_read) {
      setUnreadCount(prev => prev + 1);
    }
  };

  // Create notification (for testing or manual creation)
  const createNotification = async (title, message, type = 'general', metadata = {}) => {
    try {
      const data = { title, message, type, metadata };
      
      if (isAuthenticated) {
        await axios.post('/api/notifications/', data, {
          headers: getAuthHeaders()
        });
      } else {
        await axios.post('/api/guest-notifications/', data);
      }
      
      // Refresh notifications
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated !== null) {
      fetchUnreadCount();
      // Set up polling for real-time updates every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Listen for auth changes
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    notifications,
    unreadCount,
    loading,
    isAuthenticated,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    fetchUnreadCount,
    addNotification,
    createNotification,
    checkAuth
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};