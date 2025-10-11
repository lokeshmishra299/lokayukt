import React, { useState } from 'react';
import { FaUser, FaLock, FaBalanceScale, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Footer from './Footer';

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [formData, setFormData] = useState({
    user_name: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
    setGeneralError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError('');

    try {
      const loginApi = axios.create({
        baseURL: BASE_URL,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await loginApi.post('/login', formData);

      if (response.data.status === 'success') {
        // Store authentication data in localStorage
        localStorage.setItem('access_token', response.data.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('role', response.data.data.user.role.name);
        const userRole = response.data.data.user.role.name;
        toast.success("Login Successful!");
        setTimeout(() => {
          if (userRole === "admin") {
            window.open("/admin/dashboard", "_self");
            
          } else if (userRole === "operator") {
            localStorage.setItem('subrole', response.data.data.user.subrole.name);
            window.open("/operator/dashboard", "_self");
          }
          else if (userRole === "supervisor") {
            localStorage.setItem('subrole', response.data.data.user.subrole.name);
            window.open("/supervisor/dashboard", "_self");
          }
          else if (userRole === "lok-ayukt") {
            window.open("/lokayukt/dashboard", "_self");
          }
          else if (userRole === "up-lok-ayukt") {
            window.open("/uplokayukt/dashboard", "_self");
          }
          else {
            toast.error("Unauthorized role.");
            navigate("/login");
          }
        }, 1500);
      }

    } catch (error) {
      console.log("Full Error:", error);
      console.log("Error Response:", error.response?.data);
      
      if (error.response?.data) {
        // Direct error format check - your backend sends errors directly
        if (error.response.data.user_name || error.response.data.password) {
          // Direct format: { "user_name": ["message"], "password": ["message"] }
          const formattedErrors = {};
          
          if (error.response.data.user_name) {
            const userNameError = error.response.data.user_name;
            formattedErrors.user_name = Array.isArray(userNameError) ? userNameError[0] : userNameError;
          }
          
          if (error.response.data.password) {
            const passwordError = error.response.data.password;
            formattedErrors.password = Array.isArray(passwordError) ? passwordError[0] : passwordError;
          }
          
          setErrors(formattedErrors);
          console.log("Direct format errors set:", formattedErrors);
        }
        // Laravel validation format
        else if (error.response.data.errors) {
          const formattedErrors = {};
          Object.keys(error.response.data.errors).forEach(key => {
            const errorArray = error.response.data.errors[key];
            formattedErrors[key] = Array.isArray(errorArray) ? errorArray[0] : errorArray;
          });
          setErrors(formattedErrors);
          console.log("Laravel format errors set:", formattedErrors);
        }
        // Custom nested format
        else if (error.response.data.data && typeof error.response.data.data === 'object') {
          const formattedErrors = {};
          Object.keys(error.response.data.data).forEach(key => {
            const errorArray = error.response.data.data[key];
            formattedErrors[key] = Array.isArray(errorArray) ? errorArray[0] : errorArray;
          });
          setErrors(formattedErrors);
          console.log("Nested format errors set:", formattedErrors);
        }
        // General message error
        else if (error.response.data.message) {
          setGeneralError(error.response.data.message);
          console.log("General error set:", error.response.data.message);
        }
        // Status-based error handling
        else if (error.response.data.status === 'error') {
          setGeneralError(error.response.data.message || 'Login failed');
        }
      }

      else if (error.response?.status === 401) {
        setGeneralError('Invalid credentials');
      }
      else if (error.response?.status === 422) {
        setGeneralError('Validation failed');
      }
      // Network or other errors
      else {
        toast.error('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          
          {/* Header with Logo */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <FaBalanceScale className="text-6xl text-blue-800 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-blue-800 mb-2">
              LokAyukta CRMS
            </h1>
            <p className="text-gray-600 text-sm">
              लोकायुक्त शिकायत निवारण प्रबंधन प्रणाली
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Username / उपयोगकर्ता नाम
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.user_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter Username"
                />
              </div>
              {errors.user_name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <FaExclamationTriangle className="text-xs" />
                  {errors.user_name}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password / पासवर्ड
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.password || generalError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter Password"
                />
              </div>
              {/* Show field-specific password error */}
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <FaExclamationTriangle className="text-xs" />
                  {errors.password}
                </p>
              )}
              {/* Show general error like "Wrong password" below password field */}
              {generalError && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <FaExclamationTriangle className="text-xs" />
                  {generalError}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2
                ${!isLoading
                  ? 'bg-blue-800 hover:bg-blue-900 cursor-pointer' 
                  : 'bg-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="text-sm animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <FaLock className="text-sm" />
                  Login / लॉगिन
                </>
              )}
            </button>

          </form>

          {/* Footer */}
         

        </div>
      </div>

      {/* Page Footer - Bottom में fixed */}
      <Footer />

      {/* ToastContainer for react-toastify */}
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
      />
    </div>
  );
};

export default Login;
