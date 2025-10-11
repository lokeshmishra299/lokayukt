"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

// Create axios instance with token if it exists
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const PendingComplaints = () => {
  const navigate = useNavigate();
  const [complaintsData, setComplaintsData] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [complaintToApprove, setComplaintToApprove] = useState(null);
  const [isApproving, setIsApproving] = useState(false);

  // ✅ Fetch complaints data from API
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/lokayukt/all-pending-complaints");
        
        if (response.data.status === true) {
          setComplaintsData(response.data.data);
          console.log(response.data.data);
        } else {
          setError("Failed to fetch complaints data");
        }
      } catch (error) {
        console.error("API Error:", error);
        setError("Error fetching data");
      }
    };

    fetchComplaints();
  }, []);

  // ✅ Handle view details with navigation - Only button click
  const handleViewDetails = (e, complaintId) => {
    e.stopPropagation(); // Prevent any parent event
    navigate(`/lokayukt/search-reports/view/${complaintId}`);
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

  // ✅ Handle approval confirmation with react-toastify
  const handleConfirmApproval = async () => {
    if (!complaintToApprove) return;
    
    setIsApproving(true);
    
    try {
      const response = await api.post(`/lokayukt/approved-by-ro/${complaintToApprove.id}`);
      
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
        setComplaintsData(prevData => 
          prevData.map(complaint => 
            complaint.id === complaintToApprove.id 
              ? { ...complaint, approved_by_ro: 1 }
              : complaint
          )
        );
      } else {
        toast.error("Failed to approve complaint", {
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
      toast.error("Failed to approve complaint", {
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

  // ✅ Check if complaint is approved by RO (Regional Officer)
  const isApprovedByRO = (complaint) => {
    return complaint.approved_by_ro === 1;
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pending Complaints</h1>
        </div>

        {/* ✅ Mobile-First Responsive Card Layout */}
        <div className="space-y-3 sm:space-y-4">
          {complaintsData.map((complaint) => (
            <div
              key={complaint.id}
              className="w-full bg-white shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl rounded-lg border border-gray-300 transition-shadow duration-300"
            >
              {/* ✅ Row 1 - Only Complaint No is bold */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 p-3 sm:p-4 text-sm border-b sm:border-b-0 border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <span className="font-semibold text-blue-600 text-xs sm:text-sm mb-1 sm:mb-0">
                    Complaint No:
                  </span>
                  <span className="bg-blue-100 px-2 sm:px-3 py-1 rounded text-blue-800 font-bold text-xs sm:text-sm text-center sm:text-left">
                    {complaint.complain_no}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <span className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-0">Department:</span>
                  <span className="text-gray-700 text-sm">{complaint.department_name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <span className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-0">Nature:</span>
                  <span className="text-gray-700 text-sm">{complaint.complaintype_name}</span>
                </div>
              </div>

              {/* ✅ Row 2 - All labels normal (not bold) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 px-3 sm:px-4 pb-3 sm:pb-4 text-sm border-b sm:border-b-0 border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <span className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-0">Complainant:</span>
                  <span className="text-gray-700 text-sm">{complaint.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <span className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-0">Mobile No:</span>
                  <span className="text-gray-700 text-sm">{complaint.mobile}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  {/* <span className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-0">Current Stage:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusTextColor(complaint.status)} self-start sm:self-center`}>
                    {complaint.status}
                  </span> */}
                   <span className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-0">District:</span>
                  <span className="text-gray-700 text-sm">{complaint.district_name}</span>
                </div>
              </div>

              {/* ✅ Row 3 - All labels normal (not bold) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 px-3 sm:px-4 pb-3 sm:pb-4 border-b sm:border-b-0 border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <span className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-0">Created Date:</span>
                  <span className="text-sm text-gray-600">{formatDate(complaint.created_at)}</span>
                </div>
                 
               
                <div className="hidden sm:block"></div>
              </div>

              {/* ✅ Row 4 - Action Buttons with conditional rendering based on approved_by_ro */}
              <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 sm:justify-end">
                  <button
                    onClick={(e) => handleViewDetails(e, complaint.id)}
                    className="w-full sm:w-auto border border-blue-500 text-blue-500 hover:text-white px-4 py-2 sm:py-1 rounded hover:bg-blue-700 cursor-pointer transition-colors duration-200 text-sm font-medium"
                  >
                    View Details
                  </button>
                  
                  {/* ✅ Conditional rendering based on approved_by_ro field */}
                  {isApprovedByRO(complaint) ? (
                    <button
                      disabled
                      className="w-full sm:w-auto px-4 py-2 sm:py-1 rounded text-sm font-medium bg-green-500 text-white border border-green-500 cursor-not-allowed"
                    >
                      ✓ Verified
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleApproveClick(e, complaint)}
                      className="w-full sm:w-auto border border-green-500 text-green-500 hover:text-white hover:bg-green-700 px-4 py-2 sm:py-1 rounded cursor-pointer transition-colors duration-200 text-sm font-medium"
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
        {complaintsData.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-sm sm:text-base">No pending complaints found</p>
          </div>
        )}
      </div>

      {/* ✅ Confirmation Modal */}
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
