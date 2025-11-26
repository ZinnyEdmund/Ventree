import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithLogout } from './baseQueryLogout';
import type { BaseResponse, CreateStaffInput, StaffListData, StaffResponse, UpdateStaffInput } from '../types/general';

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
    updateStaff: builder.mutation<StaffResponse, { shopId: string; staffId: string; data: UpdateStaffInput }>({
      query: ({ shopId, staffId, data }) => ({
        url: `/v1/staff/${shopId}/${staffId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Staff'],
    }),
    getStaffByShop: builder.query<BaseResponse<StaffListData>, string>({
      query: (shopId) => ({
        url: `/v1/staff/${shopId}`,
        method: 'GET',
      }),
      providesTags: ['Staff'],
    }),
    deleteStaff: builder.mutation<StaffResponse, { shopId: string; staffId: string; }>({
      query: ({ shopId, staffId }) => ({
        url: `/v1/staff/${shopId}/${staffId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Staff'],
    }),
  }),
});

export const { 
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useGetStaffByShopQuery,
  useDeleteStaffMutation
} = staffApi;

