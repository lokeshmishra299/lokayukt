import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Ye user me sab ayega
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [subrole, setSubrole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");

      if (token) {
        try {
          const res = await axios.get(`${BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
          setRole(res.data.role?.name);
          setSubrole(res.data.subrole?.name);
        } catch (error) {
          console.error("Token invalid or expired");
          localStorage.removeItem("access_token");
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, subrole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};