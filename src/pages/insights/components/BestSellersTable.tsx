// ============================================
// 2. BestSellersTable.tsx - Best Sellers Table
// ============================================
export interface BestSeller {
  product: string;
  unitsSold: number;
  revenue: number;
  contribution: number;
}

interface BestSellersTableProps {
  data: BestSeller[];
  title?: string;
}

export const BestSellersTable: React.FC<BestSellersTableProps> = ({
  data,
  title = "Best Sellers",
}) => {
  return (
    <div className=" mb-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-secondary mb-4">{title}</h2>

      {/* Table - Scrollable on mobile */}
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
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {item.product}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {item.unitsSold}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    ₦{item.revenue.toLocaleString()}
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
          <button className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            Download Report
          </button>
        </article>
      </main>
    </div>
  );
};
