
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
import { Printer, QrCode, MoreHorizontal } from "lucide-react";
import { useAppData } from "@/contexts/AppDataContext";
import { InventoryItem } from "@/services/inventory/InventoryService";

interface InventoryItemsTableProps {
  searchQuery: string;
}

export function InventoryItemsTable({ searchQuery }: InventoryItemsTableProps) {
  const { inventory, activeBranch } = useAppData();
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    // Filter inventory items based on search query and active branch
    const filtered = inventory.filter((item) => 
      item.branch === activeBranch && 
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredInventory(filtered);
  }, [inventory, activeBranch, searchQuery]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Code</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Current Stock</TableHead>
            <TableHead className="text-right">Reorder Level</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInventory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No inventory items found
              </TableCell>
            </TableRow>
          ) : (
            filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-xs">{item.id}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right">
                  <span className={item.currentStock <= item.reorderLevel ? "text-red-500 font-bold" : ""}>
                    {item.currentStock}
                  </span>
                </TableCell>
                <TableCell className="text-right">{item.reorderLevel}</TableCell>
                <TableCell>
                  <Badge variant={item.currentStock > item.reorderLevel ? "default" : "destructive"}>
                    {item.currentStock > item.reorderLevel ? "In Stock" : "Low Stock"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1">
                    <Button variant="ghost" size="icon" title="Print Barcode">
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Generate QR Code">
                      <QrCode className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="More Options">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
