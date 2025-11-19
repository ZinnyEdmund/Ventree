import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithLogout } from './baseQueryLogout';
import type { CreateStaffInput, Staff, StaffResponse, UpdateStaffInput } from '../types/general';

export const staffApi = createApi({
  reducerPath: 'staffApi',
  baseQuery: baseQueryWithLogout,
  tagTypes: ['Staff'],
  endpoints: (builder) => ({
    createStaff: builder.mutation<StaffResponse, CreateStaffInput>({
      query: (body) => ({
        url: '/v1/staff',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Staff'],
    }),
    updateStaff: builder.mutation<StaffResponse, { id: string; data: UpdateStaffInput }>({
      query: ({ id, data }) => ({
        url: `/staff/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Staff'],
    }),
    getStaffByShop: builder.query<StaffResponse, string>({
      query: (shopId) => ({
        url: `/staff?shopId=${shopId}`,
        method: 'GET',
      }),
      providesTags: ['Staff'],
    }),
  }),
});

export const { 
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useGetStaffByShopQuery,
} = staffApi;

