
import { useState, useEffect } from 'react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mock data for line chart
const generateMockData = () => {
  const departments = ['IT', 'Operations', 'Admin', 'Sales'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return months.map(month => {
    const data: any = { name: month };
    let total = 0;
    
    departments.forEach(dept => {
      const value = Math.floor(Math.random() * 200) + 100;
      data[dept] = value;
      total += value;
    });
    
    data.Total = total;
    
    return data;
  });
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

export function LineChart() {
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    setData(generateMockData());
  }, []);

  if (data.length === 0) {
    return <div className="h-full w-full flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
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
        <YAxis />
        <Tooltip 
          formatter={(value: any) => [value, '']}
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
        {Object.keys(data[0]).filter(key => key !== 'name' && key !== 'Total').map((key, index) => (
          <Line 
            key={key} 
            type="monotone" 
            dataKey={key} 
            stroke={COLORS[index % COLORS.length]} 
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
        <Line 
          type="monotone" 
          dataKey="Total" 
          stroke="#111" 
          strokeWidth={2.5}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
          strokeDasharray="5 5"
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
