import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithLogout } from "./baseQueryLogout";
import type {
  BaseResponse,
  RecordCreditPaymentDTO,
  RecordSaleDto,
  SaleTicket,
  Sales,
  SalesItemsResponse,
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

    recordCredit: builder.mutation<BaseResponse<SaleTicket>, RecordCreditPaymentDTO & { shopId: string , ticketId: string }>({
      query: ({shopId, ticketId, ...body}) => ({
        url: `/v1/sales/${shopId}/${ticketId}/payment`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sales"],
    }),

    // getSaleTicketById: builder.mutation<BaseResponse<SaleTicket>, { shopId: string , ticketId: string }>({
    //   query: ({shopId, ticketId, ...body}) => ({
    //     url: `/v1/sales/${shopId}/${ticketId}`,
    //     method: "GET",
    //     body,
    //   }),
    //   invalidatesTags: ["Sales"],
    // }),

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
        url: `/v1/sales/${shopId}`,
        method: "GET",
      }),
      providesTags: ["Sales"],
    }),

    getCreditsByShop: builder.query<SalesResponse, string>({
      query: (shopId) => ({
        url: `/v1/sales/${shopId}/credits?creditStatus=pending`,
        method: "GET",
      }),
      providesTags: ["Sales"],
    }),

    getSalesItemsByShop: builder.query<SalesItemsResponse, string>({
      query: (shopId) => ({
        url: `/v1/sales/${shopId}/items`,
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

    getSaleTicketById: builder.query<BaseResponse<SaleTicket>, { shopId: string; ticketId: string }>({
      query: ({ shopId, ticketId }) => ({
        url: `/v1/sales/${shopId}/${ticketId}`,
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
  useGetSalesItemsByShopQuery,
  useDeleteSalesMutation,
  useGetSaleInShopQuery,
  useGetCreditsByShopQuery,
  useRecordCreditMutation,
  useGetSaleTicketByIdQuery
} = salesApi;
