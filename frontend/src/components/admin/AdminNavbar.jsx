// src/components/admin/AdminNavbar.jsx
import AdminNotificationBell from "./AdminNotificationBell";

export default function AdminNavbar() {
  return (
    <nav className="flex justify-between items-center bg-white shadow px-4 py-2">
      <div className="text-xl font-bold">Admin Dashboard</div>
      <div className="flex items-center gap-4">
        <AdminNotificationBell />
        <img src="/admin-avatar.png" alt="Admin" className="w-8 h-8 rounded-full" />
      </div>
    </nav>
  );
}

