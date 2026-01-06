import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFileAlt, FaExclamationTriangle, FaTimes, FaEye,FaChevronDown } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Notes from "./SubModule/Notes";
import Documents from "./SubModule/Documents";
import MovementHistory from "./SubModule/MovementHistory";
import Fees from "./SubModule/Fees";
import DraftLetter from "./SubModule/DraftLetter";

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


const SearchableDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef(null);



  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const selectedOption = options.find((opt) => opt.id == value);

  const filteredOptions = options.filter((option) => {
    const label = option.name || option.user_name || `User ${option.id}`;
    const district = option.district_name || "";
    const search = searchTerm.toLowerCase();
    return (
      label.toLowerCase().includes(search) ||
      district.toLowerCase().includes(search)
    );
  });

  const handleSelect = (option) => {
    onChange(option.id);
    setIsOpen(false);
    setSearchTerm("");
  };

  
  return (
    <div className="relative" ref={wrapperRef}>
      <div
        className={`w-full px-3 py-2 border rounded bg-white flex justify-between items-center cursor-pointer ${
          disabled
            ? "bg-gray-100 cursor-not-allowed text-gray-400"
            : "border-gray-300 focus:ring-2 focus:ring-blue-500"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span
          className={`text-sm ${
            !selectedOption ? "text-gray-500" : "text-gray-900"
          }`}
        >
          {selectedOption
            ? `${selectedOption.name || selectedOption.user_name}${
                selectedOption.district_name
                  ? ` (${selectedOption.district_name})`
                  : ""
              }`
            : placeholder}
        </span>
        <FaChevronDown className="w-3 h-3 text-gray-500 ml-2" />
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-hidden flex flex-col">
          <input
            type="text"
            className="w-full px-3 py-2 border-b border-gray-200 text-sm focus:outline-none bg-gray-50"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
          <div className="overflow-y-auto flex-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${
                    value == option.id
                      ? "bg-blue-100 text-blue-800"
                      : "text-gray-700"
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option.name || option.user_name || `User ${option.id}`}
                  {option.district_name ? (
                    <span className="text-gray-500 text-xs ml-1">
                      ({option.district_name})
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ViewAllComplaint = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  
const [Takefile,setTakefile]= useState(false)

function takefile(){
  setTakefile(true)
}


//  const handleTakeFile = () =>
//     setTakeFileConfirmConfig({ open: true, type: "assign" });

  


    const capitalizeFirstLetter = (text = "") => {
  if (!text) return "N/A";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("documents");
  const [showPreview, setShowPreview] = useState(false);
  const [currentPreviewFile, setCurrentPreviewFile] = useState(null);
  const [showMobileTabs, setShowMobileTabs] = useState(false);
  const [showDispatch, setshowDispatch] = useState(false);
  const [sent_through_rk, setThroughRC] = useState(false);

  function diposeShow (){
    setshowDispatch(true)
  }
  function closePoup (){
    setshowDispatch(false)
  }

  const [confirmConfig, setConfirmConfig] = useState({
    open: false,
    type: null,
  });

  const [viewModalConfig, setViewModalConfig] = useState({
    open: false,
    type: null,
  });

  const [remark, setRemark] = useState("");
  const [selectedForwardTo, setSelectedForwardTo] = useState("");
  const [forwardType, setForwardType] = useState("self");

  const {
    data: complaintData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["complaint-details", id],
    queryFn: async () => {
      const res = await api.get(`/supervisor/view-complaint/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  // const {
  //   data: forwardOptionsData,
  //   isLoading: isLoadingOptions,
  //   isFetching: isFetchingOptions,
  //   error: forwardOptionsError,
  // } = useQuery({
  //   queryKey: ["lokayukt-options"],
  //   queryFn: async () => {
  //     try {
  //       const res = await api.get("/lokayukt/get-lokayukt");
  //       if (Array.isArray(res.data)) {
  //         return res.data;
  //       } else if (res.data && Array.isArray(res.data.data)) {
  //         return res.data.data;
  //       } else if (res.data && res.data.data) {
  //         if (typeof res.data.data === "object" && res.data.data !== null) {
  //           return Object.values(res.data.data);
  //         }
  //         return [];
  //       } else {
  //         return [];
  //       }
  //     } catch (error) {
  //       throw error;
  //     }
  //   },
  //   enabled: confirmConfig.open && confirmConfig.type === "forward",
  //   staleTime: 0,
  //   gcTime: 1000 * 60 * 5,
  //   retry: 2,
  // });


    const assignToSelfMutation = useMutation({
      mutationFn: async ({ complaintId }) => {
        const res = await api.post(`/supervisor/assign-by-ro-aro/${complaintId}`);
        return res.data;
      },
      onSuccess: (data) => {
        toast.success(data.message || "Assigned to yourself successfully");
        setTakefile(false)
        queryClient.invalidateQueries({ queryKey: ["complaint-details", id] });
        setConfirmConfig({ open: false, type: null });
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Failed to assign");
      },
    });

   const {
      data: forwardOptionsData,
      isLoading: isLoadingOptions,
      isFetching: isFetchingOptions,
      error: forwardOptionsError,
    } = useQuery({
      queryKey: ["lokayukt-options", forwardType], // 
      queryFn: async () => {
        try {
          //  Send To My Pool  API: /lokayukt/get-users
          if (forwardType === "self") {
            const res = await api.get("/supervisor/get-users");
            return res.data?.data || res.data || [];
          }
  
          const res = await api.get("/supervisor/get-uplokayukt");
          const raw = res.data?.data || res.data || [];
          const flatList = Array.isArray(raw) ? raw.flat() : [];
  
          return flatList;
        } catch (error) {
          throw error;
        }
      },
      enabled: confirmConfig.open && confirmConfig.type === "forward",
      staleTime: 0,
    });

  const markAsReceivedMutation = useMutation({
    mutationFn: async ({ complaintId, remarkData }) => {
      const res = await api.post("/supervisor/received-physical", {
        complaint_id: complaintId,
        remark: remarkData,
        sent_through_rk: sent_through_rk ? 1 : 0

      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Marked as received successfully");
      queryClient.invalidateQueries({ queryKey: ["complaint-details", id] });
       setThroughRC(false);
      setRemark("");
      setConfirmConfig({ open: false, type: null });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to mark as received"
      );
    },
  });

  const dispose = useMutation({
    mutationFn: async ({ complaintId, remarkData }) => {
      const res = await api.post(`/supervisor/dispose-complain/${id}`, {
        complaint_id: complaintId,
        remark: remarkData,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success( "Dispose successfully");
      queryClient.invalidateQueries({ queryKey: ["complaint-details", id] });
      setRemark("");
      setConfirmConfig({ open: false, type: null });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to mark as received"
      );
    },
  });

  // const forwardComplaintMutation = useMutation({
  //   mutationFn: async ({ complaintId, forwardTo, remarkData }) => {
  //     const res = await api.post(`/lokayukt/forward-by-lokayukt/${complaintId}`, {
  //       forward_to: forwardTo,
  //       remark: remarkData,
  //     });
  //     return res.data;
  //   },
  //   onSuccess: (data) => {
  //     toast.success(data.message || "Forwarded successfully");
  //     queryClient.invalidateQueries({ queryKey: ["complaint-details", id] });
  //     setRemark("");
  //     setSelectedForwardTo("");
  //     setConfirmConfig({ open: false, type: null });
  //   },
  //   onError: (error) => {
  //     toast.error(error?.response?.data?.message || "Failed to forward");
  //   },
  // });

  
  const forwardComplaintMutation = useMutation({
      mutationFn: async ({ complaintId, forwardTo, remarkData }) => {
        const res = await api.post(`/supervisor/forward-by-ro-aro/${complaintId}`, {
          forward_to: forwardTo,
          remark: remarkData,
          sent_through_rk: sent_through_rk ? 1 : 0
        });
        return res.data;
      },
      onSuccess: (data) => {
        toast.success(data.message || "Forwarded successfully");
        queryClient.invalidateQueries({ queryKey: ["complaint-details", id] });
        setRemark("");
        setThroughRC(false)
        setSelectedForwardTo("");
        setConfirmConfig({ open: false, type: null });
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Failed to forward");
      },
    });

  const handleMarkAsReceived = () =>
    setConfirmConfig({ open: true, type: "receive" });

  const handleforwardphysical = () =>
    setConfirmConfig({ open: true, type: "forward" });

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
      forwardComplaintMutation.mutate({
        complaintId: id,
        forwardTo: selectedForwardTo,
        remarkData: remark,
      });
    } else if (confirmConfig.type === "pullback") {
      // toast.success("Complaint Pulled Back Successfully");
      setConfirmConfig({ open: false, type: null });
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
            {error?.response?.data?.message ||
              error?.message ||
              "Error loading complaint data"}
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
                    {complaintData.approved_rejected_by_lokayukt == 1
                      ? "In Motion – With Lokayukta"
                      : "Received - Record Section" }
                  </span>
                </div>
              </div>

              {/* Desktop Header */}
              <div className="hidden md:block">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-gray-800">
                    File No. {complaintData.complain_no}(
                    <span className="text-blue-600">NEW CASE</span>)
                  </h2>

                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded ${getStatusColor(
                        complaintData.status
                      )}`}
                    >
                       {complaintData.approved_rejected_by_lokayukt == 1
                      ? "In Motion – With Lokayukta"
                      : "Received - Record Section" }
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

            
              <p className="text-[14px] text-black font-semibold uppercase my-2">
                {/* Description:{" "} */}
                विवरण:{" "}
                <span className="text-gray-500">
                  {complaintData.complaint_description ||
                    "No detailed description available for this complaint."}
                </span>

              </p>

                 {/* <p className="text-[14px] text-black font-semibold uppercase mb-1">
              
                विलंब का कारण:{"  "}

                <span className="text-gray-500">
                  {complaintData.delay_reason ||
                    "NA"}
                </span>

              </p> */}

                          <div className="space-y-3 mb-6">
  
  <div>
    <h3 className="text-gray-900 text-[14px] font-bold  mb-2">
      मुख्य परिवादी का विवरण 
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Name */}
      <div>
        <p className="text-[14px] text-black font-semibold uppercase mb-1">
           नाम
        </p>
        <p className="text-gray-800 text-sm">
          {capitalizeFirstLetter(complaintData.main_complainant_name) || "N/A"}
        </p>
      </div>

      {/* Father's Name */}
      <div>
        <p className="text-[14px] text-black font-semibold uppercase mb-1">
          पिता का नाम
        </p>
        <p className="text-gray-800 text-sm">
          {capitalizeFirstLetter(complaintData.main_complainant_father) || "N/A"}
        </p>
      </div>

      {/* District */}
      <div>
        <p className="text-[14px] text-black font-semibold uppercase mb-1">
        जिला
        </p>
        <p className="text-gray-800 text-sm">
          {capitalizeFirstLetter(complaintData.main_complainant_district) || "N/A"}
        </p>
      </div>
    </div>
  </div>

  <div>
    <h3 className="text-gray-900 text-[14px] font-bold  mb-2">
      मुख्य प्रतिवादी का विवरण
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Name */}
      <div>
        <p className="text-[14px] text-black font-semibold uppercase mb-1">
          नाम
        </p>
        <p className="text-gray-800 text-sm">
          {capitalizeFirstLetter(complaintData.main_respondent_name) || "N/A"}
        </p>
      </div>

      {/* Designation */}
      <div>
        <p className="text-[14px] text-black font-semibold uppercase mb-1">
         पद
        </p>
        <p className="text-gray-800 text-sm">
          {capitalizeFirstLetter(complaintData.main_respondent_designation) || "N/A"}
        </p>
      </div>

      {/* District */}
      <div>
        <p className="text-[14px] text-black font-semibold uppercase mb-1">
         जिला
        </p>
        <p className="text-gray-800 text-sm">
          {capitalizeFirstLetter(complaintData.main_respondant_district) || "N/A"}
        </p>
      </div>
    </div>
  </div>

  <div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Relation */}
      <div>
        <p className="text-[14px] text-black font-semibold uppercase mb-1">
          व्यक्ति से संबंध
        </p>
        <p className="text-gray-800 text-sm">
          {capitalizeFirstLetter(complaintData.relation_with_person) || "NA"}
        </p>
      </div>

      {/* Cause Date */}
      {complaintData.dob && (
        <div>
          <p className="text-[14px] text-black font-semibold uppercase mb-1">
            कार्यवाही तिथि
          </p>
          <p className="text-gray-800 text-sm">
            {capitalizeFirstLetter(complaintData.cause_date) || "NA"}
          </p>
        </div>
      )}

      {/* Category */}
      <div>
        <p className="text-[14px] text-black font-semibold uppercase mb-1">
          श्रेणी
        </p>
        <p className="text-gray-800 text-sm">
          {capitalizeFirstLetter(complaintData.category) || "N/A"}
        </p>
      </div>
    </div>
  </div>

</div>

              {/* Fee Status and Fee Type Section */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-3 py-1.5 rounded text-[14px] border ${
                    complaintData.fee_exempted === 1
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  शुल्क का प्रकार:{" "}
                  {complaintData.fee_exempted == 0 ? "Exempted" : complaintData.fee_exempted == 2 ? "Partial" : complaintData.fee_exempted == 1 ? "Paid" : "NA"}
                </span>

                <span
                  className={`px-3 py-1.5 rounded text-xs border ${
                    complaintData.payment_status === "Success" ||
                    complaintData.payment_status === "Verified"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}
                >
                  स्थिति: {complaintData.fee_approved_by_lokayukt == 1 ? "Approved" : "Awaiting approval"}
                </span>

                {complaintData.challan_no && (
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200">
                    Challan: {complaintData.challan_no}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mt-4 border-t pt-4">
                <button
                  onClick={() =>
                    setViewModalConfig({ open: true, type: "correspondence" })
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200 hover:bg-indigo-100 transition-colors text-sm font-medium"
                >
                  <FaEye /> शिकायतकर्ता
                </button>
                <button
                  onClick={() =>
                    setViewModalConfig({ open: true, type: "respondent" })
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-md border border-orange-200 hover:bg-orange-100 transition-colors text-sm font-medium"
                >
                  <FaEye /> प्रतिवादी
                </button>
                <button
                  onClick={() =>
                    setViewModalConfig({ open: true, type: "support" })
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-md border border-green-200 hover:bg-green-100 transition-colors text-sm font-medium"
                >
                  <FaEye /> समर्थनकर्ता व्यक्ति
                </button>
                <button
                  onClick={() =>
                    setViewModalConfig({ open: true, type: "witness" })
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-md border border-purple-200 hover:bg-purple-100 transition-colors text-sm font-medium"
                >
                  <FaEye /> गवाह का विवरण
                </button>
              </div>
            </div>

            {/* Mobile Tab Navigation */}
            <div className="md:hidden border-b bg-white">
              <div className="flex flex-col">
                {[ "documents", "notings", "movement", "draft"].map((tab) => (
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
                  {/* {tab === "fee" && "Fee Verification"} */}
                      
                    {tab === "documents" && "Documents"}
                    {tab === "notings" && "Notes / Notings"}
                    {tab === "movement" && "Movement History"}
                    {tab === "draft" && "Draft"}

                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Tab Navigation */}
            <div className="hidden md:flex border-b px-6">
              <div className="flex gap-6 overflow-x-auto">
                {[ "documents", "notings", "movement", "draft"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 pt-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                      activeTab === tab
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {/* {tab === "fee" && "Fee Verification"} */}
                    {tab === "documents" && "Documents"}
                    {tab === "notings" && "Notes / Notings"}
                    {tab === "movement" && "Movement History"}
                    {tab === "draft" && "Draft Letter"}

                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto">

  {/* {activeTab === "fee" && (
  <Fees
    complaint={complaintData}
    onFeeApproved={() => {
      queryClient.invalidateQueries({
        queryKey: ["complaint-details", id],
      });
    }}
  />
)} */}


              {activeTab === "documents" && (
                <Documents complaint={complaintData} />
              )}
              {activeTab === "notings" && <Notes complaint={complaintData} />}
              {activeTab === "movement" && (
                <MovementHistory complaint={complaintData} />
              )}
              {activeTab === "draft" && <DraftLetter complaint={complaintData} />}


              
            </div>

            {/* Footer Buttons */}
            <div className="border-t p-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div>
                  <button
                    onClick={() => {
                      setConfirmConfig({ open: true, type: "pullback" });
                    }}
                    className="px-4 py-2 border  border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
                  >
                    Pull Back
                  </button>
                  
                 
                    <button
                      onClick={takefile}
                      className="px-4 py-2 border  border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm ml-2"
                    >
                       Take File In Hand
                    </button>
              

                </div>


                

                <div className="flex gap-2">


                    {/* <button
  onClick={diposeShow}
  disabled={dispose.isPending}
  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
>
  {dispose.isPending ? "Processing..." : "Dispose"}
</button> */}

                   

                  <button
                    onClick={handleMarkAsReceived}
                    disabled={markAsReceivedMutation.isPending}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {markAsReceivedMutation.isPending
                      ? "Processing..."
                      : "Return with Remarks"}
                  </button>

                    {complaintData.approved_rejected_by_ro_aro == "1" ? (
                    <span className="px-4 py-2 bg-blue-600 text-white rounded  text-sm cursor-not-allowed">
                      Forwarded
                    </span>
                  ) : (
                    <button
                      onClick={handleforwardphysical}
                      disabled={forwardComplaintMutation.isPending}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:ml-auto mt-2 sm:mt-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {forwardComplaintMutation.isPending
                        ? "Processing..."
                        : "Send / Mark"}
                    </button>
                  )}
{/* 
                  <button
                    onClick={handleforwardphysical}
                    disabled={forwardComplaintMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:ml-auto mt-2 sm:mt-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {forwardComplaintMutation.isPending
                      ? "Processing..."
                      : "Send / Mark"}
                  </button> */}
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


      {/* {
        showDispatch && (
          <div>
            <h1>djudjdjj</h1>
          </div>
        )
      } */}

{Takefile && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white w-[420px] rounded-lg shadow-lg relative">

      <div className="flex items-center justify-between px-6 pt-2 ">
        <h2 className="text-lg font-semibold text-gray-800">
          Take your file in hand?
        </h2>
        <button
          onClick={() => setTakefile(false)}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>

      <div className="px-6 py-6 text-sm text-gray-700">
        Are you sure you want to take this file in hand?
      </div>

      <div className="flex justify-end gap-3 px-6 pb-2 ">
        <button
          onClick={() => setTakefile(false)}
          className="px-5 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
        >
          No
        </button>

       <button
  onClick={() =>
    assignToSelfMutation.mutate({ complaintId: id })
  }
  className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
  disabled={assignToSelfMutation.isLoading}
>
  {assignToSelfMutation.isLoading ? "Processing..." : "Yes"}
</button>

      </div>

    </div>
  </div>
)}





     {confirmConfig.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-5 relative">
                {/* Close Button */}
                <button
                  onClick={handleConfirmNo}
                  disabled={
                    markAsReceivedMutation.isPending ||
                   forwardComplaintMutation.isPending
                  }
                  className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Close"
                >
                  <FaTimes className="w-5 h-5 text-gray-600" />
                </button>
    
                {/* Title */}
                <h3 className="text-lg font-semibold mb-4 pr-8">
                  {confirmConfig.type === "receive"
                    ? "Return with Remarks?"
                    : confirmConfig.type === "forward"
                    ? "Sent"
                    : confirmConfig.type === "pullback"
                    ? "Are you sure you want to pull back?"
                    : "Assign to Yourself?"}
                </h3>
    
                {confirmConfig.type === "forward" && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Forward Type <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center cursor-pointer p-2 border rounded hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="forwardType"
                            value="self"
                            checked={forwardType === "self"}
                            onChange={(e) => {
                              setForwardType(e.target.value);
                              setSelectedForwardTo("");
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 font-medium">
                            Send Direct
                          </span>
                        </label>
                        <label className="flex items-center cursor-pointer p-2 border rounded hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="forwardType"
                            value="uplokayukt"
                            checked={forwardType === "uplokayukt"}
                            onChange={(e) => {
                              setForwardType(e.target.value);
                              setSelectedForwardTo("");
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 font-medium">
                            Send To Other Pool
                          </span>
                        </label>
                      </div>
                    </div>
    
                    <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select {forwardType === "self" ? "My Pool" : "Other Pool"}{" "}
                        Officer <span className="text-red-500">*</span>
                      </label>
    
                      {isLoadingOptions || isFetchingOptions ? (
                        <div className="w-full px-3 py-2 border border-gray-300 rounded text-gray-500 bg-gray-50 text-sm">
                          Loading options...
                        </div>
                      ) : forwardOptionsError ? (
                        <div className="w-full px-3 py-2 border border-red-300 rounded text-red-500 bg-red-50 text-sm">
                          Error: {forwardOptionsError.message}
                        </div>
                      ) : (
                        <SearchableDropdown
                          options={
                            Array.isArray(forwardOptionsData)
                              ? forwardOptionsData
                              : []
                          }
                          value={selectedForwardTo}
                          onChange={(val) => setSelectedForwardTo(val)}
                          placeholder="Select Officer..."
                        />
                      )}

                          
                 
                    </div>
                  </>
                )}


                {confirmConfig.type !== "assign" &&
                  confirmConfig.type !== "pullback" && (
                    <>
                      <div className="mb-5 mt-3">

                       <label className="flex items-center gap-2 cursor-pointer mt-2"> 
 <input
    type="checkbox"
    checked={sent_through_rk}
    onChange={(e) => setThroughRC(e.target.checked)}
    className="w-4 h-4"
  />
  <span className="text-sm">Checkbox If Send through RC</span>
</label> 
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
                    </>
                  )}
    
                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleConfirmNo}
                    disabled={
                      markAsReceivedMutation.isPending ||
                     forwardComplaintMutation.isPending
                    }
                    className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {confirmConfig.type === "assign" ||
                    confirmConfig.type === "pullback"
                      ? "No"
                      : "Cancel"}
                  </button>
    
                  <button
                    onClick={handleConfirmYes}
                    disabled={
                      markAsReceivedMutation.isPending ||
                     forwardComplaintMutation.isPending ||
                      (confirmConfig.type === "receive" && !remark.trim()) ||
                      (confirmConfig.type === "forward" &&
                        (!remark.trim() ||
                          !selectedForwardTo ||
                          isLoadingOptions ||
                          isFetchingOptions))
                    }
                    className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {markAsReceivedMutation.isPending ||
                   forwardComplaintMutation.isPending
                      ? "Sending..."
                      : confirmConfig.type === "assign" ||
                        confirmConfig.type === "pullback"
                      ? "Yes"
                      : "Send"}
                  </button>
                </div>
              </div>
            </div>
          )}


          {showDispatch && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-5 relative">
      
      {/* Close Button */}
      <button
        onClick={closePoup}
        disabled={markAsReceivedMutation.isPending}
        className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaTimes className="w-5 h-5 text-gray-600" />
      </button>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-4 pr-8">
        Dispose Complaint
      </h3>

      {/* Remark */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Disposal Remark <span className="text-red-500">*</span>
        </label>
        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          rows={4}
          placeholder="Enter disposal remark..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={closePoup}
          className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            if (!remark.trim()) {
              toast.error("Please enter disposal remark");
              return;
            }

            dispose.mutate({
              complaintId: id,
              remarkData: remark,
            });

            setshowDispatch(false);
          }}
          disabled={dispose.isPending || !remark.trim()}
          className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {dispose.isPending ? "Disposing..." : "Dispose Now"}
        </button>
      </div>
    </div>
  </div>
)}


      {viewModalConfig.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={(e) => {
            if (e.target === e.currentTarget)
              setViewModalConfig({ open: false, type: null });
          }}
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative animate-in fade-in zoom-in duration-200 m-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewModalConfig({ open: false, type: null })}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1"
            >
              <FaTimes size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-6 border-b pb-2 text-gray-800">
              {viewModalConfig.type === "correspondence"
                ? "पत्राचार पता विवरण"
                : viewModalConfig.type === "respondent"
                ? "प्रतिवादी का विवरण"
                : viewModalConfig.type === "support"
                ? " सहायक व्यक्तियों का विवरण"
                : "गवाह का विवरण"}
            </h3>

            {/* Correspondence Content */}
            {/* {viewModalConfig.type === "correspondence" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Name
                    </p>
                    <p className="text-gray-800 font-medium">
                      {complaintData.complainants?.[0]?.complainant_name ||
                        "N/A"}
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Father Name
                    </p>
                    <p className="text-gray-800 font-medium">
                      {complaintData.complainants?.[0]?.father_name || "N/A"}
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Is Public Servant
                    </p>
                    <p className="text-gray-800 font-medium">
                      {complaintData.complainants?.[0]?.is_public_servant ||
                        "N/A"}
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Occupation
                    </p>
                    <p className="text-gray-800 font-medium">
                      {complaintData.complainants?.[0]?.occupation || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )} */}

              
     {viewModalConfig.type === "correspondence" && (
              <div className="w-full">
                {" "}
                {complaintData.complainants &&
                complaintData.complainants.length > 0 ? (
                  <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-[14px] font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap border-r border-gray-200"
                          >
                            क्र. सं.
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-[14px] font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap border-r border-gray-200"
                          >
                            नाम
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-[14px] font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap border-r border-gray-200"
                          >
                            पिता का नाम
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-[14px] font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap border-r border-gray-200"
                          >
                            जिला
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-[14px] font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap border-r border-gray-200"
                          >
                            व्यवसाय
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-[14px] font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap border-r border-gray-200"
                          >
                            लोक सेवक?
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[200px]"
                          >
                            पूरा पता
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {complaintData.complainants.map((comp, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-blue-50 transition-colors duration-150"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700 border-r border-gray-200 bg-gray-50">
                              {idx + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                              {comp.complainant_name || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200">
                              {comp.father_name || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200">
                              {comp.district_name || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200">
                              {comp.occupation || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  comp.is_public_servant === "हाँ" ||
                                  comp.is_public_servant === "Yes"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {comp.is_public_servant || "-"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 break-words">
                              {comp.permanent_place || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      ></path>
                    </svg>
                    <span className="text-gray-500 font-medium">
                      परिवादी का कोई डेटा उपलब्ध नहीं है
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Respondent Content */}
            {/* {viewModalConfig.type === "respondent" && (
              <div className="space-y-4">
                {complaintData.respondant &&
                complaintData.respondant.length > 0 ? (
                  complaintData.respondant.map((resp, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-3 shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
                        <h4 className="text-sm font-bold text-gray-700">
                          Respondent #{idx + 1}
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                        <div>
                          <p className="text-xs text-gray-500 font-semibold">
                            NAME
                          </p>
                          <p className="text-sm text-gray-800">
                            {resp?.respondent_name || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold">
                            DESIGNATION
                          </p>
                          <p className="text-sm text-gray-800">
                            {resp?.designation || "N/A"}
                          </p>
                        </div>

                        <div className="sm:col-span-2">
                          <p className="text-xs text-gray-500 font-semibold">
                            ADDRESS
                          </p>
                          <p className="text-sm text-gray-800">
                            {resp?.current_address || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded border border-dashed border-gray-300">
                    <p className="text-gray-500">
                      No respondent data available.
                    </p>
                  </div>
                )}
              </div>
            )} */}


            
  {viewModalConfig.type === "respondent" && (
              <div className="w-full">
                {complaintData.respondant &&
                complaintData.respondant.length > 0 ? (
                  <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap">
                            क्र. सं.
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap">
                            प्रतिवादी का नाम
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap">
                            पदनाम
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap">
                            विभाग
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap">
                            जिला
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap">
                            अधिकारी की श्रेणी
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 min-w-[250px]">
                            वर्तमान पता
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {complaintData.respondant.map((resp, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-blue-50 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-100">
                              {idx + 1}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-800 font-medium border-r border-gray-100 whitespace-nowrap">
                              {resp.respondent_name || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100 whitespace-nowrap">
                              {resp.designation || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100 whitespace-nowrap">
                              {resp.department_name || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100 whitespace-nowrap">
                              {resp.district_name || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100 whitespace-nowrap">
                              {resp.officer_category || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-normal break-words leading-relaxed">
                              {resp.current_address || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-500 font-medium">
                      प्रतिवादी का कोई डेटा उपलब्ध नहीं है।
                    </p>
                  </div>
                )}
              </div>
            )}

     {viewModalConfig.type === "support" && (
              <div className="w-full">
                {complaintData.support && complaintData.support.length > 0 ? (
                  <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 border-r border-gray-200 w-16 whitespace-nowrap">
                            क्र. सं.
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 border-r border-gray-200 w-1/4 whitespace-nowrap">
                            नाम
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 whitespace-nowrap">
                            पता
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {complaintData.support.map((item, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-blue-50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-100">
                              {idx + 1}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 font-medium border-r border-gray-100 whitespace-nowrap">
                              {item.support_name || "-"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 whitespace-normal break-words leading-relaxed">
                              {item.support_address || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-500 font-medium">
                      कोई सहायक व्यक्ति उपलब्ध नहीं है।
                    </p>
                  </div>
                )}
              </div>
            )}

  {viewModalConfig.type === "witness" && (
              <div className="w-full">
                {complaintData.witness && complaintData.witness.length > 0 ? (
                  <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 border-r border-gray-200 w-16 whitespace-nowrap">
                            क्र. सं.
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 border-r border-gray-200 w-1/4 whitespace-nowrap">
                            नाम
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 whitespace-nowrap">
                            पता
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {complaintData.witness.map((item, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-blue-50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-100">
                              {idx + 1}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 font-medium border-r border-gray-100 whitespace-nowrap">
                              {item.witness_name || "-"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 whitespace-normal break-words leading-relaxed">
                              {item.witness_address || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-500 font-medium">
                      कोई गवाह डेटा उपलब्ध नहीं है।
                    </p>
                  </div>
                )}
              </div>
            )}


            <div className="mt-6 flex justify-end pt-4 border-t">
              <button
                onClick={() => setViewModalConfig({ open: false, type: null })}
                className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 rounded text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllComplaint;
