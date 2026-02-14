// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; // ya jo bhi aap use karte hain

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Isme role aur subrole rahega
  const [loading, setLoading] = useState(true); // Ye refresh ke time flicker rokne ke liye hai

  // App load/refresh hone par ye chalega
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // Backend ko token bhej kar user details mangwao
          // Backend ka wo URL daaliye jo logged-in user ki detail deta hai
          const response = await axios.get('/api/me', { 
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Backend se jo role/subrole aaya, usko state me save kar lo
          setUser({
            role: response.data.role, // e.g., 'operator'
            subrole: response.data.subrole, // e.g., 'so-us'
            name: response.data.name
          });
        } catch (error) {
          console.error("Token invalid ya expire ho gaya", error);
          localStorage.removeItem('access_token');
          setUser(null);
        }
      }
      setLoading(false); // Checking khatam
    };

    fetchUser();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('access_token', token);
    setUser(userData); // Set user in context memory
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);