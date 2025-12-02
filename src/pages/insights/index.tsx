// // ============================================
// // BusinessInsightsPage.tsx - Main Page
// // ============================================
// import { StatCard } from "../home/components/StatCard";
// import {
//   bestSellers,
//   expensesData,
//   lowStockAlerts,
//   profitTrendData,
//   salesTrendData,
// } from "../../lib/dummyData";
// import { SalesTrendChart } from "./components/SalesTrendChart";
// import { BestSellersTable } from "./components/BestSellersTable";
// import { LowStockAlert } from "./components/LowStockAlert";
// import { ExpensesReport } from "./components/ExpensesReport";
// import { NetProfitTrend } from "./components/NetProfitTrend";
// import { usePersistentDashboard } from "../../hooks/usePersistentDashboard";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../state/store";
// import { RefreshCw } from "lucide-react";
// import { TimePeriod } from "../../types/general";

// export const BusinessInsightsPage = () => {
//   const { user } = useSelector((state: RootState) => state.auth);


//   // Fetch dashboard data with selected period
//   const {
//     data: dashboardData,
//     isFetching,
//     refetch,
//   } = usePersistentDashboard(user?.shopId || "", TimePeriod.WEEKLY);

//   // Format currency
//   const formatCurrency = (amount: number) => {
//     return `₦${amount.toLocaleString()}`;
//   };

//   // Extract dashboard stats
//   const dashboard = dashboardData?.data?.dashboard;

//   // Build stats array from API data or show loading/default
//   const lowStockCount = dashboard
//     ? typeof dashboard.lowStockItems === "number"
//       ? dashboard.lowStockItems
//       : dashboard.lowStockItems?.count ?? 0
//     : 0;

//   // Build stats array from API data or show loading/default
//   const stats = dashboard
//     ? [
//         {
//           title: "Sales",
//           Icon: "ic:outline-monetization-on",
//           value: formatCurrency(dashboard.sales),
//           description: "What you have sold",
//         },
//         {
//           title: "Expenses",
//           Icon: "ic:outline-monetization-on",
//           value: formatCurrency(dashboard.expenses),
//           description: "What you spent",
//         },
//         {
//           title: "Low Stock",
//           Icon: "ic:outline-trending-down",
//           value: `${lowStockCount} Item${lowStockCount === 1 ? "" : "s"}`,
//           description: "Almost Finished",
//           variant: "warning" as const,
//         },
//         {
//           title: "Profit",
//           Icon: "ic:outline-trending-up",
//           value: formatCurrency(dashboard.profit),
//           description: "How much you made",
//           variant: "success" as const,
//         },
//       ]
//     : [
//         {
//           title: "Sales",
//           Icon: "ic:outline-monetization-on",
//           value: "₦0",
//           description: "What you have sold",
//         },
//         {
//           title: "Expenses",
//           Icon: "ic:outline-monetization-on",
//           value: "₦0",
//           description: "What you spent",
//         },
//         {
//           title: "Low Stock",
//           Icon: "ic:outline-trending-down",
//           value: "0 Items",
//           description: "Almost Finished",
//           variant: "warning" as const,
//         },
//         {
//           title: "Profit",
//           Icon: "ic:outline-trending-up",
//           value: "₦0",
//           description: "How much you made",
//           variant: "success" as const,
//         },
//       ];

//   return (
//     <section className="py-6">
//       {/* Header */}
//       <article className="mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="h5 md:text-2xl  font-semibold text-secondary">
//             Overview
//           </h1>

//           {/* Refresh Button - Desktop */}
//           <button
//             onClick={() => refetch()}
//             disabled={isFetching}
//             className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             title="Refresh dashboard"
//           >
//             <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
//             <span>Refresh</span>
//           </button>
//         </div>
//       </article>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         {stats.map((stat, index) => (
//           <StatCard
//             key={index}
//             icon={stat.Icon}
//             title={stat.title}
//             value={stat.value}
//             description={stat.description}
//             variant={stat.variant}
//           />
//         ))}
//       </div>

//       {/* Sales Trend Chart */}
//       <SalesTrendChart data={salesTrendData} />

//       {/* Best Sellers Table */}
//       <BestSellersTable data={bestSellers} />

//       {/* Low Stock Alert */}
//       <LowStockAlert data={lowStockAlerts} />

//       {/* Expense Pie Chart */}
//       <ExpensesReport data={expensesData} />

//       {/* Net Profit Trend */}
//       <NetProfitTrend data={profitTrendData} />
//     </section>
//   );
// };


// ============================================
// BusinessInsightsPage.tsx - OPTIMIZED with Analytics
// ============================================
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import { RefreshCw } from "lucide-react";
import { TimePeriod } from "../../types/general";

// Components
import { StatCard } from "../home/components/StatCard";
import { SalesTrendChart } from "./components/SalesTrendChart";
import { BestSellersTable } from "./components/BestSellersTable";
import { LowStockAlert } from "./components/LowStockAlert";
import { ExpensesReport } from "./components/ExpensesReport";
import { NetProfitTrend } from "./components/NetProfitTrend";

// Hooks
import { usePersistentDashboard } from "../../hooks/usePersistentDashboard";

// Analytics Service - NEW!
import {
  useGetSalesTrendQuery,
  useGetBestSellersQuery,
  useGetLowStockAlertsQuery,
  useGetExpensesBreakdownQuery,
  useGetProfitSummaryQuery,
} from "../../services/analytics.service";

export const BusinessInsightsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const shopId = user?.shopId || "";

  // State for analytics filters
  const [days] = useState(7);
  const [limit] = useState(5);

  // Dashboard data (for stats cards)
  const {
    data: dashboardData,
    isFetching,
    refetch: refetchDashboard,
  } = usePersistentDashboard(shopId, TimePeriod.WEEKLY);

  // ============================================
  // Analytics Queries - NEW!
  // ============================================
  
  // 1. Sales Trend
  const {
    data: salesTrendData,
    isLoading: isLoadingSales,
    isError: isErrorSales,
    error: salesError,
    refetch: refetchSales,
  } = useGetSalesTrendQuery({ shopId, days }, { skip: !shopId });

  // 2. Best Sellers
  const {
    data: bestSellersData,
    isLoading: isLoadingBestSellers,
    isError: isErrorBestSellers,
    error: bestSellersError,
    refetch: refetchBestSellers,
  } = useGetBestSellersQuery({ shopId, limit }, { skip: !shopId });

  // 3. Low Stock Alerts
  const {
    data: lowStockData,
    isLoading: isLoadingStock,
    isError: isErrorStock,
    error: stockError,
    refetch: refetchStock,
  } = useGetLowStockAlertsQuery(shopId, {
    skip: !shopId,
    pollingInterval: 60000, // Poll every minute
  });

  // 4. Expenses Breakdown
  const {
    data: expensesData,
    isLoading: isLoadingExpenses,
    isError: isErrorExpenses,
    error: expensesError,
    refetch: refetchExpenses,
  } = useGetExpensesBreakdownQuery({ shopId }, { skip: !shopId });


  // 5. Profit Summary
  const {
    data: profitData,
    isLoading: isLoadingProfit,
    isError: isErrorProfit,
    error: profitError,
    refetch: refetchProfit,
  } = useGetProfitSummaryQuery(
    {
      shopId,
      period: "weekly",
      periods: 1,
    },
    { skip: !shopId }
  );
  console.log(profitData)

  // ============================================
  // Helper Functions
  // ============================================
  
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const handleRefreshAll = () => {
    refetchDashboard();
    refetchSales();
    refetchBestSellers();
    refetchStock();
    refetchExpenses();
    refetchProfit();
  };

  // ============================================
  // Stats Cards Data
  // ============================================
  
  const dashboard = dashboardData?.data?.dashboard;

  const lowStockCount = dashboard
    ? typeof dashboard.lowStockItems === "number"
      ? dashboard.lowStockItems
      : dashboard.lowStockItems?.count ?? 0
    : 0;

  const stats = dashboard
    ? [
        {
          title: "Sales",
          Icon: "ic:outline-monetization-on",
          value: formatCurrency(dashboard.sales),
          description: "What you have sold",
        },
        {
          title: "Expenses",
          Icon: "ic:outline-monetization-on",
          value: formatCurrency(dashboard.expenses),
          description: "What you spent",
        },
        {
          title: "Low Stock",
          Icon: "ic:outline-trending-down",
          value: `${lowStockCount} Item${lowStockCount === 1 ? "" : "s"}`,
          description: "Almost Finished",
          variant: "warning" as const,
        },
        {
          title: "Profit",
          Icon: "ic:outline-trending-up",
          value: formatCurrency(dashboard.profit),
          description: "How much you made",
          variant: "success" as const,
        },
      ]
    : [
        {
          title: "Sales",
          Icon: "ic:outline-monetization-on",
          value: "₦0",
          description: "What you have sold",
        },
        {
          title: "Expenses",
          Icon: "ic:outline-monetization-on",
          value: "₦0",
          description: "What you spent",
        },
        {
          title: "Low Stock",
          Icon: "ic:outline-trending-down",
          value: "0 Items",
          description: "Almost Finished",
          variant: "warning" as const,
        },
        {
          title: "Profit",
          Icon: "ic:outline-trending-up",
          value: "₦0",
          description: "How much you made",
          variant: "success" as const,
        },
      ];

  return (
    <section className="py-6">
      {/* Header */}
      <article className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="h5 md:text-2xl font-semibold text-secondary">
            Business Insights
          </h1>

          {/* Refresh Button */}
          <button
            onClick={handleRefreshAll}
            disabled={isFetching}
            className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh all data"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </article>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.Icon}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            variant={stat.variant}
          />
        ))}
      </div>

      {/* Sales Trend Chart - WITH ANALYTICS */}
      <SalesTrendChart
        data={salesTrendData?.data || []}
        shopId={shopId}
        days={days}
        isLoading={isLoadingSales}
        isError={isErrorSales}
        error={salesError}
        onRetry={refetchSales}
        period={`Last ${days} days`}
      />

      {/* Best Sellers Table - WITH ANALYTICS */}
      <BestSellersTable
        data={bestSellersData?.data || []}
        shopId={shopId}
        limit={limit}
        isLoading={isLoadingBestSellers}
        isError={isErrorBestSellers}
        error={bestSellersError}
        onRetry={refetchBestSellers}
      />

      {/* Low Stock Alert - WITH ANALYTICS */}
      <LowStockAlert
        data={lowStockData?.data || []}
        isLoading={isLoadingStock}
        isError={isErrorStock}
        error={stockError}
        onRetry={refetchStock}
      />

      {/* Expenses Report - WITH ANALYTICS */}
      <ExpensesReport
        data={expensesData?.data || []}
        isLoading={isLoadingExpenses}
        isError={isErrorExpenses}
        error={expensesError}
        onRetry={refetchExpenses}
      />

      {/* Net Profit Trend - WITH ANALYTICS */}
      <NetProfitTrend
        data={profitData?.data || []}
        shopId={shopId}
        periodType="weekly"
        periods={8}
        isLoading={isLoadingProfit}
        isError={isErrorProfit}
        error={profitError}
        onRetry={refetchProfit}
      />
    </section>
  );
};