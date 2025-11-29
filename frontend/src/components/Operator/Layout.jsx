// components/Layout.js
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from "./Sidebar"
import Header from './Header';
import Footer from '../Footer';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setIsCollapsed(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSidebar = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu} 
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content Area with proper margin */}
      <div 
        className="min-h-screen transition-all duration-300"
        style={{
          marginLeft: !isMobile ? (isCollapsed ? '4rem' : '16rem') : '0', // ✅ Changed from 18rem to 16rem
        }}
      >
        {/* Header - No inline styles needed */}
        <Header 
          toggleMobileMenu={toggleMobileMenu} 
          toggleSidebar={toggleSidebar}
          isCollapsed={isCollapsed}
        />

        {/* Main Content */}
        <main className={`flex-1 ${isMobile ? 'p-4' : 'p-6'}`}>
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;