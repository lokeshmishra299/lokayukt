// components/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import {FiInbox,FiSend,FiFileText,FiBarChart2,FiSearch}  from "react-icons/fi";
import { IoIosDocument } from "react-icons/io";
import { TiDocumentText } from "react-icons/ti";
import { TbReportSearch } from "react-icons/tb";
import {
  
  FaHome,
  FaFileAlt,
  FaChartBar,
  FaSearch,
  FaBell,
  FaTimes,
  FaSave,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";


const Sidebar = ({
  isMobileMenuOpen,
  toggleMobileMenu,
  isCollapsed,
  toggleSidebar,
}) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  
  const subrole = localStorage.getItem("subrole") || "Operator";

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const isActive = (href) => {
    const fullPath = `/operator${href}`;

    if (href === "/dashboard") {
      return location.pathname === fullPath;
    }
    return location.pathname.startsWith(fullPath);
  };

  const handleLinkClick = () => {
    if (isMobile && isMobileMenuOpen) {
      toggleMobileMenu();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #cbd5e1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: #94a3b8;
    }
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 transparent;
    }
  `;

  return (
    <>
      <style>{scrollbarStyles}</style>

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar - Now starts below header */}
      <div
        className={`fixed left-0 bg-[#E7ECF5] text-gray-700 shadow-xl transition-all duration-300 flex flex-col ${
          isMobile
            ? `w-64 z-50 top-0 bottom-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`
            : `${isCollapsed ? "w-16" : "w-64"} z-30 top-16 bottom-0`
        }`}
      >
        {/* Mobile Close Button */}
        {isMobile && isMobileMenuOpen && (
          <button
            onClick={toggleMobileMenu}
            className="absolute top-4 right-4 p-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors z-50"
            aria-label="Close menu"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        )}

        {/* Desktop Toggle Button */}
        {/* {!isMobile && (
          <button
            onClick={toggleSidebar}
            className={`absolute bg-white text-gray-600 rounded-full shadow-lg hover:bg-gray-50 border border-gray-300 transition-all duration-300 z-10 ${
              isCollapsed ? "-right-3 top-6 p-2" : "-right-4 top-6 p-3"
            }`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <FaChevronRight className="w-4 h-4" />
            ) : (
              <FaChevronLeft className="w-4 h-4" />
            )}
          </button>
        )} */}

        {/* Header Section */}
        <div className={`px-6 py-6 flex-shrink-0 ${!isMobile && isCollapsed ? "px-3" : ""}`}>
          {/* Logo */}
          {/* <div className={`flex items-center mb-4 ${!isMobile && isCollapsed ? "justify-center" : "gap-3"}`}>
            <div className={`${!isMobile && isCollapsed ? "text-2xl" : "text-3xl"}`}>⚖️</div>
            {(isMobile || !isCollapsed) && (
              <div>
                <h3 className="text-lg font-bold text-gray-800">LokAyukta</h3>
                <h4 className="text-sm font-semibold text-gray-700">CRMS</h4>
                <span className="text-xs text-gray-500">Complaint Management</span>
              </div>
            )}
          </div> */}

          {/* Subrole Badge & Actions */}
          {/* <div className="flex justify-between items-center mb-4">
            {(isMobile || !isCollapsed) && (
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs  capitalize">
                {subrole === "review-operator" ? "RO" : "EO"}
              </span>
            )}

            {(isMobile || !isCollapsed) && (
              <div className="flex gap-2">
                <button className="relative flex items-center px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-200 transition-colors">
                  <FaBell className="w-3 h-3" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
                </button>
              </div>
            )}
          </div> */}
        </div>

        {/* Navigation Menu with Sections */}
        <nav className="flex-1 px-6 overflow-y-auto custom-scrollbar">
          {/* Workbox Section */}
          {(isMobile || !isCollapsed) && (
            <p className="text-[13px]  text-gray-800 mb-2 ml-2">Workbox</p>
          )}

          <ul className="space-y-2 mb-6">
            {/* Dashboard */}
            <li>
              <Link
                to="/operator/dashboard"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm  transition-all duration-200 rounded-lg ${
                  isActive("/dashboard")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "Dashboard" : ""}
              >
                <div className="flex items-center gap-3">
                  <AiOutlineHome className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>Dashboard</span>}
                </div>
                {isActive("/dashboard") && (isMobile) && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li>

            {/* New Complaints */}
            <li>
              <Link
                to="/operator/complaints"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm  transition-all duration-200 rounded-lg ${
                  isActive("/complaints")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "New Complaints" : ""}
              >
                <div className="flex items-center gap-3">
                  <FiFileText size={20} className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>New Complaints</span>}
                </div>
                {isActive("/complaints") && (isMobile) && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li>

            {/* Inbox */}
            <li>
              <Link
                to="/operator/all-complaints"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm  transition-all duration-200 rounded-lg ${
                  isActive("/all-complaints")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "Inbox" : ""}
              >
                <div className="flex items-center gap-3">
                    <FiInbox size={18} className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>Inbox</span>}
                </div>
                {isActive("/all-complaints") && (isMobile) && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li>

            {/*Send */}
            <li>
              <Link
                to="/operator/approved-complaints"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm  transition-all duration-200 rounded-lg ${
                  isActive("/approved-complaints")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "Sent" : ""}
              >
                <div className="flex items-center gap-3">
                  <FiSend size={18}  className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>Sent</span>}
                </div>
                {isActive("/approved-complaints") && (isMobile) && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li>

            {/* Drafts */}
            <li>
              <Link
                to="/operator/draft"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm  transition-all duration-200 rounded-lg ${
                  isActive("/draft")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "Drafts" : ""}
              >
                <div className="flex items-center gap-3">
                    <FiFileText size={18} className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>Drafts</span>}
                </div>
                {isActive("/draft") && (isMobile) && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li>

              {/* RC Log */}
             <li>
              <Link
                to="/operator/rc-log"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm  transition-all duration-200 rounded-lg ${
                  isActive("/rc-log")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "rc-log" : ""}
              >
                <div className="flex items-center gap-3">
                    <TiDocumentText size={18} className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>RC Log</span>}
                </div>
                {isActive("/rc-log") && (isMobile) && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li>

                {/* Reporting */}
             <li>
              <Link
                to="/operator/reporting"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm  transition-all duration-200 rounded-lg ${
                  isActive("/reporting")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "reporting" : ""}
              >
                <div className="flex items-center gap-3">
                    <TbReportSearch size={18} className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>Reporting</span>}
                </div>
                {isActive("/reporting") && (isMobile) && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li>
          </ul>

          {/* Case & Administration Section */}
          {/* {(isMobile || !isCollapsed) && (
            <p className="text-[13px]  text-gray-800 mb-3 mt-6">Case & Administration</p>
          )} */}

          <ul className="space-y-2">
            {/* Progress Register */}
            {/* <li>
              <Link
                to="/operator/progress-register"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm  transition-all duration-200 rounded-lg ${
                  isActive("/progress-register")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "Progress Register" : ""}
              >
                <div className="flex items-center gap-3">
                  <FiBarChart2 size={20} className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>Progress Register</span>}
                </div>
                {isActive("/progress-register") && (isMobile) && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li> */}

            {/* Search & Reports */}
            {/* <li>
              <Link
                to="/operator/search-reports"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm  transition-all duration-200 rounded-lg ${
                  isActive("/search-reports")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "Search & Reports" : ""}
              >
                <div className="flex items-center gap-3">
                  <FiSearch size={20}  className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>Search & Reports</span>}
                </div>
                {isActive("/search-reports") && (isMobile) && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
