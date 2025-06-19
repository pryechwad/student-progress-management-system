import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';

// Helper to get date strings relative to today
const today = new Date(2025, 5, 19); // June is month 5 (0-indexed
function daysAgo(days: number) {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

// Mock contest history data (last 5 months)
const contestHistory = [
  { date: daysAgo(140), rating: 1200, rank: 150, unsolved: 2 },
  { date: daysAgo(110), rating: 1250, rank: 120, unsolved: 1 },
  { date: daysAgo(80), rating: 1300, rank: 100, unsolved: 0 },
  { date: daysAgo(50), rating: 1350, rank: 90, unsolved: 1 },
  { date: daysAgo(20), rating: 1400, rank: 80, unsolved: 0 },
];

// Mock problem solving data (last 7 days for heatmap)
const problemStats = {
  mostDifficult: { name: 'Div2 D', rating: 1800 },
  totalSolved: 120,
  avgRating: 1350,
  avgPerDay: 2,
  ratingBuckets: [
    { rating: '800-999', count: 10 },
    { rating: '1000-1199', count: 30 },
    { rating: '1200-1399', count: 40 },
    { rating: '1400-1599', count: 25 },
    { rating: '1600-1799', count: 10 },
    { rating: '1800+', count: 5 },
  ],
  heatmap: Array.from({ length: 7 }, (_, i) => ({ date: daysAgo(6 - i), count: Math.floor(Math.random() * 4) })),
};

const StudentProfile: React.FC = () => {
  const { id } = useParams();
  const [contestFilter, setContestFilter] = useState('30');
  const [problemFilter, setProblemFilter] = useState('7');

  // Filtered data (mock logic)
  const filteredContests = contestHistory.slice(-parseInt(contestFilter) / 30);
  const filteredHeatmap = problemStats.heatmap.slice(-parseInt(problemFilter));

  return (
    <div className="px-1 sm:px-0">
      <h2 className="text-lg sm:text-xl font-bold mb-4">Student Profile (ID: {id})</h2>
      {/* Contest History Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2 gap-2 sm:gap-4">
          <h3 className="text-base sm:text-lg font-semibold">Contest History</h3>
          <select value={contestFilter} onChange={e => setContestFilter(e.target.value)} className="border rounded px-2 py-1 text-sm">
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last 365 days</option>
          </select>
        </div>
        <div className="w-full overflow-x-auto">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={filteredContests}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="rating" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full mt-4 border border-gray-300 dark:border-gray-700 text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800">
                <th className="py-2 px-2 sm:px-4 border-b">Date</th>
                <th className="py-2 px-2 sm:px-4 border-b">Rating</th>
                <th className="py-2 px-2 sm:px-4 border-b">Rank</th>
                <th className="py-2 px-2 sm:px-4 border-b">Unsolved</th>
              </tr>
            </thead>
            <tbody>
              {filteredContests.map((c, i) => (
                <tr key={i} className="text-center">
                  <td className="py-2 px-2 sm:px-4 border-b">{c.date}</td>
                  <td className="py-2 px-2 sm:px-4 border-b">{c.rating}</td>
                  <td className="py-2 px-2 sm:px-4 border-b">{c.rank}</td>
                  <td className="py-2 px-2 sm:px-4 border-b">{c.unsolved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Problem Solving Data Section */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2 gap-2 sm:gap-4">
          <h3 className="text-base sm:text-lg font-semibold">Problem Solving Data</h3>
          <select value={problemFilter} onChange={e => setProblemFilter(e.target.value)} className="border rounded px-2 py-1 text-sm">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
        <div className="mb-4 text-xs sm:text-base">
          <div>Most Difficult Problem Solved: <b>{problemStats.mostDifficult.name}</b> (Rating: {problemStats.mostDifficult.rating})</div>
          <div>Total Problems Solved: <b>{problemStats.totalSolved}</b></div>
          <div>Average Rating: <b>{problemStats.avgRating}</b></div>
          <div>Average Problems/Day: <b>{problemStats.avgPerDay}</b></div>
        </div>
        <h4 className="font-semibold mb-2 text-xs sm:text-base">Problems Solved per Rating Bucket</h4>
        <div className="w-full overflow-x-auto">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={problemStats.ratingBuckets}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <h4 className="font-semibold mt-4 mb-2 text-xs sm:text-base">Submission Heatmap (last {problemFilter} days)</h4>
        <div className="grid grid-cols-7 gap-2">
          {filteredHeatmap.map((d, i) => (
            <div key={i} className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded text-xs sm:text-base ${d.count === 0 ? 'bg-gray-200 dark:bg-gray-700' : 'bg-green-400 dark:bg-green-600'}`}>{d.count}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;