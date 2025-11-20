// frontend/services/userApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  type BaseResponse,
  type CreateProductDto,
  type InventoryData,
  type Stocks,
} from "../types/general";
import { baseQueryWithLogout } from "./baseQueryLogout";

export const stocksApi = createApi({
  reducerPath: "stocksApi",
  baseQuery: baseQueryWithLogout,
  tagTypes: ["Stocks"],
  endpoints: (builder) => ({
    fetchInventory: builder.query<BaseResponse<InventoryData>, string>({
      query: (shopId) => ({
        url: `/v1/inventory/${shopId}/items`,
        method: "GET",
      }),
      providesTags: ["Stocks"],
    }),

    getInventoryById: builder.query<BaseResponse<Stocks>, [string, string]>({
      query: ([shopId, itemId]: [string, string]) => ({
        url: `/v1/inventory/${shopId}/items/${itemId}`,
        method: "GET",
      }),
      providesTags: ["Stocks"],
    }),

    createInventory: builder.mutation<
      BaseResponse<Stocks>,
      CreateProductDto & { shopId: string }
    >({
      query: ({ shopId, ...data }) => ({
        url: `/v1/inventory/${shopId}/items`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Stocks"],
    }),

    updateInventory: builder.mutation<
      BaseResponse<Stocks>,
      Partial<Stocks> & { shopId: string; itemId: string }
    >({
      query: ({ shopId, itemId, ...data }) => ({
        url: `/v1/inventory/${shopId}/items/${itemId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Stocks"],
    }),

    deleteInventory: builder.mutation<
      { success: boolean; message: string },
      { shopId: string; itemId: string }
    >({
      query: ({ shopId, itemId }) => ({
        url: `/v1/inventory/${shopId}/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Stocks"],
    }),
  }),
});

export const { 
    useCreateInventoryMutation,
    useFetchInventoryQuery,
    useDeleteInventoryMutation,
    useGetInventoryByIdQuery,
    useUpdateInventoryMutation,
 } = stocksApi;
