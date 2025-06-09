import { apiSlice } from './apiSlice';
import { BudgetDto } from './models/budget';

export type GetBudgetByIdRequest = number;
export type GetBudgetByIdResponse = BudgetDto;

export type AddBudgetRequest = Omit<BudgetDto, 'id'>;
export type AddBudgetResponse = { id: number };

export type DeleteBudgetRequest = number;
export type DeleteBudgetResponse = void;

export const budgetApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Получение бюджета по ID
    getBudgetById: builder.query<GetBudgetByIdResponse, GetBudgetByIdRequest>({
      query: (id) => ({
        url: `/Budget/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Budget', id }],
    }),

    // Добавление бюджета
    addBudget: builder.mutation<AddBudgetResponse, AddBudgetRequest>({
      query: (body) => ({
        url: '/Budget',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Budget'],
    }),

    // Удаление бюджета
    deleteBudget: builder.mutation<DeleteBudgetResponse, DeleteBudgetRequest>({
      query: (id) => ({
        url: `/Budget/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Budget', id }],
    }),
  }),
});

export const {
  useGetBudgetByIdQuery,
  useAddBudgetMutation,
  useDeleteBudgetMutation,
} = budgetApiSlice;
