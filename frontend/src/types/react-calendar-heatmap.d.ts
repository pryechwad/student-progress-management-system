declare module 'react-calendar-heatmap' {
  import * as React from 'react';

  interface HeatmapValue {
    date: string;
    count?: number;
  }

  interface HeatmapProps {
    startDate: Date;
    endDate: Date;
    values: HeatmapValue[];
    classForValue?: (value: HeatmapValue | null) => string;
    tooltipDataAttrs?: (value: HeatmapValue) => object;
    showWeekdayLabels?: boolean;
  }

  const CalendarHeatmap: React.FC<HeatmapProps>;
  export default CalendarHeatmap;
}
