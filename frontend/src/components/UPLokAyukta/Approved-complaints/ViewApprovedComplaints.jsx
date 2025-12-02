import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaFileAlt,
  FaExclamationTriangle,
  FaTimes,
  FaBars,
} from "react-icons/fa";
// import { FaRegEdit } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";
import Notes from "./SubModule/Notes";
import Documents from "./SubModule/Documents";
import FileDetails from "./SubModule/FileDetails";
import MovementHistory from "./SubModule/MovementHistory";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const APP_URL = BASE_URL.replace("/api", "");
const token = localStorage.getItem("access_token");
const subRole = localStorage.getItem("subrole");

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const ViewComplaintDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [activeTab, setActiveTab] = useState("cover");
  const [showPreview, setShowPreview] = useState(false);
  const [currentPreviewFile, setCurrentPreviewFile] = useState(null);
  const [showMobileTabs, setShowMobileTabs] = useState(false);

  const getComplaintIDData = async () => {
    const res = await api.get(`/uplokayukt/view-complaint/${id}`);
    console.log("ID Data", res.data.data);
    return res.data.data;
  };

  const { data: complaintData, isLoading, isError, error } = useQuery({
    queryKey: ["complaint-details", id],
    queryFn: getComplaintIDData,
    enabled: !!id, 
  });

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

  const handleFileDownload = (filePath) => {
    if (!filePath) {
      toast.error("No file available for download");
      return;
    }
    const fileUrl = `${APP_URL}${filePath}`;
    window.open(fileUrl, "_blank");
  };

  const handleFilePreview = (filePath) => {
    if (filePath) {
      setCurrentPreviewFile(filePath);
      setShowPreview(true);
    } else {
      toast.error("File preview not available");
    }
  };

  const handleEditNavigation = () => {
    if (id && complaintData) {
      navigate(`/operator/all-complaints/edit/${id}`);
    } else {
      toast.error("Unable to edit: Missing complaint data");
    }
  };

  const isPDF = (filePath) => {
    return filePath && filePath.toLowerCase().endsWith(".pdf");
  };

  const isImage = (filePath) => {
    return filePath && /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
  };

  
  const PDFPreviewModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50  z-50 flex items-center justify-center p-2">
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
                      <p className="text-gray-600">Preview not supported</p>
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
                <FaFileAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No File Available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };


  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <h1 className="text-gray-600">Loading...</h1>
      </div>
    );
  }

  
  if (isError) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error?.message || "Error loading data"}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Complaints
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full bg-white flex flex-col min-h-screen">
        {complaintData ? (
          <>
            {/* Header Section */}
            <div className="p-4 md:p-6 border-b">
              {/* Mobile Header - Compact */}
              <div className="md:hidden mb-4">
                <div className="flex justify-between items-center mb-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                 
                  </button>
                  <div className="flex items-center gap-2">
               
                  
                    <button
                      onClick={() => navigate(-1)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1"
                    >
                      <IoMdArrowBack className="w-4 h-4" /> Back
                    </button>
                  </div>
                </div>
                
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  File No. {complaintData.complain_no}
                </h2>
                
                <div className="mb-3">
                  <span
                    className={`px-3 py-1.5 text-xs rounded-full ${getStatusColor(
                      complaintData.status
                    )}`}
                  >
                    In Motion – With uplokayukta
                  </span>
                </div>
              </div>

              {/* Desktop Header */}
              <div className="hidden md:block">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-gray-800">
                    File No. {complaintData.complain_no}
                  </h2>
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded ${getStatusColor(
                        complaintData.status
                      )}`}
                    >
                      In Motion – With uplokayukta
                    </span>
                 
                    <button
                      onClick={() => navigate(-1)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1"
                    >
                      <IoMdArrowBack className="w-4 h-4" /> Back
                    </button>
                  </div>
                </div>
              </div>

              {/* Description - Common for both mobile and desktop */}
              <p className="text-gray-700 mb-4 text-sm md:text-base">
                {complaintData.details?.[0]?.description ||
                  "No detailed description available for this complaint."}
              </p>

              {/* Complainant Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                <div className="bg-gray-50 p-3 md:p-0 md:bg-transparent rounded">
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    COMPLAINANT
                  </p>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">
                    {complaintData.name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    {complaintData.address}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    Mobile: {complaintData.mobile}
                  </p>
                  {complaintData.email && (
                    <p className="text-xs md:text-sm text-gray-600">
                      Email: {complaintData.email}
                    </p>
                  )}
                </div>
                
                <div className="bg-gray-50 p-3 md:p-0 md:bg-transparent rounded">
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    DISTRICT
                  </p>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">
                    {complaintData.district_name}
                  </p>
                  {complaintData.dob && (
                    <>
                      <p className="text-xs text-gray-500 uppercase mb-1 mt-3">
                        DATE OF BIRTH
                      </p>
                      <p className="font-semibold text-gray-800 text-sm md:text-base">
                        {new Date(complaintData.dob).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Fee and Challan Info */}
              <div className="flex flex-wrap gap-2">
                {complaintData.fee_exempted === 1 ? (
                  <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded text-xs border border-green-200">
                    Fee: Exempted
                  </span>
                ) : complaintData.amount ? (
                  <span className="px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded text-xs border border-yellow-200">
                    Fee: ₹{complaintData.amount}
                  </span>
                ) : (
                  <span className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded text-xs border border-gray-200">
                    Fee: Not specified
                  </span>
                )}
                {complaintData.challan_no && (
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200">
                    Challan: {complaintData.challan_no}
                  </span>
                )}
              </div>
            </div>

            {/* Mobile Tabs Dropdown */}
           
              <div className="md:hidden border-b bg-white">
                <div className="flex flex-col">
                  <button
                    onClick={() => {
                      setActiveTab("cover");
                      setShowMobileTabs(false);
                    }}
                    className={`py-3 px-4 text-left text-sm font-medium ${
                      activeTab === "cover"
                        ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    File Details
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("documents");
                      setShowMobileTabs(false);
                    }}
                    className={`py-3 px-4 text-left text-sm font-medium ${
                      activeTab === "documents"
                        ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Documents
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("notings");
                      setShowMobileTabs(false);
                    }}
                    className={`py-3 px-4 text-left text-sm font-medium ${
                      activeTab === "notings"
                        ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Notes / Notings
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("movement");
                      setShowMobileTabs(false);
                    }}
                    className={`py-3 px-4 text-left text-sm font-medium ${
                      activeTab === "movement"
                        ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Movement History
                  </button>
                </div>
              </div>
       

            {/* Desktop Tabs */}
            <div className="hidden md:flex border-b px-6">
              <div className="flex gap-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("cover")}
                  className={`pb-3 pt-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === "cover"
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  File Details
                  {activeTab === "cover" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`pb-3 pt-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
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
                  className={`pb-3 pt-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
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
                  className={`pb-3 pt-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
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

            {/* Mobile Active Tab Indicator */}
            <div className="md:hidden border-b">
              <button
                onClick={() => setShowMobileTabs(true)}
                className="w-full py-3 px-4 flex justify-between items-center text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <span>
                  {activeTab === "cover" && "File Details"}
                  {activeTab === "documents" && "Documents"}
                  {activeTab === "notings" && "Notes / Notings"}
                  {activeTab === "movement" && "Movement History"}
                </span>
                {/* <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg> */}
              </button>
            </div>

            {/* Content Area pass the propes */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
              {activeTab === "cover" && (
                <div className="space-y-4">
                  <FileDetails complaint={complaintData} />
                </div>
              )}

              {activeTab === "documents" && (
                <div className="space-y-3">
                  <Documents complaint={complaintData} />
                </div>
              )}

              {activeTab === "notings" && (
                <div className="space-y-3">
                  <Notes complaint={complaintData} />
                </div>
              )}

              {activeTab === "movement" && (
                <MovementHistory complaint={complaintData} />
              )}
            </div>

            {/* Action Buttons - Responsive */}
         <div className="border-t p-4">
  <div className="flex flex-col sm:flex-row justify-between gap-3">

    {/* LEFT SIDE BUTTON */}
    <div className="w-full sm:w-auto">
      <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm">
        Pull Back
      </button>
    </div>

    {/* RIGHT SIDE BUTTON GROUP */}
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">

      <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm">
        Return with Remarks
      </button>

      <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
        Send / Mark
      </button>

    </div>

  </div>
</div>

          </>
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            <div>
              <div className="text-6xl mb-3">📄</div>
              <p className="text-base">No complaint data available</p>
            </div>
          </div>
        )}
      </div>

      {showPreview && <PDFPreviewModal />}
    </div>
  );
};

export default ViewComplaintDetails;