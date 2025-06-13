import {
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import {
  LoginRequest,
  useLoginMutation,
  useLogoutMutation,
} from '../api/authApiSlice';
import * as yup from 'yup';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function LogoutPage() {
  const [logout, { isLoading }] = useLogoutMutation();

  useEffect(() => {
    logout({});
  }, []);

  if (isLoading) {
    return (
      <Grid>
        <CircularProgress />
        <Typography>Logging out ...</Typography>
      </Grid>
    );
  }

  return <Navigate to='/login' replace />;
}
