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
  FaExternalLinkAlt // <-- Icon Added Here
} from "react-icons/fa";
import { IoFileTray } from "react-icons/io5";
import { FaFileSignature } from "react-icons/fa6";
import { RiFileSearchLine } from "react-icons/ri";
import { TbFileSearch } from "react-icons/tb";
import { MdOutlinePendingActions } from "react-icons/md";

const Sidebar = ({ isMobileMenuOpen, toggleMobileMenu, isCollapsed }) => {

  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  const isFilesActive = (path) => {
    return location.pathname.startsWith("/employee/view-files") ||
           location.pathname.startsWith("/employee/add-files");
  };

  const isFilesActivee = (path) => {
    return location.pathname.startsWith("/employee/view-personal-files") ||
           location.pathname.startsWith("/employee/add-personal-files");
  };

  const isFilesActiveee = (path) => {
    return location.pathname.startsWith("/employee/view-pending-files") 
          //  location.pathname.startsWith("/employee/add-pending-files");
  };

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const isActive = (href) => {
    const fullPath = `/employee${href}`;
    if (href === "/dashboard") return location.pathname === fullPath;
    return location.pathname.startsWith(fullPath);
  };

  const handleLinkClick = () => {
    if (isMobile && isMobileMenuOpen) toggleMobileMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-16 bottom-0 bg-[#E7ECF5] border-r shadow-xl transition-all duration-300 z-50 flex flex-col
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
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2 custom-scrollbar">

          {/* Dashboard */}
          <Link
            to="/employee/dashboard"
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

          {/* Complaints */}
          {/* <Link
            to="/admin/complaints"
            onClick={handleLinkClick}
            ...
          </Link> */}

          {/* Progress Register */}
          {/* <Link
            to="/admin/progress-register"
            onClick={handleLinkClick}
            ...
          </Link> */}

          {/* Search & Reports */}
          {/* <Link
            to="/admin/search-reports"
            onClick={handleLinkClick}
            ...
          </Link> */}

          {/* User Management */}
          {/* <Link
            to="/employee/user-management"
            onClick={handleLinkClick}
            ...
          </Link> */}

          {/* Add Files */}
          {/* <Link
            to="/employee/add-files"
            onClick={handleLinkClick}
            ...
          </Link> */}

          <Link
            to="/employee/view-files"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${isFilesActive()
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
              }
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <RiFileSearchLine />
            {(!isCollapsed || isMobile) && "Leave Files"}
          </Link>

          {/* <Link
            to="/employee/view-personal-files"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${isFilesActivee()
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
              }
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <TbFileSearch />
            {(!isCollapsed || isMobile) && "Personal Files"}
          </Link> */}


          <Link
            to="/employee/view-pending-files"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${isFilesActiveee()
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
              }
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <MdOutlinePendingActions />
            {(!isCollapsed || isMobile) && "Pending Files"}
          </Link>

        </nav>

        {/* 👇 MAIN DASHBOARD BUTTON (Sabse Niche Chipkaya Hua) 👇 */}
        <div className="p-4 border-t border-gray-300 w-full bg-[#E7ECF5] mt-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Link
            to="/main-dashboard"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 text-sm font-medium transition-all duration-200 rounded-lg ${
              location.pathname === "/main-dashboard"
                ? "bg-green-600 text-white shadow-md"
                : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
            } ${isCollapsed && !isMobile ? "justify-center px-2 py-2" : "px-4 py-3"}`}
            title={isCollapsed && !isMobile ? "Main Dashboard" : ""}
          >
            <FaExternalLinkAlt className="w-[16px] h-[16px] flex-shrink-0" />
            {(!isCollapsed || isMobile) && <span>Main Dashboard</span>}
          </Link>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;