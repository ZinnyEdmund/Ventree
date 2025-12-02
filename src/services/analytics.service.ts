// ============================================
// analytics.service.ts - RTK Query Service for Analytics
// ============================================
import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  DashboardOverviewResponse,
  SalesTrendResponse,
  GetSalesTrendParams,
  BestSellersResponse,
  GetBestSellersParams,
  LowStockAlertsResponse,
  ExpensesBreakdownResponse,
  GetExpensesBreakdownParams,
  ProfitSummaryResponse,
  GetProfitSummaryParams,
} from '../types/analytics';
import { baseQueryWithLogout } from './baseQueryLogout';


export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: baseQueryWithLogout,
  tagTypes: ['Analytics', 'Dashboard', 'Sales', 'Inventory', 'Expenses', 'Profit'],
  endpoints: (builder) => ({
    
    // ============================================
    // 1. Dashboard Overview
    // ============================================
    getDashboardOverview: builder.query<
      DashboardOverviewResponse,
      string
    >({
      query: (shopId) => `/v1/analytics/${shopId}/dashboard`,
      providesTags: (_result, _error, shopId) => [
        { type: 'Dashboard', id: shopId },
        { type: 'Analytics', id: 'DASHBOARD' },
      ],
    }),

    // ============================================
    // 2. Sales Trend
    // ============================================
    getSalesTrend: builder.query<
      SalesTrendResponse,
      GetSalesTrendParams
    >({
      query: ({ shopId, ...params }) => {
        const searchParams = new URLSearchParams();
        
        if (params.days) searchParams.append('days', params.days.toString());
        if (params.includeRefunded !== undefined) {
          searchParams.append('includeRefunded', params.includeRefunded.toString());
        }

        const queryString = searchParams.toString();
        return `/v1/analytics/${shopId}/sales-trend${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (_result, _error, { shopId }) => [
        { type: 'Analytics', id: 'SALES_TREND' },
        { type: 'Sales', id: shopId },
      ],
    }),

    // ============================================
    // 3. Export Sales Trend (CSV Download)
    // ============================================
    exportSalesTrend: builder.mutation<Blob, GetSalesTrendParams>({
      query: ({ shopId, ...params }) => {
        const searchParams = new URLSearchParams();
        
        if (params.days) searchParams.append('days', params.days.toString());
        if (params.includeRefunded !== undefined) {
          searchParams.append('includeRefunded', params.includeRefunded.toString());
        }

        const queryString = searchParams.toString();
        return {
          url: `/v1/analytics/${shopId}/sales-trend/export${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
          responseHandler: (response) => response.blob(),
        };
      },
    }),

    // ============================================
    // 4. Best Sellers
    // ============================================
    getBestSellers: builder.query<
      BestSellersResponse,
      GetBestSellersParams
    >({
      query: ({ shopId, ...params }) => {
        const searchParams = new URLSearchParams();
        
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);

        const queryString = searchParams.toString();
        return `/v1/analytics/${shopId}/best-sellers${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (_result, _error, { shopId }) => [
        { type: 'Analytics', id: 'BEST_SELLERS' },
        { type: 'Sales', id: shopId },
        { type: 'Inventory', id: shopId },
      ],
    }),

    // ============================================
    // 5. Export Best Sellers (CSV Download)
    // ============================================
    exportBestSellers: builder.mutation<Blob, GetBestSellersParams>({
      query: ({ shopId, ...params }) => {
        const searchParams = new URLSearchParams();
        
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);

        const queryString = searchParams.toString();
        return {
          url: `/v1/analytics/${shopId}/best-sellers/export${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
          responseHandler: (response) => response.blob(),
        };
      },
    }),

    // ============================================
    // 6. Low Stock Alerts
    // ============================================
    getLowStockAlerts: builder.query<
      LowStockAlertsResponse,
      string
    >({
      query: (shopId) => `/v1/analytics/${shopId}/low-stock-alerts`,
      providesTags: (_result, _error, shopId) => [
        { type: 'Analytics', id: 'LOW_STOCK' },
        { type: 'Inventory', id: shopId },
      ],
    }),

    // ============================================
    // 7. Expenses Breakdown
    // ============================================
    getExpensesBreakdown: builder.query<
      ExpensesBreakdownResponse,
      GetExpensesBreakdownParams
    >({
      query: ({ shopId, ...params }) => {
        const searchParams = new URLSearchParams();
        
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);

        const queryString = searchParams.toString();
        return `/v1/analytics/${shopId}/expenses-breakdown${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (_result, _error, { shopId }) => [
        { type: 'Analytics', id: 'EXPENSES_BREAKDOWN' },
        { type: 'Expenses', id: shopId },
      ],
    }),

    // ============================================
    // 8. Profit Summary
    // ============================================
    getProfitSummary: builder.query<
      ProfitSummaryResponse,
      GetProfitSummaryParams
    >({
      query: ({ shopId, ...params }) => {
        const searchParams = new URLSearchParams();
        
        if (params.period) searchParams.append('period', params.period);
        if (params.periods) searchParams.append('periods', params.periods.toString());

        const queryString = searchParams.toString();
        return `/v1/analytics/${shopId}/profit-summary${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (_result, _error, { shopId }) => [
        { type: 'Analytics', id: 'PROFIT_SUMMARY' },
        { type: 'Profit', id: shopId },
        { type: 'Sales', id: shopId },
        { type: 'Expenses', id: shopId },
      ],
    }),

    // ============================================
    // 9. Export Profit Summary (CSV Download)
    // ============================================
    exportProfitSummary: builder.mutation<Blob, GetProfitSummaryParams>({
      query: ({ shopId, ...params }) => {
        const searchParams = new URLSearchParams();
        
        if (params.period) searchParams.append('period', params.period);
        if (params.periods) searchParams.append('periods', params.periods.toString());

        const queryString = searchParams.toString();
        return {
          url: `/v1/analytics/${shopId}/profit-summary/export${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
          responseHandler: (response) => response.blob(),
        };
      },
    }),
  }),
});

// ============================================
// Export Hooks
// ============================================
export const {
  // Queries
  useGetDashboardOverviewQuery,
  useLazyGetDashboardOverviewQuery,
  useGetSalesTrendQuery,
  useLazyGetSalesTrendQuery,
  useGetBestSellersQuery,
  useLazyGetBestSellersQuery,
  useGetLowStockAlertsQuery,
  useLazyGetLowStockAlertsQuery,
  useGetExpensesBreakdownQuery,
  useLazyGetExpensesBreakdownQuery,
  useGetProfitSummaryQuery,
  useLazyGetProfitSummaryQuery,
  
  // Mutations (CSV Exports)
  useExportSalesTrendMutation,
  useExportBestSellersMutation,
  useExportProfitSummaryMutation,
} = analyticsApi;