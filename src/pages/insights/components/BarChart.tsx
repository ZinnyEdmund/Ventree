import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  type TooltipContentProps,
  ResponsiveContainer,
} from "recharts";

// #region Sample data
const data = [
  { name: "Mon", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Tue", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Wed", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Thu", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Fri", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Sat", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Sun", uv: 3490, pv: 4300, amt: 2100 },
];
// #endregion

const getIntroOfPage = (label: string | number | undefined) => {
  switch (label) {
    case "Page A":
      return "Page A is about men's clothing";
    case "Page B":
      return "Page B is about women's dress";
    case "Page C":
      return "Page C is about women's bag";
    case "Page D":
      return "Page D is about household goods";
    case "Page E":
      return "Page E is about food";
    case "Page F":
      return "Page F is about baby food";
    default:
      return "";
  }
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipContentProps<string | number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border p-2 rounded shadow">
        <p className="font-semibold text-gray-800">{`${label} : ${payload[0].value}`}</p>
        <p className="text-sm text-gray-600">{getIntroOfPage(label)}</p>
        <p className="text-xs text-gray-500">
          Amount generated that day.
        </p>
      </div>
    );
  }
  return null;
};

export const CustomContentOfTooltip = ({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean;
  defaultIndex?: number;
}) => {
    const isMobile = window.innerWidth < 640;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: isMobile ? 0 : 20,
          left: isMobile ? -10 : 20,
          bottom: isMobile ? 0 : 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: isMobile ? 10 : 14, fill: '#666666' }}/>
        <YAxis tick={{ fontSize: isMobile ? 10 : 14, fill: '#666666' }} tickFormatter={(value) => `₦${(value / 1000).toFixed(1)}K`}  />
        <Tooltip content={<CustomTooltip active payload label />} />
        {/* <Legend /> */}
        <Bar
          dataKey="pv"
          barSize={isMobile ? 20 : 40}
          fill="#59DC59"
          radius={[5, 5, 0, 0]}
          isAnimationActive={isAnimationActive}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
