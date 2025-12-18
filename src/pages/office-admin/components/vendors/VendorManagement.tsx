
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search } from "lucide-react";
import { useAppData } from "@/contexts/AppDataContext";
import { VendorList } from "./VendorList";
import { PurchaseRequestsList } from "./PurchaseRequestsList";

export function VendorManagement() {
  const { activeBranch, branches, isLoading } = useAppData();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("vendors");
  
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
        <h2 className="text-2xl font-bold">Vendor & Purchase Management</h2>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors or PRs..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button size="sm" className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>{activeTab === "vendors" ? "Add New Vendor" : "Create Purchase Request"}</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            {activeTab === "vendors" ? "Vendors" : "Purchase Requests"} - {activeBranchName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="purchase-requests">Purchase Requests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vendors">
              <VendorList searchQuery={searchQuery} />
            </TabsContent>
            
            <TabsContent value="purchase-requests">
              <PurchaseRequestsList searchQuery={searchQuery} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
