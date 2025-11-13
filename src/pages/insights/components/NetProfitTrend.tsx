// ============================================
// 5. NetProfitTrend.tsx - Weekly Profit Trend Table
// ============================================
interface ProfitTrendData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface NetProfitTrendProps {
  data: ProfitTrendData[];
  title?: string;
}

export const NetProfitTrend: React.FC<NetProfitTrendProps> = ({
  data,
  title = "Net Profit Trend",
}) => {
  return (
    <div className=" mb-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-secondary mb-4">{title}</h2>

      {/* Table */}
      <div className="bg-white rounded-lg border border-secondary-5 p-6 overflow-x-auto  px-6">
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
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="py-3 px-4 text-sm text-gray-900">
                  {item.period}
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
              </tr>
            ))}
          </tbody>
        </table>

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
