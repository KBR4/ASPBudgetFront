import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Formik,
  Form,
  FieldArray,
  Field,
  useFormikContext,
  FormikErrors,
} from 'formik';
import * as Yup from 'yup';
import {
  useGetBudgetByIdQuery,
  useUpdateBudgetMutation,
  useAddBudgetMutation,
} from '../api/budgetApiSlice';
import {
  useGetBudgetRecordsByBudgetIdQuery,
  useAddBudgetRecordMutation,
  useUpdateBudgetRecordMutation,
  useDeleteBudgetRecordMutation,
} from '../api/budgetRecordApiSlice';
import { useUserInfoQuery } from '../api/userApiSlice';
import { BudgetRecordDto } from '../api/models/budgetRecord';

type RecordErrors = {
  name?: string;
  total?: string;
  spendingDate?: string;
  comment?: string;
};

const RecordSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  total: Yup.number().required('Total is required').min(0, 'Must be positive'),
  spendingDate: Yup.date().required('Spending date is required'),
  comment: Yup.string(),
});

const BudgetSchema = Yup.object().shape({
  budgetName: Yup.string().required('Budget name is required'),
  records: Yup.array().of(RecordSchema),
});

export default function BudgetWorkspace() {
  const { id } = useParams<{ id: string }>();
  const budgetId = id ? parseInt(id) : 0;
  const isNewBudget = budgetId === 0;
  const navigate = useNavigate();
  const [saveError, setSaveError] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const {
    data: budget,
    isLoading: isBudgetLoading,
    isError: isBudgetError,
  } = useGetBudgetByIdQuery(budgetId, { skip: !id || isNewBudget });

  // Use the new hook to get records for this specific budget
  const {
    data: records = [],
    isLoading: isRecordsLoading,
    isError: isRecordsError,
    refetch: refetchRecords,
  } = useGetBudgetRecordsByBudgetIdQuery(budgetId, {
    skip: !id || isNewBudget,
  });

  const {
    data: user,
    isLoading: isUserLoading,
    isError,
  } = useUserInfoQuery(undefined);

  const [updateBudget] = useUpdateBudgetMutation();
  const [createBudget] = useAddBudgetMutation();
  const [addRecord] = useAddBudgetRecordMutation();
  const [updateRecord] = useUpdateBudgetRecordMutation();
  const [deleteRecord] = useDeleteBudgetRecordMutation();

  const initialValues = {
    budgetName: budget?.name || (isNewBudget ? 'New Budget' : `Budget ${id}`),
    records: records,
    isEditingName: false,
  };

  const validateRecords = (records: BudgetRecordDto[]) => {
    const errors: string[] = [];
    records.forEach((record, index) => {
      if (!record.name || record.name.trim() === '') {
        errors.push(`Record ${index + 1}: Name is required`);
      }
      if (
        record.total === undefined ||
        record.total === null ||
        record.total < 0
      ) {
        errors.push(`Record ${index + 1}: Valid total amount is required`);
      }
      if (!record.spendingDate) {
        errors.push(`Record ${index + 1}: Spending date is required`);
      }
    });
    return errors;
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setSaveError('');
      setSaveSuccess(false);

      const validationErrors = validateRecords(values.records);
      if (validationErrors.length > 0) {
        setSaveError(validationErrors.join(', '));
        return;
      }

      let currentBudgetId = budgetId;

      if (isNewBudget) {
        const newBudget = await createBudget({
          name: 'New Budget',
          creatorId: user!.id,
          description: '',
        }).unwrap();
        currentBudgetId = newBudget.id;
      } else if (budget && budget.name !== values.budgetName) {
        await updateBudget({
          ...budget,
          name: values.budgetName,
        }).unwrap();
      }

      for (const record of values.records) {
        if (record.id) {
          await updateRecord({
            ...record,
            budgetId: currentBudgetId,
          }).unwrap();
        } else {
          await addRecord({
            ...record,
            budgetId: currentBudgetId,
          }).unwrap();
        }
      }

      setSaveSuccess(true);

      if (isNewBudget) {
        setTimeout(() => {
          navigate(`/budget/${currentBudgetId}`);
        }, 1000);
      } else {
        await refetchRecords();
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to save budget:', error);
      setSaveError('Failed to save budget. Please try again.');
    }
  };

  const handleRecordUpdate = async (
    record: BudgetRecordDto,
    index: number,
    setFieldValue: any
  ) => {
    if (isNewBudget) return;

    try {
      if (record.id) {
        await updateRecord({
          ...record,
          budgetId,
        }).unwrap();
      } else if (record.name && record.name.trim() !== '') {
        const newRecord = await addRecord({
          ...record,
          budgetId,
        }).unwrap();
        setFieldValue(`records.${index}.id`, newRecord.id);
      }
    } catch (error) {
      console.error('Failed to update record:', error);
    }
  };

  const handleDeleteRecord = async (
    record: BudgetRecordDto,
    index: number,
    remove: (index: number) => void
  ) => {
    try {
      if (record.id) {
        await deleteRecord(record.id).unwrap();
      }
      remove(index);
      await refetchRecords();
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  const handleSaveName = async (budgetName: string, setFieldValue: any) => {
    if (isNewBudget) {
      setFieldValue('isEditingName', false);
      return;
    }

    try {
      if (budget && budget.name !== budgetName) {
        await updateBudget({
          ...budget,
          name: budgetName,
        }).unwrap();
      }
      setFieldValue('isEditingName', false);
    } catch (error) {
      console.error('Failed to update budget name:', error);
      setSaveError('Failed to update budget name. Please try again.');
    }
  };

  if ((!isNewBudget && isBudgetLoading) || (!isNewBudget && isRecordsLoading)) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isNewBudget && (isBudgetError || isRecordsError)) {
    return <Typography color='error'>Error loading budget data</Typography>;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={BudgetSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        setFieldValue,
        isSubmitting,
        isValid,
      }) => (
        <Box sx={{ p: 3 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}
          >
            <Typography variant='h6'>
              Welcome {user?.firstName} {user?.lastName}!
            </Typography>
            <Button onClick={() => navigate('/profile')}>Profile</Button>
            <Button variant='outlined' onClick={() => navigate('/')}>
              Back
            </Button>
          </Box>

          {saveError && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {saveError}
            </Alert>
          )}

          {saveSuccess && (
            <Alert severity='success' sx={{ mb: 2 }}>
              Budget saved successfully! Redirecting...
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            {values.isEditingName ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  name='budgetName'
                  value={values.budgetName}
                  onChange={handleChange}
                  size='small'
                  error={touched.budgetName && !!errors.budgetName}
                  helperText={touched.budgetName && errors.budgetName}
                />
                <Button
                  variant='contained'
                  size='small'
                  onClick={() =>
                    handleSaveName(values.budgetName, setFieldValue)
                  }
                >
                  Save Name
                </Button>
              </Box>
            ) : (
              <Typography
                variant='h4'
                onClick={() => setFieldValue('isEditingName', true)}
                sx={{ cursor: 'pointer' }}
              >
                {values.budgetName}
              </Typography>
            )}
          </Box>

          <Form>
            <FieldArray name='records'>
              {({ push, remove }) => (
                <>
                  <TableContainer component={Paper} sx={{ mb: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>Name *</TableCell>
                          <TableCell>Creation Date</TableCell>
                          <TableCell>Spending Date *</TableCell>
                          <TableCell>Total *</TableCell>
                          <TableCell>Comment</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {values.records.map((record, index) => {
                          const recordErrors =
                            (errors.records?.[index] as RecordErrors) || {};
                          const recordTouched =
                            (touched.records?.[index] as RecordErrors) || {};

                          return (
                            <TableRow key={record.id || `new-${index}`}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <Field
                                  as={TextField}
                                  name={`records.${index}.name`}
                                  size='small'
                                  fullWidth
                                  required
                                  error={
                                    recordTouched.name && !!recordErrors.name
                                  }
                                  helperText={
                                    recordTouched.name && recordErrors.name
                                  }
                                  onBlur={async () => {
                                    await handleRecordUpdate(
                                      values.records[index],
                                      index,
                                      setFieldValue
                                    );
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Field
                                  as={TextField}
                                  type='date'
                                  name={`records.${index}.creationDate`}
                                  size='small'
                                  InputLabelProps={{ shrink: true }}
                                  value={
                                    record.creationDate
                                      ? new Date(record.creationDate)
                                          .toISOString()
                                          .split('T')[0]
                                      : new Date().toISOString().split('T')[0]
                                  }
                                  disabled
                                />
                              </TableCell>
                              <TableCell>
                                <Field
                                  as={TextField}
                                  type='date'
                                  name={`records.${index}.spendingDate`}
                                  size='small'
                                  required
                                  InputLabelProps={{ shrink: true }}
                                  value={
                                    record.spendingDate
                                      ? new Date(record.spendingDate)
                                          .toISOString()
                                          .split('T')[0]
                                      : ''
                                  }
                                  error={
                                    recordTouched.spendingDate &&
                                    !!recordErrors.spendingDate
                                  }
                                  helperText={
                                    recordTouched.spendingDate &&
                                    recordErrors.spendingDate
                                  }
                                  onBlur={async () => {
                                    await handleRecordUpdate(
                                      values.records[index],
                                      index,
                                      setFieldValue
                                    );
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Field
                                  as={TextField}
                                  type='number'
                                  name={`records.${index}.total`}
                                  size='small'
                                  required
                                  inputProps={{ step: '0.01', min: '0' }}
                                  error={
                                    recordTouched.total && !!recordErrors.total
                                  }
                                  helperText={
                                    recordTouched.total && recordErrors.total
                                  }
                                  onBlur={async () => {
                                    await handleRecordUpdate(
                                      values.records[index],
                                      index,
                                      setFieldValue
                                    );
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Field
                                  as={TextField}
                                  name={`records.${index}.comment`}
                                  size='small'
                                  fullWidth
                                  onBlur={async () => {
                                    await handleRecordUpdate(
                                      values.records[index],
                                      index,
                                      setFieldValue
                                    );
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  size='small'
                                  color='error'
                                  onClick={() =>
                                    handleDeleteRecord(record, index, remove)
                                  }
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Button
                      variant='contained'
                      type='button'
                      onClick={() => {
                        push({
                          id: undefined,
                          name: '',
                          creationDate: new Date(),
                          spendingDate: new Date(),
                          budgetId: isNewBudget ? 0 : budgetId,
                          total: 0,
                          comment: '',
                        });
                      }}
                    >
                      Add Record
                    </Button>
                  </Box>
                </>
              )}
            </FieldArray>

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
              <TotalDisplay />
              <Button
                variant='contained'
                size='large'
                type='submit'
                sx={{ minWidth: 150 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save & Exit'}
              </Button>
            </Box>
          </Form>
        </Box>
      )}
    </Formik>
  );
}

function TotalDisplay() {
  const { values } = useFormikContext<{
    records: BudgetRecordDto[];
  }>();

  const total = values.records.reduce(
    (sum, record) => sum + (record.total || 0),
    0
  );

  return <Typography variant='h6'>Total: ${total.toFixed(2)}</Typography>;
}
