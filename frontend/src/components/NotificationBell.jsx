// // NotificationBell.jsx
// import React, { useState } from 'react';
// import { Bell, X } from 'lucide-react';
// import { useNotifications } from './NotificationContext';
// import NotificationDropdown from './NotificationDropdown';

// const NotificationBell = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { unreadCount } = useNotifications();

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
//       >
//         <Bell size={24} />
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
//             {unreadCount > 99 ? '99+' : unreadCount}
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div className="fixed inset-0 z-50">
//           {/* Overlay */}
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-20"
//             onClick={() => setIsOpen(false)}
//           />
          
//           {/* Dropdown */}
//           <div className="absolute top-12 right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
//             <NotificationDropdown onClose={() => setIsOpen(false)} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;


import { useEffect, useState } from "react";
import { getNotifications, markNotificationRead } from "../services/notificationService";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 bg-white border shadow-lg w-80 max-h-96 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 border-b ${n.is_read ? "" : "bg-gray-100"}`}
              onClick={() => markNotificationRead(n.id)}
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
