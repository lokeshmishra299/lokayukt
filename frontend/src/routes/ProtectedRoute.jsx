// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children, allowedRoles = [], allowedSubroles = [] }) => {
//   const authToken = localStorage.getItem("access_token");
//   const role = localStorage.getItem("role");
//   const subrole = localStorage.getItem("subrole");

//   // Check if user is authenticated
//   if (!authToken) {
//     return <Navigate to="/login" replace />;
//   }

//   // Check if role is allowed (if roles are specified)
//   if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
//     return <Navigate to="/login" replace />;
//   }

//   // Check if subrole is allowed (if subroles are specified)
//   if (allowedSubroles.length > 0 && !allowedSubroles.includes(subrole)) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
