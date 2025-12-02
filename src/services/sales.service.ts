// import { createApi } from "@reduxjs/toolkit/query/react";
// import { baseQueryWithLogout } from "./baseQueryLogout";
// import type {
//   BaseResponse,
//   RecordCreditPaymentDTO,
//   RecordSaleDto,
//   SaleTicket,
//   Sales,
//   SalesItemsResponse,
//   SalesResponse,
// } from "../types/general";

// export const salesApi = createApi({
//   reducerPath: "salesApi",
//   baseQuery: baseQueryWithLogout,
//   tagTypes: ["Sales", 'Shop'],
//   endpoints: (builder) => ({

//     createSales: builder.mutation<BaseResponse<SaleTicket>, RecordSaleDto>({
//       query: (body) => ({
//         url: "/v1/sales",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["Sales", 'Shop'],
//     }),

//     recordCredit: builder.mutation<BaseResponse<SaleTicket>, RecordCreditPaymentDTO & { shopId: string , ticketId: string }>({
//       query: ({shopId, ticketId, ...body}) => ({
//         url: `/v1/sales/${shopId}/${ticketId}/payment`,
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["Sales", 'Shop'],
//     }),

//     // getSaleTicketById: builder.mutation<BaseResponse<SaleTicket>, { shopId: string , ticketId: string }>({
//     //   query: ({shopId, ticketId, ...body}) => ({
//     //     url: `/v1/sales/${shopId}/${ticketId}`,
//     //     method: "GET",
//     //     body,
//     //   }),
//     //   invalidatesTags: ["Sales"],
//     // }),

//     updateInventory: builder.mutation<
//       BaseResponse<Sales>,
//       Partial<Sales> & { shopId: string; salesId: string }
//     >({
//       query: ({ shopId, salesId, ...data }) => ({
//         url: `/v1/sales/${shopId}/${salesId}`,
//         method: "PUT",
//         body: data,
//       }),
//       invalidatesTags: ["Sales", 'Shop'],
//     }),

//     getSalesByShop: builder.query<SalesResponse, string>({
//       query: (shopId) => ({
//         url: `/v1/sales/${shopId}`,
//         method: "GET",
//       }),
//       providesTags: ["Sales"],
//     }),

//     getCreditsByShop: builder.query<SalesResponse, string>({
//       query: (shopId) => ({
//         url: `/v1/sales/${shopId}/credits?creditStatus=pending`,
//         method: "GET",
//       }),
//       providesTags: ["Sales"],
//     }),

//     getSalesItemsByShop: builder.query<SalesItemsResponse, string>({
//       query: (shopId) => ({
//         url: `/v1/sales/${shopId}/items`,
//         method: "GET",
//       }),
//       providesTags: ["Sales"],
//     }),

//     getSaleInShop: builder.query<BaseResponse<Sales>, { shopId: string; salesId: string }>({
//       query: ({ shopId, salesId }) => ({
//         url: `/v1/sales/${shopId}/${salesId}`,
//         method: "GET",
//       }),
//       providesTags: ["Sales"],
//     }),

//     getSaleTicketById: builder.query<BaseResponse<SaleTicket>, { shopId: string; ticketId: string }>({
//       query: ({ shopId, ticketId }) => ({
//         url: `/v1/sales/${shopId}/${ticketId}`,
//         method: "GET",
//       }),
//       providesTags: ["Sales"],
//     }),

//     deleteSales: builder.mutation<
//       { success: boolean; message: string },
//       { shopId: string; salesId: string }
//     >({
//       query: ({ shopId, salesId }) => ({
//         url: `/v1/sales/${shopId}/${salesId}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Sales", 'Shop'],
//     }),
//   }),
// });

// export const {
//   useCreateSalesMutation,
//   useUpdateInventoryMutation,
//   useGetSalesByShopQuery,
//   useGetSalesItemsByShopQuery,
//   useDeleteSalesMutation,
//   useGetSaleInShopQuery,
//   useGetCreditsByShopQuery,
//   useRecordCreditMutation,
//   useGetSaleTicketByIdQuery
// } = salesApi;


import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithLogout } from "./baseQueryLogout";
import type {
  BaseResponse,
  CreditResponse,
  RecordCreditPaymentDTO,
  RecordSaleDto,
  SaleTicket,
  Sales,
  SalesItemsResponse,
  SalesResponse,
} from "../types/general";

// ============================================
// Additional Type Definitions
// ============================================

// Analytics response
export interface SalesAnalytics {
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  averageTicketValue: number;
  itemsSold: number;
  ticketCount: number;
  paymentMethods: {
    cash: number;
    transfer: number;
    credit: number;
  };
  topSellingItems: Array<{
    itemId: string;
    itemName: string;
    quantitySold: number;
    revenue: number;
  }>;
  salesByDate: Array<{
    date: string;
    sales: number;
    revenue: number;
  }>;
}

// Credit sales summary
export interface CreditSalesSummary {
  totalCreditSales: number;
  totalAmountOwed: number;
  totalAmountPaid: number;
  pendingCount: number;
  partialCount: number;
  paidCount: number;
  overdueCount: number;
  overdueAmount: number;
}

// Customer credit history
export interface CustomerCreditHistory {
  customerName: string;
  customerPhone: string;
  totalCreditSales: number;
  totalAmountOwed: number;
  totalAmountPaid: number;
  tickets: SaleTicket[];
}

// Refund request
export interface RefundTicketDTO {
  reason: string;
  refundedBy: string;
}

// Query parameters
export interface GetTicketsParams {
  startDate?: string;
  endDate?: string;
  soldBy?: string;
  paymentMethod?: "cash" | "transfer" | "credit";
  includeRefunded?: boolean;
  isCredit?: boolean;
  creditStatus?: "pending" | "partial" | "paid";
  page?: number;
  limit?: number;
  sortBy?: "date" | "totalAmount" | "amountOwed" | "dueDate";
  sortOrder?: "asc" | "desc";
}

export interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  includeRefunded?: boolean;
}

export interface SearchTicketsParams {
  q: string;
  page?: number;
  limit?: number;
}

export interface GetCreditTicketsParams {
  creditStatus?: "pending" | "partial" | "paid";
  customerPhone?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: "date" | "totalAmount" | "amountOwed" | "dueDate" | "customerName";
  sortOrder?: "asc" | "desc";
}

// ============================================
// Sales API
// ============================================

export const salesApi = createApi({
  reducerPath: "salesApi",
  baseQuery: baseQueryWithLogout,
  tagTypes: ["Sales", "Shop", "CreditSales", "Analytics"],
  endpoints: (builder) => ({
    
    // ============================================
    // Mutations (Create, Update, Delete)
    // ============================================

    /**
     * Create new sale ticket
     * POST /v1/sales
     */
    createSales: builder.mutation<BaseResponse<SaleTicket>, RecordSaleDto>({
      query: (body) => ({
        url: "/v1/sales",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sales", "Shop", "CreditSales", "Analytics"],
    }),

    /**
     * Record credit payment
     * POST /v1/sales/:shopId/:ticketId/payment
     */
    recordCredit: builder.mutation<
      BaseResponse<SaleTicket>,
      RecordCreditPaymentDTO & { shopId: string; ticketId: string }
    >({
      query: ({ shopId, ticketId, ...body }) => ({
        url: `/v1/sales/${shopId}/${ticketId}/payment`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sales", "Shop", "CreditSales", "Analytics"],
    }),

    /**
     * Update ticket (owner only)
     * PUT /v1/sales/:shopId/:ticketId
     */
    updateTicket: builder.mutation<
      BaseResponse<SaleTicket>,
      Partial<SaleTicket> & { shopId: string; ticketId: string }
    >({
      query: ({ shopId, ticketId, ...data }) => ({
        url: `/v1/sales/${shopId}/${ticketId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Sales", "Shop", "CreditSales"],
    }),

    /**
     * Refund ticket (owner only)
     * POST /v1/sales/:shopId/:ticketId/refund
     */
    refundTicket: builder.mutation<
      BaseResponse<SaleTicket>,
      RefundTicketDTO & { shopId: string; ticketId: string }
    >({
      query: ({ shopId, ticketId, ...body }) => ({
        url: `/v1/sales/${shopId}/${ticketId}/refund`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sales", "Shop", "Analytics"],
    }),

    /**
     * Delete ticket (owner only)
     * DELETE /v1/sales/:shopId/:ticketId
     */
    deleteTicket: builder.mutation<
      BaseResponse<void>,
      { shopId: string; ticketId: string }
    >({
      query: ({ shopId, ticketId }) => ({
        url: `/v1/sales/${shopId}/${ticketId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sales", "Shop", "CreditSales", "Analytics"],
    }),

    // ============================================
    // Queries (Read Operations)
    // ============================================

    /**
     * Get tickets list (summary view with filters)
     * GET /v1/sales/:shopId
     */
    getTicketList: builder.query<
      SalesResponse,
      { shopId: string } & GetTicketsParams
    >({
      query: ({ shopId, ...params }) => ({
        url: `/v1/sales/${shopId}`,
        method: "GET",
        params,
      }),
      providesTags: ["Sales"],
    }),

    /**
     * Get all items sold (individual item view)
     * GET /v1/sales/:shopId/items
     */
    getSalesItemsByShop: builder.query<
      SalesItemsResponse,
      { shopId: string } & GetTicketsParams
    >({
      query: ({ shopId, ...params }) => ({
        url: `/v1/sales/${shopId}/items`,
        method: "GET",
        params,
      }),
      providesTags: ["Sales"],
    }),

    /**
     * Get single ticket by ID
     * GET /v1/sales/:shopId/:ticketId
     */
    getSaleTicketById: builder.query<
      BaseResponse<SaleTicket>,
      { shopId: string; ticketId: string }
    >({
      query: ({ shopId, ticketId }) => ({
        url: `/v1/sales/${shopId}/${ticketId}`,
        method: "GET",
      }),
      providesTags: ["Sales"],
    }),

    /**
     * Get analytics
     * GET /v1/sales/:shopId/analytics
     */
    getAnalytics: builder.query<
      BaseResponse<SalesAnalytics>,
      { shopId: string } & AnalyticsParams
    >({
      query: ({ shopId, ...params }) => ({
        url: `/v1/sales/${shopId}/analytics`,
        method: "GET",
        params,
      }),
      providesTags: ["Analytics"],
    }),

    /**
     * Search tickets
     * GET /v1/sales/:shopId/search
     */
    searchTickets: builder.query<
      SalesResponse,
      { shopId: string } & SearchTicketsParams
    >({
      query: ({ shopId, ...params }) => ({
        url: `/v1/sales/${shopId}/search`,
        method: "GET",
        params,
      }),
      providesTags: ["Sales"],
    }),

    // ============================================
    // Credit Sales Queries
    // ============================================

    /**
     * Get all credit tickets
     * GET /v1/sales/:shopId/credit
     */
    getCreditTickets: builder.query<
      CreditResponse,
      { shopId: string } & GetCreditTicketsParams
    >({
      query: ({ shopId, ...params }) => ({
        url: `/v1/sales/${shopId}/credit`,
        method: "GET",
        params,
      }),
      providesTags: ["CreditSales"],
    }),

    /**
     * Get credit sales summary
     * GET /v1/sales/:shopId/credit/summary
     */
    getCreditSalesSummary: builder.query<
      BaseResponse<CreditSalesSummary>,
      string
    >({
      query: (shopId) => ({
        url: `/v1/sales/${shopId}/credit/summary`,
        method: "GET",
      }),
      providesTags: ["CreditSales"],
    }),

    /**
     * Get overdue credit tickets
     * GET /v1/sales/:shopId/credit/overdue
     */
    getOverdueCreditTickets: builder.query<SalesResponse, string>({
      query: (shopId) => ({
        url: `/v1/sales/${shopId}/credit/overdue`,
        method: "GET",
      }),
      providesTags: ["CreditSales"],
    }),

    /**
     * Get customer credit history
     * GET /v1/sales/:shopId/credit/customer/:customerPhone
     */
    getCustomerCreditHistory: builder.query<
      BaseResponse<CustomerCreditHistory>,
      { shopId: string; customerPhone: string }
    >({
      query: ({ shopId, customerPhone }) => ({
        url: `/v1/sales/${shopId}/credit/customer/${customerPhone}`,
        method: "GET",
      }),
      providesTags: ["CreditSales"],
    }),

    // ============================================
    // Legacy Endpoints (Deprecated - kept for compatibility)
    // ============================================

    /**
     * @deprecated Use getTicketList instead
     * GET /v1/sales/:shopId
     */
    getSalesByShop: builder.query<SalesResponse, string>({
      query: (shopId) => ({
        url: `/v1/sales/${shopId}`,
        method: "GET",
      }),
      providesTags: ["Sales"],
    }),

    /**
     * @deprecated Use getCreditTickets instead
     * GET /v1/sales/:shopId/credit?creditStatus=pending
     */
    getCreditsByShop: builder.query<SalesResponse, string>({
      query: (shopId) => ({
        url: `/v1/sales/${shopId}/credit?creditStatus=pending`,
        method: "GET",
      }),
      providesTags: ["CreditSales"],
    }),

    /**
     * @deprecated Use updateTicket instead
     */
    updateInventory: builder.mutation<
      BaseResponse<Sales>,
      Partial<Sales> & { shopId: string; salesId: string }
    >({
      query: ({ shopId, salesId, ...data }) => ({
        url: `/v1/sales/${shopId}/${salesId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Sales", "Shop"],
    }),

    /**
     * @deprecated Use getSaleTicketById instead
     */
    getSaleInShop: builder.query<
      BaseResponse<Sales>,
      { shopId: string; salesId: string }
    >({
      query: ({ shopId, salesId }) => ({
        url: `/v1/sales/${shopId}/${salesId}`,
        method: "GET",
      }),
      providesTags: ["Sales"],
    }),

    /**
     * @deprecated Use deleteTicket instead
     */
    deleteSales: builder.mutation<
      { success: boolean; message: string },
      { shopId: string; salesId: string }
    >({
      query: ({ shopId, salesId }) => ({
        url: `/v1/sales/${shopId}/${salesId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sales", "Shop"],
    }),
  }),
});

// ============================================
// Export Hooks
// ============================================

export const {
  // Mutations
  useCreateSalesMutation,
  useRecordCreditMutation,
  useUpdateTicketMutation,
  useRefundTicketMutation,
  useDeleteTicketMutation,
  
  // Queries
  useGetTicketListQuery,
  useGetSalesItemsByShopQuery,
  useGetSaleTicketByIdQuery,
  useGetAnalyticsQuery,
  useSearchTicketsQuery,
  
  // Credit Queries
  useGetCreditTicketsQuery,
  useGetCreditSalesSummaryQuery,
  useGetOverdueCreditTicketsQuery,
  useGetCustomerCreditHistoryQuery,
  
  // Legacy Hooks (Deprecated)
  useGetSalesByShopQuery,
  useGetCreditsByShopQuery,
  useUpdateInventoryMutation,
  useGetSaleInShopQuery,
  useDeleteSalesMutation,
} = salesApi;