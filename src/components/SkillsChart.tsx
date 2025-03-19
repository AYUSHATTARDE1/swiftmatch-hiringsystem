
import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

interface SkillRating {
  skill: string;
  rating: number;
  fullMark: number;
}

interface SkillsChartProps {
  data: SkillRating[];
  className?: string;
}

const SkillsChart: React.FC<SkillsChartProps> = ({ data, className }) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid strokeDasharray="3 3" stroke="var(--border)" />
          <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--muted-foreground)' }} />
          <Radar
            name="Skills"
            dataKey="rating"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
            animationDuration={1000}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillsChart;
