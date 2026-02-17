// components/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaFileAlt,
  FaChartBar,
  FaSearch,
  FaUsers,
  FaDatabase,
  FaTimes,
  FaChevronDown, 
  FaChevronRight 
} from "react-icons/fa";
import { IoFileTray } from "react-icons/io5";
import { FaUserGroup } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa6";
import { MdContactPage } from "react-icons/md";

const Sidebar = ({ isMobileMenuOpen, toggleMobileMenu, isCollapsed }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  
  // State for Employee Dropdown
  const [isEmployeeMenuOpen, setIsEmployeeMenuOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const isActive = (href) => {
    const fullPath = `/admin${href}`;
    if (href === "/dashboard") return location.pathname === fullPath;
    return location.pathname.startsWith(fullPath);
  };

  const handleLinkClick = () => {
    if (isMobile && isMobileMenuOpen) toggleMobileMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-16 bottom-0 bg-[#E7ECF5] border-r shadow-xl transition-all duration-300 z-50
          ${isMobile
            ? `w-64 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`
            : isCollapsed
              ? "w-16"
              : "w-64"
          }`}
      >
        {/* Mobile Close */}
        {isMobile && (
          <button
            onClick={toggleMobileMenu}
            className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-200"
          >
            <FaTimes />
          </button>
        )}

        {/* NAV */}
        <nav className="h-full overflow-y-auto px-3 py-6 space-y-2">

          {/* Dashboard */}
          <Link
            to="/admin/dashboard"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${isActive("/dashboard")
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
              }
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <FaHome />
            {(!isCollapsed || isMobile) && "Dashboard"}
          </Link>

          {/* User Management */}
          <Link
            to="/admin/user-management"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${isActive("/user-management")
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
              }
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <FaUsers />
            {(!isCollapsed || isMobile) && "User Management"}
          </Link>
          
          {/* --- EMPLOYEE MANAGEMENT DROPDOWN START --- */}
          <div>
            <button
              onClick={() => setIsEmployeeMenuOpen(!isEmployeeMenuOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition
                ${(isActive("/employment-management") || isActive("/file-administrator")) && !isEmployeeMenuOpen
                  ? "bg-blue-100 text-blue-800" 
                  : "text-gray-700 hover:bg-gray-200"
                }
                ${isCollapsed && !isMobile ? "justify-center" : ""}
              `}
            >
              <div className="flex items-center gap-3">
                <FaUserGroup />
                {(!isCollapsed || isMobile) && "Employee Management"}
              </div>
              {(!isCollapsed || isMobile) && (
                isEmployeeMenuOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />
              )}
            </button>

            {/* Dropdown Items */}
            {isEmployeeMenuOpen && (!isCollapsed || isMobile) && (
              <div className="mt-1 ml-4 space-y-1 border-l-2 border-gray-300 pl-2">
                
                {/* Original Employee Management Link */}
                <Link
                  to="/admin/employment-management"
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                    ${isActive("/employment-management")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }
                  `}
                >
                  <span className="text-xs">
                    <FaUserTie/>

                  </span> All Employees
                </Link>



                 <Link
                  to="/admin/all-leaves-files"
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                    ${isActive("/all-leaves-files")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }
                  `}
                >
                  <span className="text-xs">
                    <MdContactPage/>

                  </span> All Leaves
                </Link>

                {/* File Administrator (Moved Here) */}
                <Link
                  to="/admin/file-administrator"
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                    ${isActive("/file-administrator")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }
                  `}
                >
                  <IoFileTray />
                 Managed File
                </Link>
              </div>
            )}
          </div>
          {/* --- EMPLOYEE MANAGEMENT DROPDOWN END --- */}

          {/* Master Data */}
          <Link
            to="/admin/master-data"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${isActive("/master-data")
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
              }
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <FaDatabase />
            {(!isCollapsed || isMobile) && "Master Data"}
          </Link>

        </nav>
      </aside>
    </>
  );
};

export default Sidebar;