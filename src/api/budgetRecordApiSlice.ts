import { apiSlice } from './apiSlice';
import { BudgetRecordDto } from './models/budgetRecord';

export type GetAllBudgetRecordsRequest = void;
export type GetAllBudgetRecordsResponse = BudgetRecordDto[];

export type GetBudgetRecordByIdRequest = number;
export type GetBudgetRecordByIdResponse = BudgetRecordDto;

export type GetBudgetRecordsByBudgetIdRequest = number;
export type GetBudgetRecordsByBudgetIdResponse = BudgetRecordDto[];

export type AddBudgetRecordRequest = Omit<BudgetRecordDto, 'id'>;
export type AddBudgetRecordResponse = { id: number };

export type UpdateBudgetRecordRequest = BudgetRecordDto;
export type UpdateBudgetRecordResponse = void;

export type DeleteBudgetRecordRequest = number;
export type DeleteBudgetRecordResponse = void;

export const budgetRecordApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBudgetRecords: builder.query<
      GetAllBudgetRecordsResponse,
      GetAllBudgetRecordsRequest
    >({
      query: () => ({
        url: '/BudgetRecord',
        method: 'GET',
      }),
      providesTags: ['BudgetRecord'],
    }),

    getBudgetRecordById: builder.query<
      GetBudgetRecordByIdResponse,
      GetBudgetRecordByIdRequest
    >({
      query: (id) => ({
        url: `/BudgetRecord/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'BudgetRecord', id }],
    }),

    getBudgetRecordsByBudgetId: builder.query<
      GetBudgetRecordsByBudgetIdResponse,
      GetBudgetRecordsByBudgetIdRequest
    >({
      query: (budgetId) => ({
        url: `/BudgetRecord/budget/${budgetId}`,
        method: 'GET',
      }),
      providesTags: (result, error, budgetId) => [
        { type: 'BudgetRecord', id: `budget-${budgetId}` },
        'BudgetRecord',
      ],
    }),

    addBudgetRecord: builder.mutation<
      AddBudgetRecordResponse,
      AddBudgetRecordRequest
    >({
      query: (body) => ({
        url: '/BudgetRecord',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['BudgetRecord'],
    }),

    updateBudgetRecord: builder.mutation<
      UpdateBudgetRecordResponse,
      UpdateBudgetRecordRequest
    >({
      query: (body) => ({
        url: '/BudgetRecord',
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'BudgetRecord', id: arg.id },
        { type: 'BudgetRecord', id: `budget-${arg.budgetId}` },
      ],
    }),

    deleteBudgetRecord: builder.mutation<
      DeleteBudgetRecordResponse,
      DeleteBudgetRecordRequest
    >({
      query: (id) => ({
        url: `/BudgetRecord/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'BudgetRecord', id }],
    }),
  }),
});

export const {
  useGetAllBudgetRecordsQuery,
  useGetBudgetRecordByIdQuery,
  useGetBudgetRecordsByBudgetIdQuery,
  useAddBudgetRecordMutation,
  useUpdateBudgetRecordMutation,
  useDeleteBudgetRecordMutation,
} = budgetRecordApiSlice;
