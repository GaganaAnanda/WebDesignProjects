import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ element, requiredRole }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user?.type !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
}

export default ProtectedRoute;
