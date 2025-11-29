<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";
import Notes from "./SubModule/Notes";
import Documents from "./SubModule/Documents";
import CoverMeta from "./SubModule/CoverMeta";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
=======
"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");
const subRole = localStorage.getItem("subrole");

// Create axios instance with token if it exists
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
>>>>>>> 3f6088c87450ffc20c3101fd9a714a51e4121392
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

<<<<<<< HEAD
const InboxUI = () => {
  const [allComplaints, setAllComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [activeTab, setActiveTab] = useState("cover");

  const getAllComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get("/operator/all-complaints");
      console.log("All Complaints Data", res.data);
      if (res.data.status && res.data.data) {
        setAllComplaints(res.data.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error", error);
    }
  };

  useEffect(() => {
    getAllComplaints();
  }, []);

  const getTagColors = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-700",
      purple: "bg-purple-100 text-purple-700",
      gray: "bg-gray-200 text-gray-700",
      yellow: "bg-yellow-100 text-yellow-700",
      green: "bg-green-100 text-green-700",
      red: "bg-red-100 text-red-700"
    };
    return colors[color] || "bg-gray-100 text-gray-700";
  };

  // Helper function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Under Investigation":
        return "bg-purple-100 text-purple-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full h-screen flex bg-gray-50 overflow-hidden">
      {/* LEFT PANEL - 50% */}
      <div className="w-1/2 bg-white border-r flex flex-col overflow-hidden">
        {/* HEADER - Fixed at top */}
        <div className="p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-4 mb-3">
            <h2 className="text-lg font-semibold">Inbox</h2>
            <div className="flex gap-2 text-xs">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                Inbox: {allComplaints.length}
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full">
                Over 7 days: 0
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                Received today: 0
              </span>
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-2 mb-3 text-xs">
            <button className="px-3 py-1 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
              Overdue &gt; 7 days (0)
            </button>
            <button className="px-3 py-1 bg-purple-50 border border-purple-200 rounded text-purple-700">
              Fee Pending (0)
            </button>
          </div>

          {/* SEARCH BAR - DISABLED */}
          <div className="relative mb-3">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              disabled
              className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm bg-gray-100 cursor-not-allowed opacity-60"
              placeholder="Search by file no., complainant, subject..."
            />
          </div>

          {/* FILTERS */}
          <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
            <select className="border px-2 py-1.5 rounded">
              <option>Status: All</option>
            </select>
            <select className="border px-2 py-1.5 rounded">
              <option>Current Holder: All</option>
            </select>
            <select className="border px-2 py-1.5 rounded">
              <option>Fee Status: All</option>
            </select>
          </div>

          <div className="flex justify-between gap-2 text-xs">
            <select className="border px-2 py-1.5 rounded">
              <option>Case Type: All</option>
            </select>
            <select className="border px-2 py-1.5 rounded">
              <option>Sort by: Received Date</option>
            </select>
          </div>
        </div>

        {/* FILE LIST - Scrollable with VISIBLE scrollbar */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : allComplaints.length > 0 ? (
            allComplaints.map((complaint) => (
              <div
                key={complaint.id}
                onClick={() => {
                  setSelectedComplaint(complaint);
                  setActiveTab("cover");
                }}
                className={`p-4 border-b cursor-pointer transition-all relative ${
                  selectedComplaint?.id === complaint.id
                    ? "bg-gray-50"
                    : "hover:bg-gray-50"
                }`}
              >
                {/* Blue Left Border for Selected */}
                {selectedComplaint?.id === complaint.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                )}

                <div className={selectedComplaint?.id === complaint.id ? "pl-3" : ""}>
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-800">
                      File No. {complaint.complain_no}
                    </p>
                    <div className="flex gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded ${getStatusColor(complaint.status)}`}>
                        New Case
                      </span>
                      {complaint.fee_exempted === 1 && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                          With Lokayukt
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-2">
                    {complaint.remark || "No description available"}
                  </p>

                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-600">
                      Complainant: <span className="font-medium">{complaint.name}</span>
                    </span>
                    <span className="text-gray-600">
                      District: {complaint.district_name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                        {complaint.mobile}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      Created: {new Date(complaint.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No complaints found</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL - 50% */}
      <div className="w-1/2 bg-white flex flex-col overflow-hidden">
        {selectedComplaint ? (
          <>
            {/* Header Section */}
            <div className="p-6 border-b flex-shrink-0">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  File No. {selectedComplaint.complain_no}
                </h2>
                <p className={`px-3 py-1 rounded ${getStatusColor(selectedComplaint.status)}`}>
                  In Motion – With Lokayukta
                </p>
              </div>

              <p className="text-gray-700 mb-4">
                {selectedComplaint.remark || "No detailed description available for this complaint."}
              </p>

              {/* Complainant & District in 2 columns */}
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">COMPLAINANT</p>
                  <p className="font-semibold text-gray-800">
                    {selectedComplaint.name}
                  </p>
                  <p className="text-sm text-gray-600">{selectedComplaint.address}</p>
                  <p className="text-sm text-gray-600 mt-1">Mobile: {selectedComplaint.mobile}</p>
                  {selectedComplaint.email && (
                    <p className="text-sm text-gray-600">Email: {selectedComplaint.email}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">DISTRICT</p>
                  <p className="font-semibold text-gray-800">
                    {selectedComplaint.district_name}
                  </p>
                  {selectedComplaint.dob && (
                    <>
                      <p className="text-xs text-gray-500 uppercase mb-1 mt-3">DATE OF BIRTH</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(selectedComplaint.dob).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Fee Status */}
              <div className="flex gap-3">
                {selectedComplaint.fee_exempted === 1 ? (
                  <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded text-sm border border-green-200">
                    Fee: Exempted
                  </span>
                ) : selectedComplaint.amount ? (
                  <span className="px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded text-sm border border-yellow-200">
                    Fee: ₹{selectedComplaint.amount}
                  </span>
                ) : (
                  <span className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded text-sm border border-gray-200">
                    Fee: Not specified
                  </span>
                )}
                {selectedComplaint.challan_no && (
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-sm border border-blue-200">
                    Challan: {selectedComplaint.challan_no}
                  </span>
                )}
              </div>
            </div>

            {/* Tabs Section */}
            <div className="border-b px-6 flex-shrink-0">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab("cover")}
                  className={`pb-3 pt-3 text-sm font-medium transition-colors relative ${
                    activeTab === "cover"
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Cover & Meta
                  {activeTab === "cover" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`pb-3 pt-3 text-sm font-medium transition-colors relative ${
                    activeTab === "documents"
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Documents
                  {activeTab === "documents" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("notings")}
                  className={`pb-3 pt-3 text-sm font-medium transition-colors relative ${
                    activeTab === "notings"
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Notes / Notings
                  {activeTab === "notings" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("movement")}
                  className={`pb-3 pt-3 text-sm font-medium transition-colors relative ${
                    activeTab === "movement"
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Movement History
                  {activeTab === "movement" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === "cover" && (
                <div className="space-y-4">
                  {selectedComplaint.report_status && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <CoverMeta/>

                    </div>
                  )}
                </div>
              )}

              {activeTab === "documents" && (
                <div className="space-y-3">
                  <Documents/>
                </div>
              )}

              {activeTab === "notings" && (
                <div className="space-y-3">
                  {selectedComplaint.remark ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Remarks</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{selectedComplaint.remark}</p>
                    </div>
                  ) : (
                  <Notes/>
                  )}
                </div>
              )}

              {activeTab === "movement" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
                    <div>
                      <p className="font-medium text-gray-800">Created</p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedComplaint.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mt-1"></div>
                    <div>
                      <p className="font-medium text-gray-800">Last Updated</p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedComplaint.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Buttons */}
            <div className="border-t p-4 flex gap-3 flex-shrink-0">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                Pull Back
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                Mark as Received (Physical)
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto">
                Forward Physical
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            <div>
              <div className="text-6xl mb-3">📄</div>
              <p className="text-base">Select a file to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxUI;
=======
const AllComplaints = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for tabs and data
  const [activeTab, setActiveTab] = useState("all");
  const [complaintsData, setComplaintsData] = useState([]);
  const [pendingData, setPendingData] = useState([]);
  const [approvedData, setApprovedData] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [complaintToApprove, setComplaintToApprove] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  
  // Loading states for each tab
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [isLoadingPending, setIsLoadingPending] = useState(false);
  const [isLoadingApproved, setIsLoadingApproved] = useState(false);

  // Determine active tab from URL
  const getActiveTabFromURL = () => {
    if (location.pathname.includes('/pending-complaints')) return 'pending';
    if (location.pathname.includes('/approved-complaints')) return 'approved';
    return 'all'; // default
  };

  // Set active tab based on URL on mount
  useEffect(() => {
    setActiveTab(getActiveTabFromURL());
  }, [location.pathname]);

  // Handle tab change with routing
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Route navigation
    switch(tab) {
      case 'all':
        navigate('/all-complaints'); // Default route
        break;
      case 'pending':
        navigate('/operator/pending-complaints');
        break;
      case 'approved':
        navigate('/operator/approved-complaints');
        break;
      default:
        navigate('/all-complaints');
    }
  };

  // Fetch all complaints data from API
  const fetchAllComplaints = async () => {
    setIsLoadingAll(true);
    try {
      const response = await api.get("/operator/all-complaints");
      
      if (response.data.status === true) {
        setComplaintsData(response.data.data);
        setError("");
      } else {
        setError("Failed to fetch complaints data");
      }
    } catch (error) {
      console.error("API Error:", error);
      setError("Error fetching data");
    } finally {
      setIsLoadingAll(false);
    }
  };

  // Fetch pending complaints data
  const fetchPendingComplaints = async () => {
    setIsLoadingPending(true);
    try {
      const response = await api.get("/operator/pending-complaints");
      
      if (response.data.status === true) {
        setPendingData(response.data.data);
        setError("");
      } else {
        setPendingData([]);
      }
    } catch (error) {
      console.error("Pending API Error:", error);
      setPendingData([]);
      setError("Error fetching pending complaints");
    } finally {
      setIsLoadingPending(false);
    }
  };

  // Fetch approved complaints data
  const fetchApprovedComplaints = async () => {
    setIsLoadingApproved(true);
    try {
      const response = await api.get("/operator/approved-complaints");
      
      if (response.data.status === true) {
        setApprovedData(response.data.data);
        setError("");
      } else {
        setApprovedData([]);
      }
    } catch (error) {
      console.error("Approved API Error:", error);
      setApprovedData([]);
      setError("Error fetching approved complaints");
    } finally {
      setIsLoadingApproved(false);
    }
  };

  // Fetch data based on active tab
  useEffect(() => {
    switch(activeTab) {
      case 'all':
        fetchAllComplaints();
        break;
      case 'pending':
        fetchPendingComplaints();
        break;
      case 'approved':
        fetchApprovedComplaints();
        break;
      default:
        fetchAllComplaints();
    }
  }, [activeTab]);

  // Get current data based on active tab
  const getCurrentData = () => {
    switch(activeTab) {
      case 'all':
        return complaintsData;
      case 'pending':
        return pendingData;
      case 'approved':
        return approvedData;
      default:
        return complaintsData;
    }
  };

  // Get current loading state
  const getCurrentLoadingState = () => {
    switch(activeTab) {
      case 'all':
        return isLoadingAll;
      case 'pending':
        return isLoadingPending;
      case 'approved':
        return isLoadingApproved;
      default:
        return isLoadingAll;
    }
  };

  // Handle view details with navigation - Only button click
 const handleViewDetails = (e, complaintId) => {
  e.stopPropagation(); // Prevent any parent event
  navigate(`view/${complaintId}`);
  window.scrollTo({ top: 2, behavior: 'smooth' }); // Scroll to top smoothly
};

  // Handle modal view - Only for modal
  const handleModalView = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  // Handle approve button click - Show confirmation
  const handleApproveClick = (e, complaint) => {
    e.stopPropagation();
    setComplaintToApprove(complaint);
    setIsConfirmModalOpen(true);
  };

  // Handle approval confirmation with react-toastify
  const handleConfirmApproval = async () => {
    if (!complaintToApprove) return;
    
    setIsApproving(true);
    
    try {
      const response = await api.post(`/operator/approved-by-ro/${complaintToApprove.id}`);
      
      if (response.data.success || response.status === 200) {
        // Show success toast using react-toastify
        toast.success("Approved Successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Update complaint approved_by_ro status in local state
        const updateData = (prevData) => 
          prevData.map(complaint => 
            complaint.id === complaintToApprove.id 
              ? { ...complaint, approved_rejected_by_ro: 1 }
              : complaint
          );

        // Update all relevant data arrays
        setComplaintsData(updateData);
        setPendingData(updateData);
        setApprovedData(updateData);

        // Refresh current tab data
        switch(activeTab) {
          case 'all':
            fetchAllComplaints();
            break;
          case 'pending':
            fetchPendingComplaints();
            break;
          case 'approved':
            fetchApprovedComplaints();
            break;
        }

      } else {
        toast.error("Failed to approve complaint");
      }
    } catch (error) {
      console.error("Approval Error:", error);
      toast.error("Failed to approve complaint");
    } finally {
      setIsApproving(false);
      setIsConfirmModalOpen(false);
      setComplaintToApprove(null);
    }
  };

  // Cancel approval
  const handleCancelApproval = () => {
    setIsConfirmModalOpen(false);
    setComplaintToApprove(null);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusTextColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'in progress':
        return 'text-yellow-600 border-yellow-300 bg-yellow-50';
      case 'rejected':
        return 'text-red-600 border-red-300 bg-red-50';
      case 'approved':
        return 'text-green-600 border-green-300 bg-green-50';
      default:
        return 'text-gray-600 border-gray-300 bg-gray-50';
    }
  };

  // Check if complaint is approved by RO (Regional Officer)
  const isApprovedByRO = (complaint) => {
    return complaint.approved_rejected_by_ro === 1;
  };

  // Get tab title based on active tab
  const getTabTitle = () => {
    switch(activeTab) {
      case 'all':
        return 'All Complaints';
      case 'pending':
        return 'Pending Complaints';
      case 'approved':
        return 'Approved Complaints';
      default:
        return 'All Complaints';
    }
  };

  // Get current data count
  const getCurrentDataCount = () => {
    return getCurrentData().length;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const currentData = getCurrentData();
  const isLoading = getCurrentLoadingState();

  return (
    <>
      {/* React-Toastify Container */}
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

      <div className="min-h-screen p-2 sm:p-4">
        {/* Header - Responsive */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {getTabTitle()} / सभी शिकायतें
          </h1>
        </div>

        {/* JUSTIFY-BETWEEN TABS COMPONENT */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-4 sm:mb-6">
          <div className="">
            {/* JUSTIFY-BETWEEN Tab Navigation */}
            <div className="flex items-center justify-between rounded-md bg-gray-100 p-1 text-gray-500">
              <button
                onClick={() => handleTabChange('all')}
                className={`flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                  activeTab === "all"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "hover:bg-gray-200"
                }`}
              >
                All Complaints
              </button>
              <button
                onClick={() => handleTabChange('pending')}
                className={`flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                  activeTab === "pending"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "hover:bg-gray-200"
                }`}
              >
                Pending Complaints
              </button>
              <button
                onClick={() => handleTabChange('approved')}
                className={`flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                  activeTab === "approved"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "hover:bg-gray-200"
                }`}
              >
                Approved Complaints
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center space-y-4">
              {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div> */}
              <p className="text-gray-700 text-md font-semibold">Loading...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile-First Responsive Card Layout */}
<div className="space-y-4">
  {currentData.map((complaint) => (
    <div
      key={complaint.id}
      className="w-full bg-white shadow-sm hover:shadow-lg rounded-xl border border-gray-200 transition duration-300 overflow-hidden"
    >
      {/* Header Section */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <span className="text-gray-700 font-semibold text-sm">Complaint Details</span>
        <div className="mt-2 sm:mt-0">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isApprovedByRO(complaint)
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-yellow-100 text-yellow-700 border border-yellow-200"
            }`}
          >
            {isApprovedByRO(complaint) ? "Verified (Completed)" : "Pending Verification"}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          {/* Column 1 */}
          <div className="space-y-2">
            <div className="flex gap-x-2">
              <span className="text-gray-600 font-medium">Complaint No:</span>
              <span className="bg-blue-100 px-2 py-0.5 rounded text-blue-800 font-semibold text-xs">
                {complaint.complain_no}
              </span>
            </div>
            <div className="flex gap-x-2">
              <span className="text-gray-600 font-medium">Complainant:</span>
              <span className="text-gray-900 font-medium">{complaint.name}</span>
            </div>
            <div className="flex gap-x-2">
              <span className="text-gray-600 font-medium">Mobile No:</span>
              <span className="text-gray-900">{complaint.mobile}</span>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-2">
            <div className="flex gap-x-2">
              <span className="text-gray-600 font-medium">Email:</span>
              <span className="text-gray-900 text-md break-all">{complaint.email}</span>
            </div>
            <div className="flex gap-x-2">
              <span className="text-gray-600 font-medium">District:</span>
              <span className="text-gray-900">{complaint.district_name}</span>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col sm:items-end ">
            <span className="text-xs text-gray-600">Created:</span>
            <span className="text-sm font-medium text-gray-900">
              {formatDate(complaint.created_at)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-2 sm:justify-end">
          <button
            onClick={(e) => handleViewDetails(e, complaint.id)}
            className="w-full sm:w-auto border border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-lg transition duration-200 text-sm font-medium"
          >
            View Details
          </button>

        {isApprovedByRO(complaint) ? (
  <span className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-green-500 text-white cursor-default">
    ✓ Verified
  </span>
) : (
  <button
    onClick={(e) => handleApproveClick(e, complaint)}
    className="w-full sm:w-auto text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-lg transition duration-200 text-sm font-medium"
  >
    Verify
  </button>
)}

        </div>
      </div>
    </div>
  ))}
</div>



            {/* Empty State */}
            {currentData.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500 text-sm sm:text-base">
                  No {activeTab === 'all' ? '' : activeTab} complaints found
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Confirm Approval</h3>
                  <p className="text-sm text-gray-500">
                    Are you sure you want to approve this complaint?
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelApproval}
                  disabled={isApproving}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApproval}
                  disabled={isApproving}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApproving ? "Approving..." : "Yes, Approve"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal (existing) */}
      {isModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex justify-center items-start sm:items-center p-2 sm:p-4">
          <div className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-lg sm:rounded-2xl bg-white mt-2 sm:mt-0">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-start sm:items-center">
              <div className="pr-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Complaint Details</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">{selectedComplaint.complain_no}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 sm:p-2 flex-shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllComplaints;
>>>>>>> 3f6088c87450ffc20c3101fd9a714a51e4121392
