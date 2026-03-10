import React, { useState, useEffect } from 'react';
import { FiBell, FiChevronDown, FiLayers } from "react-icons/fi";
import { FaBars, FaSync, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

// NAYA CHANGE: useAuth lana zaroori hai state clear karne ke liye
import { useAuth } from '../../protectedUnknownRoutes/AuthContext.jsx'; 

import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

const Header = ({ toggleMobileMenu }) => {
  const navigate = useNavigate();
  // NAYA CHANGE: auth context se setter functions nikale
  const { setRole, setSubrole, setUser } = useAuth();

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // State to hold the API data
  const [userData, setUserData] = useState(null);

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
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = () => {
    const now = currentDateTime;
    const day = now.getDate();
    const month = now.toLocaleDateString("en-US", { month: "short" });
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    return `${day} ${month} ${year}, ${hours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;
  };

  const handleRefresh = () => window.location.reload();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const api = getApiInstance();
      const res = await api.post("/logout");

      if (res.data.status === "success") {
        toast.success("Logout Successfully");
        
        setTimeout(() => {
          // 1. Storage clear karein
          localStorage.clear();
          
          // 2. React Context (Memory) ko clean karein
          if(setRole) setRole(null);
          if(setSubrole) setSubrole(null);
          if(setUser) setUser(null);

          // 3. Browser History manipulation trick (Back button disable karne ke liye)
          window.history.pushState(null, null, window.location.href);
          window.onpopstate = function () {
              window.history.go(1);
          };

          // 4. Navigate to login with 'replace'
          navigate("/login", { replace: true });
        }, 2000);

      } else {
        toast.error("Logout failed");
        setIsLoggingOut(false);
      }
    } catch {
      toast.error("Network error");
      setIsLoggingOut(false);
    } 
  };

  const getInitials = () =>
    userData?.name
      ? userData.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
      : "AD";

  return (
    <>
      <Toaster position="top-right" />

      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b shadow-sm z-50">
        <div className="h-full flex items-center justify-between px-6">

          <div className="flex items-center gap-4">
            {isMobile && (
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md hover:bg-gray-100 md:hidden"
              >
                <FaBars />
              </button>
            )}

            <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center">
              <FiLayers className="text-white text-xl" />
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

          {/* RIGHT */}
          <div className="flex items-center gap-5">

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              className="p-2 rounded-md hover:bg-gray-100 text-blue-600"
              title="Refresh"
            >
              <FaSync />
            </button>

            {/* Notification */}
            <div className="relative cursor-pointer">
              <FiBell className="text-gray-700" size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </div>

            {/* Profile */}
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <div className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center text-white font-semibold">
                  {getInitials()}
                </div>

                {!isMobile && (
                  <div className="flex items-center gap-2">
                    <div className="text-sm">
                      <p className="font-medium text-gray-700 capitalize">
                        {userData?.name || 'Loading...'}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {/* Fallback chain: subrole label -> role label -> 'Admin' */}
                        {userData?.subrole?.label || userData?.role?.label }
                      </p>
                    </div>
                    <FiChevronDown />
                  </div>
                )}
              </div>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-60 bg-white border rounded-lg shadow-lg">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold capitalize">{userData?.name || 'Loading...'}</p>
                    <p className="text-xs text-gray-500">{userData?.email || ''}</p>
                  </div>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 ${
                      isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <FaSignOutAlt className={isLoggingOut ? 'animate-pulse' : ''} />
                    {isLoggingOut ? "Logging out..." : "Logout"}
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