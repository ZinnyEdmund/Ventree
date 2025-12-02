// services/inventory.service.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithLogout } from "./baseQueryLogout";
import type {
  BaseResponse,
  Stocks,
  InventoryData,
  InventoryAnalytics,
  CategoryData,
  StockMovementsData,
  ExpiringItem,
  GetInventoryParams,
  GetExpiringItemsParams,
  GetStockMovementsParams,
  CreateInventoryParams,
  UpdateInventoryParams,
  DeleteInventoryParams,
  RestockInventoryParams,
  AdjustStockParams,
} from "../types/inventory";

export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  baseQuery: baseQueryWithLogout,
  tagTypes: ["Inventory", "Analytics", "Categories", "StockMovements"],
  endpoints: (builder) => ({
    // ========================================================================
    // QUERIES (GET Requests)
    // ========================================================================

    /**
     * Get paginated inventory list with filters
     */
    getInventoryList: builder.query<BaseResponse<InventoryData>, GetInventoryParams>({
      query: ({ shopId, ...params }) => ({
        url: `/v1/inventory/${shopId}/items`,
        method: "GET",
        params,
      }),
      providesTags: (_result) =>
        _result?.data?.items
          ? [
              ..._result.data.items.map(({ _id }: { _id: string }) => ({
                type: "Inventory" as const,
                id: _id,
              })),
              { type: "Inventory", id: "LIST" },
            ]
          : [{ type: "Inventory", id: "LIST" }],
    }),

    /**
     * Get single inventory item by ID
     */
    getInventoryById: builder.query<BaseResponse<Stocks>, { shopId: string; itemId: string }>({
      query: ({ shopId, itemId }) => ({
        url: `/v1/inventory/${shopId}/items/${itemId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { itemId }) => [{ type: "Inventory", id: itemId }],
    }),

    /**
     * Get inventory analytics
     */
    getInventoryAnalytics: builder.query<BaseResponse<InventoryAnalytics>, string>({
      query: (shopId) => ({
        url: `/v1/inventory/${shopId}/analytics`,
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),

    /**
     * Get all categories with item counts
     */
    getCategories: builder.query<BaseResponse<CategoryData>, string>({
      query: (shopId) => ({
        url: `/v1/inventory/${shopId}/categories`,
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),

    /**
     * Get low stock items
     */
    getLowStockItems: builder.query<BaseResponse<InventoryData>, string>({
      query: (shopId) => ({
        url: `/v1/inventory/${shopId}/low-stock`,
        method: "GET",
      }),
      providesTags: [{ type: "Inventory", id: "LOW-STOCK" }],
    }),

    /**
     * Get out of stock items
     */
    getOutOfStockItems: builder.query<BaseResponse<InventoryData>, string>({
      query: (shopId) => ({
        url: `/v1/inventory/${shopId}/out-of-stock`,
        method: "GET",
      }),
      providesTags: [{ type: "Inventory", id: "OUT-OF-STOCK" }],
    }),

    /**
     * Get expiring items
     */
    getExpiringItems: builder.query<BaseResponse<{ items: ExpiringItem[] }>, GetExpiringItemsParams>({
      query: ({ shopId, days }) => ({
        url: `/v1/inventory/${shopId}/expiring`,
        method: "GET",
        params: { days },
      }),
      providesTags: [{ type: "Inventory", id: "EXPIRING" }],
    }),

    /**
     * Get stock movements for an item
     */
    getStockMovements: builder.query<BaseResponse<StockMovementsData>, GetStockMovementsParams>({
      query: ({ shopId, itemId, ...params }) => ({
        url: `/v1/inventory/${shopId}/items/${itemId}/movements`,
        method: "GET",
        params,
      }),
      providesTags: (_result, _error, { itemId }) => [
        { type: "StockMovements", id: itemId },
      ],
    }),

    // ========================================================================
    // MUTATIONS (POST, PUT, DELETE Requests)
    // ========================================================================

    /**
     * Create new inventory item
     */
    createInventory: builder.mutation<BaseResponse<Stocks>, CreateInventoryParams>({
      query: ({ shopId, ...data }) => ({
        url: `/v1/inventory/${shopId}/items`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Inventory", id: "LIST" },
        "Analytics",
        "Categories",
      ],
    }),

    /**
     * Update inventory item
     */
    updateInventory: builder.mutation<BaseResponse<Stocks>, UpdateInventoryParams>({
      query: ({ shopId, itemId, ...data }) => ({
        url: `/v1/inventory/${shopId}/items/${itemId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { itemId }) => [
        { type: "Inventory", id: itemId },
        { type: "Inventory", id: "LIST" },
        "Analytics",
        "Categories",
      ],
    }),

    /**
     * Delete inventory item
     */
    deleteInventory: builder.mutation<BaseResponse<{ success: boolean }>, DeleteInventoryParams>({
      query: ({ shopId, itemId }) => ({
        url: `/v1/inventory/${shopId}/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { itemId }) => [
        { type: "Inventory", id: itemId },
        { type: "Inventory", id: "LIST" },
        "Analytics",
        "Categories",
      ],
    }),

    /**
     * Restock inventory item
     */
    restockInventory: builder.mutation<BaseResponse<Stocks>, RestockInventoryParams>({
      query: ({ shopId, itemId, ...data }) => ({
        url: `/v1/inventory/${shopId}/items/${itemId}/restock`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { itemId }) => [
        { type: "Inventory", id: itemId },
        { type: "Inventory", id: "LIST" },
        { type: "Inventory", id: "LOW-STOCK" },
        { type: "Inventory", id: "OUT-OF-STOCK" },
        { type: "StockMovements", id: itemId },
        "Analytics",
      ],
    }),

    /**
     * Adjust stock (damage, loss, etc.)
     */
    adjustStock: builder.mutation<BaseResponse<Stocks>, AdjustStockParams>({
      query: ({ shopId, itemId, ...data }) => ({
        url: `/v1/inventory/${shopId}/items/${itemId}/adjust`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { itemId }) => [
        { type: "Inventory", id: itemId },
        { type: "Inventory", id: "LIST" },
        { type: "Inventory", id: "LOW-STOCK" },
        { type: "Inventory", id: "OUT-OF-STOCK" },
        { type: "StockMovements", id: itemId },
        "Analytics",
      ],
    }),
  }),
});

// ============================================================================
// Export Hooks
// ============================================================================

export const {
  // Queries
  useGetInventoryListQuery,
  useGetInventoryByIdQuery,
  useGetInventoryAnalyticsQuery,
  useGetCategoriesQuery,
  useGetLowStockItemsQuery,
  useGetOutOfStockItemsQuery,
  useGetExpiringItemsQuery,
  useGetStockMovementsQuery,

  // Mutations
  useCreateInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
  useRestockInventoryMutation,
  useAdjustStockMutation,

  // Lazy Queries (for manual triggering)
  useLazyGetInventoryListQuery,
  useLazyGetInventoryByIdQuery,
  useLazyGetInventoryAnalyticsQuery,
  useLazyGetCategoriesQuery,
  useLazyGetLowStockItemsQuery,
  useLazyGetOutOfStockItemsQuery,
  useLazyGetExpiringItemsQuery,
  useLazyGetStockMovementsQuery,
} = inventoryApi;

// ============================================================================
// Utility Selectors (Optional - for advanced usage)
// ============================================================================

/**
 * Select inventory list from cache
 */
export const selectInventoryList = (shopId: string, params: Partial<GetInventoryParams> = {}) =>
  inventoryApi.endpoints.getInventoryList.select({ shopId, ...params });

/**
 * Select single item from cache
 */
export const selectInventoryItem = (shopId: string, itemId: string) =>
  inventoryApi.endpoints.getInventoryById.select({ shopId, itemId });

/**
 * Select analytics from cache
 */
export const selectInventoryAnalytics = (shopId: string) =>
  inventoryApi.endpoints.getInventoryAnalytics.select(shopId);