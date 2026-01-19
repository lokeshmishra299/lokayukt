// components/Header.jsx
import React, { useState, useEffect } from 'react';
import { FiBell, FiHelpCircle, FiChevronDown, FiLayers } from "react-icons/fi";
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from "react-toastify";
import { toast, Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

const Header = ({ toggleMobileMenu }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

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

  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.warn('Error parsing user data:', error);
      return null;
    }
  };

  const subrole = localStorage.getItem("subrole");
  const user = getUserData();

  const getUserInitials = () => {
    if (user?.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    return 'SX';
  };

  return (
    <>
     <Toaster
        position="top-right"
       
      />
      {/* ✅ FIXED Header - stays at top */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50 h-16">
       
        <div className="w-full h-full flex items-center justify-between px-6">
          
          {/* LEFT SECTION - Logo + Title */}
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors md:hidden"
                aria-label="Toggle mobile menu"
              >
                <FaBars className="w-5 h-5" />
              </button>
            )}

            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <FiLayers size={26} className="text-white" />
            </div>

            {!isMobile && (
              <div>
                <h1 className="text-lg font-semibold text-gray-800">
                  Lokayukta Case Management
                </h1>
                <p className="text-xs text-gray-500">
                  Office of Lokayukta, Uttar Pradesh
                </p>
              </div>
            )}
          </div>

          {/* RIGHT SECTION - Notifications + Profile */}
          <div className="flex items-center gap-5">
            
            <div className="relative cursor-pointer">
              <FiBell size={20} className="text-gray-700" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>
            </div>

            {!isMobile && (
              <FiHelpCircle size={20} className="text-gray-700 cursor-pointer" />
            )}

            <div className="relative">
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <div className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {getUserInitials()}
                  </span>
                </div>

                {!isMobile && (
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">
                        {user?.name || 'User Name'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {subrole === "review-operator" ? "Record Keeper" : "Record Keeper"}
                      </span>
                    </div>
                    <FiChevronDown className="text-gray-600" />
                  </div>
                )}

                {isMobile && (
                  <FiChevronDown className="text-gray-600" />
                )}
              </div>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{user?.name || 'User Name'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                      {subrole === "review-operator" ? "RK" : "RK"}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors ${
                      isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <FaSignOutAlt className={`w-4 h-4 ${isLoggingOut ? 'animate-pulse' : ''}`} />
                    <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
