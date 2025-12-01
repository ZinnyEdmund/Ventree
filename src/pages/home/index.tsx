import { useState } from "react";
import {
  actions,
  notifications
} from "../../lib/dummyData";
import { StatCard } from "./components/StatCard";
import { ActionCard } from "./components/ActionButtons";
import { SectionHeader } from "./components/SectionHeader";
import { SalesHistoryTable } from "./components/SaleHistorytable";
import { NotificationItem } from "./components/NotificationTable";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import { TimePeriod } from "../../types/general";
import { RefreshCw } from "lucide-react";
import { usePersistentDashboard } from "../../hooks/usePersistentDashboard";
import { useGetSalesItemsByShopQuery } from "../../services/sales.service";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";

// Main Home Component
export const Home = () => {
  const [salesExpanded, setSalesExpanded] = useState(true);
  const [notificationsExpanded, setNotificationsExpanded] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(TimePeriod.DAILY);
  const [setSelectedSale] = useState<any>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const [pageSize] = useState(5);

  // Fetch dashboard data with selected period
  const {
    data: dashboardData,
    isFetching: isFetchingDashboard,
    isError: isDashboardError,
    error: dashboardError,
    refetch: refetchDashboard,
  } = usePersistentDashboard(user?.shopId || "", selectedPeriod);

  // Fetch sales data
  const {
    data: salesItemsData,
    isLoading: isLoadingSales,
    isFetching: isFetchingSales,
    isError: isSalesError,
    error: salesError,
    refetch: refetchSales,
  } = useGetSalesItemsByShopQuery({
    shopId: user?.shopId || "", limit: pageSize }, {
    skip: !user?.shopId,
  });

  const isLoadingSalesOrFetching = isLoadingSales || isFetchingSales;

  // Combined loading state
  const isLoading = isFetchingDashboard || isLoadingSalesOrFetching;

  // Combined error state
  const hasError = isDashboardError || isSalesError;
  const error = dashboardError || salesError;

  // Retry function that refetches all queries
  const handleRetryAll = () => {
    refetchDashboard();
    refetchSales();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  // Handle period change
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value as TimePeriod);
  };

  // Handle view sale
  const handleViewSale = (sale: any) => {
    setSelectedSale(sale);
  };

  // LOADING STATE - Show loading spinner while fetching data
  if (isLoading && !dashboardData && !salesItemsData) {
    return (
      <LoadingState 
        text="Loading your dashboard..." 
        size="lg"
      />
    );
  }

  // ERROR STATE - Show error with retry for all queries
  if (hasError && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ErrorState
          errorCode="500"
          message={
            (error as any)?.data?.message || 
            (error as any)?.message || 
            "Failed to load dashboard data. Please try again."
          }
          onRetry={handleRetryAll}
        />
      </div>
    );
  }

  // Extract dashboard stats
  const dashboard = dashboardData?.data?.dashboard;

  // Extract sales - handle both array and single object response
  const sales = salesItemsData?.data.items
    ? Array.isArray(salesItemsData.data.items)
      ? salesItemsData.data.items
      : [salesItemsData.data.items]
    : [];
  
  // Get only the 5 most recent sales
  const recentSales = sales;

  // Build stats array from API data or show loading/default
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
      <article className="mb-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="h4 md:text-3xl text-secondary">
            Welcome, {user?.userName || "Owner"}
          </h1>

          {/* Refresh Button - Desktop */}
          <button
            onClick={handleRetryAll}
            disabled={isLoading}
            className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh dashboard"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Time Filter and Refresh */}
        <div className="flex items-center justify-between gap-2">
          <select
            value={selectedPeriod}
            onChange={handlePeriodChange}
            disabled={isLoading}
            className="h4 text-secondary py-2 rounded-lg transition-colors font-medium cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value={TimePeriod.DAILY}>Today</option>
            <option value={TimePeriod.WEEKLY}>Last 7 days</option>
          </select>

          {/* Refresh Button - Mobile */}
          <button
            onClick={handleRetryAll}
            disabled={isLoading}
            className="md:hidden p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </article>

      {/* Error Alert Banner (for non-critical errors while data is available) */}
      {hasError && dashboardData && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg 
              className="w-6 h-6 text-error shrink-0 mt-0.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <div className="flex-1">
              <p className="text-red-800 font-medium">Failed to load some data</p>
              <p className="text-sm text-red-600 mt-1">
                {(error as any)?.data?.message || 
                 (error as any)?.message || 
                 "Some data may be outdated"}
              </p>
            </div>
            <button
              onClick={handleRetryAll}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <main className="py-3 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.Icon}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            variant={stat.variant}
            // isLoading={isLoading}
          />
        ))}
      </main>

      {/* Actions Grid */}
      <main className="py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <ActionCard
            key={index}
            icon={action.icon}
            title={action.title}
            description={action.description}
            to={action.to}
          />
        ))}
      </main>

      {/* Sales History */}
      <div className="py-3">
        <div className="flex items-center justify-between mb-4">
          <SectionHeader
            title="Sales History"
            isExpanded={salesExpanded}
            onToggle={() => setSalesExpanded(!salesExpanded)}
          />
        </div>

        {salesExpanded && (
          <>
            <SalesHistoryTable
              sales={recentSales}
              isLoading={isLoadingSalesOrFetching && !salesItemsData}
              error={isSalesError ? (salesError as Error) : null}
              onView={handleViewSale}
              onRetry={refetchSales}
            />
            {recentSales.length > 5 && (
              <div className="flex justify-end mt-4">
                <Link
                  to="/history"
                  className="text-secondary font-semibold hover:underline"
                >
                  View All
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* Notifications */}
      <div className="py-3">
        <div className="flex items-center justify-between">
          <SectionHeader
            title="Notifications"
            isExpanded={notificationsExpanded}
            onToggle={() => setNotificationsExpanded(!notificationsExpanded)}
          />
        </div>

        {notificationsExpanded && (
          <>
            <div className="space-y-0 bg-white rounded-lg">
              {notifications.map((notification, index) => (
                <NotificationItem key={index} message={notification} />
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Link
                to="/notification"
                className="text-secondary font-semibold hover:underline"
              >
                View All
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};