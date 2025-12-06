import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaUser, FaBuilding, FaFileAlt, FaArrowLeft, FaPaperPlane, FaRupeeSign, FaSpinner,
  FaUpload, FaCheck, FaTimes, FaPlus, FaTrash, FaEye, FaDownload
} from 'react-icons/fa';
import { IoMdArrowBack } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

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

const EditPendingComplaints = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    district_id: '',
    email: '',
    fee_exempted: false,
    amount: '',
    challan_no: '',
    dob: '',
  });

  const [originalFormData, setOriginalFormData] = useState({
    fee_exempted: false,
    amount: '',
    challan_no: '',
    dob: '',
  });

  const [complaintDetails, setComplaintDetails] = useState([{
    id: null,
    title: '',
    file: null,
    department: '',
    officer_name: '',
    designation: '',
    category: '',
    subject: '',
    nature: '',
    description: '',
    existingFile: null,
    uploadProgress: 0,
    isUploading: false,
    uploadSuccess: false,
    uploadError: ''
  }]);

  const [filePreviewData, setFilePreviewData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPreviewFile, setCurrentPreviewFile] = useState(null);

  const [districts, setDistricts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [complaintTypes, setComplaintTypes] = useState([]);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to get error for specific field and index
  const getFieldError = (fieldName, index = null) => {
    if (index !== null) {
      const arrayKey = `${fieldName}.${index}`;
      if (errors[arrayKey] && Array.isArray(errors[arrayKey])) {
        return errors[arrayKey][0];
      }
      if (typeof errors[arrayKey] === 'string') {
        return errors[arrayKey];
      }
    }
    
    if (errors[fieldName] && Array.isArray(errors[fieldName])) {
      return errors[fieldName][0];
    }
    if (typeof errors[fieldName] === 'string') {
      return errors[fieldName];
    }
    
    return null;
  };

  // ENHANCED Officer Name Parsing Function
  const parseOfficerName = (officerName) => {
    if (!officerName) return '';
    
    try {
      let parsed = officerName;
      
      // Remove outer quotes if present
      if (parsed.startsWith('"') && parsed.endsWith('"')) {
        parsed = parsed.slice(1, -1);
      }
      
      // Multiple attempts to parse JSON if it looks like stringified JSON
      let attempts = 0;
      while (attempts < 5 && (parsed.includes('[') || parsed.includes('"'))) {
        try {
          const temp = JSON.parse(parsed);
          if (Array.isArray(temp)) {
            // If it's an array, recursively parse each element
            parsed = temp.map(item => parseOfficerName(item)).join(', ');
            break;
          } else if (typeof temp === 'string') {
            parsed = temp;
          } else {
            break;
          }
        } catch {
          break;
        }
        attempts++;
      }
      
      // Clean up remaining escape characters and brackets
      parsed = parsed
        .replace(/\\"/g, '"')  // Remove escaped quotes
        .replace(/\\\\/g, '\\') // Remove double backslashes
        .replace(/^\[|\]$/g, '') // Remove outer brackets
        .replace(/^"(.+)"$/g, '$1') // Remove outer quotes
        .trim();
        
      return parsed;
      
    } catch (error) {
      // Final fallback: aggressive cleaning
      return String(officerName)
        .replace(/[\[\]"\\]/g, '') // Remove all brackets, quotes, backslashes
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
    }
  };

  // FIXED Download function
  const handleFileDownload = async (filePath) => {
    if (!filePath) {
      toast.error("File path not found!");
      return;
    }
    
    try {
      const fileUrl = `${APP_URL}${filePath}`;
      const response = await fetch(fileUrl, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        }
      });
      
      const blob = await response.blob();
      const filename = filePath.split('/').pop() || 'downloaded_file';
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`File "${filename}" downloaded successfully!`);
      
    } catch (error) {
      console.error('Download error:', error);
      const fileUrl = `${APP_URL}${filePath}`;
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = filePath.split('/').pop();
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        navigate("/operator/pending-complaints");
        return;
      }

      try {
        setIsLoading(true);

        const [
          complaintResponse,
          districtsResponse,
          departmentsResponse,
          designationsResponse,
          subjectsResponse,
          complaintTypesResponse
        ] = await Promise.all([
          api.get(`/operator/edit-complaint/${id}`),
          api.get(`/operator/all-district`),
          api.get(`/operator/department`),
          api.get(`/operator/designation`),
          api.get(`/operator/subjects`),
          api.get(`/operator/complainstype`)
        ]);

        // Set dropdown data
        if (districtsResponse.data.status === 'success') {
          setDistricts(districtsResponse.data.data);
        }
        if (departmentsResponse.data.status === 'success') {
          setDepartments(departmentsResponse.data.data);
        }
        if (designationsResponse.data.status === 'success') {
          setDesignations(designationsResponse.data.data);
        }
        if (subjectsResponse.data.status === 'success') {
          setSubjects(subjectsResponse.data.data);
        }
        if (complaintTypesResponse.data.status === 'success') {
          setComplaintTypes(complaintTypesResponse.data.data);
        }

        // Set complaint data with FIXED officer_name parsing
        if (complaintResponse.data.status === true) {
          const data = complaintResponse.data.data;
          
          const feeExemptedFromDB = data.fee_exempted === 1;
          const hasSecurityFeeData = data.amount || data.challan_no || data.dob;
          const finalFeeExempted = hasSecurityFeeData ? false : feeExemptedFromDB;
          
          const formDataFromDB = {
            name: data.name || '',
            mobile: data.mobile || '',
            address: data.address || '',
            district_id: data.district_id || '',
            email: data.email || '',
            fee_exempted: finalFeeExempted,
            amount: data.amount || '',
            challan_no: data.challan_no || '',
            dob: data.dob || '',
          };
          
          setFormData(formDataFromDB);
          setOriginalFormData({
            fee_exempted: finalFeeExempted,
            amount: data.amount || '',
            challan_no: data.challan_no || '',
            dob: data.dob || '',
          });

          // Set complaint details with FIXED officer_name parsing
          if (data.details && data.details.length > 0) {
            const detailsArray = data.details.map((detail) => ({
              id: detail.id,
              title: detail.title || '',
              file: null,
              department: detail.department_id || '',
              officer_name: parseOfficerName(detail.officer_name), // FIXED: Parse complex officer_name
              designation: detail.designation_id || '',
              category: detail.category || '',
              subject: detail.subject_id || '',
              nature: detail.complaintype_id || '',
              description: detail.description || '',
              existingFile: detail.file || null,
              uploadProgress: 0,
              isUploading: false,
              uploadSuccess: false,
              uploadError: ''
            }));
            
            setComplaintDetails(detailsArray);
          }

          // File preview data
          try {
            const fileResponse = await api.get(`/operator/get-file-preview/${id}`);
            if (fileResponse.data.status === true) {
              setFilePreviewData(fileResponse.data.data || []);
            }
          } catch (fileErr) {
            setFilePreviewData([]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error("Failed to load complaint data!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle detail changes
  const handleDetailChange = (index, field, value) => {
    setComplaintDetails(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });

    const arrayErrorKey = `${field}.${index}`;
    if (errors[arrayErrorKey]) {
      setErrors(prev => ({
        ...prev,
        [arrayErrorKey]: null
      }));
    }
  };

  // Handle file changes
  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setComplaintDetails(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        file: file,
        uploadProgress: 0,
        isUploading: true,
        uploadSuccess: false,
        uploadError: ''
      };
      return updated;
    });

    // Simulate upload progress
    const simulateUpload = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          setComplaintDetails(prev => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              uploadProgress: 100,
              isUploading: false,
              uploadSuccess: true
            };
            return updated;
          });
          clearInterval(interval);
        } else {
          setComplaintDetails(prev => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              uploadProgress: Math.round(progress)
            };
            return updated;
          });
        }
      }, 200);
    };

    simulateUpload();
  };

  const handleRemoveFile = (index) => {
    setComplaintDetails(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        file: null,
        uploadProgress: 0,
        isUploading: false,
        uploadSuccess: false,
        uploadError: ''
      };
      return updated;
    });
  };

  // Enhanced submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('mobile', formData.mobile);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('district_id', formData.district_id);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('fee_exempted', formData.fee_exempted ? '1' : '0');
      formDataToSend.append('amount', formData.amount || '');
      formDataToSend.append('challan_no', formData.challan_no || '');
      formDataToSend.append('dob', formData.dob || '');
      
      // Add complaint_details_id array
      complaintDetails.forEach((detail, index) => {
        if (detail.id) {
          formDataToSend.append(`complaint_details_id[${index}]`, detail.id);
        }
      });

      // Add all fields as arrays - FIXED: Send officer_name as simple string
      complaintDetails.forEach((detail, index) => {
        formDataToSend.append(`title[${index}]`, detail.title || '');
        formDataToSend.append(`department[${index}]`, detail.department || '');
        formDataToSend.append(`officer_name[${index}]`, detail.officer_name || ''); 
        formDataToSend.append(`designation[${index}]`, detail.designation || '');
        formDataToSend.append(`category[${index}]`, detail.category || '');
        formDataToSend.append(`subject[${index}]`, detail.subject || '');
        formDataToSend.append(`nature[${index}]`, detail.nature || '');
        formDataToSend.append(`description[${index}]`, detail.description || '');
      });
      
      // Add files
      complaintDetails.forEach((detail, index) => {
        if (detail.file) {
          formDataToSend.append(`files[${index}]`, detail.file);
        }
      });

      const response = await api.post(`/operator/update-complaint/${id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.status === true) {
        toast.success("Complaint updated successfully!");
        setTimeout(() => {
          navigate(`/operator/all-complaints/view/${id}`);
        }, 1500);
      }
    } catch (error) {
      if (error.response?.data?.status === false && error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error("Failed to update complaint. Please try again.");
      }
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center text-lg font-medium text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
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

      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Complaint</h1>
            <p className="text-xs sm:text-sm text-gray-600">शिकायत संपादन फॉर्म</p>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
            <button 
              onClick={() => navigate(`/operator/pending-complaints/view/${id}`)}
              style={{ backgroundColor: 'hsl(220, 70%, 25%)' }}
              className="flex items-center justify-center gap-2 px-4 py-2 text-white rounded transition"
            >
              <IoMdArrowBack className="text-lg" />
              <span>Back</span>
            </button>
            
            <button
              type="submit"
              form="complaint-edit-form"
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                isSubmitting
                  ? 'opacity-50 cursor-not-allowed bg-gray-400 text-white'
                  : 'text-white hover:opacity-90'
              }`}
              style={{ backgroundColor: 'hsl(220, 70%, 25%)' }}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane className="w-4 h-4" />
                  <span>Update Review</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <form id="complaint-edit-form" onSubmit={handleSubmit}>
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
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => {
                        const filteredValue = e.target.value.replace(/[^a-zA-Z\u0900-\u097F\s]/g, "");
                        handleInputChange({
                          target: { name: e.target.name, value: filteredValue },
                        });
                      }}
                      onKeyDown={(e) => {
                        if (/[^a-zA-Z\u0900-\u097F\s]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      className={`w-full px-3 py-2.5 text-sm border rounded-md  focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none transition-colors ${
                        getFieldError('name') ? '' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="Enter Full Name"
                    />
                    {getFieldError('name') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile / मोबाइल *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={(e) => {
                        const filteredValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                        handleInputChange({
                          target: { name: e.target.name, value: filteredValue },
                        });
                      }}
                      onKeyDown={(e) => {
                        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                        if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                          e.preventDefault();
                        }
                        if (/[0-9]/.test(e.key) && formData.mobile.length >= 10) {
                          e.preventDefault();
                        }
                      }}
                      className={`w-full px-3 py-2.5 text-sm border rounded-md  focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none transition-colors ${
                        getFieldError('mobile') ? '' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="10-Digit Mobile Number"
                    />
                    {getFieldError('mobile') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('mobile')}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address / पता *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2.5 text-sm border rounded-md  focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none resize-none transition-colors ${
                      getFieldError('address') ? ' ' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Enter Complete Address"
                  />
                  {getFieldError('address') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('address')}</p>
                  )}
                </div>

                {/* District and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District / जिला *
                    </label>
                    <select
                      name="district_id"
                      value={formData.district_id}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2.5 cursor-pointer text-sm border rounded-md  focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none bg-white appearance-none transition-colors ${
                        getFieldError('district_id') ? ' ' : 'border-gray-300'
                      }`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      <option value="">Select District</option>
                      {districts.map(district => (
                        <option key={district.id} value={district.district_code}>
                          {district.district_name}
                        </option>
                      ))}
                    </select>
                    {getFieldError('district_id') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('district_id')}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={(e) => {
                        const filteredValue = e.target.value.replace(/[^a-zA-Z@._-]/g, "");
                        handleInputChange({
                          target: { name: e.target.name, value: filteredValue },
                        });
                      }}
                      onKeyDown={(e) => {
                        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                        if (!/[a-zA-Z@._-]/.test(e.key) && !allowedKeys.includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      className={`w-full px-3 py-2.5 text-sm border rounded-md  focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none transition-colors ${
                        getFieldError('email') ? '' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="Enter Email"
                    />
                    {getFieldError('email') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
                    )}
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
                {/* Fee Exempted Checkbox */}
                <div>
                  <div className="flex items-center rounded-md space-x-2">
                    <input
                      id="exempted"
                      name="fee_exempted"
                      type="checkbox"
                      checked={formData.fee_exempted}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setFormData(prev => ({
                          ...prev,
                          fee_exempted: isChecked,
                          ...(isChecked && {
                            amount: '',
                            challan_no: '',
                            dob: ''
                          })
                        }));
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="exempted" className="text-xs sm:text-sm font-medium text-gray-700">
                      Fee Exempted / शुल्क माफ
                    </label>
                  </div>
                  {getFieldError('fee_exempted') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('fee_exempted')}</p>
                  )}
                </div>

                {/* Show Amount, Challan No, Date only when fee is NOT exempted */}
                {!formData.fee_exempted && (
                  <>
                    {/* Amount */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Amount / राशि *
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none ${
                          getFieldError('amount') ? ' ' : 'border-gray-300'
                        }`}
                        placeholder="Enter Amount"
                      />
                      {getFieldError('amount') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('amount')}</p>
                      )}
                    </div>

                    {/* Challan No */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Challan No. / चालान नं. *
                      </label>
                      <input
                        type="text"
                        name="challan_no"
                        value={formData.challan_no}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none ${
                          getFieldError('challan_no') ? ' ' : 'border-gray-300'
                        }`}
                        placeholder="Enter Challan Number"
                      />
                      {getFieldError('challan_no') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('challan_no')}</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Date of Birth / जन्म तिथि *
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none ${
                          getFieldError('dob') ? ' ' : 'border-gray-300'
                        }`}
                      />
                      {getFieldError('dob') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('dob')}</p>
                      )}
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

            {complaintDetails.map((detail, index) => {
              const correspondingFile = filePreviewData[index] || null;

              return (
                <div key={index} className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
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
                    {/* Title and File Upload Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Title */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Title / शीर्षक *
                        </label>
                        <input
                          type="text"
                          value={detail.title}
                          onChange={(e) => {
                            const filteredValue = e.target.value.replace(/[^a-zA-Z\u0900-\u097F\s]/g, "");
                            handleDetailChange(index, 'title', filteredValue);
                          }}
                          className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none ${
                            getFieldError('title', index) ? '' : 'border-gray-300'
                          }`}
                          placeholder="Enter Complaint Title"
                        />
                        {getFieldError('title', index) && (
                          <p className="mt-1 text-sm text-red-600">{getFieldError('title', index)}</p>
                        )}
                      </div>

                      {/* File Upload */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Choose File / फ़ाइल चुनें
                        </label>
                        
                        {!detail.file ? (
                          <div className="flex items-center space-x-2">
                            <label className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                              <FaUpload className="w-4 h-4 mr-2 text-blue-600" />
                              <span className="text-sm text-gray-700">Choose File</span>
                              <input
                                type="file"
                                onChange={(e) => handleFileChange(index, e)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="border border-gray-300 rounded-md p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <FaFileAlt className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-gray-700">
                                  {detail.file.name}
                                </span>
                                {detail.uploadSuccess && (
                                  <FaCheck className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                disabled={detail.isUploading}
                              >
                                <FaTimes className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Progress Bar */}
                            {(detail.isUploading || detail.uploadProgress > 0) && (
                              <div className="mb-2">
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                  <span>Uploading...</span>
                                  <span>{detail.uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${detail.uploadProgress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            {detail.uploadSuccess && (
                              <p className="text-xs text-green-600 flex items-center">
                                <FaCheck className="w-3 h-3 mr-1" />
                                Upload completed successfully
                              </p>
                            )}

                            <p className="text-xs text-gray-500 mt-1">
                              Size: {(detail.file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <p className="mt-1 text-xs text-gray-500"></p>
                          {correspondingFile && (
                            <button
                              type="button"
                              onClick={() => handleFileDownload(correspondingFile)}
                              className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-600 mt-1 hover:bg-green-200 rounded text-xs transition-colors"
                            >
                              <FaDownload className="w-3 h-3" />
                              Download
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Department Details Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {/* Department */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Department / विभाग *
                        </label>
                        <select
                          value={detail.department}
                          onChange={(e) => handleDetailChange(index, 'department', e.target.value)}
                          className={`w-full px-3 py-2 cursor-pointer text-sm border rounded-md focus:ring-1 focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none bg-white ${
                            getFieldError('department', index) ? '' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Department</option>
                          {departments.map(department => (
                            <option key={department.id} value={department.id}>
                              {department.name} ({department.name_hindi})
                            </option>
                          ))}
                        </select>
                        {getFieldError('department', index) && (
                          <p className="mt-1 text-sm text-red-600">{getFieldError('department', index)}</p>
                        )}
                      </div>

                      {/* Officer Name - FIXED */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Officer Name / अधिकारी का नाम *
                        </label>
                        <input
                          type="text"
                          value={detail.officer_name}
                          onChange={(e) => {
                            const filteredValue = e.target.value.replace(/[^a-zA-Z\u0900-\u097F\s]/g, "");
                            handleDetailChange(index, 'officer_name', filteredValue);
                          }}
                          className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none ${
                            getFieldError('officer_name', index) ? '' : 'border-gray-300'
                          }`}
                          placeholder="Enter Officer Name"
                        />
                        {getFieldError('officer_name', index) && (
                          <p className="mt-1 text-sm text-red-600">{getFieldError('officer_name', index)}</p>
                        )}
                      </div>

                      {/* Designation */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Designation / पदनाम *
                        </label>
                        <select
                          value={detail.designation}
                          onChange={(e) => handleDetailChange(index, 'designation', e.target.value)}
                          className={`w-full cursor-pointer px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none bg-white ${
                            getFieldError('designation', index) ? '' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Designation</option>
                          {designations.map(designation => (
                            <option key={designation.id} value={designation.id}>
                              {designation.name} ({designation.name_h})
                            </option>
                          ))}
                        </select>
                        {getFieldError('designation', index) && (
                          <p className="mt-1 text-sm text-red-600">{getFieldError('designation', index)}</p>
                        )}
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Category / श्रेणी *
                        </label>
                        <select
                          value={detail.category}
                          onChange={(e) => handleDetailChange(index, 'category', e.target.value)}
                          className={`w-full cursor-pointer px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none bg-white ${
                            getFieldError('category', index) ? '' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Category</option>
                          <option value="class_1">Class 1</option>
                          <option value="class_2">Class 2</option>
                        </select>
                        {getFieldError('category', index) && (
                          <p className="mt-1 text-sm text-red-600">{getFieldError('category', index)}</p>
                        )}
                      </div>
                    </div>

                    {/* Subject and Nature Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      {/* Subject */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Subject / विषय *
                        </label>
                        <select
                          value={detail.subject}
                          onChange={(e) => handleDetailChange(index, 'subject', e.target.value)}
                          className={`w-full cursor-pointer px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none bg-white ${
                            getFieldError('subject', index) ? '' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Subject</option>
                          {subjects.map(subject => (
                            <option key={subject.id} value={subject.id}>
                              {subject.name} ({subject.name_h})
                            </option>
                          ))}
                        </select>
                        {getFieldError('subject', index) && (
                          <p className="mt-1 text-sm text-red-600">{getFieldError('subject', index)}</p>
                        )}
                      </div>

                      {/* Nature */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Nature / प्रकृति *
                        </label>
                        <select
                          value={detail.nature}
                          onChange={(e) => handleDetailChange(index, 'nature', e.target.value)}
                          className={`w-full cursor-pointer px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none bg-white ${
                            getFieldError('nature', index) ? '' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Nature</option>
                          {complaintTypes.map(complaintType => (
                            <option key={complaintType.id} value={complaintType.id}>
                              {complaintType.name} ({complaintType.name_h})
                            </option>
                          ))}
                        </select>
                        {getFieldError('nature', index) && (
                          <p className="mt-1 text-sm text-red-600">{getFieldError('nature', index)}</p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Detailed Description / विस्तृत विवरण *
                      </label>
                      <textarea
                        value={detail.description}
                        onChange={(e) => handleDetailChange(index, 'description', e.target.value)}
                        rows={4}
                        className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none resize-none ${
                          getFieldError('description', index) ? '' : 'border-gray-300'
                        }`}
                        placeholder="Enter Detailed Complaint Description..."
                      />
                      {getFieldError('description', index) && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('description', index)}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPendingComplaints;
