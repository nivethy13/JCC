// NotificationBell.jsx
import React, { useState } from 'react';
import { Bell, X, User } from 'lucide-react';
import { useNotifications } from './NotificationContext';
import NotificationDropdown from './NotificationDropdown';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount, isAuthenticated } = useNotifications();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-20"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-12 right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
            <NotificationDropdown 
              onClose={() => setIsOpen(false)} 
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;