import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Jo Context humne banaya tha

const ProtectedRoute = ({ allowedRoles, allowedSubroles }) => {
  // 1. Context API se user ki details aur loading state nikalenge
  const { user, loading } = useAuth();

  // STAGE 1: Kya API se data aa raha hai? (Refresh hone par)
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>
        <h2>Loading... Please wait...</h2> {/* Yahan aap koi Spinner bhi laga sakte hain */}
      </div>
    );
  }

  // STAGE 2: Kya user logged in hai?
  if (!user) {
    // Agar user null hai (token nahi hai), toh wapas Login page par bhej do
    return <Navigate to="/login" replace />;
  }

  // STAGE 3: Kya user ka ROLE match ho raha hai?
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Agar 'emp' allowed hai, lekin user 'operator' hai, toh unauthorized page par bhej do
    // (Ya fir directly Navigate to="/login" bhi kar sakte hain)
    return <Navigate to="/unauthorized" replace />; 
  }

  // STAGE 4: Kya user ka SUBROLE match ho raha hai? (Zyadatar Supervisor ke case me)
  if (allowedSubroles && !allowedSubroles.includes(user.subrole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // STAGE 5: Sab kuch Theek Hai! (Green Signal)
  // <Outlet /> ka matlab hai ki jo bhi routes iske andar likhe the, unko screen par dikha do.
  return <Outlet />;
};

export default ProtectedRoute;