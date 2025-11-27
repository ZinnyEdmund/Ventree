import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithLogout } from './baseQueryLogout';
import type { BaseResponse, DashboardResponse, IShop, KYCData, SubmitKYCInfo, TimePeriod, UpdateShopDTO } from '../types/general';

export const shopApi = createApi({
  reducerPath: 'shopApi',
  baseQuery: baseQueryWithLogout,
  tagTypes: ['Shop', 'Sales', 'Expenses'],
  endpoints: (builder) => ({
    addKYCInfo: builder.mutation<BaseResponse<KYCData>, { shopId: string; data: SubmitKYCInfo }>({
      query: ({ shopId, data }) => ({
        url:  `/v1/shop/${shopId}/kyc/submit`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Shop'],
    }),
    updateProfile: builder.mutation<BaseResponse<KYCData>, { shopId: string; data: UpdateShopDTO }>({
      query: ({ shopId, data }) => ({
        url:  `/v1/shop/${shopId}/profile`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Shop'],
    }),
    getShopProfile: builder.query<BaseResponse<IShop>, string>({
        query: (shopId) => ({
          url: `/v1/shop/${shopId}/profile`,
          method: 'GET',
        }),
        providesTags: ['Shop'],
    }),
    getShopDashboard: builder.query<DashboardResponse, {shopId: string, period?: TimePeriod }>({
        query: ({shopId, period}) => ({
          url: `/v1/user/shop/${shopId}/dashboard?period=${period}`,
          method: 'GET',
        }),
        providesTags: ['Shop', 'Sales', 'Expenses'],
        keepUnusedDataFor: 3600, // keep data for 1 hour
    }),  
  }),
});

export const { 
  useAddKYCInfoMutation,
  useUpdateProfileMutation,
  useGetShopProfileQuery,
  useGetShopDashboardQuery
} = shopApi;

