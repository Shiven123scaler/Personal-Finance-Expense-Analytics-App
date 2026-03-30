import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatINR } from '../../utils/currencyFormatter';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 transition-colors duration-200 shadow-lg rounded-lg px-3 py-2 border border-gray-100 dark:border-gray-800">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">{formatINR(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const MonthlyTrendLine = ({ data, className = '' }) => {
  // data: [{ month: 'Jan', total: 15000 }, ...]

  return (
    <div className={`bg-white dark:bg-gray-800 transition-colors duration-200 rounded-xl p-5 border border-gray-100 dark:border-gray-800 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Monthly Spending Trend</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#185FA5"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#185FA5' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendLine;
