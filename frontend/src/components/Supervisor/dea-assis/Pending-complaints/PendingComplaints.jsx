"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaSearch,
  FaChevronDown,
  FaUser,
  FaUsers,
  FaTimes,
  FaSpinner,
  FaArrowRight,
  FaCheck
} from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

// Create axios instance with token if it exists
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

// Custom Searchable Select Component
const CustomSearchableSelect = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select option...",
  required = false,
  name = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = () => {
    if (!searchTerm.trim()) return options;
    
    return options.filter(option => 
      option.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      <select
        name={name}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="sr-only"
        tabIndex={-1}
      >
        <option value="">-- Select Option --</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 pl-10 pr-8 border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] bg-white text-left cursor-pointer flex items-center justify-between"
      >
        <span className="flex items-center">
          {selectedOption ? (
            <>
              {selectedOption.icon}
              <span className="ml-2">{selectedOption.displayName}</span>
            </>
          ) : (
            <>
              <FaUsers className="w-4 h-4 text-gray-400" />
              <span className="ml-2 text-gray-500">{placeholder}</span>
            </>
          )}
        </span>
        <FaChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
          <div className="p-2 border-b">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredOptions().length > 0 ? (
              <>
                {filteredOptions().some(option => option.type === 'lokayukt') && (
                  <>
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b flex items-center">
                      <span className="ml-2">Hon'ble LokAyukta</span>
                    </div>
                    
                    {filteredOptions()
                      .filter(option => option.type === 'lokayukt')
                      .map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => handleSelect(item.value)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center text-sm border-b border-gray-100 last:border-b-0"
                        >
                          {item.icon}
                          <span className="ml-2 font-medium text-gray-800">
                            {item.displayName}
                          </span>
                          {value === item.value && (
                            <FaCheck className="ml-auto w-4 h-4 text-blue-600" />
                          )}
                        </button>
                      ))}
                  </>
                )}

                {filteredOptions().some(option => option.type === 'uplokayukt') && (
                  <>
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b flex items-center">
                      <span className="ml-2">Hon'ble UpLokAyukta</span>
                    </div>
                    
                    {filteredOptions()
                      .filter(option => option.type === 'uplokayukt')
                      .map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => handleSelect(item.value)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center text-sm border-b border-gray-100 last:border-b-0"
                        >
                          {item.icon}
                          <span className="ml-2 font-medium text-gray-800">
                            {item.displayName}
                          </span>
                          {value === item.value && (
                            <FaCheck className="ml-auto w-4 h-4 text-blue-600" />
                          )}
                        </button>
                      ))}
                  </>
                )}
              </>
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                {searchTerm ? 'No options found' : 'No options available'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Forward Modal Component
const ForwardModal = ({ 
  isOpen, 
  onClose, 
  complaintId,
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    forwardTo: '',
    remarks: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  useEffect(() => {
    const fetchForwardingOptions = async () => {
      if (!isOpen) return;
      
      setIsLoadingOptions(true);
      try {
        const [lokayuktResponse, upLokayuktResponse] = await Promise.all([
          api.get("/supervisor/get-lokayukt"),
          api.get("/supervisor/get-uplokayukt")
        ]);
        
        const options = [];
        
        if (lokayuktResponse.data && Array.isArray(lokayuktResponse.data)) {
          lokayuktResponse.data.forEach(user => {
            options.push({
              value: user.id.toString(),
              displayName: user.name,
              // icon: <FaUser className="w-4 h-4 text-blue-500" />,
              type: 'lokayukt'
            });
          });
        }
        
        if (upLokayuktResponse.data && Array.isArray(upLokayuktResponse.data)) {
          upLokayuktResponse.data.forEach(user => {
            options.push({
              value: user.id.toString(),
              displayName: user.name,
              // icon: <FaUser className="w-4 h-4 text-blue-500" />,
              type: 'uplokayukt'
            });
          });
        }
        
        setDropdownOptions(options);
        
        if (options.length === 0) {
          toast.warning("No LokAyukta/UpLokAyukta found");
        }
        
      } catch (error) {
        console.error("Error fetching forwarding options:", error);
        setDropdownOptions([]);
        toast.error("Failed to load forwarding options. Please try again.");
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchForwardingOptions();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        forwardTo: '',
        remarks: ''
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.forwardTo) {
      toast.error("Please select a user to forward to");
      return;
    }

    if (!formData.remarks.trim()) {
      toast.error("Please enter remarks");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await api.post(`/supervisor/forward-by-da/${complaintId}`, {
        forward_to: parseInt(formData.forwardTo),
        remark: formData.remarks
      });

      if (response.data.success || response.data.status === true || response.status === 200) {
        toast.success(response.data.message || 'Complaint forwarded successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        
        onSubmit(complaintId);
        onClose();
      } else {
        toast.error(response.data.message || 'Error forwarding complaint');
      }
    } catch (error) {
      console.error("Forward error:", error);
      
      if (error.response?.status === 404) {
        toast.error("API endpoint not found.");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to forward this complaint.");
      } else if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors) {
          Object.keys(errors).forEach(key => {
            toast.error(errors[key][0]);
          });
        } else {
          toast.error("Validation failed.");
        }
      } else {
        toast.error('Error forwarding complaint. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Forward Complaint</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Forward To / भेजें *
              </label>
              
              {isLoadingOptions ? (
                <div className="w-full p-2 border rounded-md bg-gray-50 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Loading ...</span>
                </div>
              ) : (
                <CustomSearchableSelect
                  name="forward_to"
                  value={formData.forwardTo}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, forwardTo: value }))
                  }}
                  options={dropdownOptions}
                  placeholder="Select LokAyukta/UpLokAyukta"
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks / टिप्पणी *
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463]"
                placeholder="Enter forwarding remarks..."
                rows="4"
                required
              />
            </div>
          </div>

          <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.forwardTo || !formData.remarks.trim() || isLoadingOptions}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                isSubmitting || !formData.forwardTo || !formData.remarks.trim() || isLoadingOptions
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#123463] text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  Forwarding...
                </>
              ) : (
                <>
                  <FaArrowRight className="w-4 h-4" />
                  Forward
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PendingComplaints = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState("pending");
  const [complaintsData, setComplaintsData] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  // Handle tab change with routing
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    switch(tab) {
      case 'all':
        navigate('/supervisor/all-complaints');
        break;
      case 'pending':
        navigate('/supervisor/pending-complaints');
        break;
      case 'approved':
        navigate('/supervisor/approved-complaints');
        break;
      default:
        navigate('/supervisor/pending-complaints');
    }
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/supervisor/all-pending-complaints");
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
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleViewDetails = (e, complaintId) => {
    e.stopPropagation();
    navigate(`/supervisor/pending-complaints/view/${complaintId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleForward = (e, complaintId) => {
    e.stopPropagation();
    setSelectedComplaintId(complaintId);
    setIsForwardModalOpen(true);
  };

  // ✅ UPDATED: Remove forwarded complaint from list
  const handleForwardSubmit = (forwardedComplaintId) => {
    // Filter out the forwarded complaint from list
    setComplaintsData(prevComplaints => 
      prevComplaints.filter(complaint => complaint.id !== forwardedComplaintId)
    );
    
    console.log(`Complaint ${forwardedComplaintId} removed from pending list`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isComplaintForwarded = (complaint) => {
    return complaint.approved_rejected_by_d_a === 1;
  };

  const getApprovalStatuses = (complaint) => {
    const statuses = [];

    if (complaint.approved_rejected_by_ro === 1) {
      statuses.push({
        status: 'approved_by_ro', 
        label: 'Approved by RO',
        color: 'bg-green-500'
      });
    }
    
    if (complaint.approved_rejected_by_so_us === 1) {
      statuses.push({
        status: 'approved_by_so',
        label: 'Approved by SO',
        color: 'bg-green-500'
      });
    }
    
    if (complaint.approved_rejected_by_ds_js === 1) {
      statuses.push({
        status: 'approved_by_ds',
        label: 'Approved by DS',  
        color: 'bg-green-500'
      });
    }
    
    if (complaint.approved_rejected_by_d_a === 1) {
      statuses.push({
        status: 'approved_by_da',
        label: 'Approved by DA',
        color: 'bg-green-500'
      });
    }
    
    return statuses;
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
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Pending Complaints / लंबित शिकायतें
          </h1>
        </div>

        {/* TABS COMPONENT */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-4 sm:mb-6">
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
              <p className="text-gray-700 text-md font-semibold">Loading...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {complaintsData.map((complaint) => {
                const approvalStatuses = getApprovalStatuses(complaint);
                
                return (
                  <div
                    key={complaint.id}
                    className="w-full bg-white shadow-sm hover:shadow-lg rounded-xl border border-gray-200 transition duration-300 overflow-hidden"
                  >
                    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-gray-700 font-semibold text-sm">Complaint Details</span>
                      <div className="mt-2 sm:mt-0">
                        <span className="text-xs text-gray-600">Current Stage:</span>
                        <span
                          className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                            isComplaintForwarded(complaint)
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          }`}
                        >
                          {isComplaintForwarded(complaint) ? 'Forwarded (Completed)' : 'Pending Review'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
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

                        <div className="space-y-2">
                          <div className="flex gap-x-2">
                            <span className="text-gray-600 font-medium">Email:</span>
                            <span className="text-gray-900">{complaint.email}</span>
                          </div>
                          <div className="flex gap-x-2">
                            <span className="text-gray-600 font-medium">District:</span>
                            <span className="text-gray-900">{complaint.district_name}</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:items-end">
                          <span className="text-xs text-gray-600">Created:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(complaint.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {approvalStatuses.map((status, index) => (
                            <span
                              key={index}
                              className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium text-white ${status.color}`}
                            >
                              <FaCheck className="w-3 h-3 mr-1" />
                              {status.label}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={(e) => handleViewDetails(e, complaint.id)}
                            className="w-full sm:w-auto border border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-lg transition duration-200 text-sm font-medium"
                          >
                            View Details
                          </button>

                          {isComplaintForwarded(complaint) ? (
                            <span className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-green-500 text-white cursor-default">
                              ✓ Forwarded
                            </span>
                          ) : (
                            <button
                              onClick={(e) => handleForward(e, complaint.id)}
                              className="w-full sm:w-auto text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-lg transition duration-200 text-sm font-medium"
                            >
                              Forward
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {complaintsData.length === 0 && (
              <div className="flex flex-col items-center space-y-3 mt-10">
                <p className="text-gray-500 text-base font-medium">
                  No pending complaints found
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <ForwardModal
        isOpen={isForwardModalOpen}
        onClose={() => setIsForwardModalOpen(false)}
        complaintId={selectedComplaintId}
        onSubmit={handleForwardSubmit}
      />
    </>
  );
};

export default PendingComplaints;
