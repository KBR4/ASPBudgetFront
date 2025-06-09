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
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { BudgetRecordDto } from '../api/models/budgetRecord';
import { BudgetResultDto } from '../api/models/budgetResult';
import { mockUser } from '../api/models/mockdatauser';
import { mockRecords, mockResult } from '../api/models/mockbudgetdata';
import {
  Formik,
  Form,
  FieldArray,
  Field,
  useFormikContext,
  FormikErrors,
} from 'formik';
import * as Yup from 'yup';

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

  const initialRecords = mockRecords.filter(
    (record) => record.budgetId === budgetId
  );

  const initialValues = {
    budgetName: `Budget ${id}`,
    records: initialRecords,
    isEditingName: false,
  };

  const handleSubmit = (values: typeof initialValues) => {
    console.log('Submitting:', values);
    navigate('/');
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={BudgetSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, setFieldValue }) => (
        <Box sx={{ p: 3 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}
          >
            <Typography variant='h6'>
              Welcome {mockUser.firstName} {mockUser.lastName}!
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
                                />
                              </TableCell>
                              <TableCell>
                                <Field
                                  as={TextField}
                                  name={`records.${index}.comment`}
                                  size='small'
                                  fullWidth
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  size='small'
                                  color='error'
                                  onClick={() => remove(index)}
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
                        const newId =
                          values.records.length > 0
                            ? Math.max(
                                ...values.records.map((r) => r.id || 0)
                              ) + 1
                            : 1;

                        push({
                          id: newId,
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
