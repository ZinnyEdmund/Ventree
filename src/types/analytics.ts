// ============================================
// analytics.types.ts - TypeScript Types for Analytics
// ============================================

// ============================================
// Base Response Type
// ============================================
export interface BaseResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// ============================================
// Dashboard Overview Types
// ============================================
export interface DashboardMetrics {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  totalSales: number;
  averageOrderValue: number;
  profitMargin: number;
  revenueGrowth?: number;
  salesGrowth?: number;
}

export interface DashboardOverviewResponse {
  metrics: DashboardMetrics;
  period: 'daily' | 'weekly' | 'monthly';
  updatedAt: string;
}

// ============================================
// Sales Trend Types
// ============================================
export interface SalesTrendDataPoint {
  date: string;
  revenue: number;
  sales: number;
  profit?: number;
  refunded?: number;
}

export interface SalesTrendResponse {
  data: SalesTrendDataPoint[];
  summary: {
    totalRevenue: number;
    totalSales: number;
    averageDaily: number;
  };
  period: {
    startDate: string;
    endDate: string;
    days: number;
  };
}

export interface GetSalesTrendParams {
  shopId: string;
  days?: number; // 1-90
  includeRefunded?: boolean;
}

// ============================================
// Best Sellers Types
// ============================================
export interface BestSellerItem {
  itemId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
  contribution: number;
}

export interface BestSellersResponse {
  data: BestSellerItem[];
  period: {
    startDate: string;
    endDate: string;
  };
  total: number;
}

export interface GetBestSellersParams {
  shopId: string;
  limit?: number; // 1-50
  startDate?: string; // ISO8601
  endDate?: string; // ISO8601
}

// ============================================
// Low Stock Alerts Types
// ============================================
export interface LowStockItem {
  itemId: string;
  productName: string;
  currentStock: number;
  reorderLevel: number;
  status: "Critical" | "Low";
  unit: string;
}

export interface LowStockAlertsResponse {
  data: LowStockItem[];
  summary: {
    critical: number;
    low: number;
    total: number;
  };
  message: string,
  success: string,
}

// ============================================
// Expenses Breakdown Types
// ============================================
export interface ExpenseCategoryBreakdown {
  category: string;
  percentage: number;
  total: number;
}

export interface ExpensesBreakdownResponse {
  data: ExpenseCategoryBreakdown[];
  summary: {
    totalExpenses: number;
    totalCategories: number;
    averageExpenseAmount: number;
  };
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface GetExpensesBreakdownParams {
  shopId: string;
  startDate?: string; // ISO8601
  endDate?: string; // ISO8601
}

// ============================================
// Profit Summary Types
// ============================================
export interface ProfitPeriodData {
  label: string;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  revenue: number;
  expenses: number;
  cogs: number;
  profit: number;
}

export interface ProfitSummaryResponse {
  data: ProfitPeriodData[];
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    totalProfit: number;
    averageProfitMargin: number;
  };
  period: 'daily' | 'weekly' | 'monthly';
  periods: number;
}

export interface GetProfitSummaryParams {
  shopId: string;
  period?: 'daily' | 'weekly' | 'monthly';
  periods?: number; // 1-365
}

// ============================================
// Export Types (CSV Downloads)
// ============================================
export interface ExportResponse {
  success: boolean;
  message: string;
  downloadUrl?: string;
  filename?: string;
}

// Note: Export endpoints return CSV files directly as blob/stream
// They don't return JSON, so we'll handle them differently in the service