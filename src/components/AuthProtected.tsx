import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserInfoQuery } from '../api/userApiSlice';

export interface AuthProtectedProps {
  redirectPath?: string;
}

export default function AuthProtected({
  redirectPath = '/login',
}: AuthProtectedProps) {
  const { data: user, isLoading, isError } = useUserInfoQuery();

  if (isLoading) {
    <Box>
      <CircularProgress />
    </Box>;
  }

  if (isError || !user) {
    <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
