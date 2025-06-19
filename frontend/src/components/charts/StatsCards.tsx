
interface Stats {
  totalSolved: number;
  averageRating: number;
  averagePerDay: number;
  mostDifficult: string;
}

export default function StatsCards({
  totalSolved,
  averageRating,
  averagePerDay,
  mostDifficult,
}: Stats) {
  const stats = [
    { label: 'Total Solved', value: totalSolved },
    { label: 'Avg. Rating', value: averageRating },
    { label: 'Avg. per Day', value: averagePerDay },
    { label: 'Most Difficult', value: mostDifficult },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-800 p-4 rounded-md shadow text-center"
        >
          <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
