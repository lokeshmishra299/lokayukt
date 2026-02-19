import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaFileAlt,
  FaExclamationTriangle,
  FaTimes,
  FaEye,
  FaChevronDown,
} from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { toast, Toaster } from "react-hot-toast";
import { krutiToUnicode } from "../../../components/utils/krutiToUnicode";


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Notes from "./SubModule/Notes";
import Documents from "./SubModule/Documents";
import MovementHistory from "./SubModule/MovementHistory";
import Fees from "./SubModule/Fees";


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

  // const selectedOption = options.find((opt) => opt.id == value);
  const selectedOption = options?.find((opt) => opt && opt.id == value);

const getDisplayLabel = (option) => {
  if (!option) return "";

  const name =
    option.name ||
    option.user_name ||
    option.full_name ||
    `User ${option.id}`;

  const subRole =
    option.subrole_name ||      // ✅ get-users se
    option.subrole?.label ||    // backup
    option.role?.label ||       // backup
    "";

  return subRole ? `${name} (${subRole})` : name;
};



  const filteredOptions = options.filter((option) => {
    if (!option) return false;
    // const label = option.name || option.user_name || `User ${option.id}`;
    const label = getDisplayLabel(option);
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
  ? getDisplayLabel(selectedOption)
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
                 {getDisplayLabel(option)}
{option.district_name ? (
  <span className="text-gray-500 text-xs ml-1">
    ({option.district_name})
  </span>
) : null}
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

  const capitalizeFirstLetter = (text = "") => {
    if (!text) return "N/A";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("fee");
  const [showPreview, setShowPreview] = useState(false);
  const [currentPreviewFile, setCurrentPreviewFile] = useState(null);
  const [showMobileTabs, setShowMobileTabs] = useState(false);
  const [sent_through_rk, setThroughRC] = useState(false);
     const [showModal, setShowModal] = useState(false);
        const [Rejectedloading,setRejectedloading] = useState(false)
        const [showDisposePopup, setShowDisposePopup] = useState(false);
        const [remark, setRemark] = useState("");

        const [showReleaseModal, setShowReleaseModal] = useState(false);
const [releaseType, setReleaseType] = useState("");
const [targetDate, setTargetDate] = useState("");
     
   
      const handleReject = () => {
    console.log("Rejected!");
    setShowModal(false); // close modal after action
  };

  // Single config for Action modals (Receive, Forward, Pullback)
  const [confirmConfig, setConfirmConfig] = useState({
    open: false,
    type: null,
  });

  // Config for Data View Modal (Correspondence / Respondent)
  const [viewModalConfig, setViewModalConfig] = useState({
    open: false,
    type: null,
  });

  const [selectedForwardTo, setSelectedForwardTo] = useState("");
  const [forwardType, setForwardType] = useState("self");



  //  const transformComplaintData = (data) => {
  //     if (!data) return null;
  
  //     const decode = (text) => krutiToUnicode(text || "");
  
  //     return {
  //       ...data,
  //       // Main Fields
  //       complain_no: decode(data.complain_no),
  //       complaint_description: decode(data.complaint_description),
  //       delay_reason: decode(data.delay_reason),
        
  //       main_complainant_name: decode(data.main_complainant_name),
  //       main_complainant_father: decode(data.main_complainant_father),
  //       main_complainant_district: data.main_complainant_district,
        
  //       main_respondent_name: decode(data.main_respondent_name),
  //       main_respondent_designation: data.main_respondent_designation,
  //       main_respondant_district: data.main_respondant_district,
        
  //       relation_with_person: decode(data.relation_with_person),
  //       category: data.category, 
  
  //       // Complainants Array
  //       complainants: data.complainants?.map((comp) => ({
  //         ...comp,
  //         complainant_name: decode(comp.complainant_name),
  //         father_name: decode(comp.father_name),
  //         district_name: comp.district_name,
  //         occupation: decode(comp.occupation),
  //         is_public_servant: decode(comp.is_public_servant),
  //         permanent_place: decode(comp.permanent_place),
  //       })) || [],
  
  //       // Respondents Array
  //       respondant: data.respondant?.map((resp) => ({
  //         ...resp,
  //         respondent_name: decode(resp.respondent_name),
  //         designation: resp.designation,
  //         department_name: resp.department_name,
  //         district_name: resp.district_name,
  //         officer_category: resp.officer_category,
  //         current_address: decode(resp.current_address),
  //       })) || [],
  
  //       // Support Array
  //       support: data.support?.map((item) => ({
  //         ...item,
  //         support_name: decode(item.support_name),
  //         support_address: decode(item.support_address),
  //       })) || [],
  
  //       // Witness Array
  //       witness: data.witness?.map((item) => ({
  //         ...item,
  //         witness_name: decode(item.witness_name),
  //         witness_address: decode(item.witness_address),
  //       })) || [],
  //     };
  //   };

  const {
    data: complaintData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["complaint-details", id],
    queryFn: async () => {
      const res = await api.get(`/uplokayukt/view-complaint/${id}`);
      return res.data.data;
      // return transformComplaintData(res.data.data);

    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const isDisposed =
  complaintData?.status === "Final Disposal/Closed" ||
  complaintData?.status === "Disposed";


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

  const {
    data: forwardOptionsData,
    isLoading: isLoadingOptions,
    isFetching: isFetchingOptions,
    error: forwardOptionsError,
  } = useQuery({
    queryKey: ["lokayukt-options", forwardType], // <-- NOTE: forwardType added
    queryFn: async () => {
      try {
        // 1️Send To My Pool → API: /lokayukt/get-users
        if (forwardType === "self") {
          const res = await api.get("/uplokayukt/get-users");
          return res.data?.data || res.data || [];
        }

        // 2️Send To Other Pool → API: /lokayukt/get-lokayukt-uplokayukt
        const res = await api.get("/uplokayukt/get-uplokayukt");
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

   

  const releaseComplaintMutation = useMutation({
  mutationFn: async ({ forward_to }) => {
    const res = await api.post(
      `/uplokayukt/released-by-uplokayukt/${id}`,
      {
        forward_to, 
      }
    );
    return res.data;
  },
  onSuccess: (data) => {
    toast.success(data?.message || "Released successfully");
    queryClient.invalidateQueries({ queryKey: ["complaint-details", id] });
    setShowReleaseModal(false);
    setReleaseType("");
  },
  onError: (error) => {
    // toast.error(error?.response?.data?.message );
  },
});


   const {
        mutate: rejectComplaint,
        isPending,
      } = useMutation({
        mutationFn: async ({ complaintId }) => {
          const res = await api.post(
            `/uplokayukt/reject-complaint-by-uplokayukt/${complaintId}`
          );
          return res.data;
        },
        onSuccess: () => {
          toast.success("Rejected successfully");
          queryClient.invalidateQueries({
            queryKey: ["complaint-details", id],
          });
          setConfirmConfig({ open: false, type: null });
          setShowModal(false);
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message || "Failed to Reject"
          );
        },
      });
  


  // --- PULL BACK API (UpLokayukt) ---
  const pullBackMutation = useMutation({
    mutationFn: async ({ complaintId }) => {
      return api.post(`/uplokayukt/pull-back-by-uplokayukt/${complaintId}`);
    },
    onSuccess: (res) => {
      toast.success("Complaint pulled back successfully");
      queryClient.invalidateQueries({ queryKey: ["complaint-details", id] });
      setConfirmConfig({ open: false, type: null });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Pull back failed");
    },
  });


  // ===== DISPOSE API =====
const disposeMutation = useMutation({
  mutationFn: async ({ complaintId, remark }) => {
    const res = await api.post(`/uplokayukt/dispose-complain/${id}`, {
      complaint_id: complaintId,
      remark: remark, 
    });
    return res.data;
  },
  onSuccess: (data) => {
    toast.success(data?.message || "Disposed successfully");
    queryClient.invalidateQueries({
      queryKey: ["complaint-details", id],
    });
  },
  onError: (error) => {
    toast.error(
      error?.response?.data?.message || "Failed to Dispose"
    );
  },
});


  const markAsReceivedMutation = useMutation({
    mutationFn: async ({ complaintId, remarkData }) => {
      const res = await api.post(
        `/uplokayukt/return-complain-by-uplokayukt/${id}`,
        {
          complaint_id: complaintId,
          remark: remarkData,
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Marked as received successfully");
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

 const openReleasePopup = () => {
  setShowReleaseModal(true);
};

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
      const res = await api.post(
        `/uplokayukt/forward-by-uplokayukt/${complaintId}`,
        {
          forward_to: forwardTo,
          // remark: remarkData,
             target_date: targetDate,
          sent_through_rk: sent_through_rk ? 1 : 0,
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Forwarded successfully");
      queryClient.invalidateQueries({ queryKey: ["complaint-details", id] });
      setRemark("");
        setTargetDate("");
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

  const handleDispose = () => {
  // disposeMutation.mutate({ complaintId: id });
};

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
  if (!selectedForwardTo) {
    toast.error("Please select officer");
    return;
  }
  if (!targetDate) {
    toast.error("Please select target date");
    return;
  }

  forwardComplaintMutation.mutate({
    complaintId: id,
    forwardTo: selectedForwardTo,
    targetDate: targetDate,
  });
    }

     else if (confirmConfig.type === "pullback") {
    pullBackMutation.mutate({
      complaintId: id,
    });
  }
  };

  const handleConfirmNo = () => {
    setConfirmConfig({ open: false, type: null });
    setRemark("");
    setSelectedForwardTo("");
      setTargetDate("");
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
      <Toaster position="top-right"  />
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
                    {complaintData.approved_rejected_by_lokayukt === 1
                      ? "In Motion – With UpLokayukta"
                      : "In Motion - With Lokayukta"}
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
                      {complaintData.approved_rejected_by_lokayukt === 1
                        ? "In Motion – With UpLokayukta"
                        : "In Motion - With Lokayukta"}
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

              {/* ===== DESCRIPTION (Hindi) ===== */}

              <p className="text-[14px] text-black font-semibold my-2">
                {/* Description:{" "} */}
                विवरण:{" "}
                <span className=" text-gray-500">
                <span className="kruti-input">  {complaintData.complaint_description ||
                    "No detailed description available for this complaint."}</span>
                
                </span>
              </p>

              {/* <p className="text-[14px] text-black font-semibold uppercase mb-1">
              
                विलंब का कारण:{"  "}

                <span className="text-gray-500">
                  {complaintData.delay_reason ||
                    "NA"}
                </span>

              </p> */}

              {/* ===== DETAILS GRID (Hindi) ===== */}
              <div className="space-y-3 mb-6">
                {/* ----------------- मुख्य परिवादी का विवरण ----------------- */}
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
                      <p className="text-gray-800 kruti-input text-sm">
                        {
                          complaintData.main_complainant_name
                         || "N/A"}
                      </p>
                    </div>

                    {/* Father's Name */}
                    <div>
                      <p className="text-[14px] text-black font-semibold uppercase mb-1">
                        पिता का नाम
                      </p>
                      <p className="text-gray-800 kruti-input text-sm">
                        {
                          complaintData.main_complainant_father
                         || "N/A"}
                      </p>
                    </div>

                    {/* District */}
                    <div>
                      <p className="text-[14px] text-black font-semibold uppercase mb-1">
                        जिला
                      </p>
                      <p className="text-gray-800 text-sm">
                        {capitalizeFirstLetter(
                          complaintData.main_complainant_district
                        ) || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ----------------- मुख्य प्रतिवादी का विवरण ----------------- */}
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
                      <p className="text-gray-800 kruti-input text-sm">
                        {
                          complaintData.main_respondent_name
                         || "N/A"}
                      </p>
                    </div>

                    {/* Designation */}
                    <div>
                      <p className="text-[14px] text-black font-semibold uppercase mb-1">
                        पद
                      </p>
                      <p className="text-gray-800 text-sm">
                        {capitalizeFirstLetter(
                          complaintData.main_respondent_designation
                        ) || "N/A"}
                      </p>
                    </div>

                    {/* District */}
                    <div>
                      <p className="text-[14px] text-black font-semibold uppercase mb-1">
                        जिला
                      </p>
                      <p className="text-gray-800 text-sm">
                        {capitalizeFirstLetter(
                          complaintData.main_respondant_district
                        ) || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ----------------- अन्य विवरण ----------------- */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Relation */}
                    <div>
                      <p className="text-[14px] text-black font-semibold uppercase mb-1">
                        व्यक्ति से संबंध
                      </p>
                      <p className="text-gray-800 kruti-input text-sm">
                        {
                          complaintData.relation_with_person
                         || "NA"}
                      </p>
                    </div>

                    {/* Cause Date */}
                    {complaintData.dob && (
                      <div>
                        <p className="text-[14px] text-black font-semibold uppercase mb-1">
                          कार्यवाही तिथि
                        </p>
                        <p className="text-gray-800 text-sm">
                          {capitalizeFirstLetter(complaintData.cause_date) ||
                            "NA"}
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

              {/* Fee Status and Fee Type Section (Hindi) */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-3 py-1.5 rounded text-[14px] border ${
                    complaintData.fee_exempted === 1
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  शुल्क का प्रकार:{" "}
                   {complaintData.fee_exempted == 3 ? "Exempted" : complaintData.fee_exempted == 2 ? "Partial" : complaintData.fee_exempted == 1 ? "Paid" : "Pending"}
                </span>

                <span
                  className={`px-3 py-1.5 rounded text-xs border ${
                    complaintData.payment_status === "Success" ||
                    complaintData.payment_status === "Verified"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}
                >
                  स्थिति:{" "}
                  {complaintData.fee_approved_by_lokayukt === 1 ? "Approved" : "Awaiting approval"}
                </span>

                {complaintData.challan_no && (
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200">
                    Challan: {complaintData.challan_no}
                  </span>
                )}
              </div>

              {/* ===== NEW SECTION: Extra Details Tabs/Buttons (Hindi) ===== */}
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
                  <FaEye /> साक्षियों का विवरण
                </button>
              </div>
            </div>

            {/* Mobile Tab Navigation */}
            <div className="md:hidden border-b bg-white">
              <div className="flex flex-col">
                {["fee", "documents", "notings", "movement"].map((tab) => (
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
                    {tab === "fee" && "Fee Verification"}

                    {tab === "documents" && "Documents"}
                    {tab === "notings" && "Notes / Notings"}
                    {tab === "movement" && "Movement History"}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Tab Navigation */}
            <div className="hidden md:flex border-b px-6">
              <div className="flex gap-6 overflow-x-auto">
                {["fee", "documents", "notings", "movement"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 pt-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                      activeTab === tab
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {tab === "fee" && "Fee Verification"}
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

            {/* Tab Content Area */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
              {activeTab === "fee" && <Fees complaint={complaintData} />}

              {activeTab === "documents" && (
                <Documents complaint={complaintData} />
              )}
              {activeTab === "notings" && <Notes complaint={complaintData} />}
              {activeTab === "movement" && (
                <MovementHistory complaint={complaintData} />
              )}
            </div>

            {/* Footer Buttons */}
            <div className="border-t p-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setConfirmConfig({ open: true, type: "pullback" });
                    }}
                    className="px-4 py-2 border  border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
                  >
                    Pull Back
                  </button>

                         <button
        className="px-4 py-2 bg-red-600 border border-red-600 text-white rounded hover:bg-red-700 text-sm"
        onClick={() => setShowModal(true)}
      >
        Reject
      </button>

      {/* <button
  onClick={() => setShowReleaseModal(true)}
  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
>
  Release
</button> */}

{(complaintData?.assign_to_ps != null ||
  complaintData?.assign_to_ro_aro != null) && (
  <button
    onClick={openReleasePopup}
    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
  >
    Release
  </button>
)}

<button
  onClick={() => setShowDisposePopup(true)}
  disabled={disposeMutation.isPending || isDisposed}
  className={`px-4 py-2 border rounded text-sm
    ${
      isDisposed
        ? "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-100"
        : "border-gray-300 text-gray-700 hover:bg-gray-50"
    }
  `}
>
  {disposeMutation.isPending
    ? "Processing..."
    : isDisposed
      ? "Disposed"
      : "Dispose"}
</button>




                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleMarkAsReceived}
                    disabled={markAsReceivedMutation.isPending}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {markAsReceivedMutation.isPending
                      ? "Processing..."
                      : "Return with Remarks"}
                  </button>

                  {complaintData.approved_rejected_by_uplokayukt == "1" ? (
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
                        : "Sent / Mark"}
                    </button>
                  )}
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

      {showReleaseModal && (
  <div className="fixed inset-0 flex items-center justify-center pt-20 bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full animate-slideDown">
      <h2 className="text-lg font-semibold mb-4">
        Are you sure you want to Release?
      </h2>

      {/* PS */}
     {complaintData?.assign_to_ps != null && (
  <div className="flex items-center mb-4">
    <input
      type="radio"
      name="release"
      id="ps"
      checked={releaseType === "ps"}
      onChange={() => setReleaseType("ps")}
      className="mr-2 cursor-pointer"
    />
    <label htmlFor="ps" className="text-sm text-gray-700 cursor-pointer">
      PS
    </label>
  </div>
)}


      {/* RO / ARO */}
   {complaintData?.assign_to_ro_aro != null && (
  <div className="flex items-center mb-6">
    <input
      type="radio"
      name="release"
      id="roaro"
      checked={releaseType === "ro-aro"}
      onChange={() => setReleaseType("ro-aro")}
      className="mr-2 cursor-pointer"
    />
    <label htmlFor="roaro" className="text-sm text-gray-700 cursor-pointer">
      RO / ARO
    </label>
  </div>
)}


      {/* Buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setShowReleaseModal(false);
            setReleaseType("");
          }}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Back
        </button>

        <button
          onClick={() => {
            if (!releaseType) {
              toast.error("Please select release type");
              return;
            }

            releaseComplaintMutation.mutate({
              forward_to: releaseType,
            });
          }}
          disabled={releaseComplaintMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {releaseComplaintMutation.isPending ? "Processing..." : "Release"}
        </button>
      </div>
    </div>
  </div>
)}


          {showModal && (
  <div className="fixed inset-0 flex items-center justify-center  pt-20 bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full animate-slideDown">
      <h2 className="text-lg font-semibold mb-4">Confirm Rejection</h2>
      <p className="mb-4">Are you sure you want to reject this?</p>
      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
       <button
  onClick={() => rejectComplaint({ complaintId: id })}
  disabled={isPending}
  className={`px-4 py-2 rounded text-white
    ${isPending ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}
  `}
>
  {isPending ? "Rejecting..." : "Reject"}
</button>

      </div>
    </div>
  </div>
)}

      {/* Unified Confirmation Modal (Receive/Forward/Pullback) */}
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

            {/* --- FORWARDING LOGIC START --- */}
            {confirmConfig.type === "forward" && (
              <>
                {/* Radio Buttons Section */}
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
                        Send To My Pool
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

                {/* SEARCHABLE DROPDOWN */}
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

            {confirmConfig.type === "forward" && (
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={sent_through_rk}
                  onChange={(e) => setThroughRC(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Checkbox If Send through RC</span>
              </label>
            )}

            {/* --- FORWARDING LOGIC END --- */}

            {/* Remark Field - HIDDEN IF ASSIGN OR PULLBACK */}
            {/* {confirmConfig.type !== "assign" &&
              confirmConfig.type !== "pullback" && (
                <>
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
                </>
              )} */}


{/* RECEIVE → Remark */}
{confirmConfig.type === "receive" && (
  <div className="mb-5">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Remark <span className="text-red-500">*</span>
    </label>
    <textarea
      value={remark}
      placeholder="Enter your remark here…"
      onChange={(e) => setRemark(e.target.value)}
      rows={4}
      className="w-full px-3 py-2 border border-gray-300 rounded
                 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
    />
  </div>
)}

{/* SEND → Target Date */}
{confirmConfig.type === "forward" && (
  <div className="mb-5">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Target Date <span className="text-red-500">*</span>
    </label>
    <input
      type="date"
      min={new Date().toISOString().split("T")[0]}
      value={targetDate}
      onChange={(e) => setTargetDate(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
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
                  pullBackMutation.isPending || 
                  (confirmConfig.type === "receive" && !remark.trim()) ||
                  (confirmConfig.type === "forward" &&
                     (!selectedForwardTo ||
   !targetDate ||
   isLoadingOptions ||
   isFetchingOptions))
                }
                className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {markAsReceivedMutation.isPending ||
                forwardComplaintMutation.isPending ||
                pullBackMutation.isPending // ✅ Ye check add kiya
                  ? "Processing..."
                  : confirmConfig.type === "assign" ||
                    confirmConfig.type === "pullback"
                  ? "Yes"
                  : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== VIEW DATA MODAL (Correspondence / Respondent / Support / Witness) ===== */}
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
                ? "शिकायतकर्ता का विवरण"
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
                {/* यहाँ w-full और overflow handling */}
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
                          {/* Address को थोड़ा ज़्यादा जगह दी है */}
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
                            <td className="px-6 py-4 kruti-input whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                              {comp.complainant_name || "-"}
                            </td>
                            <td className="px-6 py-4 kruti-input whitespace-nowrap text-sm text-gray-700 border-r border-gray-200">
                              {comp.father_name || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200">
                              {comp.district_name || "-"}
                            </td>
                            <td className="px-6 py-4 kruti-input whitespace-nowrap text-sm text-gray-700 border-r border-gray-200">
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
                            <td className="px-6 py-4 kruti-input text-sm text-gray-700 break-words">
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
                            <td className="px-4 py-3 kruti-input text-sm text-gray-800 font-medium border-r border-gray-100 whitespace-nowrap">
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
                            {/* Address Column: whitespace-normal ensures text wrapping */}
                            <td className="px-4 py-3 kruti-input text-sm text-gray-600 whitespace-normal break-words leading-relaxed">
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

            {/* Support Content (Added to match buttons) */}
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
                            <td className="px-6 py-4  text-sm font-medium text-gray-900 border-r border-gray-100">
                              {idx + 1}
                            </td>
                            <td className="px-6 py-4 text-sm kruti-input text-gray-800 font-medium border-r border-gray-100 whitespace-nowrap">
                              {item.support_name || "-"}
                            </td>
                            <td className="px-6 py-4 kruti-input text-sm text-gray-600 whitespace-normal break-words leading-relaxed">
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

            {/* Witness Content (Added to match buttons) */}
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
                            <td className="px-6 py-4 kruti-input text-sm text-gray-800 font-medium border-r border-gray-100 whitespace-nowrap">
                              {item.witness_name || "-"}
                            </td>
                            <td className="px-6 py-4 kruti-input text-sm text-gray-600 whitespace-normal break-words leading-relaxed">
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


      {showDisposePopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-5 relative">
      
      {/* Close */}
      <button
        onClick={() => {
          setShowDisposePopup(false);
          setRemark("");
        }}
        className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full"
      >
        <FaTimes className="w-5 h-5 text-gray-600" />
      </button>

      <h3 className="text-lg font-semibold mb-4">
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
          placeholder="fuLrkj.k fVIi.kh ntZ djsa"
          className="w-full kruti-input px-3 py-2 border border-gray-300 rounded
                     focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setShowDisposePopup(false);
            setRemark("");
          }}
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

            // disposeMutation.mutate({ complaintId: id });
            disposeMutation.mutate({
  complaintId: id,
  remark: remark,
});
            setShowDisposePopup(false);
            setRemark("");
          }}
          disabled={disposeMutation.isPending}
          className="px-4 py-2 text-sm rounded bg-red-600 text-white
                     hover:bg-red-700 disabled:opacity-50"
        >
          {disposeMutation.isPending ? "Disposing..." : "Dispose Now"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ViewAllComplaint;
