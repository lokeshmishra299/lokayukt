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
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const AllDraft = () => {
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
//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
    
//     // Route navigation
//     switch(tab) {
//       case 'all':
//         navigate('/all-complaints'); // Default route
//         break;
//       case 'pending':
//         navigate('/operator/pending-complaints');
//         break;
//       case 'approved':
//         navigate('/operator/approved-complaints');
//         break;
//       default:
//         navigate('/all-complaints');
//     }
//   };

  // Fetch all complaints data from API
  const fetchAllComplaints = async () => {
    setIsLoadingAll(true);
    try {
      const response = await api.get("/operator/all-draft");
      
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



  // Check if complaint is approved by RO (Regional Officer)
  const isApprovedByRO = (complaint) => {
    return complaint.approved_rejected_by_ro === 1;
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
             Drafts / ड्राफ्ट
          </h1>
        </div>

        {/* JUSTIFY-BETWEEN TABS COMPONENT */}
        {/* <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-4 sm:mb-6">
          <div className="">
        
            <div className="flex items-center justify-between rounded-md bg-gray-100 p-1 text-gray-500">
              <button
                onClick={() => handleTabChange('all')}
                className={`flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                  activeTab === "all"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "hover:bg-gray-200"
                }`}
              >
                Draft
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
        </div> */}

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
           <div className="space-y-3 sm:space-y-4">
  {currentData.map((complaint) => (
    <div
      key={complaint.id}
      className="w-full bg-white shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl rounded-lg border border-gray-300 transition-shadow duration-300"
    >
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {/* Left */}
        <span className="text-gray-700 font-semibold text-sm">Complaint Details</span>

        {/* Right */}
        <div className="text-right mt-2 sm:mt-0">
          <span className="text-xs text-gray-600">Current Stage:</span>
          <span className="ml-1 text-sm font-semibold text-gray-900">
            {isApprovedByRO(complaint) ? "Verified (Completed)" : "Pending Verification"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        {/* Left */}
        <div className="space-y-2">
          <div className="flex">
            <span className="text-gray-600 font-medium w-28">Complaint No:</span>
            <span className="bg-blue-100 px-2 py-1 rounded text-blue-800 font-bold text-xs">
              {complaint.complain_no}
            </span>
          </div>
          <div className="flex">
            <span className="text-gray-600 font-medium w-28">Complainant:</span>
            <span className="text-gray-800">{complaint.name}</span>
          </div>
          <div className="flex">
            <span className="text-gray-600 font-medium w-28">Mobile No:</span>
            <span className="text-gray-800">{complaint.mobile}</span>
          </div>
        </div>

        {/* Middle */}
        <div className="space-y-2">
          <div className="flex">
            <span className="text-gray-600 font-medium w-20">Email:</span>
            <span className="text-gray-800 break-all">{complaint.email}</span>
          </div>
          <div className="flex">
            <span className="text-gray-600 font-medium w-20">District:</span>
            <span className="text-gray-800">{complaint.district_name}</span>
          </div>
          <div className="flex">
            <span className="text-gray-600 font-medium w-20">Created:</span>
            <span className="text-gray-800">{formatDate(complaint.created_at)}</span>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-2">
          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-600">Submitted:</span>
            <div className="text-sm font-medium text-gray-900">
              {formatDate(complaint.created_at)}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row gap-2 sm:justify-end">
        <button
          onClick={(e) => handleViewDetails(e, complaint.id)}
          className="w-full sm:w-auto border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-700 px-4 py-2 rounded transition-colors duration-200 text-sm font-medium"
        >
          View Details
        </button>

        {isApprovedByRO(complaint) ? (
          <button
            disabled
            className="w-full sm:w-auto px-4 py-2 rounded text-sm font-medium bg-green-500 text-white border border-green-500 cursor-not-allowed"
          >
            ✓ Verified
          </button>
        ) : (
          <button
            onClick={(e) => handleApproveClick(e, complaint)}
            className="w-full sm:w-auto border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-700 px-4 py-2 rounded transition-colors duration-200 text-sm font-medium"
          >
            Verify
          </button>
        )}
      </div>
    </div>
  ))}
</div>


            {/* Empty State */}
            {currentData.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500 text-sm sm:text-base">
                  No {activeTab === 'all' ? '' : activeTab} Draft Found
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

export default AllDraft;
