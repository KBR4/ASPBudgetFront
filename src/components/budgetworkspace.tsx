import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BudgetRecordDto } from '../api/models/budgetRecord';
import { BudgetResultDto } from '../api/models/budgetResult';
import { mockUser } from '../api/models/mockdatauser';
import { mockRecords, mockResult } from '../api/models/mockbudgetdata';

export default function BudgetWorkspace() {
  const [records, setRecords] = useState<BudgetRecordDto[]>(mockRecords);
  const [result, setResult] = useState<BudgetResultDto>(mockResult);

  const { id } = useParams<{ id: string }>();
  const [budgetName, setBudgetName] = useState<string>(`Budget ${id}`);
  const [tempBudgetName, setTempBudgetName] = useState(budgetName);
  const [isEditingName, setIsEditingName] = useState(false);

  const budgetId = id ? parseInt(id) : 0;
  const [filteredRecords, setFilteredRecords] = useState<BudgetRecordDto[]>([]);
  const [total, setTotal] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    const filtered = mockRecords.filter(
      (record) => record.budgetId === budgetId
    );
    setFilteredRecords(filtered);
  }, [budgetId]);

  useEffect(() => {
    const newTotal = filteredRecords.reduce(
      (sum, record) => sum + (record.total || 0),
      0
    );
    setTotal(newTotal);
  }, [filteredRecords]);

  const addRecord = () => {
    const newId =
      filteredRecords.length > 0
        ? Math.max(...filteredRecords.map((r) => r.id!)) + 1
        : 1;

    const newRecord: BudgetRecordDto = {
      id: newId,
      name: '',
      creationDate: new Date(),
      spendingDate: new Date(),
      budgetId: budgetId,
      total: 0,
      comment: '',
    };

    setFilteredRecords([...filteredRecords, newRecord]);
  };

  const deleteRecord = (id: number) => {
    setFilteredRecords(filteredRecords.filter((record) => record.id !== id));
  };

  const handleSave = () => {
    //add save logic
    navigate('/');
  };

  const handleNameSave = () => {
    setBudgetName(tempBudgetName);
    setIsEditingName(false);
  };

  const handleFieldChange = (
    id: number,
    field: keyof BudgetRecordDto,
    value: string | number | Date
  ) => {
    setFilteredRecords(
      filteredRecords.map((record) => {
        if (record.id === id) {
          return { ...record, [field]: value };
        }
        return record;
      })
    );
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
        <Typography variant='h6'>
          Welcome {mockUser.firstName} {mockUser.lastName}!
        </Typography>
        <Button onClick={() => navigate('/profile')}>Profile</Button>
        <Button variant='outlined' onClick={() => navigate('/')}>
          Back
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        {isEditingName ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              value={tempBudgetName}
              onChange={(e) => setTempBudgetName(e.target.value)}
              size='small'
            />
            <Button variant='contained' size='small' onClick={handleNameSave}>
              Save Name
            </Button>
          </Box>
        ) : (
          <Typography
            variant='h4'
            onClick={() => setIsEditingName(true)}
            sx={{ cursor: 'pointer' }}
          >
            {budgetName}
          </Typography>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Creation Date</TableCell>
              <TableCell>Spending Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.id}</TableCell>
                <TableCell>
                  <TextField
                    value={record.name}
                    onChange={(e) =>
                      handleFieldChange(record.id!, 'name', e.target.value)
                    }
                    size='small'
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type='date'
                    value={formatDateForInput(record.creationDate)}
                    onChange={(e) =>
                      handleFieldChange(
                        record.id!,
                        'creationDate',
                        e.target.value
                      )
                    }
                    size='small'
                    InputLabelProps={{ shrink: true }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type='date'
                    value={formatDateForInput(record.spendingDate)}
                    onChange={(e) =>
                      handleFieldChange(
                        record.id!,
                        'spendingDate',
                        e.target.value
                      )
                    }
                    size='small'
                    InputLabelProps={{ shrink: true }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type='number'
                    value={record.total}
                    onChange={(e) =>
                      handleFieldChange(
                        record.id!,
                        'total',
                        parseFloat(e.target.value)
                      )
                    }
                    size='small'
                    inputProps={{ step: '0.01' }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={record.comment || ''}
                    onChange={(e) =>
                      handleFieldChange(record.id!, 'comment', e.target.value)
                    }
                    size='small'
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size='small'
                    color='error'
                    onClick={() => deleteRecord(record.id!)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant='contained' onClick={addRecord}>
          Add Record
        </Button>
      </Box>

      <Box
        sx={{
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          bgcolor: 'background.paper',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant='h6'>Total: {total.toFixed(2)}</Typography>
        <Button
          variant='contained'
          size='large'
          onClick={handleSave}
          sx={{ minWidth: 150 }}
        >
          Save & Exit
        </Button>
      </Box>
    </Box>
  );
}
