import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import axios from 'axios';

interface Student {
  id: string;
  name: string;
  codeforcesHandle: string;
}

interface Contest {
  contestName: string;
  newRating: number;
  rank: number;
  participationTimeSeconds: number;
}

interface ProblemStats {
  totalSolved: number;
  avgRating: number;
  avgPerDay: number;
  mostDifficult: { name: string; rating: number };
  ratingBuckets: { rating: string; count: number }[];
  heatmap: { date: string; count: number }[];
}

const StudentProfile: React.FC = () => {
  const { id } = useParams();
  const [contestFilter, setContestFilter] = useState('30');
  const [problemFilter, setProblemFilter] = useState('7');
  const [student, setStudent] = useState<Student | null>(null);
  const [contests, setContests] = useState<Contest[]>([]);
  const [problemStats, setProblemStats] = useState<ProblemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always use mock data for now
    setStudent({ id: id || '1', name: 'John Doe', codeforcesHandle: 'johndoe' });
    setContests([
      { contestName: 'Div 2 Round 850', newRating: 1200, rank: 150, participationTimeSeconds: Date.now()/1000 - 86400 },
      { contestName: 'Div 2 Round 851', newRating: 1250, rank: 120, participationTimeSeconds: Date.now()/1000 - 172800 },
      { contestName: 'Div 2 Round 852', newRating: 1300, rank: 100, participationTimeSeconds: Date.now()/1000 - 259200 }
    ]);
    setProblemStats({
      totalSolved: 45,
      avgRating: 1200,
      avgPerDay: 2.1,
      mostDifficult: { name: 'Two Pointers Problem', rating: 1600 },
      ratingBuckets: [
        { rating: '800-999', count: 8 },
        { rating: '1000-1199', count: 15 },
        { rating: '1200-1399', count: 12 },
        { rating: '1400-1599', count: 7 },
        { rating: '1600+', count: 3 }
      ],
      heatmap: Array.from({ length: parseInt(problemFilter) }, (_, i) => ({
        date: new Date(Date.now() - (parseInt(problemFilter) - 1 - i) * 86400000).toISOString().slice(0, 10),
        count: Math.floor(Math.random() * 5)
      }))
    });
    setLoading(false);
  }, [id, contestFilter, problemFilter]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!student) return <div className="p-4">Student not found</div>;

  const chartData = contests.map(c => ({
    date: new Date(c.participationTimeSeconds * 1000).toLocaleDateString(),
    rating: c.newRating,
    rank: c.rank
  }));

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-lg sm:text-xl font-bold mb-4">{student.name} - {student.codeforcesHandle}</h2>
      {/* Contest History Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2 gap-2 sm:gap-4">
          <h3 className="text-base sm:text-lg font-semibold">Contest History</h3>
          <select value={contestFilter} onChange={e => setContestFilter(e.target.value)} className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last 365 days</option>
          </select>
        </div>
        <div className="w-full overflow-x-auto">
          <div className="h-64 bg-white dark:bg-gray-800 p-4 rounded border">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis domain={['auto', 'auto']} stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }} />
                <Line type="monotone" dataKey="rating" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full mt-4 border border-gray-300 dark:border-gray-700 text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800">
                <th className="py-2 px-2 sm:px-4 border-b">Date</th>
                <th className="py-2 px-2 sm:px-4 border-b">Rating</th>
                <th className="py-2 px-2 sm:px-4 border-b">Rank</th>
                <th className="py-2 px-2 sm:px-4 border-b">Contest</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((c, i) => (
                <tr key={i} className="text-center">
                  <td className="py-2 px-2 sm:px-4 border-b">
                    {new Date(c.participationTimeSeconds * 1000).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border-b">{c.newRating}</td>
                  <td className="py-2 px-2 sm:px-4 border-b">{c.rank}</td>
                  <td className="py-2 px-2 sm:px-4 border-b">{c.contestName}</td>
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
          <select value={problemFilter} onChange={e => setProblemFilter(e.target.value)} className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
        {problemStats && (
          <div className="mb-4 text-xs sm:text-base">
            <div>Most Difficult Problem Solved: <b>{problemStats.mostDifficult.name}</b> (Rating: {problemStats.mostDifficult.rating})</div>
            <div>Total Problems Solved: <b>{problemStats.totalSolved}</b></div>
            <div>Average Rating: <b>{problemStats.avgRating}</b></div>
            <div>Average Problems/Day: <b>{problemStats.avgPerDay}</b></div>
          </div>
        )}
        <h4 className="font-semibold mb-2 text-xs sm:text-base">Problems Solved per Rating Bucket</h4>
        <div className="w-full overflow-x-auto">
          <div className="h-64 bg-white dark:bg-gray-800 p-4 rounded border">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={problemStats?.ratingBuckets || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="rating" stroke="#6b7280" />
                <YAxis allowDecimals={false} stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }} />
                <Bar dataKey="count" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <h4 className="font-semibold mt-4 mb-2 text-xs sm:text-base">Submission Heatmap (last {problemFilter} days)</h4>
        <div className="grid grid-cols-7 gap-2">
          {problemStats?.heatmap.map((d, i) => (
            <div key={i} className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded text-xs sm:text-sm font-bold ${d.count === 0 ? 'bg-gray-200 dark:bg-gray-700 text-gray-500' : d.count <= 2 ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' : 'bg-green-500 dark:bg-green-600 text-white'}`}>
              {d.count}
            </div>
          )) || []}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;