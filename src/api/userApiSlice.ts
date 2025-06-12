import { apiSlice } from './apiSlice';

export type UserInfoRequest = any;

export type UserInfoResponse = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  logoAttachmentUrl: string | null;
};

export type UpdateUserRequest = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  logoAttachmentUrl?: string | null;
};

export type GetUserByIdRequest = {
  id: number;
};

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user info
    userInfo: builder.query<UserInfoResponse, void>({
      query: () => ({
        url: '/User/userInfo',
      }),
      providesTags: ['User'],
    }),

    // Get user by ID
    getUserById: builder.query<UserInfoResponse, number>({
      query: (id) => ({
        url: `/User/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Get all users (Admin only)
    getAllUsers: builder.query<UserInfoResponse[], void>({
      query: () => ({
        url: '/User',
      }),
      providesTags: ['User'],
    }),

    // Update user
    updateUser: builder.mutation<void, UpdateUserRequest>({
      query: (userData) => ({
        url: '/User',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [
        'User',
        { type: 'User', id },
      ],
    }),

    // Delete user (Admin only)
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/User/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => ['User', { type: 'User', id }],
    }),
  }),
});

export const {
  useUserInfoQuery,
  useGetUserByIdQuery,
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
