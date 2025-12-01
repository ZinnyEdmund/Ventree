// // ============================================
// // 1. SalesTrendChart.tsx - Sales Trend Bar Chart
// // ============================================
// import { CustomContentOfTooltip } from "./BarChart";

// export interface SalesTrendData {
//   day: string;
//   amount: number;
// }

// interface SalesTrendChartProps {
//   data: SalesTrendData[];
//   title?: string;
//   period?: string;
// }

// export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({
// //   data,
//   title = "Sales Trend",
//   period = "This Week",
// }) => {
// //   const maxAmount = Math.max(...data.map((d) => d.amount));

//   return (
//     <div className="my-6">
//       {/* Header */}
//       <div className="flex items-center justify-between text-secondary mb-6">
//         <h2 className="text-lg font-semibold">{title}</h2>

//         <div className="flex items-center gap-2 text-sm">
//           <span>{period}</span>
//           {/* <Icon icon="mdi:calendar" width="16" height="16" /> */}
//         </div>
//       </div>

//       <div className="bg-white rounded-lg border border-secondary-5 p-5 ">
//         {/* Chart */}
//         <main className="h-64 w-full sm:h-80 md:h-96 ">
//           <CustomContentOfTooltip />
//         </main>

//         {/* Download Button */}
//         <article className="flex justify-end">
//           <button className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
//             Download Report
//           </button>
//         </article>
//       </div>
//     </div>
//   );
// };


// ============================================
// SalesTrendChart.tsx - OPTIMIZED with Analytics Export
// ============================================
import { toast } from "sonner";
import { Download, RefreshCw } from "lucide-react";
import { CustomContentOfTooltip } from "./BarChart";
import { useExportSalesTrendMutation } from "../../../services/analytics.service";

// Updated interface for real backend data
interface SalesTrendChartProps {
  data: Array<{ date: string; revenue: number; sales: number }>;
  shopId: string;
  days: number;
  isLoading?: boolean;
  isError?: boolean;
  error?: any;
  onRetry?: () => void;
  title?: string;
  period?: string;
}

export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({
  data,
  shopId,
  days,
  isLoading = false,
  isError = false,
  error,
  onRetry,
  title = "Sales Trend",
  period = "This Week",
}) => {
  // Export mutation
  const [exportTrend, { isLoading: isExporting }] = useExportSalesTrendMutation();

  // Handle CSV export
  const handleExport = async () => {
    try {
      const blob = await exportTrend({ shopId, days }).unwrap();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `sales-trend-${days}days-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Sales trend exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export sales trend");
    }
  };

  // ============================================
  // Loading State
  // ============================================
  if (isLoading) {
    return (
      <div className="my-6">
        <div className="flex items-center justify-between text-secondary mb-6">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="flex items-center gap-2 text-sm">
            <span>{period}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-secondary-5 p-5">
          <div className="h-64 w-full sm:h-80 md:h-96 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading sales data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // Error State
  // ============================================
  if (isError) {
    return (
      <div className="my-6">
        <div className="flex items-center justify-between text-secondary mb-6">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="flex items-center gap-2 text-sm">
            <span>{period}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-red-200 p-5">
          <div className="h-64 w-full sm:h-80 md:h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Failed to load sales trend
              </p>
              <p className="text-xs text-gray-500 mb-3">
                {(error as any)?.data?.message || "Something went wrong"}
              </p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // Empty State
  // ============================================
  if (!data || data.length === 0) {
    return (
      <div className="my-6">
        <div className="flex items-center justify-between text-secondary mb-6">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="flex items-center gap-2 text-sm">
            <span>{period}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-secondary-5 p-5">
          <div className="h-64 w-full sm:h-80 md:h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">No sales data</p>
              <p className="text-xs text-gray-500">
                Sales data will appear here once you record sales
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // Success State - Display Chart
  // ============================================
  return (
    <div className="my-6">
      {/* Header */}
      <div className="flex items-center justify-between text-secondary mb-6">
        <h2 className="text-lg font-semibold">{title}</h2>

        <div className="flex items-center gap-2 text-sm">
          <span>{period}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-secondary-5 p-5">
        {/* Chart */}
        <main className="h-64 w-full sm:h-80 md:h-96">
          <CustomContentOfTooltip data={data} />
        </main>

        {/* Download Button */}
        <article className="flex justify-end">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download size={16} />
            {isExporting ? "Exporting..." : "Download Report"}
          </button>
        </article>
      </div>
    </div>
  );
};