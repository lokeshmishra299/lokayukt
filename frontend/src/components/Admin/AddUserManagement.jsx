// pages/AddUserManagement.js
import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaUserTag, 
  FaBuilding,
  FaLock,
  FaPaperPlane,
  FaSpinner,
  FaUsers
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
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const AddUserManagement = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    role_id: '',
    sub_role_id: '',
    designation: '',
    department_id: '',
    district_id: '', 
    password: '',
    password_confirmation: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for all API data
  const [districts, setDistricts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(true);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  const [isLoadingDesignations, setIsLoadingDesignations] = useState(true);

  // Roles and Sub-roles
  const [roles, setRoles] = useState([]);
  const [subRoles, setSubRoles] = useState([]);
  const [isLoadingSubRoles, setIsLoadingSubRoles] = useState(false);

  // Fetch all data from APIs on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch districts
        const districtsResponse = await api.get(`/admin/all-district`);
        if (districtsResponse.data.status === 'success') {
          setDistricts(districtsResponse.data.data);
        } else {
          console.warn('Unexpected districts API response:', districtsResponse.data);
          toast.error('Failed to load districts - Invalid response format');
        }

        // Fetch departments
        const departmentsResponse = await api.get(`/admin/department`);
        if (departmentsResponse.data.status === 'success') {
          setDepartments(departmentsResponse.data.data);
        } else {
          console.warn('Unexpected departments API response:', departmentsResponse.data);
        }

        // Fetch designations
        const designationsResponse = await api.get(`/admin/designation`);
        if (designationsResponse.data.status === 'success') {
          setDesignations(designationsResponse.data.data);
        } else {
          console.warn('Unexpected designations API response:', designationsResponse.data);
        }

      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoadingDistricts(false);
        setIsLoadingDepartments(false);
        setIsLoadingDesignations(false);
      }
    };

    fetchAllData();
  }, []);

  // Fetch roles on component mount
  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await api.get("/admin/get-roles");
        if (res.data.status === true) {
          setRoles(res.data.role);
          console.log('Roles fetched:', res.data.role);
        }
      } catch (error) {
        console.log("Roles are not defined:", error);
        toast.error('Failed to load roles');
      }
    }

    fetchRoles();
  }, []);

  // Fetch sub-roles when role_id changes - FIXED
  useEffect(() => {
    async function fetchSubRoles() {
      if (!formData.role_id) {
        setSubRoles([]);
        return;
      }

      setIsLoadingSubRoles(true);
      try {
        const res = await api.get(`/admin/get-sub-roles/${formData.role_id}`);
        console.log('Sub-roles API response:', res.data);
        
        // FIXED: Based on your API response structure
        if (res.data && res.data.status === true && res.data.subrole) {
          setSubRoles(res.data.subrole); // Use 'subrole' from API response
          console.log('Sub-roles set:', res.data.subrole);
        } else {
          setSubRoles([]);
          console.log('No sub-roles found or invalid response structure');
        }
      } catch (error) {
        console.log("Sub-role fetch error:", error);
        setSubRoles([]);
        // toast.error('Failed to load sub-roles for selected role');
      } finally {
        setIsLoadingSubRoles(false);
      }
    }

    fetchSubRoles();
  }, [formData.role_id]); // This will trigger when role_id changes

  // Validation functions
  const validateName = (name) => /^[A-Za-z\s]*$/.test(name);
  const validateMobile = (mobile) => /^\d{10}$/.test(mobile);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle role_id change - reset sub_role_id when role changes
    if (name === 'role_id') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        sub_role_id: '' // Reset sub-role when role changes
      }));
      
      // Clear sub-role error
      if (errors.sub_role_id) {
        setErrors(prev => ({ ...prev, sub_role_id: '' }));
      }
    }
    // Handle name validation - only alphabets and spaces
    else if (name === 'name') {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
    // Handle mobile validation
    else if (name === 'number') {
      if (value === '' || validateMobile(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
          setErrors(prev => ({ ...prev, [name]: '' }));
        }
      } else {
        setErrors(prev => ({ ...prev, [name]: 'Enter exactly 10 digits for mobile number' }));
        return;
      }
    }
    // Handle password confirmation validation
    else if (name === 'password_confirmation') {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (value && formData.password && value !== formData.password) {
        setErrors(prev => ({ ...prev, [name]: 'Passwords do not match' }));
      } else {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
    // Handle other fields
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      if (name === 'password' && formData.password_confirmation && value !== formData.password_confirmation) {
        setErrors(prev => ({ ...prev, password_confirmation: 'Passwords do not match' }));
      } else if (name === 'password') {
        setErrors(prev => ({ ...prev, password_confirmation: '' }));
      }
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await api.post('/admin/add-user', {
        name: formData.name,
        email: formData.email,
        number: formData.number,
        role_id: parseInt(formData.role_id) || '',
        sub_role_id: formData.sub_role_id || '',  
        designation: formData.designation || '',
        department: formData.department_id || '', 
        district_id: formData.district_id, 
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });

      if (response.data.status === true) {
        toast.success(response.data.message || 'User created successfully!');
        
        // Reset form completely
        setFormData({
          name: '',
          email: '',
          number: '',
          role_id: '',
          sub_role_id: '',
          designation: '',
          department_id: '',
          district_id: '',
          password: '',
          password_confirmation: ''
        });
        setErrors({});
        setSubRoles([]); // Clear sub-roles
      }
    } catch (error) {
      // Enhanced error handling for backend validation
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const backendErrors = {};
        
        // Process backend errors - handle array format
        Object.keys(error.response.data.errors).forEach(field => {
          const errorArray = error.response.data.errors[field];
          // Get first error message from array
          backendErrors[field] = Array.isArray(errorArray) ? errorArray[0] : errorArray;
        });
        
        setErrors(backendErrors);
        
        // Show toast with first error for user feedback
        const firstError = Object.values(backendErrors)[0];
        // toast.error(firstError || 'Please fix the validation errors');
        
        console.log('Backend validation errors:', backendErrors);
      } else {
        // Generic error handling
        // toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
      }
      console.error('Submit error:', error.response?.data || error);
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

      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add New User</h1>
            <p className="text-xs sm:text-sm text-gray-600">Create a new user account</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 sm:space-y-6">
          {/* User Details */}
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <FaUser className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">User Information</h2>
                <p className="text-xs sm:text-sm text-gray-500">Basic user details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none ${
                    errors.name ? '' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name (only alphabets and spaces)"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none ${
                    errors.email ? '' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="number" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Mobile *
                </label>
                <input
                  id="number"
                  type="tel"
                  name="number"
                  placeholder="Enter Mobile number"
                  value={formData.number}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "");
                    setFormData(prev => ({ ...prev, number: onlyDigits }));
                    
                    // Clear errors when typing
                    if (errors.number) {
                      setErrors(prev => ({ ...prev, number: '' }));
                    }
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none ${
                    errors.number ? '' : 'border-gray-300'
                  }`}
                  maxLength="10"
                  pattern="[0-9]*"
                />
                {errors.number && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    {errors.number}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role_id" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  id="role_id"
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none bg-white ${
                    errors.role_id ? '' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.label}</option>
                  ))}
                </select>
                {errors.role_id && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    {errors.role_id}
                  </p>
                )}
              </div>

              {/* Sub Role - Now dynamic based on selected role */}
              <div>
                <label htmlFor="sub_role_id" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Sub Role *
                </label>
                <select
                  id="sub_role_id"
                  name="sub_role_id"
                  value={formData.sub_role_id}
                  onChange={handleInputChange}
                  disabled={!formData.role_id || isLoadingSubRoles}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none bg-white ${
                    errors.sub_role_id ? '' : 'border-gray-300'
                  } ${(!formData.role_id || isLoadingSubRoles) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">
                    {!formData.role_id 
                      ? 'First select a role' 
                      : isLoadingSubRoles 
                        ? 'Loading sub-roles...' 
                        : subRoles.length === 0 
                          ? 'No sub-roles'
                          : 'Select Sub Role'
                    }
                  </option>
                  {subRoles.map(subRole => (
                    <option key={subRole.id} value={subRole.id}>
                      {subRole.label || subRole.name}
                    </option>
                  ))}
                </select>
                {errors.sub_role_id && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    {errors.sub_role_id}
                  </p>
                )}
                {/* Debug info - Remove in production */}
                {/* {formData.role_id && (
                  <p className="mt-1 text-xs text-gray-400">
                    Found {subRoles.length} sub-role(s) for selected role
                  </p>
                )} */}
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
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none bg-white ${
                    errors.district_id ? '' : 'border-gray-300'
                  }`}
                  disabled={isLoadingDistricts}
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district.id} value={district.district_code}>
                      {district.district_name}
                    </option>
                  ))}
                </select>
                {errors.district_id && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    {errors.district_id}
                  </p>
                )}
              </div>

              {/* Designation */}
              <div>
                <label htmlFor="designation" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Designation *
                </label>
                <select
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none bg-white ${
                    errors.designation ? '' : 'border-gray-300'
                  }`}
                  disabled={isLoadingDesignations}
                >
                  <option value="">Select Designation</option>
                  {designations.map(designation => (
                    <option key={designation.id} value={designation.id}>
                      {designation.name}
                    </option>
                  ))}
                </select>
                {errors.designation && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    {errors.designation}
                  </p>
                )}
              </div>

              {/* Department */}
              <div>
                <label htmlFor="department_id" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  id="department_id"
                  name="department_id" 
                  value={formData.department_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none bg-white ${
                    errors.department_id ? '' : 'border-gray-300'
                  }`}
                  disabled={isLoadingDepartments}
                >
                  <option value="">Select Department</option>
                  {departments.map(department => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
                {errors.department_id && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    {errors.department_id}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <FaLock className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Security</h2>
                <p className="text-xs sm:text-sm text-gray-500">Set user password</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none ${
                    errors.password ? '' : 'border-gray-300'
                  }`}
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="password_confirmation" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none ${
                    errors.password_confirmation ? '' : 'border-gray-300'
                  }`}
                  placeholder="Confirm password"
                />
                {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    {errors.password_confirmation}
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
                    : 'bg-[#123463] hover:bg-[#123463] text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    Creating User...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="w-4 h-4" />
                    Create User
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

export default AddUserManagement;
