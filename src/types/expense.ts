// ============================================
// types/expense.types.ts - Complete Expense Types
// ============================================

// --- Base Expense Model
export interface ExpenseData {
  _id: string;
  shopId: string;
  title: string;
  date: string; // ISO Date string
  category: string;
  amount: number;
  notes: string;
  uploader: string;
  createdByRole?: "owner" | "manager";
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  __v: number;
}

// --- Create Expense DTO
export interface ICreateExpense {
  shopId: string;
  staffId?: string; // optional - not needed for owner
  category: string;
  amount: number;
  title: string;
  notes?: string;
}

// --- Update Expense DTO
export interface IUpdateExpense {
  title?: string;
  category?: string;
  amount?: number;
  notes?: string;
}

// --- Paginated Response
export interface PaginatedExpenseResponse {
    success: boolean
  data: ExpenseData[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

// --- Query Parameters for GET Expenses
export interface GetExpensesParams {
  shopId: string;
  // Pagination
  page?: number;
  limit?: number;
  // Filters
  category?: string;
  startDate?: string; // ISO date
  endDate?: string; // ISO date
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  // Sorting
  sortBy?: "createdAt" | "amount" | "title";
  sortOrder?: "asc" | "desc";
}

// --- Filtered Expenses (today, week, month)
export interface GetFilteredExpensesParams {
  shopId: string;
  filter: "today" | "week" | "month";
}

export interface FilteredExpensesResponse {
  expenses: ExpenseData[];
  total: number;
}

// --- Total Expenses
export interface TotalExpensesResponse {
  today: number;
  week: number;
  month: number;
  total: number;
}

// --- Base Response (keep your existing one or use this)
export interface BaseResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}