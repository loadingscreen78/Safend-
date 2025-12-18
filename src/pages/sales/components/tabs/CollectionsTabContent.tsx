import React from "react";
import { Card } from "@/components/ui/card";
import { AgingInvoicesTable } from "../AgingInvoicesTable";

interface CollectionsTabContentProps {
  activeFilter: string;
  searchTerm: string;
  onEdit: (item: any, type: string) => void;
}

export function CollectionsTabContent({
  activeFilter,
  searchTerm,
  onEdit
}: CollectionsTabContentProps) {
  return (
    <>
      <div className="bg-gradient-to-r from-red-50 to-gray-50 dark:from-red-900/20 dark:to-gray-900/20 p-6 rounded-lg border border-red-100 dark:border-red-800/30">
        <h3 className="text-lg font-medium mb-2">Aging Invoice Collection</h3>
        <p className="text-muted-foreground">
          Track and manage overdue invoices and collection activities.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-6 hover:shadow-lg transition-shadow border-t-4 stat-border-gray">
          <h4 className="font-semibold text-gray-600 dark:text-gray-300">0-30 Days</h4>
          <p className="text-3xl font-bold stat-text-gray mt-2">₹5.2L</p>
          <p className="text-xs text-muted-foreground mt-1">14 invoices</p>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-shadow border-t-4 stat-border-black">
          <h4 className="font-semibold text-gray-600 dark:text-gray-300">31-60 Days</h4>
          <p className="text-3xl font-bold stat-text-black mt-2">₹3.7L</p>
          <p className="text-xs text-muted-foreground mt-1">8 invoices</p>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-shadow border-t-4 stat-border-gray">
          <h4 className="font-semibold text-gray-600 dark:text-gray-300">61-90 Days</h4>
          <p className="text-3xl font-bold stat-text-gray mt-2">₹2.1L</p>
          <p className="text-xs text-muted-foreground mt-1">5 invoices</p>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-shadow border-t-4 stat-border-red">
          <h4 className="font-semibold text-gray-600 dark:text-gray-300">90+ Days</h4>
          <p className="text-3xl font-bold stat-text-red mt-2">₹1.8L</p>
          <p className="text-xs text-muted-foreground mt-1">3 invoices</p>
        </Card>
      </div>
      
      <AgingInvoicesTable 
        filter={activeFilter}
        searchTerm={searchTerm}
        onEdit={(item) => onEdit(item, "aging")}
      />
    </>
  );
}