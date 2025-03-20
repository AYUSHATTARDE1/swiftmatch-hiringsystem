
import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis } from 'recharts';

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
          <PolarGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            style={{ fontSize: '12px' }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false}
          />
          <Radar
            name="Skills"
            dataKey="rating"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillsChart;
