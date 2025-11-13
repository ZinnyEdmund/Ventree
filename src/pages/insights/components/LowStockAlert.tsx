// ============================================
// 3. LowStockAlert.tsx - Low Stock Alert Table
// ============================================
export interface StockAlert {
  product: string;
  currentStock: number;
  status: "critical" | "low";
}

interface LowStockAlertProps {
  data: StockAlert[];
  title?: string;
}

export const LowStockAlert: React.FC<LowStockAlertProps> = ({
  data,
  title = "Low Stock Alert",
}) => {
  const getStatusBadge = (status: "critical" | "low") => {
    if (status === "critical") {
      return (
        <span className="inline-flex items-center gap-1 text-sm text-red-600">
          <span className="w-2 h-2 bg-red-600 rounded-full"></span>
          Critical
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-sm text-yellow-600">
        <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
        Low
      </span>
    );
  };

  return (
    <div className=" mb-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-secondary mb-4">{title}</h2>

      {/* Table - Scrollable on mobile */}
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
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {item.product}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {item.currentStock}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
