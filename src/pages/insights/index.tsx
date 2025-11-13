// ============================================
// BusinessInsightsPage.tsx - Main Page
// ============================================
import { StatCard } from "../home/components/StatCard";
import { bestSellers, expensesData, lowStockAlerts, profitTrendData, salesTrendData, stats } from "../../lib/dummyData";
import { SalesTrendChart } from "./components/SalesTrendChart";
import { BestSellersTable } from "./components/BestSellersTable";
import { LowStockAlert } from "./components/LowStockAlert";
import { ExpensesReport } from "./components/ExpensesReport";
import { NetProfitTrend } from "./components/NetProfitTrend";

export const BusinessInsightsPage = () => {
  

  return (
    <section className="py-6">
      {/* Header */}
      <article className="mb-6">
        <h1 className="h5 md:text-2xl  font-semibold text-secondary">Overview</h1>
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