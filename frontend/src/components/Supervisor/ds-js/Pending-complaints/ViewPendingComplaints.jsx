import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaFileAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaCalendarAlt,
  FaDownload,
  FaArrowLeft,
  FaExclamationTriangle,
  FaIdCard,
  FaRupeeSign,
  FaEye,
  FaExpand,
  FaTimes,
  FaSpinner,
  FaUpload,
  FaCheck,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const APP_URL = BASE_URL.replace("/api", "");
const token = localStorage.getItem("access_token");
const subRole = localStorage.getItem("subrole");

// Create axios instance with token if it exists
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const ViewPendingComplaints = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaintData, setComplaintData] = useState(null);
  const [filePreviewData, setFilePreviewData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPreviewFile, setCurrentPreviewFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch complaint data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("No complaint ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch complaint data using edit endpoint for consistency
        const complaintResponse = await api.get(
          `/supervisor/view-complaint/${id}`
        );

        if (complaintResponse.data.status === true) {
          setComplaintData(complaintResponse.data.data);
          console.log("Complaint Data:", complaintResponse.data.data);

          // Fetch file preview data
          try {
            const fileResponse = await api.get(
              `/supervisor/get-file-preview/${id}`
            );
            if (fileResponse.data.status === true) {
              setFilePreviewData(fileResponse.data.data || []);
              console.log("File Preview Data:", fileResponse.data.data);
            }
          } catch (fileErr) {
            console.log("File preview not available:", fileErr);
            setFilePreviewData([]);
          }
        } else {
          setError("Failed to fetch complaint data");
          toast.error("Failed to fetch complaint data");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.response?.data?.message || "Failed to fetch complaint data"
        );
        toast.error("Error loading complaint details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Disposed - Accepted":
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "Under Investigation":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Pending":
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Handle file download
  const handleFileDownload = (filePath) => {
    if (!filePath) {
      toast.error("No file available for download");
      return;
    }
    
    // Open file in new tab for download
    const fileUrl = `${APP_URL}${filePath}`;
    window.open(fileUrl, "_blank");
  };

  // Handle file preview
  const handleFilePreview = (filePath) => {
    if (filePath) {
      setCurrentPreviewFile(filePath);
      setShowPreview(true);
    } else {
      toast.error("File preview not available");
    }
  };

  // Handle edit navigation
  const handleEditNavigation = () => {
    if (id && complaintData) {
      console.log("Navigating to edit with ID:", id);
      console.log("Complaint data:", complaintData);
      navigate(`/supervisor/pending-complaints/edit/${id}`);
    } else {
      toast.error("Unable to edit: Missing complaint data");
    }
  };

  // Check if file is PDF
  const isPDF = (filePath) => {
    return filePath && filePath.toLowerCase().endsWith(".pdf");
  };

  // Check if file is image
  const isImage = (filePath) => {
    return filePath && /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
  };

  // PDF Preview Modal Component
  const PDFPreviewModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">File Preview</h3>
            <button
              onClick={() => {
                setShowPreview(false);
                setCurrentPreviewFile(null);
              }}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4">
            {currentPreviewFile ? (
              <>
                {isPDF(currentPreviewFile) ? (
                  <iframe
                    src={`${APP_URL}${currentPreviewFile}`}
                    className="w-full h-full border rounded"
                    title="PDF Preview"
                  />
                ) : isImage(currentPreviewFile) ? (
                  <img
                    src={`${APP_URL}${currentPreviewFile}`}
                    alt="File Preview"
                    className="max-w-full max-h-full mx-auto object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FaFileAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Preview not supported for this file type</p>
                      <button
                        onClick={() => handleFileDownload(currentPreviewFile)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Download File
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FaFileAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No File Available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center text-lg font-medium text-gray-700">
          Loading...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => navigate("/supervisor/pending-complaints")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Complaints
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header - Same as edit form with Edit Button */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">View Complaint Details</h1>
            <p className="text-xs sm:text-sm text-gray-600">शिकायत विवरण देखें</p>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
            {/* Edit Button - Show based on subRole */}
            {subRole === "review-operator" && (
              <button
                onClick={handleEditNavigation}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                disabled={!id || !complaintData}
              >
                <FaRegEdit className="text-lg" />
                <span>Edit</span>
              </button>
            )}
            
            <button 
              onClick={() => navigate("/supervisor/pending-complaints")}
              style={{ backgroundColor: 'hsl(220, 70%, 25%)' }}
              className="flex items-center justify-center gap-2 px-4 py-2 text-white rounded transition"
            >
              <IoMdArrowBack className="text-lg" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Same structure as edit form */}
      {complaintData && (
        <div className="space-y-4 sm:space-y-6">
          {/* Top Row: Complainant Details + Security Fee */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Complainant Details */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <FaUser className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Complainant Details</h2>
                  <p className="text-sm text-gray-500">शिकायतकर्ता विवरण</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Name and Mobile Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name / नाम *
                    </label>
                    <div className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-gray-50">
                      {complaintData.name || "N/A"}
                    </div>
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile / मोबाइल *
                    </label>
                    <div className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-gray-50 font-mono">
                      {complaintData.mobile || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address / पता *
                  </label>
                  <div className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-gray-50 min-h-[80px] whitespace-pre-wrap">
                    {complaintData.address || "N/A"}
                  </div>
                </div>

                {/* District and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District / जिला *
                    </label>
                    <div className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-gray-50">
                      {complaintData.district_name || "N/A"}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-gray-50">
                      {complaintData.email || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Fee Section */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <FaRupeeSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Security Fee</h2>
                  <p className="text-xs sm:text-sm text-gray-500">जमानत राशि</p>
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {/* Fee Exempted Checkbox - Read Only */}
                <div>
                  <div className="flex items-center rounded-md space-x-2">
                    <input
                      id="exempted"
                      type="checkbox"
                      checked={complaintData.fee_exempted === 1}
                      disabled
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded opacity-60"
                    />
                    <label htmlFor="exempted" className="text-xs sm:text-sm font-medium text-gray-700">
                      Fee Exempted / शुल्क माफ
                    </label>
                  </div>
                </div>

                {/* Show Amount, Challan No, Date when fee is NOT exempted */}
                {complaintData.fee_exempted !== 1 && (
                  <>
                    {/* Amount */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Amount / राशि *
                      </label>
                      <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50">
                        {complaintData.amount || "N/A"}
                      </div>
                    </div>

                    {/* Challan No */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Challan No. / चालान नं. *
                      </label>
                      <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50">
                        {complaintData.challan_no || "N/A"}
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Date of Birth / जन्म तिथि *
                      </label>
                      <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50">
                        {complaintData.dob || "N/A"}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Complaint Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Complaint Details</h2>
            </div>

            {complaintData?.details?.length > 0 && (
              complaintData.details.map((detail, index) => {
                const correspondingFile = filePreviewData[index] || null;

                return (
                  <div key={detail.id} className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <FaFileAlt className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            Complaint Detail #{index + 1}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500">शिकायत विवरण</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Title and File Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Title / शीर्षक *
                          </label>
                          <div className="w-full px-3 py-[10px] text-sm border border-gray-300 rounded-md bg-gray-50">
                            {detail.title || "N/A"}
                          </div>
                        </div>

                        {/* File Display */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Attached File / फ़ाइल
                          </label>
                          
                          {correspondingFile ? (
                            <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 flex items-center justify-between">
                              <span className="text-gray-700">File Attached</span>
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleFilePreview(correspondingFile)}
                                  className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded text-xs transition-colors"
                                >
                                  <FaEye className="w-3 h-3" />
                                  Preview
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleFileDownload(correspondingFile)}
                                  className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-600 hover:bg-green-200 rounded text-xs transition-colors"
                                >
                                  <FaDownload className="w-3 h-3" />
                                  Download
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50">
                              No file attached
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Department Details Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {/* Department */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Department / विभाग *
                          </label>
                          <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50">
                            {detail.department_name || "N/A"}
                          </div>
                        </div>

                        {/* Officer Name */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Officer Name / अधिकारी का नाम *
                          </label>
                          <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50">
                            {detail.officer_name || "N/A"}
                          </div>
                        </div>

                        {/* Designation */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Designation / पदनाम *
                          </label>
                          <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50">
                            {detail.designation_name || "N/A"}
                          </div>
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Category / श्रेणी *
                          </label>
                          <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 capitalize">
                            {detail.category?.replace("_", " ") || "N/A"}
                          </div>
                        </div>
                      </div>

                      {/* Subject and Nature Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {/* Subject */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Subject / विषय *
                          </label>
                          <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50">
                            {detail.subject_name || "N/A"}
                          </div>
                        </div>

                        {/* Nature */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Nature / प्रकृति *
                          </label>
                          <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50">
                            {detail.complaintype_name || "N/A"}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Detailed Description / विस्तृत विवरण *
                        </label>
                        <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 min-h-[100px] whitespace-pre-wrap">
                          {detail.description || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && <PDFPreviewModal />}
    </div>
  );
};

export default ViewPendingComplaints;
