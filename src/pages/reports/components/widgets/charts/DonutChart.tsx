
import { useState, useEffect } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';

// Mock data for donut chart
const generateMockData = () => {
  const categories = ['0-30 days', '31-60 days', '61-90 days', '91+ days'];
  
  return categories.map(category => {
    const value = Math.floor(Math.random() * 500000) + 100000;
    return {
      name: category,
      value
    };
  });
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

export function DonutChart() {
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    setData(generateMockData());
  }, []);

  if (data.length === 0) {
    return <div className="h-full w-full flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={90}
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: any) => [`₹${value.toLocaleString()}`, '']}
          labelStyle={{ fontWeight: 'bold' }}
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            border: '1px solid #f0f0f0'
          }}
        />
        <Legend 
          verticalAlign="bottom" 
          align="center"
          layout="horizontal"
          iconSize={10}
          iconType="circle"
          wrapperStyle={{
            paddingTop: '20px',
            fontSize: '12px'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
