
import { useState } from "react";
import { Loan, LoanInstallment } from "../index";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CircleDollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AmortizationChartProps {
  loan: Loan;
  installments: LoanInstallment[];
}

export function AmortizationChart({ loan, installments }: AmortizationChartProps) {
  const [activeTab, setActiveTab] = useState("schedule");
  
  // Sort installments by due date
  const sortedInstallments = [...installments].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
  
  // Generate chart data
  const chartData = sortedInstallments.map((installment, index) => {
    const month = new Date(installment.dueDate).toLocaleDateString('default', { month: 'short' });
    const remaining = loan.principal - (installment.amount * (index + 1));
    
    return {
      name: month,
      principal: installment.amount,
      interest: 0, // No interest in our case
      balance: Math.max(0, remaining)
    };
  });
  
  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schedule">Repayment Schedule</TabsTrigger>
          <TabsTrigger value="chart">Amortization Chart</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Remaining Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInstallments.map((installment, index) => {
                const remaining = loan.principal - (installment.amount * (index + 1));
                
                return (
                  <TableRow key={installment.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{new Date(installment.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>₹{installment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          installment.status === "PAID" 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : installment.status === "OVERDUE"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }
                      >
                        {installment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {installment.paidOn 
                        ? new Date(installment.paidOn).toLocaleDateString() 
                        : '-'}
                    </TableCell>
                    <TableCell>₹{Math.max(0, remaining).toLocaleString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="chart" className="mt-4">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
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
                <Tooltip 
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, undefined]}
                />
                <Legend />
                <Bar dataKey="principal" stackId="a" name="Principal" fill="#4f46e5" />
                <Bar dataKey="interest" stackId="a" name="Interest" fill="#c084fc" />
                <Bar dataKey="balance" name="Remaining Balance" fill="#94a3b8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
