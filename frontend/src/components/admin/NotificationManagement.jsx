// NotificationManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Users, 
  Calendar, 
  MessageCircle, 
  Filter,
  Search,
  Send,
  Eye,
  Trash2,
  Settings
} from 'lucide-react';
import axios from 'axios';

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    today: 0,
    pending_approvals: 0
  });
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    date_range: '7',
    search: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Fetch notifications with filters
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.status !== 'all') params.append('is_read', filters.status === 'read');
      if (filters.search) params.append('search', filters.search);
      if (filters.date_range !== 'all') {
        const days = parseInt(filters.date_range);
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);
        params.append('from_date', fromDate.toISOString().split('T')[0]);
      }

      const response = await axios.get(`/api/admin/notifications/?${params}`);
      setNotifications(response.data.notifications);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/notification-stats/');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    try {
      switch (action) {
        case 'mark_read':
          await axios.post('/api/admin/notifications/bulk-mark-read/', {
            notification_ids: selectedNotifications
          });
          break;
        case 'delete':
          await axios.delete('/api/admin/notifications/bulk-delete/', {
            data: { notification_ids: selectedNotifications }
          });
          break;
      }
      
      setSelectedNotifications([]);
      setShowBulkActions(false);
      fetchNotifications();
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  // Send custom notification
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendForm, setSendForm] = useState({
    recipient_type: 'all', // 'all', 'customers', 'admins', 'specific'
    specific_users: [],
    title: '',
    message: '',
    type: 'general',
    send_email: false
  });

  const handleSendNotification = async () => {
    try {
      await axios.post('/api/admin/send-notification/', sendForm);
      setShowSendModal(false);
      setSendForm({
        recipient_type: 'all',
        specific_users: [],
        title: '',
        message: '',
        type: 'general',
        send_email: false
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notification Management</h1>
            <p className="text-gray-600 mt-2">Manage and monitor system notifications</p>
          </div>
          <button
            onClick={() => setShowSendModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Send size={20} />
            <span>Send Notification</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <MessageCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending_approvals}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Types</option>
              <option value="booking_success">Booking Success</option>
              <option value="booking_rejected">Booking Rejected</option>
              <option value="payment_approved">Payment Approved</option>
              <option value="complaint_replied">Complaint Replied</option>
              <option value="new_booking">New Booking</option>
              <option value="new_complaint">New Complaint</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={filters.date_range}
              onChange={(e) => setFilters(prev => ({ ...prev, date_range: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="1">Today</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedNotifications.length} notification(s) selected
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleBulkAction('mark_read')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                Mark as Read
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedNotifications([])}
                className="text-gray-600 hover:text-gray-800 px-3 py-1 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading notifications...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.length === notifications.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedNotifications(notifications.map(n => n.id));
                        } else {
                          setSelectedNotifications([]);
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    selected={selectedNotifications.includes(notification.id)}
                    onSelect={(selected) => {
                      if (selected) {
                        setSelectedNotifications(prev => [...prev, notification.id]);
                      } else {
                        setSelectedNotifications(prev => prev.filter(id => id !== notification.id));
                      }
                    }}
                    onUpdate={fetchNotifications}
                  />
                ))}
              </tbody>
            </table>

            {notifications.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Bell size={48} className="mx-auto mb-4 opacity-20" />
                <p>No notifications found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Send Notification Modal */}
      {showSendModal && (
        <SendNotificationModal
          form={sendForm}
          setForm={setSendForm}
          onSend={handleSendNotification}
          onClose={() => setShowSendModal(false)}
        />
      )}
    </div>
  );
};

// NotificationRow Component
const NotificationRow = ({ notification, selected, onSelect, onUpdate }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getTypeColor = (type) => {
    const colors = {
      booking_success: 'bg-green-100 text-green-800',
      booking_rejected: 'bg-red-100 text-red-800',
      payment_approved: 'bg-blue-100 text-blue-800',
      payment_rejected: 'bg-red-100 text-red-800',
      complaint_replied: 'bg-purple-100 text-purple-800',
      new_booking: 'bg-orange-100 text-orange-800',
      new_complaint: 'bg-yellow-100 text-yellow-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.default;
  };

  const markAsRead = async () => {
    try {
      await axios.patch(`/api/admin/notifications/${notification.id}/`, {
        is_read: true
      });
      onUpdate();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteNotification = async () => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await axios.delete(`/api/admin/notifications/${notification.id}/`);
        onUpdate();
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    }
  };

  return (
    <>
      <tr className={`hover:bg-gray-50 ${!notification.is_read ? 'bg-blue-50' : ''}`}>
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div>
            <div className="text-sm font-medium text-gray-900">
              {notification.user.first_name} {notification.user.last_name}
            </div>
            <div className="text-sm text-gray-500">{notification.user.email}</div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notification.type)}`}>
            {notification.type.replace('_', ' ')}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-900">{notification.title}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {notification.message}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            notification.is_read ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {notification.is_read ? 'Read' : 'Unread'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(notification.created_at).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-900"
          >
            <Eye size={16} />
          </button>
          {!notification.is_read && (
            <button
              onClick={markAsRead}
              className="text-green-600 hover:text-green-900"
              title="Mark as read"
            >
              <Eye size={16} />
            </button>
          )}
          <button
            onClick={deleteNotification}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 size={16} />
          </button>
        </td>
      </tr>
      
      {showDetails && (
        <tr>
          <td colSpan="7" className="px-6 py-4 bg-gray-50">
            <div className="text-sm">
              <p className="font-medium text-gray-900 mb-2">Full Message:</p>
              <p className="text-gray-700 mb-4">{notification.message}</p>
              
              {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                <div>
                  <p className="font-medium text-gray-900 mb-2">Metadata:</p>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(notification.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

// Send Notification Modal
const SendNotificationModal = ({ form, setForm, onSend, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (form.recipient_type === 'specific') {
      fetchUsers();
    }
  }, [form.recipient_type]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get('/api/admin/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Send Notification</h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
            <select
              value={form.recipient_type}
              onChange={(e) => setForm(prev => ({ ...prev, recipient_type: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Users</option>
              <option value="customers">Customers Only</option>
              <option value="admins">Admins Only</option>
              <option value="specific">Specific Users</option>
            </select>
          </div>

          {form.recipient_type === 'specific' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Users</label>
              {loadingUsers ? (
                <p className="text-gray-500">Loading users...</p>
              ) : (
                <select
                  multiple
                  value={form.specific_users}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    specific_users: Array.from(e.target.selectedOptions, option => option.value)
                  }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
                >
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.email})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Notification title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Notification message"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="general">General</option>
              <option value="announcement">Announcement</option>
              <option value="maintenance">Maintenance</option>
              <option value="promotion">Promotion</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="send_email"
              checked={form.send_email}
              onChange={(e) => setForm(prev => ({ ...prev, send_email: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="send_email" className="ml-2 text-sm text-gray-700">
              Also send via email
            </label>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSend}
            disabled={!form.title || !form.message}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationManagement;