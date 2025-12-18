
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function MonthlyCashRequirementsTable() {
  // Get monthly cash requirements (mock)
  const monthlyCashRequirements = [
    { month: 'Mar', patrol: 25000, fuel: 18000, equipment: 12000, other: 8000, total: 63000 },
    { month: 'Apr', patrol: 27000, fuel: 19500, equipment: 8000, other: 7500, total: 62000 },
    { month: 'May', patrol: 28000, fuel: 21000, equipment: 15000, other: 9000, total: 73000 },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Monthly Cash Requirements</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Patrol</TableHead>
              <TableHead className="text-right">Fuel</TableHead>
              <TableHead className="text-right">Equipment</TableHead>
              <TableHead className="text-right">Other</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {monthlyCashRequirements.map((month) => (
              <TableRow key={month.month}>
                <TableCell className="font-medium">{month.month}</TableCell>
                <TableCell className="text-right">₹{month.patrol.toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{month.fuel.toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{month.equipment.toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{month.other.toLocaleString()}</TableCell>
                <TableCell className="text-right font-bold">₹{month.total.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
