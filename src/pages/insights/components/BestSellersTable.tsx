// // ============================================
// // 2. BestSellersTable.tsx - Best Sellers Table
// // ============================================
// export interface BestSeller {
//   product: string;
//   unitsSold: number;
//   revenue: number;
//   contribution: number;
// }

// interface BestSellersTableProps {
//   data: BestSeller[];
//   title?: string;
// }

// export const BestSellersTable: React.FC<BestSellersTableProps> = ({
//   data,
//   title = "Best Sellers",
// }) => {
//   return (
//     <div className=" mb-6">
//       {/* Header */}
//       <h2 className="text-lg font-semibold text-secondary mb-4">{title}</h2>

//       {/* Table - Scrollable on mobile */}
//       <main className="bg-white rounded-lg border border-secondary-5 p-6 px-6">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[600px]">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
//                   Product
//                 </th>
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
//                   Units Sold
//                 </th>
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
//                   Revenue
//                 </th>
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
//                   Contribution
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
//                     {item.unitsSold}
//                   </td>
//                   <td className="py-3 px-4 text-sm text-gray-900">
//                     ₦{item.revenue.toLocaleString()}
//                   </td>
//                   <td className="py-3 px-4 text-sm text-gray-900">
//                     {item.contribution}%
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
// BestSellersTable.tsx - OPTIMIZED with Analytics Export
// ============================================
import { toast } from "sonner";
import { Download, RefreshCw } from "lucide-react";
import { useExportBestSellersMutation } from "../../../services/analytics.service";
import { formatPriceInNaira } from "../../../lib/helper";

// Backend data structure
interface BestSellersTableProps {
  data: Array<{
    itemId: string;
    productName: string;
    unitsSold: number;
    revenue: number;
    contribution: number;
  }>;
  shopId: string;
  limit: number;
  isLoading?: boolean;
  isError?: boolean;
  error?: any;
  onRetry?: () => void;
  title?: string;
}

export const BestSellersTable: React.FC<BestSellersTableProps> = ({
  data,
  shopId,
  limit,
  isLoading = false,
  isError = false,
  error,
  onRetry,
  title = "Best Sellers",
}) => {
  // Export mutation
  const [exportBestSellers, { isLoading: isExporting }] =
    useExportBestSellersMutation();

  // Handle CSV export
  const handleExport = async () => {
    try {
      const blob = await exportBestSellers({ shopId, limit }).unwrap();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `best-sellers-top${limit}-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Best sellers exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export best sellers");
    }
  };

  // Transform data and calculate contribution
  const transformedData = data.map((item) => {
    const totalRevenue = data.reduce((sum, i) => sum + i.revenue, 0);
    const contribution = totalRevenue > 0 
      ? ((item.revenue / totalRevenue) * 100).toFixed(1) 
      : "0";

    return {
      product: item.productName,
      unitsSold: item.unitsSold,
      revenue: item.revenue,
      contribution: contribution,
      category: item.productName,
    };
  });

  // ============================================
  // Loading State
  // ============================================
  if (isLoading) {
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-secondary mb-4">{title}</h2>

        <main className="bg-white rounded-lg border border-secondary-5 p-6">
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading best sellers...</p>
            </div>
          </div>
        </main>
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

        <main className="bg-white rounded-lg border border-red-200 p-6">
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
                Failed to load best sellers
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
        </main>
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

        <main className="bg-white rounded-lg border border-secondary-5 p-6">
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
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                No best sellers yet
              </p>
              <p className="text-xs text-gray-500">
                Your top-selling products will appear here once you record sales
              </p>
            </div>
          </div>
        </main>
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
      <main className="bg-white rounded-lg border border-secondary-5 p-6 px-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Product
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Units Sold
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Revenue
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Contribution
                </th>
              </tr>
            </thead>
            <tbody>
              {transformedData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm text-gray-900 font-medium">
                        {item.product}
                      </p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {item.unitsSold}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {formatPriceInNaira(item.revenue)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {item.contribution}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
      </main>
    </div>
  );
};