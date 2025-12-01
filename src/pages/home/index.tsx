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

// Main Home Component
export const Home = () => {
  const [salesExpanded, setSalesExpanded] = useState(true);
  const [notificationsExpanded, setNotificationsExpanded] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(TimePeriod.DAILY);
  const [ setSelectedSale] = useState<any>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  // Fetch dashboard data with selected period
  const {
    data: dashboardData,
    isFetching,
    refetch,
  } = usePersistentDashboard(user?.shopId || "", selectedPeriod);

  // Fetch sales data
  const {
    data: salesItemsData,
    isLoading: isLoadingSales,
    refetch: refetchSales,
  } = useGetSalesItemsByShopQuery(user?.shopId || "", {
    skip: !user?.shopId,
  });


  // Format currency
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

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

  // Handle period change
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value as TimePeriod);
  };

  // Handle view sale
  const handleViewSale = (sale: any) => {
    setSelectedSale(sale);
  };


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
            onClick={() => refetch()}
            disabled={isFetching}
            className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh dashboard"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Time Filter and Refresh */}
        <div className="flex items-center justify-between gap-2">
          <select
            value={selectedPeriod}
            onChange={handlePeriodChange}
            disabled={isFetching}
            className="h4 text-secondary py-2 rounded-lg transition-colors font-medium cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value={TimePeriod.DAILY}>Today</option>
            <option value={TimePeriod.WEEKLY}>Last 7 days</option>
          </select>

          {/* Refresh Button - Mobile */}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="md:hidden p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={20} className={isFetching ? "animate-spin" : ""} />
          </button>
        </div>
      </article>

      {/* Error Alert */}
      {/* {isError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon
              icon="mdi:alert-circle-outline"
              width="24"
              height="24"
              className="text-red-500 flex-shrink-0 mt-0.5"
            />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Failed to load dashboard</p>
              <p className="text-sm text-red-600 mt-1">
                {(error as any)?.data?.message || "Please try again later"}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )} */}

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

      {/* Sales History
      <div className="py-3">
        <div className="flex items-center justify-between">
          <SectionHeader
            title="Sales History"
            isExpanded={salesExpanded}
            onToggle={() => setSalesExpanded(!salesExpanded)}
          />
        </div>

        {salesExpanded && (
          <>
            <div className="space-y-0 rounded-lg bg-white">
              {salesHistory.map((sale, index) => (
                <SalesHistoryItem
                  key={index}
                  product={sale.product}
                  price={sale.price}
                  soldBy={sale.soldBy}
                  time={sale.time}
                  onMenuClick={() =>
                    console.log(`Menu clicked for ${sale.product}`)
                  }
                />
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Link
                to="/history"
                className="text-secondary font-semibold hover:underline"
              >
                View All
              </Link>
            </div>
          </>
        )}
      </div> */}

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
              isLoading={isLoadingSales}
              onView={handleViewSale}
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