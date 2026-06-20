import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Loading...</div>
      </div>
    );
  }

  if (!user || user.userType !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};
