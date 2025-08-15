// NotificationItem.jsx
import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  MessageCircle, 
  Calendar, 
  Star,
  User,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { useNotifications } from './NotificationContext';

const NotificationItem = ({ notification }) => {
  const { markAsRead } = useNotifications();

  const getNotificationIcon = (type) => {
    const iconProps = { size: 16, className: "text-white" };
    
    switch (type) {
      case 'booking_success':
        return { icon: <CheckCircle {...iconProps} />, bgColor: 'bg-green-500' };
      case 'booking_rejected':
        return { icon: <XCircle {...iconProps} />, bgColor: 'bg-red-500' };
      case 'payment_approved':
        return { icon: <CreditCard {...iconProps} />, bgColor: 'bg-blue-500' };
      case 'payment_rejected':
        return { icon: <XCircle {...iconProps} />, bgColor: 'bg-red-500' };
      case 'complaint_replied':
        return { icon: <MessageCircle {...iconProps} />, bgColor: 'bg-purple-500' };
      case 'event_completed':
        return { icon: <Star {...iconProps} />, bgColor: 'bg-yellow-500' };
      case 'profile_updated':
        return { icon: <User {...iconProps} />, bgColor: 'bg-indigo-500' };
      case 'new_booking':
        return { icon: <Calendar {...iconProps} />, bgColor: 'bg-orange-500' };
      case 'new_complaint':
        return { icon: <AlertCircle {...iconProps} />, bgColor: 'bg-red-500' };
      default:
        return { icon: <AlertCircle {...iconProps} />, bgColor: 'bg-gray-500' };
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleClick = () => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    
    // Handle navigation based on notification type
    const { type, metadata } = notification;
    switch (type) {
      case 'booking_success':
      case 'booking_rejected':
        if (metadata.booking_id) {
          window.location.href = `/bookings/${metadata.booking_id}`;
        }
        break;
      case 'complaint_replied':
        if (metadata.complaint_id) {
          window.location.href = `/complaints/${metadata.complaint_id}`;
        }
        break;
      case 'event_completed':
        if (metadata.booking_id) {
          window.location.href = `/feedback/${metadata.booking_id}`;
        }
        break;
      default:
        break;
    }
  };

  const { icon, bgColor } = getNotificationIcon(notification.type);

  return (
    <div
      onClick={handleClick}
      className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
        !notification.is_read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${bgColor}`}>
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium text-gray-900 ${!notification.is_read ? 'font-semibold' : ''}`}>
              {notification.title}
            </p>
            {!notification.is_read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {formatTimeAgo(notification.created_at)}
            </span>
            
            {notification.metadata.booking_id && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                #{notification.metadata.booking_id}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;