import { useEffect, useState } from "react";
import { getAdminNotifications, markAdminNotificationRead, deleteAdminNotification } from "../../services/adminNotificationService";

export default function AdminNotificationManagement() {
  const [notifications, setNotifications] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  // Load notifications from backend
  useEffect(() => {
    getAdminNotifications(status, search).then(setNotifications);
  }, [status, search]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Notifications</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select onChange={(e) => setStatus(e.target.value)} value={status} className="border p-2">
          <option value="">All</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2"
        />
      </div>

      {/* Notification List */}
      <div className="bg-white shadow rounded">
        {notifications.length > 0 ? notifications.map((n) => (
          <div key={n.id} className={`p-4 border-b flex justify-between ${n.is_read ? "" : "bg-blue-50"}`}>
            <div>
              <strong>{n.title}</strong>
              <p>{n.message}</p>
              <small>{new Date(n.created_at).toLocaleString()}</small>
            </div>
            <div className="flex gap-2">
              {!n.is_read && (
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={async () => {
                    await markAdminNotificationRead(n.id);
                    getAdminNotifications(status, search).then(setNotifications);
                  }}
                >
                  Mark Read
                </button>
              )}
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={async () => {
                  await deleteAdminNotification(n.id);
                  getAdminNotifications(status, search).then(setNotifications);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )) : (
          <p className="p-4 text-gray-500">No notifications found.</p>
        )}
      </div>
    </div>
  );
}
