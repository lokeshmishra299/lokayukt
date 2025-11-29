import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaBuilding, 
  FaFileAlt, 
  FaArrowLeft,
  FaPaperPlane,
  FaRupeeSign,
  FaSpinner,
  FaUpload,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { IoMdArrowBack } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

// Create axios instance with token if it exists
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const AllComplaintsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    district_id: '',
    email: '',
    fee_exempted: true,
    amount: '',
    challan_no: '',
    title: '',
    file: null,
    dob: '',
    // ✅ Fixed field names to match backend expectations
    department: '',        // Changed from department_id
    officer_name: '',
    designation: '',       // Changed from designation_id
    category: '',
    subject: '',          // Changed from subject_id
    nature: '',           // Changed from complaintype_id
    description: ''
  });

  // Dropdown data states
  const [districts, setDistricts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [complaintTypes, setComplaintTypes] = useState([]);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // File upload progress states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [existingFile, setExistingFile] = useState(null);

  // Fetch complaint data and dropdown data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        toast.error("No complaint ID provided");
        navigate("/supervisor/all-complaints");
        return;
      }

      try {
        setIsLoading(true);

        // Parallel API calls for better performance
        const [
          complaintResponse,
          districtsResponse,
          departmentsResponse,
          designationsResponse,
          subjectsResponse,
          complaintTypesResponse
        ] = await Promise.all([
          api.get(`/supervisor/edit-complaint/${id}`),
          api.get(`/supervisor/all-district`),
          api.get(`/supervisor/department`),
          api.get(`/supervisor/designation`),
          api.get(`/supervisor/subjects`),
          api.get(`/supervisor/complainstype`)
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

        // ✅ Pre-populate form with complaint data - Fixed mapping
        if (complaintResponse.data.status === true) {
          const data = complaintResponse.data.data;
          setFormData({
            name: data.name || '',
            mobile: data.mobile || '',
            address: data.address || '',
            district_id: data.district_id || '',
            email: data.email || '',
            fee_exempted: data.fee_exempted === 1,
            amount: data.amount || '',
            challan_no: data.challan_no || '',
            title: data.title || '',
            file: null,
            dob: data.dob || '',
            // ✅ Map backend IDs to frontend field names
            department: data.department_id || '',      // Map department_id to department
            officer_name: data.officer_name || '',
            designation: data.designation_id || '',    // Map designation_id to designation
            category: data.category || '',
            subject: data.subject_id || '',           // Map subject_id to subject
            nature: data.complaintype_id || '',       // Map complaintype_id to nature
            description: data.description || ''
          });
          
          // Store existing file info
          if (data.file) {
            setExistingFile(data.file);
          }
        } else {
          toast.error("Failed to load complaint data");
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error("Error loading complaint data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle radio button for fee_exempted
    if (name === 'fee_exempted') {
      setFormData(prev => ({
        ...prev,
        fee_exempted: value === 'true'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // ✅ Clear error when user starts typing - match backend field names
    const errorFieldMap = {
      'department': 'department',
      'designation': 'designation', 
      'subject': 'subject',
      'nature': 'nature'
    };
    
    const errorField = errorFieldMap[name] || name;
    if (errors[errorField]) {
      setErrors(prev => ({
        ...prev,
        [errorField]: ''
      }));
    }
  };

  // ✅ FIXED FILE UPLOAD HANDLER - This was the main bug!
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // ✅ FIXED: Added [0] to get first file from FileList
    
    if (!file) return;

    // Validate file type (only PDF allowed)
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should not exceed 5MB');
      return;
    }

    // Reset upload states
    setUploadProgress(0);
    setIsUploading(true);
    setUploadSuccess(false);
    setUploadError('');

    // ✅ Simulate upload progress (exactly same as Complaints.jsx)
    const simulateUpload = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15; // Random increment
        if (progress >= 100) {
          progress = 100;
          setUploadProgress(100);
          setIsUploading(false);
          setUploadSuccess(true);
          setFormData(prev => ({
            ...prev,
            file: file
          }));
          clearInterval(interval);
        } else {
          setUploadProgress(Math.round(progress));
        }
      }, 200);
    };

    simulateUpload(); // For simulation

    // Clear error when user selects file
    if (errors.file) {
      setErrors(prev => ({
        ...prev,
        file: ''
      }));
    }
  };

  // ✅ Remove uploaded file
  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null
    }));
    setUploadProgress(0);
    setIsUploading(false);
    setUploadSuccess(false);
    setUploadError('');
  };

  // ✅ Fixed submit handler with proper boolean conversion
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Create FormData for file upload
      const submitFormData = new FormData();
      
      // ✅ Add all form fields to FormData with proper conversion
      Object.keys(formData).forEach(key => {
        if (key === 'file' && formData.file) {
          submitFormData.append('file', formData.file);
        } else if (key === 'fee_exempted') {
          // ✅ Convert boolean to integer for database
          submitFormData.append(key, formData[key] ? '1' : '0');
        } else if (formData[key] !== null && formData[key] !== '') {
          submitFormData.append(key, formData[key]);
        }
      });

      // Debug: Log what we're sending
      console.log('FormData being sent:');
      for (let [key, value] of submitFormData.entries()) {
        console.log(key, ':', value, typeof value);
      }

      // Use FormData with multipart/form-data headers for update
      const response = await axios.post(
        `${BASE_URL}/supervisor/update-complaint/${id}`,
        submitFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (response.data.status === true) {
        toast.success(response.data.message || 'Complaint updated successfully!');
        
        // Navigate back to view page after successful update
        setTimeout(() => {
          navigate(`/supervisor/all-complaints/view/${id}`);
        }, 1500);
      }
    } catch (error) {
      if (error.response?.data?.status === false && error.response?.data?.errors) {
        // ✅ Fixed error handling
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach(field => {
          backendErrors[field] = error.response.data.errors[field][0]; // ✅ Take first error message
        });
        setErrors(backendErrors);
        
        // ✅ Show first error in toast - Fixed array access
        const firstError = Object.values(error.response.data.errors)[0][0];
        // toast.error(firstError);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
      console.error('Update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading statea
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

      {/* Header - Mobile responsive */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Complaint</h1>
            <p className="text-xs sm:text-sm text-gray-600">शिकायत संपादन फॉर्म</p>
          </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
  <button 
    onClick={() => navigate(`/supervisor/all-complaints/view/${id}`)}
    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
  >
    <IoMdArrowBack className="text-lg" />
    <span>Back</span>
  </button>
</div>

        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Form Layout - Same as Complaints.jsx */}
        <div className="space-y-4 sm:space-y-6">
          {/* Top Row: Complainant Details + Security Fee */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Complainant Details */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <FaUser className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Complainant Details</h2>
                  <p className="text-xs sm:text-sm text-gray-500">शिकायतकर्ता विवरण</p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Name / नाम *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[A-Za-z\s]*$/.test(value)) {
                        handleInputChange(e);
                      }
                    }}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Mobile / मोबाइल *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9]*$/.test(value) && value.length <= 10) {
                        handleInputChange(e);
                      }
                    }}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.mobile ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="10-digit mobile number"
                  />
                  {errors.mobile && (
                    <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Address / पता *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter complete address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    District / जिला *
                  </label>
                  <select
                    name="district_id"
                    value={formData.district_id}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 cursor-pointer text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${
                      errors.district_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select District</option>
                    {districts.map(district => (
                      <option key={district.id} value={district.district_code}>
                        {district.district_name}
                      </option>
                    ))}
                  </select>
                  {errors.district_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.district_id}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Fee */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <FaRupeeSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Security Fee</h2>
                  <p className="text-xs sm:text-sm text-gray-500">जमानत राशि</p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {/* Fee Exempted Radio */}
                <div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        id="exempted"
                        name="fee_exempted"
                        type="radio"
                        value="true"
                        checked={formData.fee_exempted === true}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="exempted" className="text-xs sm:text-sm font-medium text-gray-700">
                        Fee Exempted / शुल्क माफ
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        id="not_exempted"
                        name="fee_exempted"
                        type="radio"
                        value="false"
                        checked={formData.fee_exempted === false}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="not_exempted" className="text-xs sm:text-sm font-medium text-gray-700">
                        Fee Paid / शुल्क भुगतान
                      </label>
                    </div>
                  </div>
                  {errors.fee_exempted && (
                    <p className="mt-1 text-sm text-red-600">{errors.fee_exempted}</p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Amount / राशि
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                    placeholder="Enter amount"
                    disabled={formData.fee_exempted}
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                  )}
                </div>

                {/* Challan No */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Challan No. / चालान नं.
                  </label>
                  <input
                    type="text"
                    name="challan_no"
                    value={formData.challan_no}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                    placeholder="Enter challan number"
                    disabled={formData.fee_exempted}
                  />
                  {errors.challan_no && (
                    <p className="mt-1 text-sm text-red-600">{errors.challan_no}</p>
                  )}
                </div>

                {/* Date of Birth - show only if NOT exempted */}
                {!formData.fee_exempted && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Date of Birth / जन्म तिथि
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    {errors.dob && (
                      <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <FaFileAlt className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">Outside Correspondence</h2>
                    <p className="text-xs sm:text-sm text-gray-500">बाहरी पत्राचार</p>
                  </div>
                </div>

                {/* Title Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Title / शीर्षक *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter complaint title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* ✅ File Upload with Progress - NOW WORKING! */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Choose File / फ़ाइल चुनें
                  </label>
                  
                  {/* Show existing file info */}
                  {existingFile && !formData.file && (
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-xs text-blue-800">
                        Current file: {existingFile}
                      </p>
                    </div>
                  )}
                  
                  {/* File Upload Area */}
                  {!formData.file ? (
                    <div className="flex items-center space-x-2">
                      <label className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                        <FaUpload className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="text-sm text-gray-700">
                          {existingFile ? 'Replace PDF file' : 'Choose PDF file'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        /> 
                      </label>
                    </div>
                  ) : (
                    // File Selected Area
                    <div className="border border-gray-300 rounded-md p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <FaFileAlt className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-gray-700">
                            {formData.file.name}
                          </span>
                          {uploadSuccess && (
                            <FaCheck className="w-4 h-4 text-green-600" />
                          )}
                          {uploadError && (
                            <FaTimes className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          disabled={isUploading}
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </div>

                      {/* ✅ Progress Bar */}
                      {(isUploading || uploadProgress > 0) && (
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Upload Status */}
                      {uploadSuccess && (
                        <p className="text-xs text-green-600 flex items-center">
                          <FaCheck className="w-3 h-3 mr-1" />
                          Upload completed successfully
                        </p>
                      )}
                      
                      {uploadError && (
                        <p className="text-xs text-red-600 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {uploadError}
                        </p>
                      )}

                      {/* File Size */}
                      <p className="text-xs text-gray-500 mt-1">
                        Size: {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  )}

                  <p className="mt-1 text-xs text-gray-500">Only PDF files allowed (Max: 5MB)</p>
                  {errors.file && (
                    <p className="mt-1 text-sm text-red-600">{errors.file}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Respondent Department - Full Width */}
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Respondent Department</h2>
                <p className="text-xs sm:text-sm text-gray-500">प्रतिवादी विभाग</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/*  Department - Fixed field name */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Department / विभाग *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 cursor-pointer text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Department</option>
                  {departments.map(department => (
                    <option key={department.id} value={department.id}>
                      {department.name} ({department.name_hindi})
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                )}
              </div>

              {/* Officer Name */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Officer Name / अधिकारी का नाम *
                </label>
                <input
                  type="text"
                  name="officer_name"
                  value={formData.officer_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.officer_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter officer name"
                />
                {errors.officer_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.officer_name}</p>
                )}
              </div>

              {/* ✅ Designation - Fixed field name */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Designation / पदनाम *
                </label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className={`w-full cursor-pointer px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${
                    errors.designation ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Designation</option>
                  {designations.map(designation => (
                    <option key={designation.id} value={designation.id}>
                      {designation.name} ({designation.name_h})
                    </option>
                  ))}
                </select>
                {errors.designation && (
                  <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Category / श्रेणी *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full cursor-pointer px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Category</option>
                  <option value="class_1">Class 1</option>
                  <option value="class_2">Class 2</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>
            </div>
          </div>

          {/* Complaint Details - Full Width */}
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <FaFileAlt className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Complaint Details</h2>
                <p className="text-xs sm:text-sm text-gray-500">शिकायत विवरण</p>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/*  Subject - Fixed field name */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Subject / विषय *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full cursor-pointer px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${
                      errors.subject ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} ({subject.name_h})
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                  )}
                </div>

                {/* ✅ Nature - Fixed field name */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Nature / प्रकृति *
                  </label>
                  <select
                    name="nature"
                    value={formData.nature}
                    onChange={handleInputChange}
                    className={`w-full cursor-pointer px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${
                      errors.nature ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Nature</option>
                    {complaintTypes.map(complaintType => (
                      <option key={complaintType.id} value={complaintType.id}>
                        {complaintType.name} ({complaintType.name_h})
                      </option>
                    ))}
                  </select>
                  {errors.nature && (
                    <p className="mt-1 text-sm text-red-600">{errors.nature}</p>
                  )}
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Detailed Description / विस्तृत विवरण *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter detailed complaint description..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <div className="flex justify-end space-x-3">
             
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="w-4 h-4" />
                    Update Complaint
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AllComplaintsEdit;
