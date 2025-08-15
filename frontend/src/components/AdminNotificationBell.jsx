import { useEffect, useState } from "react";
import { getAdminNotifications, markAdminNotificationRead } from "../services/adminNotificationService";

export default function AdminNotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getAdminNotifications().then(setNotifications);
  }, []);

  const unreadCount = Array.isArray(notifications)
  ? notifications.filter(n => !n.is_read).length
  : 0;


  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        📢
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 bg-white border shadow-lg w-96 max-h-96 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 border-b ${n.is_read ? "" : "bg-blue-50"}`}
              onClick={() => markAdminNotificationRead(n.id)}
            >
              <strong>{n.title}</strong>
              <p>{n.message}</p>
              <small>{new Date(n.created_at).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
