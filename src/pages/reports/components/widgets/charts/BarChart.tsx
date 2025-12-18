
import { useState, useEffect } from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mock data for bar chart
const generateMockData = () => {
  const branches = ['Branch A', 'Branch B', 'Branch C', 'Branch D', 'Branch E'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  
  return months.map(month => {
    const data: any = { name: month };
    
    branches.forEach(branch => {
      data[branch] = Math.floor(Math.random() * 100000) + 50000;
    });
    
    return data;
  });
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

export function BarChart() {
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    setData(generateMockData());
  }, []);

  if (data.length === 0) {
    return <div className="h-full w-full flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 40,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="name" />
        <YAxis 
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
        />
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
          verticalAlign="top"
          align="right"
          wrapperStyle={{
            paddingBottom: '20px',
            fontSize: '12px'
          }}
        />
        {Object.keys(data[0]).filter(key => key !== 'name').map((key, index) => (
          <Bar 
            key={key} 
            dataKey={key} 
            fill={COLORS[index % COLORS.length]} 
            name={key}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
