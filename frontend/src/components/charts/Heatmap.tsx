import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

interface SubmissionData {
  date: string;
  count?: number;
}

interface HeatmapProps {
  data: SubmissionData[];
}

export default function Heatmap({ data }: HeatmapProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-md p-4 shadow">
      <CalendarHeatmap
        startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
        endDate={new Date()}
        values={data}
        classForValue={(value) => {
          if (!value || !value.count) return 'color-empty';
          if (value.count > 5) return 'color-github-4';
          if (value.count > 3) return 'color-github-3';
          if (value.count > 1) return 'color-github-2';
          return 'color-github-1';
        }}
        tooltipDataAttrs={(value) => ({
          'data-tip': `${value.date}: ${value.count ?? 0} submissions`,
        })}
        showWeekdayLabels
      />
    </div>
  );
}
