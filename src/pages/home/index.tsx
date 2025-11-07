import { useState } from "react";
import { actions, notifications, salesHistory, stats } from "../../lib/dummyData";
import { StatCard } from "./components/StatCard";
import { ActionCard } from "./components/ActionButtons";
import { SectionHeader } from "./components/SectionHeader";
import { SalesHistoryItem } from "./components/SaleHistorytable";
import { NotificationItem } from "./components/NotificationTable";

// Main Home Component
export const Home = () => {
  const [salesExpanded, setSalesExpanded] = useState(true);
  const [notificationsExpanded, setNotificationsExpanded] = useState(true);

  return (
    <section className="py-6">
      {/* Header */}
      <article className="mb-2">
        <h1 className="h3 text-secondary mb-4">Welcome, Owner</h1>

        {/* Time Filter */}
        <div className="flex items-center gap-2 h4 text-secondary ">
          <select className="flex items-center gap-2 py-2 rounded-lg transition-colors font-medium cursor-pointer focus:outline-none">
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last-7-days">Last 7 days</option>
            <option value="last-30-days">Last 30 days</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </article>

      {/* Stats Grid */}
      <main className="py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </main>

      {/* Actions Grid */}
      <main className="py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <ActionCard
            key={index}
            title={action.title}
            description={action.description}
            onClick={() => console.log(`Clicked: ${action.title}`)}
          />
        ))}
      </main>

      {/* Sales History */}
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
              <button className="text-secondary font-semibold hover:underline">
                View All
              </button>
            </div>
          </>
        )}
      </div>

      {/* Notifications */}
      <div className="py-3">
        <div className="flex items-center justify-between ">
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
              <button className="text-secondary font-semibold hover:underline">
                View All
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
