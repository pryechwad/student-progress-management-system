// src/components/charts/RatingLineChart.tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface RatingPoint {
  date: string;
  rating: number;
}

interface RatingLineChartProps {
  data: RatingPoint[];
}

export default function RatingLineChart({ data }: RatingLineChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#8884d8" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="rating" stroke="#10b981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
