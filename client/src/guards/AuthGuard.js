import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { Paths } from '../routes/Paths';

const AuthGuard = () => {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated() ? <Outlet /> : <Navigate to={Paths.auth.login} />;
};

export default AuthGuard;
