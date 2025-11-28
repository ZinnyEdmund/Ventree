import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithLogout } from "./baseQueryLogout";
import type {
  BaseResponse,
  RecordSaleDto,
  SaleTicket,
  Sales,
  SalesResponse,
} from "../types/general";

export const salesApi = createApi({
  reducerPath: "salesApi",
  baseQuery: baseQueryWithLogout,
  tagTypes: ["Sales"],
  endpoints: (builder) => ({

    createSales: builder.mutation<BaseResponse<SaleTicket>, RecordSaleDto>({
      query: (body) => ({
        url: "/v1/sales",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sales"],
    }),

    updateInventory: builder.mutation<
      BaseResponse<Sales>,
      Partial<Sales> & { shopId: string; salesId: string }
    >({
      query: ({ shopId, salesId, ...data }) => ({
        url: `/v1/sales/${shopId}/${salesId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Sales"],
    }),

    getSalesByShop: builder.query<SalesResponse, string>({
      query: (shopId) => ({
        url: `/v1/sales/${shopId}/list`,
        method: "GET",
      }),
      providesTags: ["Sales"],
    }),

    getSaleInShop: builder.query<BaseResponse<Sales>, { shopId: string; salesId: string }>({
      query: ({ shopId, salesId }) => ({
        url: `/v1/sales/${shopId}/${salesId}`,
        method: "GET",
      }),
      providesTags: ["Sales"],
    }),

    deleteSales: builder.mutation<
      { success: boolean; message: string },
      { shopId: string; salesId: string }
    >({
      query: ({ shopId, salesId }) => ({
        url: `/v1/sales/${shopId}/${salesId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sales"],
    }),
  }),
});

export const {
  useCreateSalesMutation,
  useUpdateInventoryMutation,
  useGetSalesByShopQuery,
  useDeleteSalesMutation,
  useGetSaleInShopQuery,
} = salesApi;
