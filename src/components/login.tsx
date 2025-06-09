import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Grid, Link } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';
import { useLoginMutation } from '../api/authApiSlice';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .max(100, 'Email must be at most 100 characters')
    .required('Email is required'),
  password: Yup.string()
    .min(9, 'Password must be at least 9 characters')
    .max(128, 'Password must be at most 128 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/^\S*$/, 'Password cannot contain spaces')
    .required('Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await login(values).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant='h4' gutterBottom>
        Login
      </Typography>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <Field
              component={TextField}
              name='email'
              label='Email'
              fullWidth
              margin='normal'
              variant='outlined'
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />

            <Field
              component={TextField}
              name='password'
              label='Password'
              type='password'
              fullWidth
              margin='normal'
              variant='outlined'
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />

            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
        )}
      </Formik>

      <Grid container justifyContent='center' sx={{ mt: 2 }}>
        <Typography variant='body2'>
          Don&apos;t have an account?{' '}
          <Link href='/register' className='register-link' color='primary'>
            Create one
          </Link>
        </Typography>
      </Grid>
    </Box>
  );
}
