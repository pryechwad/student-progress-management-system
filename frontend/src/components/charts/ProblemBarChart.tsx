// src/components/charts/ProblemBarChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type RatingBucket = {
  rating: string;
  count: number;
};

interface ProblemBarChartProps {
  data: RatingBucket[];
}

export default function ProblemBarChart({ data }: ProblemBarChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="rating" stroke="#8884d8" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
