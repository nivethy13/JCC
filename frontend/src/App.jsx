
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Test from './pages/Test';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import About from './components/AboutUs';
import AboutUs from './pages/AboutUs';
import AboutManagement from './components/admin/AboutManagement';
import GalleryManagement from './components/admin/GalleryManagement';
import AdminLayout from "./pages/AdminLayout";
import AdminNotificationManagement from './components/admin/AdminNotificationManagement';
import Gallery from './components/admin/Gallery.jsx';

function App() {
  return (
      <Router>
        <Routes> 
                   
          <Route path="/" element={<Test />} />
          {/* <Route path="/about" element={<AboutPage />} /> */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/us" element={<About />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/about-management" element={<AboutManagement />} />
          <Route path="/gallery-management" element={<GalleryManagement />} />
          {/* <Route path="/notification-management" element={<NotificationManagement />} /> */}
          <Route path="/layout" element={<AdminLayout />} />
          <Route path="/notification" element={<AdminNotificationManagement />} />
          <Route path="/check" element={<Gallery />} />

        </Routes>
      </Router>
  );
}

export default App;