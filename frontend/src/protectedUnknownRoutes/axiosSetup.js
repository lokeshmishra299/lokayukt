// src/axiosSetup.js
import axios from 'axios';


const originalCreate = axios.create;


axios.create = function(config) {
  
  const instance = originalCreate.call(this, config);
  
  
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      
      if (
        error.response && 
        (error.response.status === 401 || error.response.data?.message === "Unauthenticated.")
      ) {
        console.log("Global Jugaad: Token expired! Redirecting to login...");
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
  
  return instance; 
};