
import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Filter } from "lucide-react";

// Mock data for operational reports
const attendanceData = [
  { name: "Week 1", present: 95, late: 3, absent: 2 },
  { name: "Week 2", present: 94, late: 4, absent: 2 },
  { name: "Week 3", present: 92, late: 5, absent: 3 },
  { name: "Week 4", present: 96, late: 2, absent: 2 },
];

const incidentData = [
  { name: "Jan", incidents: 5 },
  { name: "Feb", incidents: 7 },
  { name: "Mar", incidents: 4 },
  { name: "Apr", incidents: 6 },
  { name: "May", incidents: 3 },
];

const complianceData = [
  { name: "Uniform", value: 96 },
  { name: "Protocol", value: 92 },
  { name: "Training", value: 88 },
  { name: "Reports", value: 85 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface OperationsReportsViewProps {
  filter: string;
}

export function OperationsReportsView({ filter }: OperationsReportsViewProps) {
  const [dateRange, setDateRange] = useState("Last 30 days");
  
  // This would change based on the filter in a real application
  const reportTitle = filter === "All Reports" ? "Operational Overview" : filter;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">{reportTitle}</h3>
          <p className="text-muted-foreground">Data for {dateRange}</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="flex gap-2 items-center">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
          </Button>
          <Button variant="outline" className="flex gap-2 items-center">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" className="flex gap-2 items-center">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Staff Attendance</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={attendanceData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" stackId="a" fill="#4CAF50" />
              <Bar dataKey="late" stackId="a" fill="#FFC107" />
              <Bar dataKey="absent" stackId="a" fill="#F44336" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        
        {/* Compliance Chart */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Compliance Metrics</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={complianceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {complianceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        
        {/* Incidents Chart */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Monthly Incidents</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={incidentData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="incidents" stroke="#ff5722" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        
        {/* Summary Stats */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Key Metrics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <p className="text-muted-foreground">Attendance Rate</p>
              <p className="text-3xl font-bold text-green-500">94.2%</p>
              <p className="text-xs text-muted-foreground">+1.2% vs last month</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <p className="text-muted-foreground">Patrol Completion</p>
              <p className="text-3xl font-bold text-amber-500">92.7%</p>
              <p className="text-xs text-muted-foreground">-0.5% vs last month</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <p className="text-muted-foreground">Avg. Response Time</p>
              <p className="text-3xl font-bold text-blue-500">4.2m</p>
              <p className="text-xs text-muted-foreground">-0.3m vs last month</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <p className="text-muted-foreground">Staff Satisfaction</p>
              <p className="text-3xl font-bold text-purple-500">86%</p>
              <p className="text-xs text-muted-foreground">+2% vs last month</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
