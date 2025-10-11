// pages/Complaints.js
import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaBuilding, 
  FaFileAlt, 
  FaSearch, 
  FaSave, 
  FaPaperPlane,
  FaRupeeSign,
  FaSpinner,
  FaUpload,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

// Create axios instance with token if it exists
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const Complaints = () => {
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
    department: '',     
    officer_name: '',
    designation: '',
    category: '',
    subject: '',        
    nature: '',
    description: ''
  });

  const [districts, setDistricts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ File upload progress states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Fetch all required data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch districts
        const districtsResponse = await api.get(`/lokayukt/all-district`);
        if (districtsResponse.data.status === 'success') {
          setDistricts(districtsResponse.data.data);
        }

        // Fetch departments
        const departmentsResponse = await api.get(`/lokayukt/department`);
        if (departmentsResponse.data.status === 'success') {
          setDepartments(departmentsResponse.data.data);
        }

        // Fetch designations
        const designationsResponse = await api.get(`/lokayukt/designation`);
        if (designationsResponse.data.status === 'success') {
          setDesignations(designationsResponse.data.data);
        }

        // Fetch subjects
        const subjectsResponse = await api.get(`/lokayukt/subjects`);
        if (subjectsResponse.data.status === 'success') {
          setSubjects(subjectsResponse.data.data);
        }

        // Fetch complaint types
        const complaintTypesResponse = await api.get(`/lokayukt/complainstype`);
        if (complaintTypesResponse.data.status === 'success') {
          setComplaintTypes(complaintTypesResponse.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchAllData();
  }, []);

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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // ✅ Enhanced file upload with progress
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
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

    // ✅ Alternative: Simulate upload progress (if no API endpoint yet)
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

  // ✅ Fixed submit handler with FormData for file upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // ✅ Create FormData for file upload
      const submitFormData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'file' && formData.file) {
          submitFormData.append('file', formData.file);
        } else if (formData[key] !== null && formData[key] !== '') {
          submitFormData.append(key, formData[key]);
        }
      });

      // ✅ Use FormData with multipart/form-data headers
      const response = await axios.post(
        `${BASE_URL}/lokayukt/complaints`,
        submitFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (response.data.status === true) {
        toast.success(response.data.message || 'Complaint registered successfully!');
        
        // ✅ Reset form after successful submission
        setFormData({
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
          department: '',     
          officer_name: '',
          designation: '',
          category: '',
          subject: '',        
          nature: '',
          description: ''
        });

        // Reset file upload states
        setUploadProgress(0);
        setIsUploading(false);
        setUploadSuccess(false);
        setUploadError('');
      }
    } catch (error) {
      if (error.response?.data?.status === false && error.response?.data?.errors) {
        // Handle validation errors
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach(field => {
          backendErrors[field] = error.response.data.errors[field][0]; // Take first error message
        });
        setErrors(backendErrors);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Complaint Entry</h1>
            <p className="text-xs sm:text-sm text-gray-600">शिकायत प्रविष्टि फॉर्म</p>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
            {/* <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-gray-50">
              <FaSearch className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Check Duplicates</span>
              <span className="xs:hidden">Check Duplicates</span>
            </button> */}
            {/* <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-gray-50">
              <FaSave className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Save Draft</span>
              <span className="xs:hidden">Save</span>
            </button> */}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Form Layout */}
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
                      // sirf letters aur spaces allow karo
                      if (/^[A-Za-z\s]*$/.test(value)) {
                        handleInputChange(e);
                      }
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name}
                    </p>
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
                      // Sirf digits allow + max 10 digits
                      if (/^[0-9]*$/.test(value) && value.length <= 10) {
                        handleInputChange(e);
                      }
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="10-digit mobile number"
                  />
                  {errors.mobile && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.mobile}
                    </p>
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    placeholder="Enter complete address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address}
                    </p>
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
                    className="w-full px-3 py-2 cursor-pointer text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">Select District</option>
                    {districts.map(district => (
                      <option key={district.id} value={district.district_code}>
                        {district.district_name}
                      </option>
                    ))}
                  </select>
                  {errors.district_id && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.district_id}
                    </p>
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email}
                    </p>
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

                {/* ✅ Title Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Title / शीर्षक *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter complaint title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* ✅ File Upload with Progress */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Choose File / फ़ाइल चुनें *
                  </label>
                  
                  {/* File Upload Area */}
                  {!formData.file ? (
                    <div className="flex items-center space-x-2">
                      <label className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                        <FaUpload className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="text-sm text-gray-700">Choose PDF file</span>
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
              {/* Department */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Department / विभाग *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 cursor-pointer text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="">Select Department</option>
                  {departments.map(department => (
                    <option key={department.id} value={department.id}>
                      {department.name} ({department.name_hindi})
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.department}
                  </p>
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter officer name"
                />
                {errors.officer_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.officer_name}
                  </p>
                )}
              </div>

              {/* Designation */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Designation / पदनाम *
                </label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full cursor-pointer px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="">Select Designation</option>
                  {designations.map(designation => (
                    <option key={designation.id} value={designation.id}>
                      {designation.name} ({designation.name_h})
                    </option>
                  ))}
                </select>
                {errors.designation && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.designation}
                  </p>
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
                  className="w-full cursor-pointer px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="">Select Category</option>
                  <option value="class_1">Class 1</option>
                  <option value="class_2">Class 2</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.category}
                  </p>
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
                {/* Subject Dropdown */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Subject / विषय *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full cursor-pointer px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} ({subject.name_h})
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Nature */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Nature / प्रकृति *
                  </label>
                  <select
                    name="nature"
                    value={formData.nature}
                    onChange={handleInputChange}
                    className="w-full cursor-pointer px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">Select Nature</option>
                    {complaintTypes.map(complaintType => (
                      <option key={complaintType.id} value={complaintType.id}>
                        {complaintType.name} ({complaintType.name_h})
                      </option>
                    ))}
                  </select>
                  {errors.nature && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.nature}
                    </p>
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  placeholder="Enter detailed complaint description..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <div className="flex justify-end">
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
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="w-4 h-4" />
                    Submit Complaint
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

export default Complaints;
