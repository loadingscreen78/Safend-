
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Download, Upload, QrCode, Printer, Package } from "lucide-react";
import { useAppData } from "@/contexts/AppDataContext";
import { InventoryItemsTable } from "./InventoryItemsTable";
import { StockMovementTable } from "./StockMovementTable";
import { LowStockTable } from "./LowStockTable";
import { InventoryDistributionForm } from "./InventoryDistributionForm";

export function InventoryDashboard() {
  const { activeBranch, branches, isLoading } = useAppData();
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryView, setInventoryView] = useState("items");
  
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-safend-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeBranchName = branches.find(b => b.id === activeBranch)?.name || 'Unknown Branch';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Inventory & Distribution</h2>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Upload className="h-4 w-4" />
            <span>Import CSV</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button size="sm" className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>Add Item</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            Inventory Management - {activeBranchName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={inventoryView} onValueChange={setInventoryView}>
            <TabsList className="mb-4">
              <TabsTrigger value="items">All Items</TabsTrigger>
              <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
              <TabsTrigger value="stock-movement">Stock Movement</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
            </TabsList>
            
            <TabsContent value="items">
              <InventoryItemsTable searchQuery={searchQuery} />
            </TabsContent>
            
            <TabsContent value="low-stock">
              <LowStockTable />
            </TabsContent>
            
            <TabsContent value="stock-movement">
              <StockMovementTable />
            </TabsContent>

            <TabsContent value="distribution">
              <InventoryDistributionForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
