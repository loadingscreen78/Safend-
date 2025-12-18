
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useAppData } from "@/contexts/AppDataContext";

export function LowStockTable() {
  const { inventory, activeBranch } = useAppData();
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    // Filter inventory items that are low on stock
    const lowStock = inventory.filter(
      item => item.branch === activeBranch && item.currentStock <= item.reorderLevel
    );
    setLowStockItems(lowStock);
  }, [inventory, activeBranch]);

  return (
    <div>
      {lowStockItems.length > 0 && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md flex items-start">
          <AlertTriangle className="text-amber-500 mt-0.5 mr-2 h-5 w-5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-amber-800">Reorder Required</h3>
            <p className="text-amber-700 text-sm">
              {lowStockItems.length} items are below their reorder level and need to be restocked.
            </p>
          </div>
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Current Stock</TableHead>
              <TableHead className="text-right">Reorder Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStockItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No low stock items found
                </TableCell>
              </TableRow>
            ) : (
              lowStockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right text-red-500 font-bold">{item.currentStock}</TableCell>
                  <TableCell className="text-right">{item.reorderLevel}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">Reorder Required</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="default" size="sm">
                      Create Purchase Request
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
