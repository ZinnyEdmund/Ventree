// frontend/services/userApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  type BaseResponse,
  type ExpenseData,
  type ICreateExpense,
} from "../types/general";
import { baseQueryWithLogout } from "./baseQueryLogout";

export const expenseApi = createApi({
  reducerPath: "expenseApi",
  baseQuery: baseQueryWithLogout,
  tagTypes: ["Expenses"],
  endpoints: (builder) => ({
    fetchExpenses: builder.query<BaseResponse<ExpenseData[]>, string>({
      query: (shopId) => ({
        url: `/v1/expenses/${shopId}`,
        method: "GET",
      }),
      providesTags: ["Expenses"],
    }),

    getExpensesById: builder.query<BaseResponse<ExpenseData>, [string, string]>({
      query: ([shopId, expenseId]: [string, string]) => ({
        url: `/v1/expenses/${shopId}/${expenseId}`,
        method: "GET",
      }),
      providesTags: ["Expenses"],
    }),

    createExpenses: builder.mutation<
      BaseResponse<ExpenseData>,
      ICreateExpense
    >({
      query: (data) => ({
        url: `/v1/expenses/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Expenses"],
    }),

    updateExpenses: builder.mutation<
      BaseResponse<ICreateExpense>,
      Partial<ExpenseData> & { shopId: string; expenseId: string }
    >({
      query: ({ shopId, expenseId, ...data }) => ({
        url: `/v1/expenses/${shopId}/${expenseId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Expenses"],
    }),

    deleteExpenses: builder.mutation<
      { success: boolean; message: string },
      { shopId: string; expenseId: string }
    >({
      query: ({ shopId, expenseId }) => ({
        url: `/v1/expenses/${shopId}/${expenseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expenses"],
    }),
  }),
});

export const { 
    useCreateExpensesMutation,
    useFetchExpensesQuery,
    useDeleteExpensesMutation,
    useGetExpensesByIdQuery,
    useUpdateExpensesMutation,
 } = expenseApi;
