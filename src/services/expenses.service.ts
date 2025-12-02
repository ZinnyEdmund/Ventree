// ============================================
// services/expense.service.ts - Optimized Expense Service
// ============================================
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithLogout } from "./baseQueryLogout";
import type {
  BaseResponse,
  ExpenseData,
  ICreateExpense,
  IUpdateExpense,
  PaginatedExpenseResponse,
  GetExpensesParams,
  GetFilteredExpensesParams,
  FilteredExpensesResponse,
  TotalExpensesResponse,
} from "../types/expense";

export const expenseApi = createApi({
  reducerPath: "expenseApi",
  baseQuery: baseQueryWithLogout,
  tagTypes: ["Expenses", "ExpenseStats", 'Shop'],
  endpoints: (builder) => ({
    // ============================================
    // QUERIES (Read Operations)
    // ============================================

    /**
     * Get expenses with pagination and filters
     * 
     * @example
     * const { data } = useGetExpensesQuery({
     *   shopId: "123",
     *   page: 1,
     *   limit: 20,
     *   category: "Utilities",
     *   search: "electricity"
     * });
     */
    getExpenses: builder.query<
      PaginatedExpenseResponse,
      GetExpensesParams
    >({
      query: ({ shopId, ...params }) => {
        const queryParams = new URLSearchParams();

        // Add pagination
        if (params.page) queryParams.append("page", String(params.page));
        if (params.limit) queryParams.append("limit", String(params.limit));

        // Add filters
        if (params.category) queryParams.append("category", params.category);
        if (params.startDate) queryParams.append("startDate", params.startDate);
        if (params.endDate) queryParams.append("endDate", params.endDate);
        if (params.minAmount !== undefined) queryParams.append("minAmount", String(params.minAmount));
        if (params.maxAmount !== undefined) queryParams.append("maxAmount", String(params.maxAmount));
        if (params.search) queryParams.append("search", params.search);

        // Add sorting
        if (params.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

        return {
          url: `/v1/expenses/${shopId}?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }: { _id: string }) => ({
                type: "Expenses" as const,
                id: _id,
              })),
              { type: "Expenses", id: "LIST" },
            ]
          : [{ type: "Expenses", id: "LIST" }],
    }),

    /**
     * Get single expense by ID
     * 
     * @example
     * const { data } = useGetExpenseByIdQuery({
     *   shopId: "123",
     *   expenseId: "456"
     * });
     */
    getExpenseById: builder.query<
      BaseResponse<ExpenseData>,
      { shopId: string; expenseId: string }
    >({
      query: ({ shopId, expenseId }) => ({
        url: `/v1/expenses/${shopId}/${expenseId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { expenseId }) => [
        { type: "Expenses", id: expenseId },
      ],
    }),

    /**
     * Get filtered expenses (today, week, month)
     * 
     * @example
     * const { data } = useGetFilteredExpensesQuery({
     *   shopId: "123",
     *   filter: "week"
     * });
     */
    getFilteredExpenses: builder.query<
      BaseResponse<FilteredExpensesResponse>,
      GetFilteredExpensesParams
    >({
      query: ({ shopId, filter }) => ({
        url: `/v1/expenses/${shopId}/filter?filter=${filter}`,
        method: "GET",
      }),
      providesTags: [{ type: "ExpenseStats", id: "FILTERED" }],
    }),

    /**
     * Get total expenses (today, week, month, total)
     * 
     * @example
     * const { data } = useGetTotalExpensesQuery("123");
     */
    getTotalExpenses: builder.query<
      BaseResponse<TotalExpensesResponse>,
      string
    >({
      query: (shopId) => ({
        url: `/v1/expenses/${shopId}/total`,
        method: "GET",
      }),
      providesTags: [{ type: "ExpenseStats", id: "TOTALS" }],
    }),

    // ============================================
    // MUTATIONS (Write Operations)
    // ============================================

    /**
     * Create new expense
     * 
     * @example
     * const [createExpense] = useCreateExpenseMutation();
     * await createExpense({
     *   shopId: "123",
     *   title: "Electricity Bill",
     *   amount: 5000,
     *   category: "Utilities"
     * });
     */
    createExpense: builder.mutation<
      BaseResponse<ExpenseData>,
      ICreateExpense
    >({
      query: (data) => ({
        url: `/v1/expenses/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Expenses", id: "LIST" },
        { type: "ExpenseStats", id: "FILTERED" },
        { type: "ExpenseStats", id: "TOTALS" },
        'Shop',
      ],
    }),

    /**
     * Update expense
     * 
     * @example
     * const [updateExpense] = useUpdateExpenseMutation();
     * await updateExpense({
     *   shopId: "123",
     *   expenseId: "456",
     *   title: "Updated Title",
     *   amount: 6000
     * });
     */
    updateExpense: builder.mutation<
      BaseResponse<ExpenseData>,
      {
        shopId: string;
        expenseId: string;
      } & IUpdateExpense
    >({
      query: ({ shopId, expenseId, ...data }) => ({
        url: `/v1/expenses/${shopId}/${expenseId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { expenseId }) => [
        { type: "Expenses", id: expenseId },
        { type: "Expenses", id: "LIST" },
        { type: "ExpenseStats", id: "FILTERED" },
        { type: "ExpenseStats", id: "TOTALS" },
        'Shop',
      ],
    }),

    /**
     * Delete expense
     * 
     * @example
     * const [deleteExpense] = useDeleteExpenseMutation();
     * await deleteExpense({
     *   shopId: "123",
     *   expenseId: "456"
     * });
     */
    deleteExpense: builder.mutation<
      BaseResponse<{ message: string }>,
      { shopId: string; expenseId: string }
    >({
      query: ({ shopId, expenseId }) => ({
        url: `/v1/expenses/${shopId}/${expenseId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { expenseId }) => [
        { type: "Expenses", id: expenseId },
        { type: "Expenses", id: "LIST" },
        { type: "ExpenseStats", id: "FILTERED" },
        { type: "ExpenseStats", id: "TOTALS" },
        'Shop', 
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetExpensesQuery,
  useGetExpenseByIdQuery,
  useGetFilteredExpensesQuery,
  useGetTotalExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  // Lazy queries
  useLazyGetExpensesQuery,
  useLazyGetExpenseByIdQuery,
  useLazyGetFilteredExpensesQuery,
  useLazyGetTotalExpensesQuery,
} = expenseApi;