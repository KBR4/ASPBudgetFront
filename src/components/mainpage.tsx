import React from 'react';
import { Box, Typography, Button, Select, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BudgetDto } from '../api/models/budget';
import { UserDto } from '../api/models/user';
import { Roles } from '../api/models/roles';
import { mockUser } from '../api/models/mockdatauser';

const mockBudgets: BudgetDto[] = [
  { id: 1, name: 'Budget 1', creatorId: 1 },
  { id: 2, name: 'Debts', creatorId: 1 },
  { id: 3, name: 'Budget 10', creatorId: 1 },
];

export default function BudgetList() {
  const [budgets, setBudgets] = useState<BudgetDto[]>(mockBudgets);
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
    //logic for logout
  };

  const handleDelete = () => {
    if (selectedBudgetId) {
      setBudgets(budgets.filter((budget) => budget.id !== selectedBudgetId));
      setSelectedBudgetId(null);
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

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant='h6' sx={{ mr: 2 }}>
          Welcome {mockUser.firstName} {mockUser.lastName}!
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
