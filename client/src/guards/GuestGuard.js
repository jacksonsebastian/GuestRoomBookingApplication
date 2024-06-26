import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { Paths } from '../routes/Paths';

const GuestGuard = () => {
  const { isAuthenticated } = useAuthContext();

  console.log("isAuthenticated:1", isAuthenticated())

  return isAuthenticated() ? <Navigate to={Paths.dashboard.root} /> : <Outlet /> ;
};

export default GuestGuard;
