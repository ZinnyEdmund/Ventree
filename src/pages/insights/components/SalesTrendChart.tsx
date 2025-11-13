// ============================================
// 1. SalesTrendChart.tsx - Sales Trend Bar Chart
// ============================================
import { Icon } from "@iconify/react";
import { CustomContentOfTooltip } from "./BarChart";

export interface SalesTrendData {
  day: string;
  amount: number;
}

interface SalesTrendChartProps {
  data: SalesTrendData[];
  title?: string;
  period?: string;
}

export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({
  data,
  title = "Sales Trend",
  period = "This Week",
}) => {
  const maxAmount = Math.max(...data.map((d) => d.amount));

  return (
    <div className="my-6">
      {/* Header */}
      <div className="flex items-center justify-between text-secondary mb-6">
        <h2 className="text-lg font-semibold">{title}</h2>

        <div className="flex items-center gap-2 text-sm">
          <span>{period}</span>
          <Icon icon="mdi:calendar" width="16" height="16" />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-secondary-5 p-5 ">
        {/* Chart */}
        <main className="h-64 w-full sm:h-80 md:h-96 ">
          <CustomContentOfTooltip />
        </main>

        {/* Download Button */}
        <article className="flex justify-end">
          <button className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            Download Report
          </button>
        </article>
      </div>
    </div>
  );
};
