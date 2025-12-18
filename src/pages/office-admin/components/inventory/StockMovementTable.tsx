
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useAppData } from "@/contexts/AppDataContext";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function StockMovementTable() {
  const { activeBranch } = useAppData();
  const [transactionType, setTransactionType] = useState("all");
  
  // This would come from a real API in a full implementation
  const stockTransactions = [
    {
      id: "TXN-2025-001",
      date: "2025-05-01",
      itemName: "Security Badge",
      type: "stock-in",
      quantity: 50,
      reference: "PO-2025-042"
    },
    {
      id: "TXN-2025-002",
      date: "2025-05-02",
      itemName: "Radio Sets",
      type: "stock-out",
      quantity: -5,
      reference: "AL-2025-078"
    },
    {
      id: "TXN-2025-003",
      date: "2025-05-03",
      itemName: "Flashlights",
      type: "return",
      quantity: 2,
      reference: "RT-2025-016"
    },
    {
      id: "TXN-2025-004",
      date: "2025-05-05",
      itemName: "Uniforms",
      type: "stock-out",
      quantity: -10,
      reference: "DIST-2025-031"
    }
  ];

  const filteredTransactions = transactionType === "all" 
    ? stockTransactions 
    : stockTransactions.filter(txn => txn.type === transactionType);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Transaction Type:</h3>
          <Select value={transactionType} onValueChange={setTransactionType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="stock-in">Stock In</SelectItem>
              <SelectItem value="stock-out">Stock Out</SelectItem>
              <SelectItem value="return">Returns</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          <span>Export Ledger</span>
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Transaction Type</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.itemName}</TableCell>
                  <TableCell className="capitalize">{transaction.type.replace('-', ' ')}</TableCell>
                  <TableCell className={`text-right ${transaction.quantity < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {transaction.quantity > 0 ? `+${transaction.quantity}` : transaction.quantity}
                  </TableCell>
                  <TableCell>{transaction.reference}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
