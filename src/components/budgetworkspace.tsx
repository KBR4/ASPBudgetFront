import React from 'react';
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
} from '../api/budgetApiSlice';
import {
  useGetAllBudgetRecordsQuery,
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
  name: Yup.string().required('Required'),
  total: Yup.number().required('Required').min(0, 'Must be positive'),
  spendingDate: Yup.date().required('Required'),
  comment: Yup.string(),
});

const BudgetSchema = Yup.object().shape({
  budgetName: Yup.string().required('Budget name is required'),
  records: Yup.array().of(RecordSchema),
});

export default function BudgetWorkspace() {
  const { id } = useParams<{ id: string }>();
  const budgetId = id ? parseInt(id) : 0;
  const navigate = useNavigate();

  // Загрузка данных бюджета
  const {
    data: budget,
    isLoading: isBudgetLoading,
    isError: isBudgetError,
  } = useGetBudgetByIdQuery(budgetId, { skip: !id });

  // Загрузка записей бюджета
  const {
    data: records = [],
    isLoading: isRecordsLoading,
    isError: isRecordsError,
  } = useGetAllBudgetRecordsQuery();

  // Загрузка данных пользователя
  const { data: user } = useUserInfoQuery({});

  // Мутации для обновления данных
  const [updateBudget] = useUpdateBudgetMutation();
  const [addRecord] = useAddBudgetRecordMutation();
  const [updateRecord] = useUpdateBudgetRecordMutation();
  const [deleteRecord] = useDeleteBudgetRecordMutation();

  // Фильтрация записей по текущему бюджету
  const filteredRecords = records.filter(
    (record) => record.budgetId === budgetId
  );

  const initialValues = {
    budgetName: budget?.name || `Budget ${id}`,
    records: filteredRecords,
    isEditingName: false,
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      // Обновляем название бюджета
      if (budget) {
        await updateBudget({
          ...budget,
          name: values.budgetName,
        }).unwrap();
      }

      // Перенаправляем на главную страницу
      navigate('/');
    } catch (error) {
      console.error('Failed to save budget:', error);
    }
  };

  if (isBudgetLoading || isRecordsLoading) {
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

  if (isBudgetError || isRecordsError) {
    return <Typography color='error'>Error loading budget data</Typography>;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={BudgetSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, setFieldValue }) => (
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
                  onClick={() => setFieldValue('isEditingName', false)}
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
                        {values.records.map((record, index) => {
                          const recordErrors =
                            (errors.records?.[index] as RecordErrors) || {};
                          const recordTouched =
                            (touched.records?.[index] as RecordErrors) || {};

                          return (
                            <TableRow key={record.id || index}>
                              <TableCell>{record.id || 'new'}</TableCell>
                              <TableCell>
                                <Field
                                  as={TextField}
                                  name={`records.${index}.name`}
                                  size='small'
                                  fullWidth
                                  error={
                                    recordTouched.name && !!recordErrors.name
                                  }
                                  helperText={
                                    recordTouched.name && recordErrors.name
                                  }
                                  onBlur={async () => {
                                    const recordToUpdate =
                                      values.records[index];
                                    if (recordToUpdate.id) {
                                      await updateRecord(recordToUpdate);
                                    } else {
                                      const newRecord = await addRecord({
                                        ...recordToUpdate,
                                        budgetId,
                                      }).unwrap();
                                      setFieldValue(
                                        `records.${index}.id`,
                                        newRecord.id
                                      );
                                    }
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
                                    new Date(record.creationDate)
                                      .toISOString()
                                      .split('T')[0]
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
                                  InputLabelProps={{ shrink: true }}
                                  error={
                                    recordTouched.spendingDate &&
                                    !!recordErrors.spendingDate
                                  }
                                  helperText={
                                    recordTouched.spendingDate &&
                                    recordErrors.spendingDate
                                  }
                                  onBlur={async () => {
                                    const recordToUpdate =
                                      values.records[index];
                                    if (recordToUpdate.id) {
                                      await updateRecord(recordToUpdate);
                                    }
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Field
                                  as={TextField}
                                  type='number'
                                  name={`records.${index}.total`}
                                  size='small'
                                  inputProps={{ step: '0.01' }}
                                  error={
                                    recordTouched.total && !!recordErrors.total
                                  }
                                  helperText={
                                    recordTouched.total && recordErrors.total
                                  }
                                  onBlur={async () => {
                                    const recordToUpdate =
                                      values.records[index];
                                    if (recordToUpdate.id) {
                                      await updateRecord(recordToUpdate);
                                    }
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
                                    const recordToUpdate =
                                      values.records[index];
                                    if (recordToUpdate.id) {
                                      await updateRecord(recordToUpdate);
                                    }
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  size='small'
                                  color='error'
                                  onClick={async () => {
                                    if (record.id) {
                                      await deleteRecord(record.id);
                                    }
                                    remove(index);
                                  }}
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
                          budgetId: budgetId,
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

            <TotalDisplay />

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
              >
                Save & Exit
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

  return <Typography variant='h6'>Total: {total.toFixed(2)}</Typography>;
}
