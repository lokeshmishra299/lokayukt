// components/Layout.js
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from "./Sidebar"
import Header from './Header';
import Footer from '../../Footer';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // ✅ FIXED: Don't auto-collapse on mobile, just detect mobile state
      if (mobile) {
        setIsCollapsed(false); // Keep expanded for mobile functionality
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header 
        toggleMobileMenu={toggleMobileMenu} 
        toggleSidebar={toggleSidebar}
        isCollapsed={isCollapsed}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen} 
          toggleMobileMenu={toggleMobileMenu} 
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
        />
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isMobile ? 'p-4' : 'p-6'
        }`} style={{
          marginLeft: !isMobile ? (isCollapsed ? '4rem' : '18rem') : '0'
        }}>
          <Outlet />
        </main>
      </div>
      
      {/* Footer को यहाँ add करें - sidebar के साथ sync होगा */}
      <div 
        className="transition-all duration-300"
        style={{
          marginLeft: !isMobile ? (isCollapsed ? '4rem' : '18rem') : '0'
        }}
      >
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
