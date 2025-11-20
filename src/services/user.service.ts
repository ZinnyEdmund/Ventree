// frontend/services/userApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import type { ClientProfile, ServiceProviderProfile, User } from '../types/general';
import { baseQueryWithLogout } from './baseQueryLogout';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithLogout,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getAllUsers: builder.query<User[], void>({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    getUserById: builder.query<User, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    getMyProfile: builder.query<ClientProfile | ServiceProviderProfile, void>({
      query: () => ({
        url: '/users/profile',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    updateUser: builder.mutation<ClientProfile | ServiceProviderProfile, { data: Partial<ClientProfile> | Partial<ServiceProviderProfile> }>({
      query: ({ data }) => ({
        url: '/users/update',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    deleteUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetMyProfileQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;