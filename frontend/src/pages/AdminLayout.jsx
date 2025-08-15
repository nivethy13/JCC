// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import AdminNotificationBell from "../components/AdminNotificationBell";

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-6">Admin Menu</h2>
        <nav>
          <a href="/admin" className="block py-2">Dashboard</a>
          <a href="/admin/bookings" className="block py-2">Bookings</a>
          <a href="/admin/halls" className="block py-2">Halls</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex justify-between items-center bg-white shadow p-4">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <AdminNotificationBell />
            <img
              src="/admin-avatar.png"
              alt="Admin"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
