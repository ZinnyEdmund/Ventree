// ============================================
// BusinessInsightsPage.tsx - Main Page
// ============================================
import { StatCard } from "../home/components/StatCard";
import {
  bestSellers,
  expensesData,
  lowStockAlerts,
  profitTrendData,
  salesTrendData,
} from "../../lib/dummyData";
import { SalesTrendChart } from "./components/SalesTrendChart";
import { BestSellersTable } from "./components/BestSellersTable";
import { LowStockAlert } from "./components/LowStockAlert";
import { ExpensesReport } from "./components/ExpensesReport";
import { NetProfitTrend } from "./components/NetProfitTrend";
import { usePersistentDashboard } from "../../hooks/usePersistentDashboard";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import { RefreshCw } from "lucide-react";
import { TimePeriod } from "../../types/general";

export const BusinessInsightsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);


  // Fetch dashboard data with selected period
  const {
    data: dashboardData,
    isFetching,
    refetch,
  } = usePersistentDashboard(user?.shopId || "", TimePeriod.WEEKLY);

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  // Extract dashboard stats
  const dashboard = dashboardData?.data?.dashboard;

  // Build stats array from API data or show loading/default
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
          value: `${dashboard.lowStockItems} Items`,
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
          <h1 className="h5 md:text-2xl  font-semibold text-secondary">
            Overview
          </h1>

          {/* Refresh Button - Desktop */}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh dashboard"
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

      {/* Sales Trend Chart */}
      <SalesTrendChart data={salesTrendData} />

      {/* Best Sellers Table */}
      <BestSellersTable data={bestSellers} />

      {/* Low Stock Alert */}
      <LowStockAlert data={lowStockAlerts} />

      {/* Expense Pie Chart */}
      <ExpensesReport data={expensesData} />

      {/* Net Profit Trend */}
      <NetProfitTrend data={profitTrendData} />
    </section>
  );
};
