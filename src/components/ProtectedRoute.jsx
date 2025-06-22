import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userData = JSON.parse(localStorage.getItem('tnstc-user'));
  const userRole = userData?.user?.role;

  if (!userData) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;
