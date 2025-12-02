import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFileAlt, FaExclamationTriangle, FaTimes } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Notes from "./SubModule/Notes";
import Documents from "./SubModule/Documents";
import FileDetails from "./SubModule/FileDetails";
import MovementHistory from "./SubModule/MovementHistory";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const APP_URL = BASE_URL.replace("/api", "");
const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const ViewApprovedComplaints = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("cover");
  const [showPreview, setShowPreview] = useState(false);
  const [currentPreviewFile, setCurrentPreviewFile] = useState(null);
  const [showMobileTabs, setShowMobileTabs] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ open: false, type: null });
  const [remark, setRemark] = useState("");
  const [selectedForwardTo, setSelectedForwardTo] = useState("");

  // Fetch complaint details
  const {
    data: complaintData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["complaint-details", id],
    queryFn: async () => {
      const res = await api.get(`/operator/view-complaint/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  // Fetch forward options - FIXED: Check API response structure
  const {
    data: forwardOptionsData,
    isLoading: isLoadingOptions,
    isFetching: isFetchingOptions,
    error: forwardOptionsError,
  } = useQuery({
    queryKey: ["lokayukt-options"],
    queryFn: async () => {
      try {
        const res = await api.get("/operator/get-lokayukt");
 
        

        if (Array.isArray(res.data)) {
          // console.log("Response is direct array");
          return res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          // console.log("Response has data array");
          return res.data.data;
        } else if (res.data && res.data.data) {
          // console.log("Response data.data exists but not array:", res.data.data);
          // Try to convert object to array if needed
          if (typeof res.data.data === 'object' && res.data.data !== null) {
            return Object.values(res.data.data);
          }
          return [];
        } else {
          // console.log("Unexpected response structure");
          return [];
        }
      } catch (error) {
        // console.error("Error fetching lokayukt options:", error);
        throw error;
      }
    },
    enabled: confirmConfig.open && confirmConfig.type === "forward",
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    retry: 2,
  });

  // Mark as received mutation
  const markAsReceivedMutation = useMutation({
    mutationFn: async (remarkData) => {
      const res = await api.post(`/operator/received-physical/${id}`, {
        remark: remarkData,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Marked as received successfully");
      queryClient.invalidateQueries({ queryKey: ["complaint-details", id] });
      setRemark("");
      setConfirmConfig({ open: false, type: null });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to mark as received");
    },
  });

  // Forward physically mutation
  const forwardPhysicallyMutation = useMutation({
    mutationFn: async ({ forwardTo, remarkData }) => {
      const res = await api.post(`/operator/forward-physical/${id}`, {
        forward_to: forwardTo,
        remark: remarkData,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Forwarded successfully");
      queryClient.invalidateQueries({ queryKey: ["complaint-details", id] });
      setRemark("");
      setSelectedForwardTo("");
      setConfirmConfig({ open: false, type: null });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to forward");
    },
  });

  const handleMarkAsReceived = () => setConfirmConfig({ open: true, type: "receive" });
  const handleforwardphysical = () => setConfirmConfig({ open: true, type: "forward" });

  const handleConfirmYes = () => {
    if (confirmConfig.type === "receive") {
      if (!remark.trim()) {
        toast.error("Please enter a remark");
        return;
      }
      markAsReceivedMutation.mutate(remark);
    } else if (confirmConfig.type === "forward") {
      if (!selectedForwardTo || !remark.trim()) {
        toast.error("Please select forward to and enter a remark");
        return;
      }
      forwardPhysicallyMutation.mutate({
        forwardTo: selectedForwardTo,
        remarkData: remark,
      });
    }
  };

  const handleConfirmNo = () => {
    setConfirmConfig({ open: false, type: null });
    setRemark("");
    setSelectedForwardTo("");
  };

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

  // const isPDF = (filePath) => filePath && filePath.toLowerCase().endsWith(".pdf");
  // const isImage = (filePath) => filePath && /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);

  // const PDFPreviewModal = () => (
  //   <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2">
  //     <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
  //       <div className="flex items-center justify-between p-4 border-b">
  //         <h3 className="text-lg font-semibold">File Preview</h3>
  //         <button
  //           onClick={() => {
  //             setShowPreview(false);
  //             setCurrentPreviewFile(null);
  //           }}
  //           className="p-2 hover:bg-gray-100 rounded"
  //         >
  //           <FaTimes className="w-5 h-5" />
  //         </button>
  //       </div>
  //       <div className="flex-1 p-4">
  //         {currentPreviewFile ? (
  //           <>
  //             {isPDF(currentPreviewFile) ? (
  //               <iframe
  //                 src={`${APP_URL}${currentPreviewFile}`}
  //                 className="w-full h-full border rounded"
  //                 title="PDF Preview"
  //               />
  //             ) : isImage(currentPreviewFile) ? (
  //               <img
  //                 src={`${APP_URL}${currentPreviewFile}`}
  //                 alt="File Preview"
  //                 className="max-w-full max-h-full mx-auto object-contain"
  //               />
  //             ) : (
  //               <div className="flex items-center justify-center h-full">
  //                 <div className="text-center">
  //                   <FaFileAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
  //                   <p className="text-gray-600">Preview not supported</p>
  //                   <button
  //                     onClick={() => handleFileDownload(currentPreviewFile)}
  //                     className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  //                   >
  //                     Download File
  //                   </button>
  //                 </div>
  //               </div>
  //             )}
  //           </>
  //         ) : (
  //           <div className="flex items-center justify-center h-full">
  //             <FaFileAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
  //             <p className="text-gray-600">No File Available</p>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-gray-600">Loading...</h1>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">
            {error?.response?.data?.message || error?.message || "Error loading complaint data"}
          </p>
          <button
            onClick={() => navigate("/operator/all-complaints")}
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
            {/* Header and content sections remain the same */}
            <div className="p-4 md:p-6 border-b">
              {/* Mobile Header */}
              <div className="md:hidden mb-4">
                <div className="flex justify-between items-center mb-3">
                  <button
                    onClick={() => navigate("/operator/all-complaints")}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1"
                  >
                    <IoMdArrowBack className="w-4 h-4" /> Back
                  </button>
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
                    In Motion – With Lokayukta
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
                      className={`px-3 py-1 rounded ${getStatusColor(complaintData.status)}`}
                    >
                      In Motion – With Lokayukta
                    </span>
                    <button
                      onClick={() => navigate("/operator/all-complaints")}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1"
                    >
                      <IoMdArrowBack className="w-4 h-4" /> Back
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4 text-sm md:text-base">
                {complaintData.details?.[0]?.description ||
                  "No detailed description available for this complaint."}
              </p>

              {/* Complainant Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                <div className="bg-gray-50 p-3 md:p-0 md:bg-transparent rounded">
                  <p className="text-xs text-gray-500 uppercase mb-1">COMPLAINANT</p>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">
                    {complaintData.name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">{complaintData.address}</p>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    Mobile: {complaintData.mobile}
                  </p>
                  {complaintData.email && (
                    <p className="text-xs md:text-sm text-gray-600">Email: {complaintData.email}</p>
                  )}
                </div>
                <div className="bg-gray-50 p-3 md:p-0 md:bg-transparent rounded">
                  <p className="text-xs text-gray-500 uppercase mb-1">DISTRICT</p>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">
                    {complaintData.district_name}
                  </p>
                  {complaintData.dob && (
                    <>
                      <p className="text-xs text-gray-500 uppercase mb-1 mt-3">DATE OF BIRTH</p>
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

            {/* Tabs */}
            <div className="md:hidden border-b bg-white">
              <div className="flex flex-col">
                {["cover", "documents", "notings", "movement"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setShowMobileTabs(false);
                    }}
                    className={`py-3 px-4 text-left text-sm font-medium ${
                      activeTab === tab
                        ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {tab === "cover" && "File Details"}
                    {tab === "documents" && "Documents"}
                    {tab === "notings" && "Notes / Notings"}
                    {tab === "movement" && "Movement History"}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden md:flex border-b px-6">
              <div className="flex gap-6 overflow-x-auto">
                {["cover", "documents", "notings", "movement"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 pt-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                      activeTab === tab ? "text-blue-600" : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {tab === "cover" && "File Details"}
                    {tab === "documents" && "Documents"}
                    {tab === "notings" && "Notes / Notings"}
                    {tab === "movement" && "Movement History"}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
              {activeTab === "cover" && <FileDetails complaint={complaintData} />}
              {activeTab === "documents" && <Documents complaint={complaintData} />}
              {activeTab === "notings" && <Notes complaint={complaintData} />}
              {activeTab === "movement" && <MovementHistory complaint={complaintData} />}
            </div>

            {/* Action Buttons */}
            <div className="border-t p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="px-4 py-2 border cursor-not-allowed border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm">
                  Pull Back
                </button>
                {complaintData.received_phsical === 1 ? (
                  <button
                    disabled
                    className="px-4 py-2 border border-green-300 bg-green-50 text-green-700 rounded cursor-not-allowed text-sm"
                  >
                    Received
                  </button>
                ) : (
                  <button
                    onClick={handleMarkAsReceived}
                    disabled={markAsReceivedMutation.isPending}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {markAsReceivedMutation.isPending
                      ? "Processing..."
                      : "Mark as Received (Physical)"}
                  </button>
                )}
                {complaintData.forward_physical === 1 ? (
                  <button
                    disabled
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:ml-auto mt-2 sm:mt-0  disabled:cursor-not-allowed"
                  >
                    Forwarded
                  </button>
                ) : (
                  <button
                    onClick={handleforwardphysical}
                    disabled={forwardPhysicallyMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:ml-auto mt-2 sm:mt-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {forwardPhysicallyMutation.isPending
                      ? "Processing..."
                      : "Forward Physically Completed File"}
                  </button>
                )}
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

      {/* Confirmation Modal */}
      {confirmConfig.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-5">
            <h3 className="text-lg font-semibold mb-4">
              {confirmConfig.type === "receive"
                ? "Mark as Received?"
                : "Forward Physically Completed File?"}
            </h3>
            {confirmConfig.type === "forward" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Forward To <span className="text-red-500">*</span>
                </label>
                {isLoadingOptions || isFetchingOptions ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded text-gray-500">
                    Loading...
                  </div>
                ) : forwardOptionsError ? (
                  <div className="w-full px-3 py-2 border border-red-300 rounded text-red-500 bg-red-50">
                    Error loading options: {forwardOptionsError.message}
                  </div>
                ) : (
                  <>
                    {process.env.NODE_ENV === "development" && (
                      <div className="text-xs text-gray-500 mb-1">
                        Found {Array.isArray(forwardOptionsData) ? forwardOptionsData.length : 0} options
                      </div>
                    )}
                    <select
                      value={selectedForwardTo}
                      onChange={(e) => setSelectedForwardTo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select...</option>
                      {Array.isArray(forwardOptionsData) && forwardOptionsData.length > 0 ? (
                        forwardOptionsData.map((option) => {
                          // Debug each option
                          {/* console.log("Dropdown option:", option); */}
                          return (
                            <option key={option.id} value={option.id}>
                              {option.name || option.user_name || `User ${option.id}`}
                              {option.district_name ? ` (${option.district_name})` : ""}
                            </option>
                          );
                        })
                      ) : (
                        <option disabled>No options available</option>
                      )}
                    </select>
                  </>
                )}
              </div>
            )}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remark <span className="text-red-500">*</span>
              </label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={4}
                placeholder="Enter your remark here..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleConfirmNo}
                disabled={markAsReceivedMutation.isPending || forwardPhysicallyMutation.isPending}
                className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmYes}
                disabled={
                  markAsReceivedMutation.isPending ||
                  forwardPhysicallyMutation.isPending ||
                  (confirmConfig.type === "forward" && (isLoadingOptions || isFetchingOptions)) ||
                  (confirmConfig.type === "receive" && !remark.trim()) ||
                  (confirmConfig.type === "forward" && (!selectedForwardTo || !remark.trim()))
                }
                className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {markAsReceivedMutation.isPending || forwardPhysicallyMutation.isPending
                  ? "Sending..."
                  : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreview && <PDFPreviewModal />}
    </div>
  );
};

export default ViewApprovedComplaints;