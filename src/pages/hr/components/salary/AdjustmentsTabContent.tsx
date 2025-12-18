
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SalaryAdjustment } from "@/services/DataService";

interface Employee {
  id: string;
  name: string;
  [key: string]: any;
}

interface AdjustmentsTabContentProps {
  adjustments: SalaryAdjustment[];
  employees: Employee[];
  onRemoveAdjustment: (id: string) => void;
}

export function AdjustmentsTabContent({ 
  adjustments, 
  employees,
  onRemoveAdjustment
}: AdjustmentsTabContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter adjustments based on search term
  const filteredAdjustments = adjustments.filter(adjustment => {
    const employee = employees.find(e => e.id === adjustment.employeeId);
    
    // Search by employee name, adjustment ID, type or description
    return (
      employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Salary Adjustments</CardTitle>
            <CardDescription>
              Manage allowances and deductions for employees
            </CardDescription>
          </div>
          <div className="w-full md:w-64">
            <Input
              placeholder="Search adjustments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdjustments.length > 0 ? (
              filteredAdjustments.map((adjustment) => {
                const employee = employees.find(e => e.id === adjustment.employeeId);
                return (
                  <TableRow key={adjustment.id}>
                    <TableCell>{adjustment.id}</TableCell>
                    <TableCell>{employee?.name || "Unknown"}</TableCell>
                    <TableCell>
                      <Badge className={adjustment.type === "Allowance" ? "bg-green-500" : "bg-amber-500"}>
                        {adjustment.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{adjustment.description}</TableCell>
                    <TableCell className={adjustment.amount < 0 ? "text-red-500" : "text-green-500"}>
                      ₹{Math.abs(adjustment.amount).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => onRemoveAdjustment(adjustment.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  {searchTerm ? "No adjustments found matching your search" : "No adjustments found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
