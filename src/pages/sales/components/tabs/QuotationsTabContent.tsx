import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { QuotationsTable } from "../QuotationsTable";
import { subscribeToQuotations } from "@/services/firebase/QuotationFirebaseService";

interface QuotationsTabContentProps {
  activeFilter: string;
  searchTerm: string;
  onEdit: (item: any, type: string) => void;
}

export function QuotationsTabContent({
  activeFilter,
  searchTerm,
  onEdit
}: QuotationsTabContentProps) {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });

  useEffect(() => {
    const unsubscribe = subscribeToQuotations((quotations) => {
      const total = quotations.length;
      const pending = quotations.filter(q => q.status === "Pending" || q.status === "Draft").length;
      const accepted = quotations.filter(q => q.status === "Approved" || q.status === "Accepted").length;
      const rejected = quotations.filter(q => q.status === "Rejected").length;
      
      setStats({ total, pending, accepted, rejected });
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="bg-gradient-to-r from-red-50 to-gray-50 dark:from-red-900/20 dark:to-gray-900/20 p-6 rounded-lg border border-red-100 dark:border-red-800/30">
        <h3 className="text-lg font-medium mb-2">Quotation Management</h3>
        <p className="text-muted-foreground">
          Create, track, and manage quotations for your clients and prospects.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-6 hover:shadow-lg transition-shadow border-t-4 stat-border-black">
          <h4 className="font-semibold text-gray-600 dark:text-gray-300">Total</h4>
          <p className="text-3xl font-bold stat-text-black mt-2">{stats.total}</p>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-shadow border-t-4 stat-border-gray">
          <h4 className="font-semibold text-gray-600 dark:text-gray-300">Pending</h4>
          <p className="text-3xl font-bold stat-text-gray mt-2">{stats.pending}</p>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-shadow border-t-4 stat-border-red">
          <h4 className="font-semibold text-gray-600 dark:text-gray-300">Accepted</h4>
          <p className="text-3xl font-bold stat-text-red mt-2">{stats.accepted}</p>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-shadow border-t-4 stat-border-gray">
          <h4 className="font-semibold text-gray-600 dark:text-gray-300">Rejected</h4>
          <p className="text-3xl font-bold stat-text-gray mt-2">{stats.rejected}</p>
        </Card>
      </div>
      
      <QuotationsTable 
        filter={activeFilter}
        searchTerm={searchTerm}
        onEdit={(item) => onEdit(item, "quotation")}
      />
    </>
  );
}