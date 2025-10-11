"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");
  const subRole = localStorage.getItem("subrole")
// Create axios instance with token if it exists
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const PendingComplaints = () => {
  const navigate = useNavigate();
  
  // State for tabs and data
  const [activeTab, setActiveTab] = useState("pending"); // Default to pending since this is PendingComplaints
  const [complaintsData, setComplaintsData] = useState([]);
  const [allComplaintsData, setAllComplaintsData] = useState([]);
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

  // Handle tab change with routing
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Route navigation
    switch(tab) {
      case 'all':
        navigate('/operator/all-complaints');
        break;
      case 'pending':
        navigate('/operator/pending-complaints');
        break;
      case 'approved':
        navigate('/operator/approved-complaints');
        break;
      default:
        navigate('/operator/pending-complaints');
    }
  };

  // Fetch all complaints data
  const fetchAllComplaints = async () => {
    setIsLoadingAll(true);
    try {
      const response = await api.get("/operator/all-complaints");
      
      if (response.data.status === true) {
        setAllComplaintsData(response.data.data);
        setError("");
      } else {
        setAllComplaintsData([]);
      }
    } catch (error) {
      console.error("All Complaints API Error:", error);
      setAllComplaintsData([]);
      setError("Error fetching all complaints");
    } finally {
      setIsLoadingAll(false);
    }
  };

  // Fetch pending complaints data
  const fetchPendingComplaints = async () => {
    setIsLoadingPending(true);
    try {
      const response = await api.get("/operator/all-pending-complaints");
      
      if (response.data.status === true) {
        setComplaintsData(response.data.data);
        console.log(response.data.data);
        setError("");
      } else {
        setError("Failed to fetch complaints data");
      }
    } catch (error) {
      console.error("API Error:", error);
      setError("Error fetching data");
    } finally {
      setIsLoadingPending(false);
    }
  };

  // Fetch approved complaints data
  const fetchApprovedComplaints = async () => {
    setIsLoadingApproved(true);
    try {
      const response = await api.get("/operator/all-approved-complaints");
      
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

  // Fetch data on component mount
  useEffect(() => {
    fetchPendingComplaints(); // Load pending by default
    fetchAllComplaints(); // Load all complaints data
    fetchApprovedComplaints(); // Load approved data
  }, []);

  // Get current data based on active tab
  const getCurrentData = () => {
    switch(activeTab) {
      case 'all':
        return allComplaintsData;
      case 'pending':
        return complaintsData;
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
        return isLoadingPending;
    }
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
        return 'Pending Complaints';
    }
  };

  // Get current data count
  const getCurrentDataCount = () => {
    return getCurrentData().length;
  };

  // ✅ Handle view details with navigation - Only button click
  const handleViewDetails = (e, complaintId) => {
    e.stopPropagation(); // Prevent any parent event
    navigate(`/operator/pending-complaints/view/${complaintId}`);
      window.scrollTo({ top: 2, behavior: 'smooth' }); // Scroll to top smoothly

  };

  // ✅ Handle modal view - Only for modal
  const handleModalView = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  // ✅ Handle approve button click - Show confirmation
  const handleApproveClick = (e, complaint) => {
    e.stopPropagation();
    setComplaintToApprove(complaint);
    setIsConfirmModalOpen(true);
  };

  // ✅ **UPDATED: Handle approval confirmation - Show as verified and remove after delay**
  const handleConfirmApproval = async () => {
    if (!complaintToApprove) return;
    
    setIsApproving(true);
    
    try {
      const response = await api.post(`/operator/approved-by-ro/${complaintToApprove.id}`);
      
      if (response.data.success || response.status === 200) {
        // Show success toast using react-toastify
        toast.success("Verified Successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // ✅ **STEP 1: First update to show as verified**
        const updateData = (prevData) => 
          prevData.map(complaint => 
            complaint.id === complaintToApprove.id 
              ? { 
                  ...complaint, 
                  approved_rejected_by_ro: 1  // ✅ Show as verified first
                }
              : complaint
          );

        setComplaintsData(updateData);
        setAllComplaintsData(updateData);
        setApprovedData(updateData);

        // ✅ **STEP 2: Remove from list after 2 seconds**
        setTimeout(() => {
          setComplaintsData(prevData => 
            prevData.filter(complaint => complaint.id !== complaintToApprove.id)
          );
        }, 2000); // 2 seconds delay to show "Verified" status

        // Refresh data
        setTimeout(() => {
          fetchPendingComplaints();
          fetchAllComplaints();
          fetchApprovedComplaints();
        }, 2500);

      } else {
        toast.error("Failed to verify complaint", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Approval Error:", error);
      toast.error("Failed to verify complaint", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsApproving(false);
      setIsConfirmModalOpen(false);
      setComplaintToApprove(null);
    }
  };

  // ✅ Cancel approval
  const handleCancelApproval = () => {
    setIsConfirmModalOpen(false);
    setComplaintToApprove(null);
  };

  // ✅ Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // ✅ Get status color
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

  // ✅ **UPDATED: Check if complaint is approved by RO (Regional Officer)**
  const isApprovedByRO = (complaint) => {
    return complaint.approved_rejected_by_ro === 1;
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
      {/* ✅ React-Toastify Container */}
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
        {/* ✅ Header - Responsive */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {getTabTitle()} / लंबित शिकायतें
          </h1>
        </div>

        {/* TABS COMPONENT - ALWAYS VISIBLE */}
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
                className="w-full sm:w-auto text-blue-700 border border-blue-700  hover:bg-blue-700 hover:text-white t px-4 py-2 rounded-lg transition duration-200 text-sm font-medium"
              >
                Verify
              </button>
            )}

       

        </div>
      </div>
    </div>
  ))}
</div>


            {/* ✅ Empty State */}
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

      {/* ✅ **UPDATED: Confirmation Modal with better messaging** */}
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
                  <h3 className="text-lg font-medium text-gray-900">Confirm Verification</h3>
                  <p className="text-sm text-gray-500">
                    Are you sure you want to verify complaint?
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelApproval}
                  disabled={isApproving}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApproval}
                  disabled={isApproving}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApproving ? "Verifying..." : "Yes, Verify"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Mobile Responsive Modal */}
      {isModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex justify-center items-start sm:items-center p-2 sm:p-4">
          <div className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-lg sm:rounded-2xl bg-white mt-2 sm:mt-0">
            {/* Modal Header - Mobile Responsive */}
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

export default PendingComplaints;
