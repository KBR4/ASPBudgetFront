import React from 'react';
import { Box, TextField, Button, Typography, Avatar } from '@mui/material';
import { mockUser } from '../api/models/mockdatauser';
import { UserDto } from '../api/models/user';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDto>(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState<UserDto>(mockUser);

  const handleEdit = () => {
    setTempUser(user);
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser(tempUser);
    setIsEditing(false);
    //saving changes logic
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant='h4'>Profile</Typography>
        <Button variant='outlined' onClick={() => navigate('/')}>
          Back to Main
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant='h6'>Name</Typography>
        <TextField
          label='First Name'
          fullWidth
          margin='normal'
          value={isEditing ? tempUser.firstName : user.firstName}
          onChange={handleChange}
          name='firstName'
          disabled={!isEditing}
        />
        <TextField
          label='Last Name'
          fullWidth
          margin='normal'
          value={isEditing ? tempUser.lastName : user.lastName}
          onChange={handleChange}
          name='lastName'
          disabled={!isEditing}
        />
        <TextField
          label='Email'
          fullWidth
          margin='normal'
          value={isEditing ? tempUser.email : user.email}
          onChange={handleChange}
          name='email'
          disabled={!isEditing}
        />

        {isEditing ? (
          <Button variant='contained' sx={{ mt: 2 }} onClick={handleSave}>
            Save
          </Button>
        ) : (
          <Button variant='contained' sx={{ mt: 2 }} onClick={handleEdit}>
            Edit
          </Button>
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant='h6'>Avatar</Typography>
        <Avatar sx={{ width: 100, height: 100, mb: 2 }} />
        <Button variant='contained'>Upload</Button>
      </Box>

      <Box>
        <Typography variant='h6'>Admin Features</Typography>
        <TextField label='Select User' fullWidth margin='normal' />
        <Button variant='contained' sx={{ mr: 2 }}>
          Edit
        </Button>
        <Button variant='contained' color='error'>
          Delete
        </Button>
      </Box>
    </Box>
  );
}
