// components/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import {FiInbox,FiSend,FiFileText,FiBarChart2,FiSearch}  from "react-icons/fi";
import { HiMiniUsers } from "react-icons/hi2";
import { FaDatabase } from "react-icons/fa";
import { RiQrScanFill } from "react-icons/ri";
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
    const fullPath = `/dispatch${href}`;

    // Make dashboard active for exact match OR when at base /dispatch route
    if (href === "/dashboard") {
      return location.pathname === fullPath || location.pathname === "/dispatch" || location.pathname === "/dispatch/";
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

        {/* Header Section */}
        <div className={`px-6 py-6 flex-shrink-0 ${!isMobile && isCollapsed ? "px-3" : ""}`}>
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
                to="/dispatch/dashboard"
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
                {isActive("/dashboard") && (isMobile ) && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li>

          {/* Inbox */}
            <li>
              <Link
                to="/dispatch/all-complaints"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm  transition-all duration-200 rounded-lg ${
                  isActive("/all-complaints")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "New Complaints" : ""}
              >
                <div className="flex items-center gap-3">
                  <FiInbox size={20} className="w-[18px] h-[18px] flex-shrink-0" />
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
                            to="/dispatch/approved-complaints"
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


                        {/* userMangment */}
                      
                   

                        {/* <li>
                          <Link
                            to="/dispatch/user-management"
                            onClick={handleLinkClick}
                            className={`flex items-center justify-between text-sm  transition-all duration-200 rounded-lg ${
                              isActive("/user-management")
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-700 hover:bg-gray-200"
                            } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                            title={!isMobile && isCollapsed ? "Sent" : ""}
                          >
                            <div className="flex items-center gap-3">
                              <HiMiniUsers size={18}  className="w-[18px] h-[18px] flex-shrink-0" />
                              {(isMobile || !isCollapsed) && <span>User Management</span>}
                            </div>
                            {isActive("/user-management") && (isMobile) && (
                              <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                                <div className="w-4 h-4 bg-white rounded-full"></div>
                              </div>
                            )}
                          </Link>
                        </li> */}


                            {/* masterData */}
                        {/* <li>
                          <Link
                            to="/dispatch/master-data"
                            onClick={handleLinkClick}
                            className={`flex items-center justify-between text-sm  transition-all duration-200 rounded-lg ${
                              isActive("/master-data")
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-700 hover:bg-gray-200"
                            } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                            title={!isMobile && isCollapsed ? "Sent" : ""}
                          >
                            <div className="flex items-center gap-3">
                              <FaDatabase size={18}  className="w-[18px] h-[18px] flex-shrink-0" />
                              {(isMobile || !isCollapsed) && <span>Master Data</span>}
                            </div>
                            {isActive("/master-data") && (isMobile) && (
                              <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                                <div className="w-4 h-4 bg-white rounded-full"></div>
                              </div>
                            )}
                          </Link>
                        </li> */}


{/* Reporting */}

                             {/* <li>
                          <Link
                            to="/dispatch/reporting"
                            onClick={handleLinkClick}
                            className={`flex items-center justify-between text-sm  transition-all duration-200 rounded-lg ${
                              isActive("/reporting")
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-700 hover:bg-gray-200"
                            } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                            title={!isMobile && isCollapsed ? "Sent" : ""}
                          >
                            <div className="flex items-center gap-3">
                              <TbReportSearch size={18}  className="w-[18px] h-[18px] flex-shrink-0" />
                              {(isMobile || !isCollapsed) && <span>Reporting</span>}
                            </div>
                            {isActive("/reporting") && (isMobile) && (
                              <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                                <div className="w-4 h-4 bg-white rounded-full"></div>
                              </div>
                            )}
                          </Link>
                        </li> */}


{/* Scane Latter */}
                             <li>
                          <Link
                            to="/dispatch/scane-letter"
                            onClick={handleLinkClick}
                            className={`flex items-center justify-between text-sm  transition-all duration-200 rounded-lg ${
                              isActive("/scane-letter")
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-700 hover:bg-gray-200"
                            } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                            title={!isMobile && isCollapsed ? "Sent" : ""}
                          >
                            <div className="flex items-center gap-3">
                              <RiQrScanFill size={18}  className="w-[18px] h-[18px] flex-shrink-0" />
                              {(isMobile || !isCollapsed) && <span>Scan Letters</span>}
                            </div>
                            {isActive("/scane-letter") && (isMobile) && (
                              <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                                <div className="w-4 h-4 bg-white rounded-full"></div>
                              </div>
                            )}
                          </Link>
                        </li>




                          {/* <li>
                          <Link
                            to="/dispatch/user-management"
                            onClick={handleLinkClick}
                            className={`flex items-center justify-between text-sm  transition-all duration-200 rounded-lg ${
                              isActive("/user-management")
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-700 hover:bg-gray-200"
                            } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                            title={!isMobile && isCollapsed ? "Sent" : ""}
                          >
                            <div className="flex items-center gap-3">
                              <HiMiniUsers size={18}  className="w-[18px] h-[18px] flex-shrink-0" />
                              {(isMobile || !isCollapsed) && <span>User Management</span>}
                            </div>
                            {isActive("/user-management") && (isMobile) && (
                              <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                                <div className="w-4 h-4 bg-white rounded-full"></div>
                              </div>
                            )}
                          </Link>
                        </li> */}

          </ul>

          {/* Case & Administration Section */}
          {/* {(isMobile || !isCollapsed) && (
            <p className="text-[13px]  text-gray-800 mb-3 mt-6">Case & Administration</p>
          )} */}

          <ul className="space-y-2">
            {/* Progress Register */}
            {/* <li>
              <Link
                to="/dispatch/progress-register"
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
                to="/dispatch/search-reports"
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
                {isActive("/search-reports") && (isMobile ) && (
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
