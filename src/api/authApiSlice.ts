import { apiSlice } from './apiSlice';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type RegisterResponse = any;

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (args) => ({
        url: '/Auth/login',
        method: 'POST',
        body: args,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.token) {
            localStorage.setItem('auth_token', data.token);
          }
        } catch (error) {
          console.error(error);
        }
      },
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (args) => ({
        url: '/Auth/register',
        method: 'POST',
        body: args,
      }),
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation<any, any>({
      query: () => ({
        url: '/Auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
  authApiSlice;
