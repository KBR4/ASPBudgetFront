import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { UserDto } from '../api/models/user';
import { Roles } from '../api/models/roles';
import { useState } from 'react';

export default function Register() {
  const [user, setUser] = useState<Partial<UserDto>>({
    firstName: '',
    lastName: '',
    email: '',
    role: Roles.User,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant='h4' gutterBottom>
        Register
      </Typography>

      <TextField
        fullWidth
        name='firstName'
        label='First Name'
        value={user.firstName}
        onChange={handleChange}
        margin='normal'
      />

      <TextField
        fullWidth
        name='lastName'
        label='Last Name'
        value={user.lastName}
        onChange={handleChange}
        margin='normal'
      />

      <TextField
        fullWidth
        name='email'
        label='Email'
        type='email'
        value={user.email}
        onChange={handleChange}
        margin='normal'
      />

      <TextField
        fullWidth
        name='password'
        label='Password'
        type='password'
        margin='normal'
      />

      <Button fullWidth variant='contained' sx={{ mt: 2 }}>
        Register
      </Button>
    </Box>
  );
}
