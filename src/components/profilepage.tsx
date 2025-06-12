import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUserInfoQuery, useUpdateUserMutation } from '../api/userApiSlice';

export default function ProfilePage() {
  const navigate = useNavigate();

  // Fetch current user data
  const { data: user, isLoading, error, refetch } = useUserInfoQuery(undefined);
  const [updateUser, { isLoading: isUpdating, error: updateError }] =
    useUpdateUserMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    logoAttachmentUrl: '',
  });

  // Remove redundant auth check - AuthProtected component handles this

  // Update tempUser when user data is loaded
  useEffect(() => {
    if (user) {
      setTempUser({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        logoAttachmentUrl: user.logoAttachmentUrl || '',
      });
    }
  }, [user]);

  const handleEdit = () => {
    if (user) {
      setTempUser({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        logoAttachmentUrl: user.logoAttachmentUrl || '',
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      // Make sure we're sending the correct format that matches UpdateUserRequest
      await updateUser({
        id: user.id,
        firstName: tempUser.firstName,
        lastName: tempUser.lastName,
        email: tempUser.email,
        // Don't send logoAttachmentUrl for now since the backend doesn't handle it in the update
      }).unwrap();

      setIsEditing(false);
      // Refetch user data to get updated info
      refetch();
    } catch (error) {
      console.error('Failed to save changes:', error);
      // Log the full error to see what's happening
      console.error('Update error details:', error);
    }
  };

  const handleCancel = () => {
    if (user) {
      setTempUser({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        logoAttachmentUrl: user.logoAttachmentUrl || '',
      });
    }
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempUser((prev) => ({ ...prev, [name]: value }));
  };

  // Loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
        <Alert severity='error' sx={{ mb: 2 }}>
          Failed to load user data. Please try again.
        </Alert>
        <Button variant='outlined' onClick={() => refetch()}>
          Retry
        </Button>
        <Button variant='outlined' onClick={() => navigate('/')} sx={{ ml: 2 }}>
          Back to Main
        </Button>
      </Box>
    );
  }

  // No user data
  if (!user) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
        <Alert severity='warning' sx={{ mb: 2 }}>
          No user data found. Please log in again.
        </Alert>
        <Button variant='contained' onClick={() => navigate('/login')}>
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant='h4'>Profile</Typography>
        <Button variant='outlined' onClick={() => navigate('/')}>
          Back to Main
        </Button>
      </Box>

      {/* Display update errors */}
      {updateError && (
        <Alert severity='error' sx={{ mb: 2 }}>
          Failed to update profile. Please try again.
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant='h6' sx={{ mb: 2 }}>
          Personal Information
        </Typography>

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
          type='email'
        />

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          {isEditing ? (
            <>
              <Button
                variant='contained'
                onClick={handleSave}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </Button>
              <Button
                variant='outlined'
                onClick={handleCancel}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button variant='contained' onClick={handleEdit}>
              Edit
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant='h6' sx={{ mb: 2 }}>
          Profile Picture
        </Typography>
        <Avatar
          sx={{ width: 100, height: 100, mb: 2 }}
          src={user.logoAttachmentUrl || undefined}
          alt={`${user.firstName} ${user.lastName}`}
        >
          {!user.logoAttachmentUrl &&
            `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`}
        </Avatar>
        <Button variant='outlined' disabled>
          Upload New Picture
        </Button>
        <Typography
          variant='caption'
          display='block'
          sx={{ mt: 1, color: 'text.secondary' }}
        ></Typography>
      </Box>
    </Box>
  );
}
