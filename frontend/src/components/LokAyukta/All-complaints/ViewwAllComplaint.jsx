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
// import FileDetails from "./SubModule/FileDetails"; // Removed as requested
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

const ViewAllComplaint = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  // UPDATED: Default active tab set to 'documents'
  const [activeTab, setActiveTab] = useState("documents");
  const [showPreview, setShowPreview] = useState(false);
  const [currentPreviewFile, setCurrentPreviewFile] = useState(null);
  const [showMobileTabs, setShowMobileTabs] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ open: false, type: null });
  const [remark, setRemark] = useState("");
  const [selectedForwardTo, setSelectedForwardTo] = useState("");

  const {
    data: complaintData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["complaint-details", id],
    queryFn: async () => {
      const res = await api.get(`/lokayukt/view-complaint/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const {
    data: forwardOptionsData,
    isLoading: isLoadingOptions,
    isFetching: isFetchingOptions,
    error: forwardOptionsError,
  } = useQuery({
    queryKey: ["lokayukt-options"],
    queryFn: async () => {
      try {
        const res = await api.get("/lokayukt/get-lokayukt");

        if (Array.isArray(res.data)) {
          return res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          return res.data.data;
        } else if (res.data && res.data.data) {
          if (typeof res.data.data === 'object' && res.data.data !== null) {
            return Object.values(res.data.data);
          }
          return [];
        } else {
          return [];
        }
      } catch (error) {
        throw error;
      }
    },
    enabled: confirmConfig.open && confirmConfig.type === "forward",
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    retry: 2,
  });

  const markAsReceivedMutation = useMutation({
    mutationFn: async ({ complaintId, remarkData }) => {
      const res = await api.post('/lokayukt/received-physical', {
        complaint_id: complaintId,
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

  const forwardPhysicallyMutation = useMutation({
    mutationFn: async ({ complaintId, forwardTo, remarkData }) => {
      const res = await api.post('/lokayukt/forward-physical', {
        complaint_id: complaintId,
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
      markAsReceivedMutation.mutate({
        complaintId: id,
        remarkData: remark,
      });
    } else if (confirmConfig.type === "forward") {
      if (!selectedForwardTo || !remark.trim()) {
        toast.error("Please select forward to and enter a remark");
        return;
      }
      forwardPhysicallyMutation.mutate({
        complaintId: id,
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
            <div className="p-4 md:p-6 border-b">
              {/* Mobile Header */}
              <div className="md:hidden mb-4">
                <div className="flex justify-between items-center mb-3">
                  <button
                    onClick={() => navigate(-1)}
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
                    {complaintData.approved_rejected_by_lokayukt == 0 ? "Received - Record Section" : "In Motion – With Lokayukta"}
                  </span>
                </div>
              </div>

              {/* Desktop Header */}
       {/* ===== HEADER UNCHANGED ===== */}
<div className="hidden md:block">
  <div className="flex justify-between items-start mb-3">
    <h2 className="text-xl font-semibold text-gray-800">
      File No. {complaintData.complain_no}(
       <span className="text-blue-600">NEW CASE</span>
      )
    </h2>

    <div className="flex gap-2">
      <span
        className={`px-3 py-1 rounded ${getStatusColor(complaintData.status)}`}
      >
        {complaintData.approved_rejected_by_lokayukt == 0
          ? "Received - Record Section"
          : "In Motion – With Lokayukta"}
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


{/* ===== DESCRIPTION ===== */}
<p className="text-gray-700 mb-4 text-sm md:text-base">
  Description:{" "}
  {complaintData.complaint_description ||
    "No detailed description available for this complaint."}
</p>


{/* ===== DETAILS GRID (3 Columns Now) ===== */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

  {/* ------------ COLUMN 1 ------------ */}
  <div>
    <p className="text-xs text-gray-500 uppercase mb-1">
      CORRESPONDENCE NAME
    </p>
    <p className=" text-gray-800 text-sm md:text-base">
      {complaintData.correspondence_name}
    </p>

    <p className="text-xs md:text-sm text-gray-600 mt-1">
      {complaintData.address}
    </p>

  <p className="text-xs mt-3 text-gray-500 uppercase mb-1">
      ADDRESS
    </p>
    <p className=" text-gray-800 text-sm md:text-base">
        {complaintData.permanent_place || "N/A"}
    </p>
    



  </div>


  {/* ------------ COLUMN 2 ------------ */}
  <div>
    <p className="text-xs text-gray-500 uppercase mb-1">DISTRICT</p>
    <p className=" text-gray-800 text-sm md:text-base">
      {complaintData.permanent_district || "N/A"}
    </p>

    {complaintData.dob && (
      <>
        <p className="text-xs text-gray-500 uppercase mb-1 mt-4">
          Relation With Person
        </p>
        <p className=" text-gray-800 text-sm md:text-base">
          {complaintData.relation_with_person || "NA"}
        </p>
      </>
    )}
  </div>


  {/* ------------ COLUMN 3 ------------ */}
  <div>
     <p className="text-xs text-gray-500 uppercase mb-1">PERMANENT POST OFFICE</p>
    <p className=" text-gray-800 text-sm md:text-base">
      {complaintData.permanent_post_office || "N/A"}
    </p>

    <p className="text-xs text-gray-500 uppercase mb-1 mt-4">
      PREVIOUSLY SUBMITTED DETAILS
    </p>
    <p className=" text-gray-800 text-sm md:text-base">
      {complaintData.previously_submitted_details || "N/A"}
    </p>

    {/* <p className="text-xs text-gray-500 uppercase mb-1 mt-4">
      RELATION WITH PERSON
    </p>
    <p className="font-semibold text-gray-800 text-sm md:text-base">
      {complaintData.relation_with_person}
    </p> */}

    {/* <p className="text-xs text-gray-500 uppercase mb-1 mt-4">
      SUPPORTING AFFIDAVIT LIST
    </p>
    <p className="font-semibold text-gray-800 text-sm md:text-base">
      {complaintData.supporting_affidavit_list}
    </p> */}
  </div>

</div>


              {/* UPDATED: Fee Status and Fee Type Section */}
              <div className="flex flex-wrap gap-2">
                {/* 1. Fee Type Logic */}
                <span className={`px-3 py-1.5 rounded text-xs border ${
                  complaintData.fee_exempted === 1 
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-gray-50 text-gray-700 border-gray-200"
                }`}>
                  Fee Type: {complaintData.fee_exempted === 1 
                      ? 'Exempted' 
                      : complaintData.amount 
                      ? 'Paid' 
                      : 'Partial'}
                </span>

                {/* 2. Fee Status Logic */}
                <span className={`px-3 py-1.5 rounded text-xs border ${
                  complaintData.payment_status === 'Success' || complaintData.payment_status === 'Verified'
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                }`}>
                  Status: {complaintData.payment_status || 'Awaiting approval'}
                </span>

                {/* 3. Challan (if exists) */}
                {complaintData.challan_no && (
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200">
                    Challan: {complaintData.challan_no}
                  </span>
                )}
              </div>
            </div>

            {/* Mobile Tab Navigation (Removed "cover") */}
            <div className="md:hidden border-b bg-white">
              <div className="flex flex-col">
                {["documents", "notings", "movement"].map((tab) => (
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
                    {tab === "documents" && "Documents"}
                    {tab === "notings" && "Notes / Notings"}
                    {tab === "movement" && "Movement History"}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Tab Navigation (Removed "cover") */}
            <div className="hidden md:flex border-b px-6">
              <div className="flex gap-6 overflow-x-auto">
                {["documents", "notings", "movement"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 pt-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                      activeTab === tab ? "text-blue-600" : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
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

            {/* Tab Content Area (Removed "cover" render) */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
              {activeTab === "documents" && <Documents complaint={complaintData} />}
              {activeTab === "notings" && <Notes complaint={complaintData} />}
              {activeTab === "movement" && <MovementHistory complaint={complaintData} />}
            </div>

            {/* Footer Buttons */}
            <div className="border-t p-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between">

              <div>

                <button className="px-4 py-2 border cursor-not-allowed border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm">
                  Pull Back
                </button>
             
              </div>
             
                  
                  <div className="flex gap-2">

                      <button
                    // onClick={handleMarkAsReceived}
                    disabled={markAsReceivedMutation.isPending}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {markAsReceivedMutation.isPending
                      ? "Processing..."
                      : "Return with Remarks"}
                  </button>


                     <button
                    // onClick={handleforwardphysical}
                    disabled={forwardPhysicallyMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:ml-auto mt-2 sm:mt-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {forwardPhysicallyMutation.isPending
                      ? "Processing..."
                      : "Send / Mark"}
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

      {/* Confirmation Modal */}
      {confirmConfig.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-5 relative">
            <button
              onClick={handleConfirmNo}
              disabled={markAsReceivedMutation.isPending || forwardPhysicallyMutation.isPending}
              className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close"
            >
              <FaTimes className="w-5 h-5 text-gray-600" />
            </button>

            <h3 className="text-lg font-semibold mb-4 pr-8">
              {confirmConfig.type === "receive"
                ? "Mark as Received?"
                : "Forward File Physically Electronically?"}
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
                  <select
                    value={selectedForwardTo}
                    onChange={(e) => setSelectedForwardTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    {Array.isArray(forwardOptionsData) && forwardOptionsData.length > 0 ? (
                      forwardOptionsData.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name || option.user_name || `User ${option.id}`}
                          {option.district_name ? ` (${option.district_name})` : ""}
                        </option>
                      ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                  </select>
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
    </div>
  );
};

export default ViewAllComplaint;
