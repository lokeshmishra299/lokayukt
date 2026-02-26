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
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { toast, Toaster } from "react-hot-toast";
import { useQueryClient } from '@tanstack/react-query';
import { FaEye, FaEyeSlash } from "react-icons/fa";



import axios from "axios";
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
  const queryClient = useQueryClient();

    const navigate =useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    role_id: '',
    sub_role_id: '',
    ps_parent: "",
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

  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Roles and Sub-roles
  const [roles, setRoles] = useState([]);
  const [subRoles, setSubRoles] = useState([]);
  const [selectedSubRoleLabel, setSelectedSubRoleLabel] = useState('');

  const [isLoadingSubRoles, setIsLoadingSubRoles] = useState(false);

  // PS Under Lokayukat state
const [psUnderLokayukat, setPsUnderLokayukat] = useState('');
const [lokayuktList, setLokayuktList] = useState([]);
const [isLoadingLokayukt, setIsLoadingLokayukt] = useState(false);
const isPersonalSecretary = formData.role_id === "6";
const isSupervisor = formData.role_id === "3"; 
const needsPsParent = isPersonalSecretary || (isSupervisor && formData.sub_role_id);




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

  const [savedRoleId, setSavedRoleId] = useState()

  // Fetch roles on component mount
  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await api.get("/admin/get-roles");
        if (res.data.status === true) {
          setRoles(res.data.role);
          console.log('Roles fetched:', res.data.role);
          const setRoleIDForCheek = res.data.role.map((items)=>{
            return items.id
          })

          console.log("Id he ye ", setRoleIDForCheek)
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
    setSelectedSubRoleLabel('');
    setFormData(prev => ({ 
      
      ...prev, 
      
      [name]: value,
      sub_role_id: '', // Reset sub-role when role changes
      ps_parent: "" // Reset lokayukt-uplokayukt
      
    }));
    
    // Clear sub-role error
    if (errors.sub_role_id) {
      setErrors(prev => ({ ...prev, sub_role_id: '' }));
    }
      if (errors.lokayukt_uplokayukt) setErrors(prev => ({ ...prev, lokayukt_uplokayukt: '' }));
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
  // Handle PS Under Lokayukat input
  else if (name === 'ps_under_lokayukat') {
    setPsUnderLokayukat(value);
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

  // ✅ पहले payload बनाएं
  let payload = {
    name: formData.name,
    email: formData.email,
    number: formData.number,
    role_id: parseInt(formData.role_id) || '',
    designation: formData.designation || '',
    department: formData.department_id || '',
    district_id: formData.district_id,
    password: formData.password,
    password_confirmation: formData.password_confirmation
  };

  // ✅ Role के according fields add करें
  // if (isPersonalSecretary) {
  //   // Personal Secretary के लिए
  //   payload.ps_parent = formData.ps_parent || "";
  //   payload.sub_role_id = ""; // empty string
  // } else {
  //   // दूसरे roles के लिए
  //   payload.sub_role_id = formData.sub_role_id || "";
  //   payload.ps_parent = ""; // empty string
  // }

  payload.sub_role_id = formData.sub_role_id || "";

if (needsPsParent) {
  payload.ps_parent = formData.ps_parent || "";
} else {
  payload.ps_parent = "";
}


  console.log("Submitting payload:", payload);

  try {
    const response = await api.post('/admin/add-user', payload); 
    
    if (response.data.status === true) {
      toast.success(response.data.message || 'User created successfully!');
      queryClient.invalidateQueries({queryKey: ["users"]})
      
      setTimeout(()=>{
        navigate(-1)
      }, 2000)
      
      setFormData({
        name: '',
        email: '',
        number: '',
        role_id: '',
        sub_role_id: '',
        ps_parent: "",
        designation: '',
        department_id: '',
        district_id: '',
        password: '',
        password_confirmation: ''
      });
      setErrors({});
      setSubRoles([]);
    }
  } catch (error) {
    // Error handling
    if (error.response?.status === 422 && error.response?.data?.errors) {
      const backendErrors = {};
      Object.keys(error.response.data.errors).forEach(field => {
        const errorArray = error.response.data.errors[field];
        backendErrors[field] = Array.isArray(errorArray) ? errorArray[0] : errorArray;
      });
      setErrors(backendErrors);
    }
  } finally {
    setIsSubmitting(false);
  }
};


const fetchLokayukt = async () => {
  const res = await api.get('/admin/get-lokayukt-uplokayukt')
  console.log("Show Data", res.data)
  console.log("Response structure:", {
    hasData: !!res.data,
    hasDataData: !!res.data?.data,
    isArray: Array.isArray(res.data?.data),
    isArrayOfArrays: Array.isArray(res.data?.data?.[0])
  })
  
  // सही data access करें
  return res.data?.data || res.data || []
}

const { data: fetchLokayuktData } = useQuery({
  queryKey: ["get-lokayukt-uplokayukt"],
  queryFn: fetchLokayukt
})

// Temporary debug
console.log("fetchLokayuktData in component:", fetchLokayuktData)
  


// const renderPSLikePopup = (label) => {
//   if (!label) return null;

//   return (
//     <div className="mt-2">
//       <select
//         disabled
//         className="w-full px-3 py-2 text-sm border rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
//       >
//         <option>{label}</option>
//       </select>
//     </div>
//   );
// };


  return (
    <div className=" bg-gray-50 min-h-screen">
      <Toaster
        position="top-right"
     
      />

      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Add New User</h1>
            <p className="text-xs sm:text-sm text-gray-600">Create a new user account</p>
          </div>
          <div>
            <button onClick={()=>{
              navigate(-1)
            }} 
             className="inline-flex items-center gap-2 px-4 py-2 bg-[#13316C] text-white rounded-md text-sm hover:bg-[#0f2451] transition"
            
            >Back</button>
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
                  placeholder="Enter Full Name"
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
                  placeholder="Enter Email Address"
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
                  placeholder="Enter Mobile Number"
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

               {/* Role - यह हमेशा दिखेगा */}
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

  {/* SUB ROLE - केवल role_id != 6 होने पर दिखेगा */}
  {!isPersonalSecretary && (
    <div>
      <label htmlFor="sub_role_id" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
        Sub Role *
      </label>
      <select
        id="sub_role_id"
        name="sub_role_id"
        value={formData.sub_role_id}
        // onChange={handleInputChange}
        onChange={(e) => {
  handleInputChange(e);

  const selected = subRoles.find(
    (sr) => sr.id === Number(e.target.value)
  );

  setSelectedSubRoleLabel(selected?.label || selected?.name || '');
}}
        disabled={!formData.role_id || isLoadingSubRoles}
        className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none bg-white ${
          errors.sub_role_id ? 'border-red-500' : 'border-gray-300'
        } ${(!formData.role_id || isLoadingSubRoles) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <option value="">
          {!formData.role_id 
            ? 'First Select a role' 
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
  )}

  {/* {!isPersonalSecretary && selectedSubRoleLabel && (
  renderPSLikePopup(selectedSubRoleLabel)
)} */}



  {/* LOKAYUKT-UPLOKAYUKT - केवल role_id = 6 होने पर दिखेगा */}


{(isPersonalSecretary || (isSupervisor && selectedSubRoleLabel)) && (
  <div>
    <label htmlFor="ps_parent" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
      {/* PS Under Hon' Lokayukt/Uplokayukt * */}
       {isPersonalSecretary
    ? "PS Under Hon' Lokayukt/Uplokayukt *"
    : "Under Supervisor *"}
    </label>

    {/* <select
      id="ps_parent"
      name="ps_parent"
      value={formData.ps_parent}
      onChange={handleInputChange}
      className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none bg-white ${
        errors.ps_parent ? 'border-red-500' : 'border-gray-300'
      }`}
    >
      <option value="">Select User</option>

      {fetchLokayuktData?.flat(2)?.map((item) => (
        <option key={item.id} value={item.id}>
          {item?.role?.label} ({item.name}) 
        </option>
      ))}
    </select> */}

    <select
  id="ps_parent"
  name="ps_parent"
  value={formData.ps_parent}
  onChange={handleInputChange}
  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none bg-white ${
    errors.ps_parent ? "border-red-500" : "border-gray-300"
  }`}
>
  <option value="">Select User</option>

  {fetchLokayuktData?.flat(2)?.map((item) => {
    const label =
      item?.role?.name === "supervisor"
        ? item?.subrole?.label 
        : item?.role?.label; 

    return (
      <option key={item.id} value={item.id}>
       {item.name} ({label})
      </option>
    );
  })}
</select>


    {errors.ps_parent && (
      <p className="mt-1 text-sm text-red-600">
        {errors.ps_parent}
      </p>
    )}
  </div>
)}




              {/* District */}
            <div>
    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
      District / जिला *
    </label>
    <select
      name="district_id"
      value={formData.district_id}
      onChange={handleInputChange}
      // 🎯 डायनामिक फॉन्ट: अगर कोई जिला सेलेक्टेड है तो 'kruti-input', वरना नॉर्मल (English)
      className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none bg-white ${
        errors.district_id ? 'border-red-500' : 'border-gray-300'
      } ${formData.district_id ? 'kruti-input text-[20px]' : 'font-sans text-sm'}`}
      disabled={isLoadingDistricts}
    >
      {/* 🎯 डिफ़ॉल्ट ऑप्शन हमेशा इंग्लिश में रहेगा */}
      <option value="" style={{ fontFamily: 'sans-serif', fontSize: '14px' }}>
        Select District
      </option>
      
      {/* 🎯 जिलों के नाम हमेशा KrutiDev में दिखेंगे */}
      {districts.map(district => (
        <option 
          key={district.id} 
          value={district.district_code}
          style={{ fontFamily: 'KrutiDev', fontSize: '20px' }}
        >
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
      // 🎯 डायनामिक फॉन्ट: अगर कोई डिपार्टमेंट सेलेक्टेड है तो 'kruti-input', वरना नॉर्मल (English)
      className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none bg-white ${
        errors.department_id ? 'border-red-500' : 'border-gray-300'
      } ${formData.department_id ? 'kruti-input text-[20px]' : 'font-sans text-sm'}`}
      disabled={isLoadingDepartments}
    >
      {/* 🎯 डिफ़ॉल्ट ऑप्शन हमेशा इंग्लिश में रहेगा */}
      <option value="" style={{ fontFamily: 'sans-serif', fontSize: '14px' }}>
        Select Department
      </option>
      
      {/* 🎯 डिपार्टमेंट के नाम हमेशा KrutiDev में दिखेंगे */}
      {departments.map(department => (
        <option 
          key={department.id} 
          value={department.id}
          style={{ fontFamily: 'KrutiDev', fontSize: '20px' }}
        >
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

  <div className="relative">
    {/* inline style to hide browser default eye */}
    <style>
      {`
        .no-browser-eye::-ms-reveal,
        .no-browser-eye::-ms-clear {
          display: none;
        }
        .no-browser-eye::-webkit-textfield-decoration-container {
          display: none;
        }
      `}
    </style>

    <input
      id="password"
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleInputChange}
      className={`no-browser-eye w-full px-3 pr-10 py-2 text-sm border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none ${
        errors.password ? 'border-red-500' : 'border-gray-300'
      }`}
      placeholder="Enter Password"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  </div>

  {errors.password && (
    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
  )}
</div>


              {/* Confirm Password */}
             <div>
  <label htmlFor="password_confirmation" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
    Confirm Password *
  </label>

  <div className="relative">
    <input
      id="password_confirmation"
      type={showConfirmPassword ? "text" : "password"}
      name="password_confirmation"
      value={formData.password_confirmation}
      onChange={handleInputChange}
      className={`no-browser-eye w-full px-3 pr-10 py-2 text-sm border rounded-md focus:ring-1 focus:ring-[#123463] focus:border-[#123463] outline-none ${
        errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
      }`}
      placeholder="Confirm Password"
    />

    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
    >
      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  </div>

  {errors.password_confirmation && (
    <p className="mt-1 text-sm text-red-600">
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
