import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { tokenStore } from '../../auth/store/token.store';
import { authApi } from '../../auth/api/auth.api';

export const AdminRoute = ({ children }: { children: React.ReactElement }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = tokenStore.get();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authApi.getMe();
        setIsAdmin(response.data.role === 'Admin');
      } catch (error) {
        console.error('Failed to fetch user', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const token = tokenStore.get();
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};
