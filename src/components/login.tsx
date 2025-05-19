import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Grid } from '@mui/material';

export default function Login() {
  const navigate = useNavigate();
  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant='h4' gutterBottom>
        Login
      </Typography>
      <TextField fullWidth label='Email' margin='normal' variant='outlined' />
      <TextField
        fullWidth
        label='Password'
        type='password'
        margin='normal'
        variant='outlined'
      />
      <Button fullWidth variant='contained' sx={{ mt: 2 }}>
        Login
      </Button>
      <Grid container justifyContent='center'>
        <Typography variant='body2'>
          Don&apos;t have an account?{' '}
          <Link
            to='/register'
            style={{
              textDecoration: 'none',
              color: '#1976d2',
              fontWeight: 'bold',
            }}
          >
            Create one
          </Link>
        </Typography>
      </Grid>
    </Box>
  );
}
