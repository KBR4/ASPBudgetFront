import React, { useState } from 'react'; // Добавлен импорт useState
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
  useGetAllBudgetsQuery,
  useDeleteBudgetMutation,
} from '../api/budgetApiSlice';

export default function BudgetList() {
  const navigate = useNavigate();
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null);

  // 1. Получаем данные пользователя (передаем undefined, так как запрос не требует параметров)
  const {
    data: user,
    isLoading: isUserLoading,
    isError,
  } = useUserInfoQuery({});

  // 2. Получаем все бюджеты
  const { data: budgets = [], isLoading: isBudgetsLoading } =
    useGetAllBudgetsQuery();

  // 3. Хук для удаления бюджета
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

  const handleCreateNew = () => {
    navigate('/budget/0');
  };

  const handleSelect = () => {
    if (selectedBudgetId) {
      navigate(`/budget/${selectedBudgetId}`);
    }
  };

  if (isUserLoading) {
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

      <Select
        fullWidth
        value={selectedBudgetId || ''}
        onChange={(e) => setSelectedBudgetId(Number(e.target.value))}
        sx={{ mb: 3 }}
      >
        {budgets.map((budget) => (
          <MenuItem key={budget.id} value={budget.id}>
            {budget.name}
          </MenuItem>
        ))}
      </Select>

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
