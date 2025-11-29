// pages/SearchReports.js
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaDownload,
  FaFileAlt,
  FaChartBar,
  FaSpinner,
  FaArrowRight, 
  FaChevronDown,
  FaUser,
  FaUserTie,
  FaCrown,
  FaUsers,
  FaTimes
} from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from '../../Pagination';
import * as XLSX from "xlsx-js-style"; 
import { saveAs } from "file-saver"; 
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

// Custom Searchable Dropdown Component
const CustomSearchableDropdown = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select option...",
  required = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const flattenOptions = (options) => {
    const flattened = [];
    options.forEach(group => {
      group.items.forEach(item => {
        flattened.push({
          ...item,
          groupLabel: group.label,
          groupIcon: group.icon
        });
      });
    });
    return flattened;
  };

  const filteredOptions = () => {
    if (!searchTerm.trim()) return options;
    
    const flatOptions = flattenOptions(options);
    const filtered = flatOptions.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.groupLabel.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedFiltered = {};
    filtered.forEach(option => {
      if (!groupedFiltered[option.groupLabel]) {
        const originalGroup = options.find(g => g.label === option.groupLabel);
        groupedFiltered[option.groupLabel] = {
          label: option.groupLabel,
          icon: originalGroup?.icon,
          items: []
        };
      }
      groupedFiltered[option.groupLabel].items.push(option);
    });

    return Object.values(groupedFiltered);
  };

  const selectedOption = flattenOptions(options).find(opt => opt.value === value);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 pr-8 border rounded-md focus:ring-1  focus:ring-[#123463] focus:border-[#123463] bg-white text-left cursor-pointer flex items-center justify-between"
        required={required}
      >
        <span className="flex items-center">
          {selectedOption ? (
            <>
              {selectedOption.icon}
              <span className="ml-2">{selectedOption.label}</span>
            </>
          ) : (
            <>
              <FaUsers className="w-4 h-4 text-gray-400" />
              <span className="ml-2 text-gray-500">{placeholder}</span>
            </>
          )}
        </span>
        <FaChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
          <div className="p-2 border-b">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1  focus:ring-[#123463] focus:border-[#123463] outline-none text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredOptions().length > 0 ? (
              filteredOptions().map((group) => (
                <div key={group.label}>
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b flex items-center">
                    {group.icon}
                    <span className="ml-2">{group.label}</span>
                  </div>
                  
                  {group.items.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => handleSelect(item.value)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center text-sm border-b border-gray-100 last:border-b-0"
                    >
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                      {value === item.value && (
                        <FaUsers className="ml-auto w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                {searchTerm ? 'No options found' : 'No options available'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Forward Modal Component
const ForwardModal = ({ 
  isOpen, 
  onClose, 
  complaintId,
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    forwardTo: '',
    remarks: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownOptions = [
    {
      label: 'Senior Officers',
      icon: <FaCrown className="w-4 h-4 text-purple-600" />,
      items: [
        { 
          value: 'chief-secretary', 
          label: 'Chief Secretary', 
          icon: <FaCrown className="w-4 h-4 text-purple-600" /> 
        },
        { 
          value: 'additional-chief-secretary', 
          label: 'Additional Chief Secretary', 
          icon: <FaCrown className="w-4 h-4 text-purple-600" /> 
        }
      ]
    },
    {
      label: 'Department Officers',
      icon: <FaUserTie className="w-4 h-4 text-blue-600" />,
      items: [
        { 
          value: 'collector-bhopal', 
          label: 'Collector, Bhopal', 
          icon: <FaUserTie className="w-4 h-4 text-blue-600" /> 
        },
        { 
          value: 'collector-indore', 
          label: 'Collector, Indore', 
          icon: <FaUserTie className="w-4 h-4 text-blue-600" /> 
        }
      ]
    },
    {
      label: 'Section Officers',
      icon: <FaUser className="w-4 h-4 text-green-600" />,
      items: [
        { 
          value: 'section-officer-1', 
          label: 'Section Officer - Revenue', 
          icon: <FaUser className="w-4 h-4 text-green-600" /> 
        },
        { 
          value: 'section-officer-2', 
          label: 'Section Officer - Admin', 
          icon: <FaUser className="w-4 h-4 text-green-600" /> 
        }
      ]
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setFormData({
        forwardTo: '',
        remarks: ''
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      toast.success('Complaint forwarded successfully!');
      onSubmit();
      onClose();
    } catch (error) {
      toast.error('Error forwarding complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Forward Complaint</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Forward To / भेजें
              </label>
              <CustomSearchableDropdown
                value={formData.forwardTo}
                onChange={(value) => setFormData(prev => ({ ...prev, forwardTo: value }))}
                options={dropdownOptions}
                placeholder="Select Department/Officer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks / टिप्पणी
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                className="w-full p-2 border rounded-md focus:ring-1  focus:ring-[#123463] focus:border-[#123463]"
                placeholder="Enter forwarding remarks..."
                rows="3"
              />
            </div>
          </div>
          <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.forwardTo}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                isSubmitting || !formData.forwardTo
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  Forwarding...
                </>
              ) : (
                <>
                  <FaArrowRight className="w-4 h-4" />
                  Forward
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SearchReports = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchResults, setSearchResults] = useState([]);
  const [districts, setDistricts] = useState([]);
  
  // EXISTING API STATES
  const [overallStats, setOverallStats] = useState(null);
  const [districtWiseStats, setDistrictWiseStats] = useState(null);
  const [departmentWiseStats, setDepartmentWiseStats] = useState(null);
  
  // NEW API STATES
  const [monthlyTrends, setMonthlyTrends] = useState(null);
  const [complianceReport, setComplianceReport] = useState(null);
  const [avgProcessingTimes, setAvgProcessingTimes] = useState(null);
  
  // ✅ LOADING STATES
  const [isLoadingSearch, setIsLoadingSearch] = useState(true);
  const [isLoadingGeneral, setIsLoadingGeneral] = useState(true);
  const [isLoadingStatistical, setIsLoadingStatistical] = useState(true);
  const [isLoadingCompliance, setIsLoadingCompliance] = useState(true);
  
  const [isSearching, setIsSearching] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  const ensureArray = (data) => Array.isArray(data) ? data : [];

  const navigate = useNavigate();

  // Header Export Function
  const handleHeaderExport = () => {
    try {
      if (filteredResults.length === 0) {
        toast.error("No data to export.");
        return;
      }

      const wsData = [
        ["Sr. No", "Complain No", "Application No", "Name", "Officer", "Department", "District", "Nature", "Status", "Entry Date"],
        ...filteredResults.map((item, index) => [
          index + 1,
          item.complain_no || "NA",
          item.application_no || "NA", 
          item.name || "NA",
          item.officer_name || "NA",
          item.department_name || "NA",
          item.district_name || "NA",
          item.complaintype_name || "NA",
          item.status || "NA",
          item.created_at || "NA"
        ])
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      const headerStyle = {
        font: { bold: true, color: { rgb: "000000" } },
        alignment: { horizontal: "center" },
        fill: { fgColor: { rgb: "D3D3D3" } }
      };

      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[cellAddress]) ws[cellAddress] = {};
        ws[cellAddress].s = headerStyle;
      }

      ws['!cols'] = [
        {wch: 8}, {wch: 15}, {wch: 15}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 20}
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Search Reports");

      const excelBuffer = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'array',
        cellStyles: true
      });

      const data = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      saveAs(data, `Search_Reports_${new Date().toISOString().slice(0,10)}.xlsx`);
      toast.success("Export successful!");
    } catch(e) {
      console.error("Export failed:", e);
      toast.error("Failed to export data.");
    }
  };

  // Forward Modal handlers
  const handleForward = (complaintId) => {
    setSelectedComplaintId(complaintId);
    setIsForwardModalOpen(true);
  };

  const handleForwardSubmit = () => {
    console.log('Complaint forwarded');
  };

  // ✅ UPDATED: Fetch initial data with loading states
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingSearch(true);
      setIsLoadingGeneral(true);
      setIsLoadingStatistical(true);
      setIsLoadingCompliance(true);

      try {
        // Fetch districts and search results
        const districtsResponse = await api.get("/supervisor/all-district");
        
        if (districtsResponse.data.status === "success") {
          const districtsArray = ensureArray(districtsResponse.data.data);
          setDistricts(districtsArray);
        }

        const reportsResponse = await api.get("/supervisor/complain-report");
        
        if (reportsResponse.data.status === true) {
          const dataArray = ensureArray(reportsResponse.data.data);
          setSearchResults(dataArray);
        }
        setIsLoadingSearch(false);

        // Fetch overall stats
        try {
          const overallResponse = await api.get("/supervisor/all-complains");
          if (overallResponse.data.status === true) {
            setOverallStats(overallResponse.data.data);
          }
        } catch (error) {
          console.error("Error fetching overall stats:", error);
        }

        // Fetch district-wise stats
        try {
          const districtWiseResponse = await api.get("/supervisor/district-wise-complaint");
          if (districtWiseResponse.data.status === true) {
            setDistrictWiseStats(districtWiseResponse.data.data);
          }
        } catch (error) {
          console.error("Error fetching district-wise stats:", error);
        }

        // Fetch department-wise stats
        try {
          const departmentWiseResponse = await api.get("/supervisor/department-wise-complaint");
          if (departmentWiseResponse.data.status === true) {
            setDepartmentWiseStats(departmentWiseResponse.data.data);
          }
        } catch (error) {
          console.error("Error fetching department-wise stats:", error);
        }
        setIsLoadingGeneral(false);

        // Fetch monthly trends
        try {
          const monthlyTrendsResponse = await api.get("/supervisor/montly-trends");
          if (monthlyTrendsResponse.data.status === true) {
            setMonthlyTrends(monthlyTrendsResponse.data.data);
          }
        } catch (error) {
          console.error("Error fetching monthly trends:", error);
        }

        // Fetch average processing time
        try {
          const avgProcessingResponse = await api.get("/supervisor/detail-by-complaintype");
          if (avgProcessingResponse.data.status === true) {
            setAvgProcessingTimes(avgProcessingResponse.data.data);
          }
        } catch (error) {
          console.error("Error fetching average processing times:", error);
        }
        setIsLoadingStatistical(false);

        // Fetch compliance report
        try {
          const complianceReportResponse = await api.get("/supervisor/compliance-report");
          if (complianceReportResponse.data.status === true) {
            setComplianceReport(complianceReportResponse.data.data);
          }
        } catch (error) {
          console.error("Error fetching compliance report:", error);
        }
        setIsLoadingCompliance(false);

      } catch (error) {
        setSearchResults([]);
        setDistricts([]);
        toast.error("Error loading data");
        setIsLoadingSearch(false);
        setIsLoadingGeneral(false);
        setIsLoadingStatistical(false);
        setIsLoadingCompliance(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle refresh data
  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const response = await api.get("/supervisor/complain-report");
      
      if (response.data.status === true) {
        const dataArray = ensureArray(response.data.data);
        setSearchResults(dataArray);
        setCurrentPage(1);
      } else {
        setSearchResults([]);
        toast.warning("No data found");
      }
    } catch (error) {
      setSearchResults([]);
      toast.error("Error fetching data");
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "Disposed - Accepted" || status === "Resolved")
      return "bg-green-100 text-green-800 border-green-200";
    if (status === "Rejected") return "bg-red-100 text-red-800 border-red-200";
    if (status === "In Progress" || status === "Under Investigation")
      return "bg-orange-400 text-white ";
    if (status === "Pending")
      return "bg-green-400 text-white";
  };

  const filteredResults = ensureArray(searchResults).filter((result) => {
    const matchesSearch = 
      searchTerm === "" ||
      (result.complain_no && 
        result.complain_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.application_no && 
        result.application_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.name && 
        result.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.officer_name && 
        result.officer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.department_name && 
        result.department_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.district_name && 
        result.district_name.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesDistrict = true;
    if (selectedDistrict !== "all") {
      const selectedDistrictObj = districts.find(d => d.id.toString() === selectedDistrict);
      if (selectedDistrictObj) {
        matchesDistrict = result.district_id.toString() === selectedDistrictObj.district_code;
      } else {
        matchesDistrict = false;
      }
    }

    const matchesStatus = selectedStatus === "all" || result.status === selectedStatus;

    return matchesSearch && matchesDistrict && matchesStatus;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDistrict, selectedStatus]);

  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const reportStats = {
    total: overallStats?.total_complaints || ensureArray(searchResults).length,
    disposed: ensureArray(searchResults).filter(
      (r) => r.status === "Disposed - Accepted" || r.status === "Resolved"
    ).length,
    rejected: overallStats?.total_rejected || ensureArray(searchResults).filter((r) => r.status === "Rejected").length,
    inProgress: overallStats?.total_pending || ensureArray(searchResults).filter(
      (r) =>
        r.status === "In Progress" ||
        r.status === "Under Investigation" ||
        r.status === "Pending"
    ).length,
  };

  const calculateOverallAverage = () => {
    if (!avgProcessingTimes || !Array.isArray(avgProcessingTimes)) return "N/A";
    
    const validTimes = avgProcessingTimes.filter(item => item.avg_days !== null && !isNaN(parseFloat(item.avg_days)));
    if (validTimes.length === 0) return "N/A";
    
    const totalDays = validTimes.reduce((sum, item) => sum + parseFloat(item.avg_days), 0);
    const average = (totalDays / validTimes.length).toFixed(1);
    return `${average}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen overflow-hidden ">
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

      <div className="max-w-full px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold pt-2 text-gray-900 truncate">
              Search & Reports / खोज और रिपोर्ट
            </h1>
          </div>
          
          <div className="flex items-center flex-shrink-0">
            <button 
              onClick={handleHeaderExport}
              className="flex items-center gap-2 px-4 py-2 border hover:bg-[#e69a0c] text-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              <FaDownload className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden sm:px-0 lg:px-0 md:px-0 px-2 sm:py-0 lg:py-0 md:py-0 py-2 ">
          <div className="space-y-6">
            <div className="inline-flex h-auto sm:h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 w-full">
              <div className="grid grid-cols-1 sm:flex w-full gap-1">
                <button
                  onClick={() => setActiveTab("search")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:flex-1 ${
                    activeTab === "search"
                      ? "bg-white text-gray-900 shadow-sm"
                      : ""
                  }`}
                >
                  Advanced Search
                </button>
                <button
                  onClick={() => setActiveTab("general")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:flex-1 ${
                    activeTab === "general"
                      ? "bg-white text-gray-900 shadow-sm"
                      : ""
                  }`}
                >
                  General Reports
                </button>
                <button
                  onClick={() => setActiveTab("statistical")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:flex-1 ${
                    activeTab === "statistical"
                      ? "bg-white text-gray-900 shadow-sm"
                      : ""
                  }`}
                >
                  Statistical Reports
                </button>
                <button
                  onClick={() => setActiveTab("compliance")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:flex-1 ${
                    activeTab === "compliance"
                      ? "bg-white text-gray-900 shadow-sm"
                      : ""
                  }`}
                >
                  Compliance Reports
                </button>
              </div>
            </div>

            <div className="overflow-hidden">
              {/* ✅ UPDATED: Advanced Search Tab */}
              {activeTab === "search" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="space-y-3 sm:space-y-4 overflow-hidden">
                    <div className="bg-white  sm:p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <FaSearch className="w-5 h-5 text-gray-700 relative  sm:bottom-3 md:bottom-3 lg:bottom-3 " />
                        <h3 className="text-2xl sm:text-xl md:text-2xl relative sm:bottom-3 md:bottom-3 lg:bottom-3  font-semibold text-gray-900">
                          Search Criteria
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Search Term</label>
                          <input
                            id="search-term"
                            type="text"
                            placeholder="Complaint No., Name, etc."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1  focus:ring-[#123463] focus:border-[#123463] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                          <select
                            id="district"
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="w-full px-3 py-2 text-sm cursor-pointer border border-gray-300 rounded-md focus:ring-1  focus:ring-[#123463] focus:border-[#123463] outline-none bg-white"
                          >
                            <option value="all">All Districts</option>
                            {ensureArray(districts).map((district) => (
                              <option key={district.id} value={district.id.toString()}>
                                {district.district_name} - {district.dist_name_hi}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            id="status"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-3 py-2 text-sm cursor-pointer border border-gray-300 rounded-md focus:ring-1  focus:ring-[#123463] focus:border-[#123463] outline-none bg-white"
                          >
                            <option value="all">All Status</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Disposed - Accepted">Disposed - Accepted</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Under Investigation">Under Investigation</option>
                            <option value="Pending">Pending</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 opacity-0">Search</label>
                          <button
                            onClick={handleSearch}
                            disabled={isSearching}
                            style={{ backgroundColor: 'hsl(220, 70%, 25%)' }}
                            className="w-full flex items-center justify-center gap-2 px-6 py-2 rounded-md transition-colors text-sm font-medium h-[38px]"
                          >
                            {isSearching ? (
                              <>
                                <FaSpinner className="w-4 h-4 text-white animate-spin" />
                                <span className="text-white">Search...</span>
                              </>
                            ) : (
                              <>
                                <FaSearch className="w-4 h-4 text-white" />
                                <span className="text-white">Search</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ✅ UPDATED: Search Results with Loading State */}
                    <div className="bg-white p-3 sm:p-4 border-gray-200 shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-900">
                          Search Results 
                        </h3>
                      </div>

                      <div className="w-full overflow-hidden rounded-md border border-gray-200">
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-[11px] sm:text-xs">
                            <thead className="bg-gray-50">
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  Complaint No.
                                </th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  Complainant
                                </th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap hidden lg:table-cell">
                                  Respondent
                                </th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap hidden lg:table-cell">
                                  Department
                                </th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  District
                                </th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  Nature
                                </th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  Status
                                </th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  Entry Date
                                </th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                              {isLoadingSearch ? (
                                <tr>
                                  <td colSpan="9" className="py-8 text-center font-semibold text-md text-gray-500">
                                    Loading...
                                  </td>
                                </tr>
                              ) : paginatedResults.length > 0 ? (
                                paginatedResults.map((result, index) => (
                                  <tr key={result.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-2 sm:px-3 font-medium text-gray-700 hover:text-blue-800 hover:underline cursor-pointer" 
                                        onClick={() => navigate(`/supervisor/search-reports/view/${result.id}`)}>
                                      {result.complain_no || result.application_no || "N/A"}
                                    </td>
                                    <td className="py-2 px-2 sm:px-3 text-gray-700">
                                      {result.name || "N/A"}
                                    </td>
                                    <td className="py-2 px-2 sm:px-3 text-gray-700 hidden lg:table-cell">
                                      {result.designation_name || "N/A"}
                                    </td>
                                    <td className="py-2 px-2 sm:px-3 text-gray-700 hidden lg:table-cell">
                                      {result.department_name || "N/A"}
                                    </td>
                                    <td className="py-2 px-2 sm:px-3 text-gray-700">
                                      <span 
                                    
                                        title={`District Code: ${result.district_id}`}
                                      >
                                        {result.district_name || "N/A"}
                                      </span>
                                    </td>
                                    <td className="py-2 px-2 sm:px-3">
                                      <span
                                        className={`inline-flex items-center px-2 py-[2px] rounded-full text-[10px] font-medium ${
                                          result.complaintype_name === "Allegation"
                                            ? "bg-red-400 text-white"
                                            : "bg-green-400 text-white"
                                        }`}
                                      >
                                        {result.complaintype_name || "N/A"}
                                      </span>
                                    </td>
                                    <td className="py-2 px-2 sm:px-3">
                                      <span
                                        className={`inline-flex items-center px-2 py-[2px] rounded-full text-[10px] font-medium ${getStatusColor(
                                          result.status
                                        )}`}
                                      >
                                        {result.status || "N/A"}
                                      </span>
                                    </td>
                                    <td className="py-2 px-2 sm:px-3">
                                      <span className="text-xs text-gray-600">
                                        {result.created_at || "N/A"}
                                      </span>
                                    </td>
                                    <td className="py-2 px-2 sm:px-3">
                                      <div className="flex gap-1">
                                        <button 
                                          onClick={() => navigate(`view/${result.id}`)}
                                          className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-[10px] hover:bg-gray-50 transition-colors"
                                        >
                                          <FaFileAlt className="w-3 text-green-600 h-3" />
                                          <span className="hidden text-green-600 font-semibold sm:inline">View</span>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="9" className="py-8 text-center font-semibold text-md text-gray-500">
                                    No Data Found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {totalPages > 1 && (
                        <div className="mt-4">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={filteredResults.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            showInfo={true}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ UPDATED: General Reports Tab */}
              {activeTab === "general" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="w-full max-w-7xl mx-auto space-y-4 p-2 sm:space-y-6 overflow-hidden">
                    {isLoadingGeneral ? (
                      <div className="text-center py-8">
                        <div className="text-gray-500 font-semibold text-md">Loading...</div>
                      </div>
                    ) : (
                      <>
                        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <div className="min-w-0 bg-white p-3 sm:p-6 rounded-lg border border-gray-200">
                            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                              Total Complaints
                            </h3>
                            <div className="text-lg sm:text-2xl font-bold text-gray-900">
                              {overallStats?.total_complaints || reportStats.total}
                            </div>
                          </div>
                          <div className="min-w-0 bg-white p-3 sm:p-6 rounded-lg border border-gray-200">
                            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                              Disposed
                            </h3>
                            <div className="text-lg sm:text-2xl font-bold text-green-600">
                              {overallStats?.total_approved || 0}
                            </div>
                          </div>
                          <div className="min-w-0 bg-white p-3 sm:p-6 rounded-lg border border-gray-200">
                            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                              Rejected
                            </h3>
                            <div className="text-lg sm:text-2xl font-bold text-red-600">
                              {overallStats?.total_rejected || reportStats.rejected}
                            </div>
                          </div>
                          <div className="min-w-0 bg-white p-3 sm:p-6 rounded-lg border border-gray-200">
                            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                              In Progress
                            </h3>
                            <div className="text-lg sm:text-2xl font-bold text-yellow-600">
                              {overallStats?.total_pending || reportStats.inProgress}
                            </div>
                          </div>
                        </div>

                        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                          <div className="min-w-0 bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                              District-wise Report 
                            </h3>
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                              {districtWiseStats && Object.keys(districtWiseStats).length > 0 ? (
                                Object.entries(districtWiseStats).map(([districtName, count]) => (
                                  <div key={districtName} className="flex justify-between items-center">
                                    <span className="truncate text-sm sm:text-base text-gray-700">
                                      {districtName}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                      {count}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center text-gray-500 font-semibold py-4">
                                  No Data Found
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="min-w-0 bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                              Department-wise Report 
                            </h3>
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                              {departmentWiseStats && Object.keys(departmentWiseStats).length > 0 ? (
                                Object.entries(departmentWiseStats).map(([departmentName, count]) => (
                                  <div key={departmentName} className="flex justify-between items-center">
                                    <span className="truncate text-sm sm:text-base text-gray-700">
                                      {departmentName}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                      {count}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center text-gray-500 font-semibold py-4">
                                  No Data Found
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* ✅ UPDATED: Statistical Reports Tab */}
              {activeTab === "statistical" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  {isLoadingStatistical ? (
                    <div className="text-center py-8">
                      <div className="text-gray-500 font-semibold text-md">Loading...</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 overflow-hidden">
                      <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-4">
                          <FaChartBar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            Monthly Trends
                          </h3>
                        </div>
                        <div className="space-y-4">
                          {monthlyTrends && monthlyTrends.length > 0 ? (
                            monthlyTrends.map((trend, index) => (
                              <div key={index}>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                                  <span className="text-sm sm:text-base text-gray-700 font-medium">
                                    {trend.month} {trend.year}
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                    <span className="text-sm text-gray-600">{trend.month} {trend.year}</span>
                                    <div className="flex gap-2 flex-wrap">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {trend.pending} Received
                                      </span>
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {trend.approved} Disposed
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-gray-500 font-semibold py-4">
                              No Data Found
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                          Average Processing Time
                        </h3>
                        <div className="space-y-4">
                          {avgProcessingTimes && avgProcessingTimes.length > 0 ? (
                            <>
                              {avgProcessingTimes.map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                  <span className="text-sm sm:text-base text-gray-700">
                                    {item.name}s
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {item.avg_days !== null ? `${item.avg_days} days` : 'N/A'}
                                  </span>
                                </div>
                              ))}
                              <div className="flex justify-between border-t pt-2">
                                <span className="font-medium text-gray-900">Overall Average</span>
                                <span className="font-bold text-gray-900">
                                  {calculateOverallAverage()} days
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center text-gray-500 font-semibold py-4">
                              No Data Found
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ✅ UPDATED: Compliance Reports Tab */}
              {activeTab === "compliance" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  {isLoadingCompliance ? (
                    <div className="text-center py-8">
                      <div className="text-gray-500 font-semibold text-md">Loading...</div>
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6 overflow-hidden">
                      <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                          📈 Compliance Report 
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {complianceReport ? (
                            <>
                              <div className="text-center p-4 border rounded-lg">
                                <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
                                  {parseFloat(complianceReport.approved_percentage).toFixed(1)}%
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500">Within Target</div>
                              </div>
                              <div className="text-center p-4 border rounded-lg">
                                <div className="text-xl sm:text-2xl font-bold text-yellow-600 mb-1">
                                  {parseFloat(complianceReport.pending_percentage).toFixed(1)}%
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500">Delayed</div>
                              </div>
                              <div className="text-center p-4 border rounded-lg">
                                <div className="text-xl sm:text-2xl font-bold text-red-600 mb-1">
                                  {parseFloat(complianceReport.rejected_percentage).toFixed(1)}%
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500">Critical Delay</div>
                              </div>
                            </>
                          ) : (
                            <>
                             <div className="col-span-3 text-center py-8 flex justify-center items-center">
                <h1 className="text-gray-500 font-semibold text-md">No Data Found</h1>
              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ForwardModal
        isOpen={isForwardModalOpen}
        onClose={() => setIsForwardModalOpen(false)}
        complaintId={selectedComplaintId}
        onSubmit={handleForwardSubmit}
      />
    </div>
  );
};

export default SearchReports;
