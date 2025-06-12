import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL ?? 'http://localhost:5259',
  credentials: 'include',
  prepareHeaders(headers) {
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Budget', 'BudgetRecord'],
  endpoints: () => ({}),
});

export const {}: any = apiSlice;
