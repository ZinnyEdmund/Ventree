// // ============================================
// // 5. NetProfitTrend.tsx - Weekly Profit Trend Table
// // ============================================
// interface ProfitTrendData {
//   period: string;
//   revenue: number;
//   expenses: number;
//   profit: number;
// }

// interface NetProfitTrendProps {
//   data: ProfitTrendData[];
//   title?: string;
// }

// export const NetProfitTrend: React.FC<NetProfitTrendProps> = ({
//   data,
//   title = "Net Profit Trend",
// }) => {
//   return (
//     <div className=" mb-6">
//       {/* Header */}
//       <h2 className="text-lg font-semibold text-secondary mb-4">{title}</h2>

//       {/* Table */}
//       <div className="bg-white rounded-lg border border-secondary-5 p-6 overflow-x-auto  px-6">
//         <table className="w-full min-w-[600px]">
//           <thead>
//             <tr className="border-b border-gray-200">
//               <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
//                 Period
//               </th>
//               <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
//                 Revenue
//               </th>
//               <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
//                 Expenses
//               </th>
//               <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
//                 Profit
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item, index) => (
//               <tr
//                 key={index}
//                 className="border-b border-gray-100 last:border-0"
//               >
//                 <td className="py-3 px-4 text-sm text-gray-900">
//                   {item.period}
//                 </td>
//                 <td className="py-3 px-4 text-sm font-medium text-green-600">
//                   ₦{item.revenue.toLocaleString()}
//                 </td>
//                 <td className="py-3 px-4 text-sm font-medium text-red-600">
//                   ₦{item.expenses.toLocaleString()}
//                 </td>
//                 <td className="py-3 px-4 text-sm font-medium text-green-600">
//                   ₦{item.profit.toLocaleString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

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
// NetProfitTrend.tsx - OPTIMIZED with Analytics Export
// ============================================
import { toast } from "sonner";
import { Download, RefreshCw } from "lucide-react";
import { useExportProfitSummaryMutation } from "../../../services/analytics.service";
import { calculateProfitMargin } from "../../../lib/helper";

// Backend data structure
interface NetProfitTrendProps {
  data: Array<{
    label: string;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  revenue: number;
  expenses: number;
  cogs: number;
  profit: number;
  }>;
  shopId: string;
  periodType: "daily" | "weekly" | "monthly";
  periods: number;
  isLoading?: boolean;
  isError?: boolean;
  error?: any;
  onRetry?: () => void;
  title?: string;
}

export const NetProfitTrend: React.FC<NetProfitTrendProps> = ({
  data,
  shopId,
  periodType,
  periods,
  isLoading = false,
  isError = false,
  error,
  onRetry,
  title = "Net Profit Trend",
}) => {
  // Export mutation
  const [exportProfit, { isLoading: isExporting }] =
    useExportProfitSummaryMutation();

  // Handle CSV export
  const handleExport = async () => {
    try {
      const blob = await exportProfit({
        shopId,
        period: periodType,
        periods,
      }).unwrap();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `profit-summary-${periodType}-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Profit summary exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export profit summary");
    }
  };

  // ============================================
  // Loading State
  // ============================================
  if (isLoading) {
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-secondary mb-4">{title}</h2>

        <div className="bg-white rounded-lg border border-secondary-5 p-6">
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading profit data...</p>
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
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-secondary mb-4">{title}</h2>

        <div className="bg-white rounded-lg border border-red-200 p-6">
          <div className="h-64 flex items-center justify-center">
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
                Failed to load profit data
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
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-secondary mb-4">{title}</h2>

        <div className="bg-white rounded-lg border border-secondary-5 p-6">
          <div className="h-64 flex items-center justify-center">
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
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                No profit data yet
              </p>
              <p className="text-xs text-gray-500">
                Your profit trends will appear here once you record sales and expenses
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // Success State - Display Table
  // ============================================
  return (
    <div className="mb-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-secondary mb-4">{title}</h2>

      {/* Table */}
      <div className="bg-white rounded-lg border border-secondary-5 p-6 overflow-x-auto px-6">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Period
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Revenue
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Expenses
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Profit
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Margin
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="py-3 px-4 text-sm text-gray-900">
                  {item.label}
                </td>
                <td className="py-3 px-4 text-sm font-medium text-green-600">
                  ₦{item.revenue.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm font-medium text-red-600">
                  ₦{item.expenses.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm font-medium text-green-600">
                  ₦{item.profit.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      calculateProfitMargin(item.profit, item.revenue) >= 50
                        ? "bg-green-100 text-green-800"
                        : calculateProfitMargin(item.profit, item.revenue) >= 30
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {calculateProfitMargin(item.profit, item.revenue)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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