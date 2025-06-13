import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUserInfoQuery } from '../api/userApiSlice';
import {
  useGetUserBudgetsQuery,
  useDeleteBudgetMutation,
  useAddBudgetMutation,
} from '../api/budgetApiSlice';

export default function BudgetList() {
  const navigate = useNavigate();
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null);

  const {
    data: user,
    isLoading: isUserLoading,
    isError,
  } = useUserInfoQuery(undefined);

  const { data: userBudgets = [], isLoading: isBudgetsLoading } =
    useGetUserBudgetsQuery(undefined);

  const [createBudget] = useAddBudgetMutation();
  const [deleteBudget] = useDeleteBudgetMutation();

  const handleLogout = () => {
    navigate('/login');
  };

  const handleDelete = async () => {
    if (selectedBudgetId) {
      try {
        await deleteBudget(selectedBudgetId).unwrap();
        setSelectedBudgetId(null);
      } catch (error) {
        console.error('Failed to delete budget:', error);
      }
    }
  };

  const handleCreateNew = async () => {
    if (!user) {
      console.error('User not loaded yet');
      return;
    }

    try {
      const now = new Date();
      const newBudget = await createBudget({
        name: 'New Budget',
        creatorId: user.id,
        description: '',
        startDate: now,
        finishDate: new Date(
          now.getFullYear() + 1,
          now.getMonth(),
          now.getDate()
        ),
      }).unwrap();

      navigate(`/budget/${newBudget.id}`);
    } catch (error) {
      console.error('Failed to create new budget:', error);
    }
  };

  const handleSelect = () => {
    if (selectedBudgetId) {
      navigate(`/budget/${selectedBudgetId}`);
    }
  };

  if (isUserLoading || isBudgetsLoading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    navigate('/login');
    return null;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant='h6' sx={{ mr: 2 }}>
          Welcome {user?.firstName} {user?.lastName}!
        </Typography>
        <Button onClick={() => navigate('/profile')}>Profile</Button>
        <Button variant='outlined' onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Typography variant='h4' gutterBottom>
        Select Budget
      </Typography>

      {userBudgets.length === 0 ? (
        <Typography variant='body1' sx={{ mb: 3, fontStyle: 'italic' }}>
          No budgets found. Create your first budget!
        </Typography>
      ) : (
        <Select
          fullWidth
          value={selectedBudgetId || ''}
          onChange={(e) => setSelectedBudgetId(Number(e.target.value))}
          sx={{ mb: 3 }}
        >
          {userBudgets.map((budget) => (
            <MenuItem key={budget.id} value={budget.id}>
              {budget.name}
            </MenuItem>
          ))}
        </Select>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant='contained'
          disabled={!selectedBudgetId}
          onClick={handleSelect}
        >
          Select
        </Button>
        <Button
          variant='outlined'
          color='error'
          disabled={!selectedBudgetId}
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Button variant='outlined' onClick={handleCreateNew}>
          New Budget
        </Button>
      </Box>
    </Box>
  );
}
