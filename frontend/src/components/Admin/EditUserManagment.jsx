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
  FaUsers,
  FaEdit
} from 'react-icons/fa';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';

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

const EditUserManagement = () => {
  const { id } = useParams(); // Get user ID from URL params
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    role_id: '',
    sub_role_id: '',
    designation: '', // Store designation ID but send as 'designation'
    department: '',   // Store department ID but send as 'department'
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

  // Roles and Sub-roles - Dynamic from API
  const [roles, setRoles] = useState([]);
  const [subRoles, setSubRoles] = useState([]);
  const [isLoadingSubRoles, setIsLoadingSubRoles] = useState(false);

  // Fetch user data and all dropdown data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch user data first
        const userResponse = await api.get(`/admin/edit-users/${id}`);
        if (userResponse.data.status === true) {
          const userData = userResponse.data.data;
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            number: userData.number || '',
            role_id: userData.role_id || '',
            sub_role_id: userData.sub_role_id || '',
            designation: userData.designation_id || '', // GET se designation_id aata hai
            department: userData.department_id || '',   // GET se department_id aata hai
            district_id: userData.district_id || '',
            password: '',
            password_confirmation: ''
          });
        } else {
          toast.error('Failed to load user data');
          navigate('/admin/user-management'); // Redirect if user not found
        }

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
        toast.error('Failed to load required data from server');
        if (error.response?.status === 404) {
          navigate('/admin/user-management'); // Redirect if user not found
        }
      } finally {
        setIsLoadingDistricts(false);
        setIsLoadingDepartments(false);
        setIsLoadingDesignations(false);
      }
    };

    if (id) {
      fetchAllData();
    }
  }, [id, navigate]);

  // Fetch roles on component mount - ADDED
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

  // Fetch sub-roles when role_id changes - ADDED
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
        
        // Based on your API response structure
        if (res.data && res.data.status === true && res.data.subrole) {
          setSubRoles(res.data.subrole);
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
    
    // Handle role_id change - reset sub_role_id when role changes - ADDED
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
      // FIXED: Send designation and department IDs as strings (backend expects these field names)
      const updatePayload = {
        name: formData.name,
        email: formData.email,
        number: formData.number,
        role_id: parseInt(formData.role_id) || '',
        sub_role_id: formData.sub_role_id || '',  
        designation: formData.designation.toString(), // Send designation ID as string
        department: formData.department.toString(),   // Send department ID as string
        district_id: formData.district_id || ''
      };

      // Only include password fields if they are provided
      if (formData.password && formData.password_confirmation) {
        updatePayload.password = formData.password;
        updatePayload.password_confirmation = formData.password_confirmation;
      }

      console.log('Update payload being sent:', updatePayload); // Debug log

      const response = await api.post(`/admin/update-users/${id}`, updatePayload);

      if (response.data.status === true) {
        toast.success(response.data.message || 'User updated successfully!');
        // Navigate back to users list after successful update
        setTimeout(() => {
          navigate("/admin/user-management")
        }, 2000);
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
        toast.error(firstError || 'Please fix the validation errors');
        
        console.log('Backend validation errors:', backendErrors);
      } else if (error.response?.status === 404) {
        toast.error('User not found');
        navigate("/admin/user-management");
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to update this user');
      } else {
        // Generic error handling
        toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit User</h1>
            <p className="text-xs sm:text-sm text-gray-600">Update user account information</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 sm:space-y-6">
          {/* User Details */}
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <FaEdit className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
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
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
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
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
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
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.number ? 'border-red-500' : 'border-gray-300'
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

              {/* Role - UPDATED to use dynamic API */}
              <div>
                <label htmlFor="role_id" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  id="role_id"
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${
                    errors.role_id ? 'border-red-500' : 'border-gray-300'
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

              {/* Sub Role - UPDATED to use dynamic API with dependency on role */}
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
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${
                    errors.sub_role_id ? 'border-red-500' : 'border-gray-300'
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
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${
                    errors.district_id ? 'border-red-500' : 'border-gray-300'
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

              {/* Designation - FIXED: Store ID but send correctly */}
              <div>
                <label htmlFor="designation" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Designation *
                </label>
                <select
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${
                    errors.designation ? 'border-red-500' : 'border-gray-300'
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

              {/* Department - FIXED: Store ID but send correctly */}
              <div>
                <label htmlFor="department" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  id="department"
                  name="department" 
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
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
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    {errors.department}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Password Section - Optional for updates */}
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <FaLock className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Security</h2>
                <p className="text-xs sm:text-sm text-gray-500">Change user password (leave blank to keep current password)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter new password (optional)"
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
                  Confirm New Password
                </label>
                <input
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm new password"
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
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/user-management")}
                className="px-6 py-3 rounded-lg font-medium bg-gray-300 hover:bg-gray-400 text-gray-700 transition-all"
              >
                Cancel
              </button>
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
                    Updating User...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="w-4 h-4" />
                    Update User
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

export default EditUserManagement;
