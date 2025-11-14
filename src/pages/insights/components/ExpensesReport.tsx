// ============================================
// 4. ExpensesReport.tsx - Expenses Breakdown with Pie Chart
// ============================================
interface Expense {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  date: string;
  note: string;
}

interface ExpensesReportProps {
  data: Expense[];
  title?: string;
}

export const ExpensesReport: React.FC<ExpensesReportProps> = ({
  data,
  title = "Expenses Report",
}) => {
  // Calculate cumulative angle for pie chart
  let cumulativePercentage = 0;

  return (
    <div className=" mb-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-secondary mb-6">{title}</h2>

      {/* Pie Chart */}
      <div className="flex flex-col lg:flex-row items-center gap-8 md:justify-center mb-8">
        {/* Chart */}
        <div className="relative w-64 h-64">
          <svg viewBox="0 0 200 200" className="transform -rotate-90">
            {data.map((item, index) => {
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
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700">
                {item.category}: {item.percentage}%
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
                  Expense
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Note
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
                    {item.category}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    ₦{item.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {item.date}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {item.note}
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
