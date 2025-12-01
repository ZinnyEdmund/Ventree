// // ============================================
// // 3. LowStockAlert.tsx - Low Stock Alert Table
// // ============================================
// export interface StockAlert {
//   product: string;
//   currentStock: number;
//   status: "critical" | "low";
// }

// interface LowStockAlertProps {
//   data: StockAlert[];
//   title?: string;
// }

// export const LowStockAlert: React.FC<LowStockAlertProps> = ({
//   data,
//   title = "Low Stock Alert",
// }) => {
//   const getStatusBadge = (status: "critical" | "low") => {
//     if (status === "critical") {
//       return (
//         <span className="inline-flex items-center gap-1 text-sm text-red-600">
//           <span className="w-2 h-2 bg-red-600 rounded-full"></span>
//           Critical
//         </span>
//       );
//     }
//     return (
//       <span className="inline-flex items-center gap-1 text-sm text-yellow-600">
//         <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
//         Low
//       </span>
//     );
//   };

//   return (
//     <div className=" mb-6">
//       {/* Header */}
//       <h2 className="text-lg font-semibold text-secondary mb-4">{title}</h2>

//       {/* Table - Scrollable on mobile */}
//       <div className="bg-white rounded-lg border border-secondary-5 p-6 px-6">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[500px]">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
//                   Product
//                 </th>
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
//                   Current Stock
//                 </th>
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
//                   Status
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
//                     {item.product}
//                   </td>
//                   <td className="py-3 px-4 text-sm text-gray-900">
//                     {item.currentStock}
//                   </td>
//                   <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
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
//       </div>
//     </div>
//   );
// };


// ============================================
// LowStockAlert.tsx - OPTIMIZED with Analytics
// ============================================
import { RefreshCw } from "lucide-react";

// Backend data structure
interface LowStockAlertProps {
  data: Array<{
    itemId: string;
    productName: string;
    currentStock: number;
    reorderLevel: number;
    status: "Critical" | "Low";
    unit: string;
  }>;
  isLoading?: boolean;
  isError?: boolean;
  error?: any;
  onRetry?: () => void;
  title?: string;
}

export const LowStockAlert: React.FC<LowStockAlertProps> = ({
  data,
  isLoading = false,
  isError = false,
  error,
  onRetry,
  title = "Low Stock Alert",
}) => {
  const getStatusBadge = (status: "Critical" | "Low") => {
    if (status === "Critical") {
      return (
        <span className="inline-flex items-center gap-1 text-sm text-red-600">
          <span className="w-2 h-2 bg-red-600 rounded-full"></span>
          Critical
        </span>
      );
    }
    if (status === "Low") {
      return (
        <span className="inline-flex items-center gap-1 text-sm text-yellow-600">
          <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
          Low
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-sm text-green-600">
        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
        OK
      </span>
    );
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
              <p className="text-sm text-gray-500">Loading stock alerts...</p>
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
                Failed to load stock alerts
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
  // Empty State (Good - No Low Stock!)
  // ============================================
  if (!data || data.length === 0) {
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-secondary mb-4">{title}</h2>

        <div className="bg-white rounded-lg border border-secondary-5 p-6">
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                All stock levels are healthy!
              </p>
              <p className="text-xs text-gray-500">
                No items are running low on stock at the moment
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // Success State - Display Alerts
  // ============================================
  return (
    <div className="mb-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-secondary mb-4">{title}</h2>

      {/* Alert Count Badge */}
      {/* <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          {data.filter((item) => item.stockStatus === "critical").length} Critical
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          {data.filter((item) => item.stockStatus === "low").length} Low
        </span>
      </div> */}

      {/* Table */}
      <div className="bg-white rounded-lg border border-secondary-5 p-6 px-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Product
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Current Stock
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Reorder Level
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm text-gray-900 font-medium">
                        {item.productName}
                      </p>
                      {/* <p className="text-xs text-gray-500">{item.}</p> */}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm text-gray-900">
                        {item.currentStock}
                      </p>
                      {/* {item !== undefined && (
                        <p className="text-xs text-red-600">
                          ~{item.daysUntilStockOut}{" "}
                          {item.daysUntilStockOut === 1 ? "day" : "days"} left
                        </p> */}
                      {/* )} */}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {item.reorderLevel}
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(item.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};