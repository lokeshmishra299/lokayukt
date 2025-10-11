// pages/ProgressRegister.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSearch,
  FaFileAlt,
  FaClock,
  FaArrowRight,
  FaFilter,
  FaDownload,
  FaCalendarAlt,
} from "react-icons/fa";
import { FaRegFileAlt } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";

import Pagination from "../Pagination";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

// Create axios instance with token if it exists
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const ProgressRegister = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("movements");
  const [complaintsData, setComplaintsData] = useState([]);
  const [currentReportData, setCurrentReportData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);
  const [expandedNotes, setExpandedNotes] = useState(new Set());

  // Loading states for each tab
  const [loadingMovements, setLoadingMovements] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Toggle note expansion
  const toggleNoteExpansion = (id) => {
    const newExpandedNotes = new Set(expandedNotes);
    if (newExpandedNotes.has(id)) {
      newExpandedNotes.delete(id);
    } else {
      newExpandedNotes.add(id);
    }
    setExpandedNotes(newExpandedNotes);
  };

  // Check if note text is long (more than 50 characters)
  const isLongNote = (note) => {
    return note && note.length > 50;
  };

  // Export functionality - File Movements
  const handleExportMovements = () => {
    try {
      const fileMovements = transformToFileMovements(complaintsData);
      const filteredMovements = fileMovements.filter(
        (movement) =>
          movement.complaintNo
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          movement.complainant.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredMovements.length === 0) {
        toast.error("No data to export.");
        return;
      }

      const wsData = [
        [
          "Sr. No",
          "Complaint No",
          "Complainant",
          "From Role",
          "To Role",
          "Note",
          "Timestamp",
          "Status",
        ],
        ...filteredMovements.map((movement, index) => [
          index + 1,
          movement.complaintNo || "NA",
          movement.complainant || "NA",
          movement.fromRole || "NA",
          movement.toRole || "NA",
          movement.note || "NA",
          movement.timestamp || "NA",
          movement.displayStatus || "NA",
        ]),
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Header styling
      const headerStyle = {
        font: { bold: true, color: { rgb: "000000" } },
        alignment: { horizontal: "center" },
        fill: { fgColor: { rgb: "D3D3D3" } },
      };

      const range = XLSX.utils.decode_range(ws["!ref"]);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[cellAddress]) ws[cellAddress] = {};
        ws[cellAddress].s = headerStyle;
      }

      // Column widths
      ws["!cols"] = [
        { wch: 8 },
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 30 },
        { wch: 20 },
        { wch: 15 },
      ];

      XLSX.utils.book_append_sheet(wb, ws, "File_Movements");

      const excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
        cellStyles: true,
      });

      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(
        data,
        `File_Movements_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      toast.success("Export successful!");
    } catch (e) {
      console.error("Export failed:", e);
      toast.error("Failed to export data.");
    }
  };

  // Export functionality - Current Status
  const handleExportStatus = () => {
    try {
      const complaintStatus = transformCurrentReportToStatus(currentReportData);
      const filteredStatus = complaintStatus.filter(
        (status) =>
          status.complaintNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          status.complainant.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredStatus.length === 0) {
        toast.error("No data to export.");
        return;
      }

      const wsData = [
        [
          "Sr. No",
          "Complaint No",
          "Complainant",
          "Subject",
          "Current Stage",
          "Assigned To",
          "Received Date",
          "Target Date",
          "Days Elapsed",
          "Status",
        ],
        ...filteredStatus.map((status, index) => [
          index + 1,
          status.complaintNo || "NA",
          status.complainant || "NA",
          status.subject || "NA",
          status.currentStage || "NA",
          status.assignedTo || "NA",
          status.receivedDate || "NA",
          status.targetDate || "NA",
          status.daysElapsed || "NA",
          getStatusText(status.status) || "NA",
        ]),
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Header styling
      const headerStyle = {
        font: { bold: true, color: { rgb: "000000" } },
        alignment: { horizontal: "center" },
        fill: { fgColor: { rgb: "D3D3D3" } },
      };

      const range = XLSX.utils.decode_range(ws["!ref"]);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[cellAddress]) ws[cellAddress] = {};
        ws[cellAddress].s = headerStyle;
      }

      // Column widths
      ws["!cols"] = [
        { wch: 8 },
        { wch: 15 },
        { wch: 20 },
        { wch: 30 },
        { wch: 15 },
        { wch: 20 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 15 },
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Current_Status");

      const excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
        cellStyles: true,
      });

      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(
        data,
        `Current_Status_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      toast.success("Export successful!");
    } catch (e) {
      console.error("Export failed:", e);
      toast.error("Failed to export data.");
    }
  };

  // Export functionality - Analytics
  const handleExportAnalytics = () => {
    try {
      if (!analyticsData) {
        toast.error("No analytics data to export.");
        return;
      }

      const wsData = [
        ["Metric", "Value"],
        [
          "Average Processing Time",
          `${parseFloat(analyticsData.avg_processing_time || 0).toFixed(
            1
          )} days`,
        ],
        ["Files in Transit", analyticsData.files_in_transit || 0],
        ["Overdue Files", analyticsData.overdue_files || 0],
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Header styling
      const headerStyle = {
        font: { bold: true, color: { rgb: "000000" } },
        alignment: { horizontal: "center" },
        fill: { fgColor: { rgb: "D3D3D3" } },
      };

      const range = XLSX.utils.decode_range(ws["!ref"]);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[cellAddress]) ws[cellAddress] = {};
        ws[cellAddress].s = headerStyle;
      }

      // Column widths
      ws["!cols"] = [{ wch: 25 }, { wch: 15 }];

      XLSX.utils.book_append_sheet(wb, ws, "Analytics");

      const excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
        cellStyles: true,
      });

      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(
        data,
        `Analytics_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      toast.success("Export successful!");
    } catch (e) {
      console.error("Export failed:", e);
      toast.error("Failed to export data.");
    }
  };

  // Main export handler based on active tab
  const handleExport = () => {
    switch (activeTab) {
      case "movements":
        handleExportMovements();
        break;
      case "status":
        handleExportStatus();
        break;
      case "analytics":
        handleExportAnalytics();
        break;
      default:
        toast.error("Please select a tab to export data.");
    }
  };

  // Fetch complaints data from API for movements tab
  useEffect(() => {
    const fetchComplaints = async () => {
      setLoadingMovements(true);
      try {
        const response = await api.get("/lokayukt/progress-register");
        if (response.data.status && response.data.data) {
          setComplaintsData(response.data.data);
          console.log(response.data.data);
        } else {
          setComplaintsData([]);
        }
      } catch (err) {
        console.error("API Error:", err);
        setComplaintsData([]);
      } finally {
        setLoadingMovements(false);
      }
    };

    fetchComplaints();
  }, []);

  // Fetch current report data for status tab
  useEffect(() => {
    const fetchCurrentReport = async () => {
      setLoadingStatus(true);
      try {
        const response = await api.get("/lokayukt/current-report");
        console.log("Current Report API Response:", response.data);

        if (response.data.status && response.data.data) {
          setCurrentReportData(response.data.data);
        } else {
          console.log("No current report data available");
          setCurrentReportData([]);
        }
      } catch (err) {
        console.error("Current Report API Error:", err);
        setCurrentReportData([]);
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchCurrentReport();
  }, []);

  // Fetch analytics data for analytics tab
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoadingAnalytics(true);
      try {
        const response = await api.get("/lokayukt/analytic-report");
        console.log("Analytics API Response:", response.data);

        if (response.data.status && response.data.data) {
          setAnalyticsData(response.data.data);
        } else {
          console.log("No analytics data available");
          setAnalyticsData(null);
        }
      } catch (err) {
        console.error("Analytics API Error:", err);
        setAnalyticsData(null);
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Updated function to determine movement flow based on conditions
  const getMovementFlow = (complaint) => {
    const {
      approved_rejected_by_ro,
      approved_rejected_by_so_us,
      approved_rejected_by_ds_js,
      approved_rejected_by_d_a,
      approved_rejected_by_lokayukt,
      approved_rejected_by_uplokayukt,
      forward_by_ro,
      forward_by_so_us,
      forward_by_ds_js,
      forward_by_d_a,
      forward_by_sec,
      forward_to_d_a,
      forward_to_lokayukt,
      forward_by_cio_io,
      forward_to_sec,
      forward_to_cio_io,
      forward_by_lokayukt,
    } = complaint;

    if (forward_by_ro != null) {
      return {
        from: "RO",
        to: "Section Officer",
        status: "completed",
        icon: <FaArrowRight className=" text-gray-500" />,
      };
    }
    if (forward_by_so_us != null && forward_to_d_a != null) {
      return {
        from: "Section Officer",
        to: "DA",
        status: "completed",
        icon: <FaArrowRight className=" text-gray-500" />,
      };
    }

    if (forward_by_ds_js != null && forward_to_d_a != null) {
      return {
        from: "DS",
        to: "DA",
        status: "completed",
        icon: <FaArrowRight className=" text-gray-500" />,
      };
    }

    if (forward_by_ds_js != null && forward_to_lokayukt != null) {
      return {
        from: "DS",
        to: "Lokayukt",
        status: "completed",
        icon: <FaArrowRight className=" text-gray-500" />,
      };
    }

    if (forward_by_d_a != null && forward_to_lokayukt != null) {
      return {
        from: "DA",
        to: "Lokayukt",
        status: "completed",
        icon: <FaArrowRight className=" text-gray-500" />,
      };
    }

    if (forward_by_sec != null && forward_to_lokayukt != null) {
      return {
        from: "Secretary",
        to: "Lokayukt",
        status: "completed",
        icon: <FaArrowRight className=" text-gray-500" />,
      };
    }
    if (forward_by_d_a != null && forward_to_lokayukt != null) {
      return {
        from: "DA",
        to: "Lokayukt",
        status: "completed",
        icon: <FaArrowRight className=" text-gray-500" />,
      };
    }

    if (forward_by_cio_io != null && forward_to_lokayukt != null) {
      return {
        from: "CIO",
        to: "Lokayukt",
        status: "completed",
        icon: <FaArrowRight className=" text-gray-500" />,
      };
    }

    if (forward_by_lokayukt != null && forward_to_sec != null) {
      return {
        from: "Lokayukt",
        to: "Secretary",
        status: "completed",
        icon: <FaArrowRight className=" text-gray-500" />,
      };
    }
    if (forward_by_lokayukt != null && forward_to_cio_io != null) {
      return {
        from: "Lokayukt",
        to: "CIO",
        status: "completed",
        icon: <FaArrowRight className=" text-gray-500" />,
      };
    }

    // Default: Just show "RO" (no movement)
    return {
      from: "NA",
      to: "NA",
      status: "pending",
      icon: null,
    };
  };

  
  const checkIfOverdue = (targetDate, timestamp) => {
   
    if (!targetDate || targetDate === null) {
      return false;
    }

    try {
      const target = new Date(targetDate);
      const created = new Date(timestamp);
      
      // Calculate difference in days
      const diffTime = created - target;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // If difference is more than 10 days, it's overdue
      return diffDays > 10;
    } catch (error) {
      console.error("Error checking overdue status:", error);
      return false;
    }
  };

  // Transform API data to file movements format
  const transformToFileMovements = (data) => {
    return data.map((complaint, index) => {
      const movement = getMovementFlow(complaint);
      const isOverdue = checkIfOverdue(complaint.target_date, complaint.created_at);
      
      return {
        id: complaint.id,
        complaintNo: complaint.complain_no,
        complainant: complaint.name,
        fromRole: movement.from,
        toRole: movement.to,
        movementIcon: movement.icon,
        note: complaint.remarks || "N/A",
        timestamp: formatDate(complaint.created_at),
        status: complaint.status || "N/A",
        isOverdue: isOverdue, 
        displayStatus: isOverdue ? "Overdue" : getDisplayStatus(complaint.status), // Show Overdue if condition met
      };
    });
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);x
  };

  const getAssignedToWithRole = (report) => {
    if (report.da_name !== null) {
      return `DA - ${capitalizeFirstLetter(report.da_name)}`;
    }
    if (report.ds_name !== null) {
      return `DS - ${capitalizeFirstLetter(report.ds_name)}`;
    }
    if (report.ro_name !== null) {
      return `RO - ${capitalizeFirstLetter(report.ro_name)}`;
    }
    if (report.so_name !== null) {
      return `Section Officer - ${capitalizeFirstLetter(report.so_name)}`;
    }
    // if (report.sec_name !== null) {
    //   return `Secretary - ${capitalizeFirstLetter(report.sec_name)}`;
    // }
    /**
     * IF Secretary is forwarded report to Lokayukt, Show LokAyukta Office
     */
    if (report.sec_name !== null) {
      return `LokAyukta Office`;
    }
    // if (report.cio_name !== null) {
    //   return `CIO - ${capitalizeFirstLetter(report.cio_name)}`;
    // }
    /**
     * IF CIO is forwarded report to Lokayukt, Show LokAyukta Office
     */
    if (report.cio_name !== null) {
      return `LokAyukta Office`;
    }
    if (report.cio_to_name !== null) {
      return `CIO - ${capitalizeFirstLetter(report.cio_to_name)}`;
    }
    if (report.sec_to_name !== null) {
      return `Secretary - ${capitalizeFirstLetter(report.sec_to_name)}`;
    }
    if (report.lokayukt_name !== null) {
      return `LokAyukta Office`;
    }
  };

  // Transform current report data
  const transformCurrentReportToStatus = (data) => {
    if (!data || data.length === 0) return [];

    return data.map((report) => {
      const daysElapsed = report.days || getDaysElapsed(report.created_at);

      return {
        complaintNo: report.complain_no || "N/A",
        complainant: report.name || "N/A",
        subject: report.description || report.title || "No subject provided",
        currentStage: report.status || "N/A",
        assignedTo: getAssignedToWithRole(report),
        receivedDate: formatDateOnly(report.created_at),
        targetDate: report.target_date
          ? formatDateOnly(report.target_date)
          : "-",
        status: getStatusFromTargetDate(report.target_date),
        daysElapsed: daysElapsed,
        originalStatus: report.status,
      };
    });
  };

  const getStatusFromTargetDate = (targetDate) => {
    if (!targetDate) {
      return "on-track";
    }

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const target = new Date(targetDate);
      target.setHours(0, 0, 0, 0);

      const diffTime = target - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0) {
        return "on-track";
      } else if (diffDays < 0 && Math.abs(diffDays) <= 10) {
        return "delayed";
      } else {
        return "critical";
      }
    } catch (error) {
      console.error("Error calculating status from target date:", error);
      return "on-track";
    }
  };

  // Helper function to get readable status text
  const getStatusText = (status) => {
    switch (status) {
      case "on-track":
        return "On Track";
      case "delayed":
        return "Delayed";
      case "critical":
        return "Critical";
      case "overdue":
        return "Overdue";
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  const getDisplayStatus = (status) => {
    if (status === "Verified") return "Pending";
    if (status === "Forwarded") return "Completed";

    return status;
  };

  // UPDATED: Handle overdue status with red bg and white text
  const getFileMovementStatusColor = (displayStatus, isOverdue) => {
    // If overdue, show red background with white text
    if (isOverdue) {
      return "bg-red-500 text-white";
    }

    // Otherwise, use original color logic
    switch (displayStatus) {
      case "Pending":
        return "bg-orange-400 text-white";
      case "Completed":
        return "bg-green-500 text-white";
      default:
        return "border-gray-400 text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-CA");
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getTargetDate = (createdDate) => {
    if (!createdDate) return "N/A";
    try {
      const date = new Date(createdDate);
      date.setDate(date.getDate() + 30);
      return date.toLocaleDateString("en-CA");
    } catch (error) {
      return "N/A";
    }
  };

  const getDaysElapsed = (createdDate) => {
    if (!createdDate) return 0;
    try {
      const created = new Date(createdDate);
      const today = new Date();
      const diffTime = Math.abs(today - created);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      return 0;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "on-track":
        return "bg-green-500 text-white";
      case "delayed":
        return "bg-yellow-500 text-white";
      case "critical":
        return "bg-red-500 text-white";
      case "completed":
        return "bg-green-400 text-white";
      case "pending":
        return "bg-orange-400 text-white";
      case "overdue":
        return "bg-red-400 text-white";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get transformed data
  const fileMovements = transformToFileMovements(complaintsData);
  const complaintStatus = transformCurrentReportToStatus(currentReportData);

  // Filter data based on search term
  const filteredMovements = fileMovements.filter(
    (movement) =>
      movement.complaintNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.complainant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStatus = complaintStatus.filter(
    (status) =>
      status.complaintNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.complainant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  // Calculate pagination for current active tab
  const getCurrentData = () => {
    if (activeTab === "movements") return filteredMovements;
    if (activeTab === "status") return filteredStatus;
    return [];
  };

  const currentData = getCurrentData();
  const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = currentData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">
            Error loading data
          </div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen overflow-hidden">
      {/* Toast Container */}
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

      <div className="px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold pt-1 text-gray-900 truncate">
              Progress Register / प्रगति रजिस्टर
            </h1>
          </div>

          {/* Filter and Export buttons on the right */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Filter Button */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-[#e69a0c] transition-colors text-sm font-medium text-gray-700">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter
            </button>

            {/* Export Button with functionality */}
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-[#e69a0c] transition-colors text-sm font-medium"
            >
              <FaDownload className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Search Card */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex-shrink-0">
              File Tracking & Movement
            </h2>
            <div className="flex items-center gap-2 w-full sm:w-auto max-w-full">
              <label
                htmlFor="search"
                className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:block flex-shrink-0"
              >
                Search:
              </label>
              <div className="relative flex-1 sm:flex-initial min-w-0">
                <input
                  id="search"
                  type="text"
                  placeholder="Complaint No. or Complainant"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-48 lg:w-64 px-3 py-2 pl-8 sm:pl-10 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-1  focus:ring-[#123463] focus:border-[#123463] outline-none"
                />
                <FaSearch className="absolute left-2.5 sm:left-3 top-2.5 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Component */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="space-y-6">
            <div className="inline-flex h-auto sm:h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 w-full">
              <div className="grid grid-cols-1 sm:flex w-full gap-1">
                <button
                  onClick={() => setActiveTab("movements")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:flex-1 ${
                    activeTab === "movements"
                      ? "bg-white text-gray-900 shadow-sm"
                      : ""
                  }`}
                >
                  File Movements
                </button>
                <button
                  onClick={() => setActiveTab("status")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:flex-1 ${
                    activeTab === "status"
                      ? "bg-white text-gray-900 shadow-sm"
                      : ""
                  }`}
                >
                  Current Status
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:flex-1 ${
                    activeTab === "analytics"
                      ? "bg-white text-gray-900 shadow-sm"
                      : ""
                  }`}
                >
                  Analytics
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-3 sm:p-6 overflow-hidden">
              {/* File Movements Tab */}
              {activeTab === "movements" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <FaRegFileAlt className="w-4 h-4 sm:w-5 sm:h-5 " />
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-600">
                        Recent File Movements
                      </h3>
                    </div>

                    <div className="flow-root border border-gray-200 rounded-md">
                      <div className="overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                          <table className="min-w-full table-auto text-[11px] sm:text-xs">
                            <thead className="bg-gray-50">
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  Complaint No.
                                </th>
                                <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  Complainant
                                </th>
                                <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  Movement
                                </th>
                                <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  Note
                                </th>
                                <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  Timestamp
                                </th>
                                <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                              {loadingMovements ? (
                                <tr>
                                  <td
                                    colSpan="6"
                                    className="py-8 font-semibold text-center text-md text-gray-500"
                                  >
                                    Loading...
                                  </td>
                                </tr>
                              ) : paginatedData.length > 0 ? (
                                paginatedData.map((movement) => (
                                  <tr
                                    key={movement.id}
                                    className="hover:bg-gray-50"
                                  >
                                    <td className="py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                      {movement.complaintNo}
                                    </td>
                                    <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-700 whitespace-nowrap">
                                      {movement.complainant}
                                    </td>
                                    <td className="py-2 px-2 sm:py-3 sm:px-3">
                                      <div className="flex items-center gap-1.5 whitespace-nowrap max-w-[120px] overflow-x-auto">
                                        <span className="text-gray-700 text-xs">
                                          {movement.fromRole}
                                        </span>
                                        {movement.toRole &&
                                          movement.fromRole !==
                                            movement.toRole && (
                                            <>
                                              {movement.movementIcon}
                                              <span className="text-gray-700 font-semibold text-xs">
                                                {movement.toRole}
                                              </span>
                                            </>
                                          )}
                                      </div>
                                    </td>
                                    <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-700 max-w-[250px]">
                                      {isLongNote(movement.note) ? (
                                        expandedNotes.has(movement.id) ? (
                                          <div
                                            className="text-xs leading-relaxed break-words whitespace-normal cursor-pointer"
                                            onClick={() =>
                                              toggleNoteExpansion(movement.id)
                                            }
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                movement.note?.replace(
                                                  /\n/g,
                                                  "<br>"
                                                ) || "N/A",
                                            }}
                                          />
                                        ) : (
                                          <div
                                            className="text-xs truncate cursor-pointer hover:text-blue-600"
                                            onClick={() =>
                                              toggleNoteExpansion(movement.id)
                                            }
                                            title="Click to expand"
                                          >
                                            {movement.note}...
                                          </div>
                                        )
                                      ) : (
                                        <div className="text-xs">
                                          {movement.note}
                                        </div>
                                      )}
                                    </td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-3 text-gray-600 whitespace-nowrap">
                                      {movement.timestamp}
                                    </td>
                                    <td className="py-2 px-2 sm:py-3 sm:px-3 whitespace-nowrap">
                                      <span
                                        className={`inline-flex items-center px-2 py-[2px] rounded-full text-[10px] sm:text-xs font-medium border ${getFileMovementStatusColor(
                                          movement.displayStatus,
                                          movement.isOverdue
                                        )}`}
                                      >
                                        {movement.displayStatus}
                                      </span>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan="6"
                                    className="py-8 font-semibold text-center text-md text-gray-500"
                                  >
                                    No Data Found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
  <div className="mt-4 flex items-center justify-center sm:justify-end">
    {/* ✅ Mobile: center, Desktop (sm+): right */}
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      showInfo={false}
    />
  </div>
)}


                  
                  </div>
                </div>
              )}

              {/* Current Status Tab */}
              {activeTab === "status" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2 mb-4">
                      <IoTimeOutline className="w-4 h-4 sm:w-5 sm:h-5" />
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
                        Current Complaint Status
                      </h3>
                    </div>

                    <div className="overflow-x-auto border border-gray-200 rounded-md">
                      <div className="min-w-full">
                        <table className="w-full text-[11px] sm:text-xs">
                          <thead className="bg-gray-50">
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                Complaint No.
                              </th>
                              <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                Complainant
                              </th>
                              <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                Current Stage
                              </th>
                              <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                Assigned To
                              </th>
                              <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                Days Elapsed
                              </th>
                              <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-700 whitespace-nowrap hidden lg:table-cell">
                                Target Date
                              </th>
                              <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {loadingStatus ? (
                              <tr>
                                <td
                                  colSpan="7"
                                  className="py-8 font-semibold text-center text-md text-gray-500"
                                >
                                  Loading...
                                </td>
                              </tr>
                            ) : paginatedData.length > 0 ? (
                              paginatedData.map((complaint, index) => (
                                <tr
                                  key={`${complaint.complaintNo}-${index}`}
                                  className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                  <td className="py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-700">
                                    {complaint.complaintNo}
                                  </td>
                                  <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-700">
                                    {complaint.complainant}
                                  </td>
                                  <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-700">
                                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium">
                                      {complaint.currentStage === "Verified"
                                        ? "Verification"
                                        : complaint.currentStage ===
                                          "Investigation Report"
                                        ? "Under Investigation"
                                        : complaint.currentStage
                                        ? complaint.currentStage == "Forwarded"
                                          ? "Awaiting Enquiry Assignment"
                                          : complaint.currentStage
                                        : "N/A"}
                                    </span>
                                  </td>
                                  <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-700">
                                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium">
                                      {complaint.assignedTo}
                                    </span>
                                  </td>
                                  <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-600">
                                    <span
                                      className={`font-semibold ${
                                        complaint.daysElapsed > 15
                                          ? "text-black"
                                          : "text-black"
                                      }`}
                                    >
                                      {complaint.daysElapsed} days
                                    </span>
                                  </td>
                                  <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-600 hidden lg:table-cell">
                                    {complaint.targetDate}
                                  </td>
                                  <td className="py-2 px-2 sm:py-3 sm:px-3">
                                    <span
                                      className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium border ${getStatusColor(
                                        complaint.status
                                      )}`}
                                    >
                                      {getStatusText(complaint.status)}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="7"
                                  className="py-8 font-semibold text-center text-md text-gray-500"
                                >
                                  No Data Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-4">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                          totalItems={currentData.length}
                          itemsPerPage={ITEMS_PER_PAGE}
                          showInfo={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="overflow-hidden">
                    {loadingAnalytics ? (
                      <div className="text-center py-8">
                        <div className="text-gray-500 font-semibold text-md">
                          Loading...
                        </div>
                      </div>
                    ) : analyticsData ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div className="bg-gradient-to-br  p-4 sm:p-6 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
                              Average Processing Time
                            </h3>
                          </div>
                          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                            {parseFloat(
                              analyticsData.avg_processing_time || 0
                            ).toFixed(1)}{" "}
                            days
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            From entry to disposal
                          </p>
                        </div>

                        <div className="bg-gradient-to-br  p-4 sm:p-6 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
                              Files in Transit
                            </h3>
                          </div>
                          <div className="text-2xl sm:text-3xl font-bold text-yellow-700 mb-1">
                            {analyticsData.files_in_transit || 0}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Currently moving between roles
                          </p>
                        </div>

                        <div className="bg-gradient-to-br  p-4 sm:p-6 rounded-lg border border-gray-200 sm:col-span-2 lg:col-span-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
                              Overdue Files
                            </h3>
                          </div>
                          <div className="text-2xl sm:text-3xl font-bold text-red-700 mb-1">
                            {analyticsData.overdue_files || 0}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Past target date
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-500 font-semibold text-md">
                          No Data Found
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressRegister;
