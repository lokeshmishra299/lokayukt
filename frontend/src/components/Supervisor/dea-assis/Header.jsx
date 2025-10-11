// components/Header.jsx
import React, { useState, useEffect } from 'react';
import { FaSync, FaBars, FaUser, FaEnvelope, FaPhone, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const subrole = localStorage.getItem("subrole")
//  const subRole = localStorage.getItem("subrole")


const Header = ({ toggleMobileMenu, toggleSidebar, isCollapsed }) => {
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Create axios instance with token
  const getApiInstance = () => {
    const token = localStorage.getItem("access_token");
    return axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  };

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Format date and time exactly like in image: "25 Sep 2025, 12:48 am"
  const formatDateTime = () => {
    const now = currentDateTime;
    const day = now.getDate();
    const month = now.toLocaleDateString('en-US', { month: 'short' });
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    return `${day} ${month} ${year}, ${hours}:${minutesStr} ${ampm}`;
  };

  // Logout function with API call
  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      const api = getApiInstance();
      const response = await api.post('/logout');

      if (response.data.status === 'success') {
        toast.success('Logout Successfully');
        
        setTimeout(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          localStorage.removeItem('role'); 
          localStorage.removeItem('subrole'); 
          window.open("/login", "_self");
        }, 1500);
       
      } else {
        toast.error('Logout failed. Please try again.');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Network error during logout. Please try again.');
      }
    } finally {
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 1500);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // ✅ Safe user data parsing with error handling
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.warn('Error parsing user data:', error);
      return null;
    }
  };

  // ✅ Safe role parsing from localStorage
  const getUserRole = () => {
    try {
      const role = localStorage.getItem('role');
      return role || 'supervisor';
    } catch (error) {
      return 'supervisor';
    }
  };

  const user = getUserData();
  const userRole = getUserRole();

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />

      {/* ✅ RESPONSIVE Header - Mobile First Design */}
      <header 
        className="bg-white border-b border-gray-200 relative z-20"
        style={{
          marginLeft: !isMobile ? (isCollapsed ? '4rem' : '18rem') : '0',
          width: !isMobile ? (isCollapsed ? 'calc(100% - 4rem)' : 'calc(100% - 18rem)') : '100%'
        }}
      >
        <div className={`flex justify-between items-center ${isMobile ? 'px-3 py-3' : 'px-6 py-4'}`}>
          
          {/* ✅ LEFT SIDE - Mobile Menu + Clock + DateTime */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* ✅ MOBILE: Hamburger Menu Button */}
            {isMobile && (
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Toggle mobile menu"
              >
                <FaBars className="w-5 h-5" />
              </button>
            )}

            {/* ✅ Clock Icon - Responsive */}
            <div className={`flex items-center justify-center ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`}>
              <div className={`border-2 border-gray-400 rounded-full relative ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`}>
                <div className="absolute top-0 left-1/2 w-0.5 h-1.5 bg-gray-400 transform -translate-x-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-1 h-0.5 bg-gray-400 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
            
            {/* ✅ Date Time Text - Responsive */}
            <span className={`text-gray-600 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {isMobile ? 
                // Mobile: Show shorter format
                `${new Date().getDate()} ${new Date().toLocaleDateString('en-US', { month: 'short' })}` :
                // Desktop: Show full format
                formatDateTime()
              }
            </span>
          </div>

          {/* ✅ RIGHT SIDE - User Info + Actions (Responsive) */}
          <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-2'}`}>
            
            {/* ✅ User Details - Hidden on very small screens */}
            {!isMobile && (
              <div className="flex flex-col">
                {/* User Name & Role */}
                <div className="flex items-center">
                  <FaUser className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </span>
                  <span className="ml-2 px-2 py-0.5 border text-black text-xs rounded-full font-medium">
                    {subrole == "dea-assis" ? "DA" : "DA" }
                  </span>
                </div>

                {/* User Email */}
                <div>
                  <span className="text-xs text-gray-500">
                    {user?.email || "sahil@gmail.com"}
                  </span>
                </div>
              </div>
            )}

            {/* ✅ MOBILE: User Icon Only */}
            {isMobile && (
              <div className="flex items-center gap-1">
                <FaUser className="w-4 h-4 text-gray-600" />
                <span className="text-xs text-gray-600 font-medium">
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
              </div>
            )}

            {/* ✅ Action Buttons - Responsive */}
            <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-2'}`}>
              {/* Refresh Icon */}
              <button
                onClick={handleRefresh}
                className={`text-blue-500 rounded-lg hover:bg-gray-100 transition-colors ${
                  isMobile ? 'p-1.5' : 'p-2'
                }`}
                title="Refresh"
              >
                <FaSync className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
              </button>

              {/* Logout Icon */}
              <button 
                className={`text-red-600 transition-colors rounded-lg hover:bg-gray-100 ${
                  isMobile ? 'p-1.5' : 'p-2'
                } ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleLogout}
                disabled={isLoggingOut}
                title="Logout"
              >
                <FaSignOutAlt className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} ${
                  isLoggingOut ? 'animate-pulse' : ''
                }`} />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
