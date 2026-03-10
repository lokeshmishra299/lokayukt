// components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiHelpCircle, FiChevronDown, FiLayers } from "react-icons/fi";
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// NAYA CHANGE: Aapka exact path yahan hai
import { useAuth } from '../../../protectedUnknownRoutes/AuthContext.jsx';

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

const Header = ({ toggleMobileMenu }) => {
  const navigate = useNavigate();
  
  // NAYA CHANGE: Context se state clear karne ke functions
  const { setRole, setSubrole, setUser } = useAuth();

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // State to hold the API data
  const [userData, setUserData] = useState(null);
  
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

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

  // Fetch User Data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const api = getApiInstance();
        const response = await api.get('/me'); 
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

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

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

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

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      const api = getApiInstance();
      const response = await api.post('/logout');

      if (response.data.status === 'success') {
        toast.success('Logout Successfully');
        
        timeoutRef.current = setTimeout(() => {
          // 1. LocalStorage ko saaf karein
          localStorage.clear();

          // 2. React ki memory (Context API) ko reset karein
          if (setRole) setRole(null);
          if (setSubrole) setSubrole(null);
          if (setUser) setUser(null);

          // 3. MAIN TRICK: Browser History Block karna
          window.history.pushState(null, null, window.location.href);
          window.onpopstate = function () {
              window.history.go(1);
          };

          // 4. navigate with replace (window.open ki jagah)
          navigate("/login", { replace: true });
        }, 2000);
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
      timeoutRef.current = setTimeout(() => {
        setIsLoggingOut(false);
      }, 1500);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getUserInitials = () => {
    if (userData?.name) {
      const nameParts = userData.name.split(' ');
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      }
      return userData.name.substring(0, 2).toUpperCase();
    }
    return 'LK';
  };

  return (
    <>
      <Toaster position="top-right" />

      {/* ✅ FIXED Header - stays at top */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50 h-16">
        <div className="w-full h-full flex items-center justify-between px-4 md:px-6">
          
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
                  {formatDateTime()}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT SECTION - Notifications + Profile */}
          <div className="flex items-center gap-5">
            
            <div className="relative cursor-pointer" aria-label="Notifications">
              <FiBell size={20} className="text-gray-700" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>
            </div>

            {!isMobile && (
              <FiHelpCircle 
                size={20} 
                className="text-gray-700 cursor-pointer" 
                aria-label="Help"
              />
            )}

            <div className="relative" ref={dropdownRef}>
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
                      <span className="text-sm font-medium text-gray-700 capitalize">
                         {/* Display API Name */}
                        {userData?.name}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                         {/* Display API Subrole Label, fallback to Role Label, fallback to string */}
                        {userData?.subrole?.label || userData?.role?.label}
                      </span>
                    </div>
                    <FiChevronDown className="text-gray-600" />
                  </div>
                )}

                {isMobile && (
                  <FiChevronDown className="text-gray-600" />
                )}
              </div>

              {/* DROPDOWN MENU */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[60]">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 capitalize">
                      {userData?.name || 'Loading...'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userData?.email || ''}
                    </p>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                      {userData?.subrole?.label || userData?.role?.label}
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