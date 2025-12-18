
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BranchDashboard } from "./components/BranchDashboard";
import { InventoryDashboard } from "./components/inventory/InventoryDashboard";
import { VendorManagement } from "./components/vendors/VendorManagement";
import { BillManagement } from "./components/bills/BillManagement";
import { MaintenanceRepairs } from "./components/MaintenanceRepairs";
import { FacilitiesFleet } from "./components/FacilitiesFleet";
import { DocumentPolicy } from "./components/DocumentPolicy";
import { VisitorGatePass } from "./components/VisitorGatePass";

export function OfficeAdminModule() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Office Administration</h1>
          <p className="text-muted-foreground">
            Centralized management of non-HR, non-Accounts back-office tasks
          </p>
        </div>

        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full h-auto flex flex-wrap bg-card p-1 mb-8">
            <TabsTrigger value="dashboard" className="flex-grow">
              Branch Dashboard
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex-grow">
              Inventory
            </TabsTrigger>
            <TabsTrigger value="vendors" className="flex-grow">
              Vendors & Purchase
            </TabsTrigger>
            <TabsTrigger value="bills" className="flex-grow">
              Bills & Subscriptions
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex-grow">
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="facilities" className="flex-grow">
              Facilities & Fleet
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex-grow">
              Documents & Policy
            </TabsTrigger>
            <TabsTrigger value="visitor" className="flex-grow">
              Visitor Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-0">
            <BranchDashboard />
          </TabsContent>
          
          <TabsContent value="inventory" className="mt-0">
            <InventoryDashboard />
          </TabsContent>
          
          <TabsContent value="vendors" className="mt-0">
            <VendorManagement />
          </TabsContent>
          
          <TabsContent value="bills" className="mt-0">
            <BillManagement />
          </TabsContent>
          
          <TabsContent value="maintenance" className="mt-0">
            <MaintenanceRepairs />
          </TabsContent>
          
          <TabsContent value="facilities" className="mt-0">
            <FacilitiesFleet />
          </TabsContent>
          
          <TabsContent value="documents" className="mt-0">
            <DocumentPolicy />
          </TabsContent>
          
          <TabsContent value="visitor" className="mt-0">
            <VisitorGatePass />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
