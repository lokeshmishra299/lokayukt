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
  
      <Header 
        toggleMobileMenu={toggleMobileMenu} 
        toggleSidebar={toggleSidebar}
        isCollapsed={isCollapsed}
      />

      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu} 
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />

 
      <div 
        className="min-h-screen transition-all duration-300"
        style={{
          marginLeft: !isMobile ? (isCollapsed ? '4rem' : '16rem') : '0',
          paddingTop: '4rem', 
        }}
      >
    
        <main className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <Outlet />
        </main>

    
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
