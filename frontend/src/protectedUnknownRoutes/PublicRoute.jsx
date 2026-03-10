import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // Agar token hai, toh user ko wapas pichle page par bhej do (Go Back)
      navigate(-1); 
    }
  }, [token, navigate]);

  if (token) {
    // Jab tak user wapas pichle page par ja raha hai, login page mat dikhao (blank rakho)
    return null; 
  }

  // Agar token nahi hai, toh aaram se Login page dikhao
  return children;
};

export default PublicRoute;