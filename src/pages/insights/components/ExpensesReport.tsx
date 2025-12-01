// // ============================================
// // 4. ExpensesReport.tsx - Expenses Breakdown with Pie Chart
// // ============================================
// interface Expense {
//   category: string;
//   amount: number;
//   percentage: number;
//   color: string;
//   date: string;
//   note: string;
// }

// interface ExpensesReportProps {
//   data: Expense[];
//   title?: string;
// }

// export const ExpensesReport: React.FC<ExpensesReportProps> = ({
//   data,
//   title = "Expenses Report",
// }) => {
//   // Calculate cumulative angle for pie chart
//   let cumulativePercentage = 0;

//   return (
//     <div className=" mb-6">
//       {/* Header */}
//       <h2 className="text-lg font-semibold text-secondary mb-6">{title}</h2>

//       {/* Pie Chart */}
//       <div className="flex flex-col lg:flex-row items-center gap-8 md:justify-center mb-8">
//         {/* Chart */}
//         <div className="relative w-64 h-64">
//           <svg viewBox="0 0 200 200" className="transform -rotate-90">
//             {data.map((item, index) => {
//               const startAngle = (cumulativePercentage / 100) * 360;
//               cumulativePercentage += item.percentage;
//               const endAngle = (cumulativePercentage / 100) * 360;

//               const startRad = (startAngle * Math.PI) / 180;
//               const endRad = (endAngle * Math.PI) / 180;

//               const x1 = 100 + 100 * Math.cos(startRad);
//               const y1 = 100 + 100 * Math.sin(startRad);
//               const x2 = 100 + 100 * Math.cos(endRad);
//               const y2 = 100 + 100 * Math.sin(endRad);

//               const largeArcFlag = item.percentage > 50 ? 1 : 0;

//               return (
//                 <path
//                   key={index}
//                   d={`M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
//                   fill={item.color}
//                   className="hover:opacity-80 transition-opacity cursor-pointer"
//                 />
//               );
//             })}
//           </svg>
//         </div>

//         {/* Legend */}
//         <div className="flex-1 space-y-3">
//           {data.map((item, index) => (
//             <div key={index} className="flex items-center gap-3">
//               <div
//                 className="w-4 h-4 rounded"
//                 style={{ backgroundColor: item.color }}
//               />
//               <span className="text-sm text-gray-700">
//                 {item.category}: {item.percentage}%
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Expense Table */}
//       <main className="bg-white rounded-lg border border-secondary-5 p-6 px-6">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[600px]">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
//                   Expense
//                 </th>
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
//                   Amount
//                 </th>
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
//                   Date
//                 </th>
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
//                   Note
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((item, index) => (
//                 <tr
//                   key={index}
//                   className="border-b border-gray-100 last:border-0"
//                 >
//                   <td className="py-3 px-4 text-sm text-gray-900">
//                     {item.category}
//                   </td>
//                   <td className="py-3 px-4 text-sm text-gray-900">
//                     ₦{item.amount.toLocaleString()}
//                   </td>
//                   <td className="py-3 px-4 text-sm text-gray-900">
//                     {item.date}
//                   </td>
//                   <td className="py-3 px-4 text-sm text-gray-600">
//                     {item.note}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Download Button */}
//         <article className="flex justify-end">
//           <button className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
//             Download Report
//           </button>
//         </article>
//       </main>
//     </div>
//   );
// };


// ============================================
// ExpensesReport.tsx - OPTIMIZED with Analytics
// ============================================
import { RefreshCw } from "lucide-react";
import { formatPriceInNaira } from "../../../lib/helper";

// Backend data structure
interface ExpensesReportProps {
  data: Array<{
    category: string;
    percentage: number;
    total: number;
  }>;
  isLoading?: boolean;
  isError?: boolean;
  error?: any;
  onRetry?: () => void;
  title?: string;
}

export const ExpensesReport: React.FC<ExpensesReportProps> = ({
  data,
  isLoading = false,
  isError = false,
  error,
  onRetry,
  title = "Expenses Report",
}) => {
  // Color palette for pie chart
  const colors = [
    "#073e1e", // blue
    "#aaaaaa66", // green
    "#9bb2a4", // amber
    "#38654b", // red
    "#33eb35", // purple
    "#59dc59", // pink
    "#eafeb9", // teal
    "#e1fd98", // orange
    "#d7fd76", // cyan
    "#cdfc54", // lime
  ];

  // Transform backend data to include colors
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: colors[index % colors.length],
    amount: item.total,
    date: new Date().toLocaleDateString(),
    note: `${data.length} ${data.length === 1 ? "expense" : "expenses"}`,
  }));

  // ============================================
  // Loading State
  // ============================================
  if (isLoading) {
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-secondary mb-6">{title}</h2>

        <div className="bg-white rounded-lg border border-secondary-5 p-6">
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading expenses...</p>
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
        <h2 className="text-lg font-semibold text-secondary mb-6">{title}</h2>

        <div className="bg-white rounded-lg border border-red-200 p-6">
          <div className="h-96 flex items-center justify-center">
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
                Failed to load expenses
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
        <h2 className="text-lg font-semibold text-secondary mb-6">{title}</h2>

        <div className="bg-white rounded-lg border border-secondary-5 p-6">
          <div className="h-96 flex items-center justify-center">
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
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                No expenses recorded
              </p>
              <p className="text-xs text-gray-500">
                Your expense breakdown will appear here once you record expenses
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // Success State - Display Pie Chart & Table
  // ============================================
  let cumulativePercentage = 0;

  return (
    <div className="mb-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-secondary mb-6">{title}</h2>

      {/* Pie Chart */}
      <div className="flex flex-col lg:flex-row items-center gap-8 md:justify-center mb-8">
        {/* Chart */}
        <div className="relative w-64 h-64">
          <svg viewBox="0 0 200 200" className="transform -rotate-90">
            {dataWithColors.map((item, index) => {
              const startAngle = (cumulativePercentage / 100) * 360;
              cumulativePercentage += item.percentage;
              const endAngle = (cumulativePercentage / 100) * 360;

              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;

              const x1 = 100 + 100 * Math.cos(startRad);
              const y1 = 100 + 100 * Math.sin(startRad);
              const x2 = 100 + 100 * Math.cos(endRad);
              const y2 = 100 + 100 * Math.sin(endRad);

              const largeArcFlag = item.percentage > 50 ? 1 : 0;

              return (
                <path
                  key={index}
                  d={`M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={item.color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {dataWithColors.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700">
                {item.category}: {item.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Table */}
      <main className="bg-white rounded-lg border border-secondary-5 p-6 px-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Total Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Percentage
                </th>
                {/* <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Count
                </th> */}
              </tr>
            </thead>
            <tbody>
              {dataWithColors.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-900">
                        {item.category}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {formatPriceInNaira(item.total)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {item.percentage}%
                  </td>
                  {/* <td className="py-3 px-4 text-sm text-gray-600">
                    {item.note}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};