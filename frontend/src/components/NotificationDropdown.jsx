// NotificationDropdown.jsx
import React, { useEffect, useState } from 'react';
import { Bell, Check, CheckCheck, X, User, LogIn } from 'lucide-react';
import { useNotifications } from './NotificationContext';
import NotificationItem from './NotificationItem';

const NotificationDropdown = ({ onClose, isAuthenticated }) => {
  const { notifications, unreadCount, loading, fetchNotifications, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState('all'); // 'all', 'unread'

  useEffect(() => {
    const filterParams = filter === 'unread' ? { is_read: false } : {};
    fetchNotifications(1, filterParams);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className="w-80 max-h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Bell size={18} />
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {!isAuthenticated && (
            <div className="flex items-center text-xs text-gray-500">
              <User size={12} className="mr-1" />
              <span>Guest</span>
            </div>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Authentication Notice for Guests */}
      {!isAuthenticated && (
        <div className="bg-blue-50 border-b border-blue-200 p-3">
          <div className="flex items-center space-x-2 text-sm text-blue-700">
            <LogIn size={16} />
            <span>Login to sync notifications across devices</span>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            filter === 'all'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            filter === 'unread'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Actions */}
      {unreadCount > 0 && (
        <div className="p-2 border-b">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <CheckCheck size={14} />
            <span>Mark all as read</span>
          </button>
        </div>
      )}

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Bell size={32} className="mx-auto mb-2 opacity-50" />
            <p>No notifications</p>
            {!isAuthenticated && (
              <p className="text-xs mt-1">Guest notifications are temporary</p>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                isGuest={!isAuthenticated}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-gray-50">
        <button
          onClick={() => {
            onClose();
            // Navigate to notifications page
            window.location.href = isAuthenticated ? '/notifications' : '/guest-notifications';
          }}
          className="w-full text-sm text-blue-600 hover:text-blue-800"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;