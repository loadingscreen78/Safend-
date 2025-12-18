import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileSignature, 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Download,
  Upload,
  Edit
} from "lucide-react";
import { AgreementsTable } from "./AgreementsTable";
import { WorkordersTable } from "./WorkordersTable";
import { subscribeToAgreements } from "@/services/firebase/AgreementFirebaseService";
import { subscribeToWorkOrders } from "@/services/firebase/WorkOrderFirebaseService";
import { addWorkOrder } from "@/services/firebase/WorkOrderFirebaseService";
import { useToast } from "@/components/ui/use-toast";

interface ContractsManagementProps {
  filter: string;
  searchTerm: string;
  onEdit: (item: any, type: string) => void;
}

interface WorkflowItem {
  id: string;
  quotationRef: string;
  client: string;
  stage: string;
  agreementStatus: string;
  workOrderStatus: string;
  value: string;
  progress: number;
  nextAction: string;
  timeline: string;
  agreementId?: string;
  workOrderId?: string;
}

const getStageColor = (stage: string) => {
  switch (stage) {
    case "pending_agreement": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "agreement_signed": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "work_order_active": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "work_order_completed": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400";
    case "work_order_cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    "Draft": "outline",
    "Signed": "default", 
    "Active": "default",
    "Not Created": "secondary"
  };
  
  return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
};

export function ContractsManagement({ filter, searchTerm, onEdit }: ContractsManagementProps) {
  const [activeSubTab, setActiveSubTab] = useState("workflow");
  const [agreements, setAgreements] = useState<any[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [contractWorkflow, setContractWorkflow] = useState<WorkflowItem[]>([]);
  const { toast } = useToast();

  // Subscribe to real-time agreements and work orders
  useEffect(() => {
    const unsubscribeAgreements = subscribeToAgreements((firebaseAgreements) => {
      setAgreements(firebaseAgreements);
    });
    
    const unsubscribeWorkOrders = subscribeToWorkOrders((firebaseWorkOrders) => {
      setWorkOrders(firebaseWorkOrders);
    });
    
    return () => {
      unsubscribeAgreements();
      unsubscribeWorkOrders();
    };
  }, []);

  // Build workflow items from agreements and work orders
  useEffect(() => {
    const workflow: WorkflowItem[] = [];
    
    // Process each agreement
    agreements.forEach(agreement => {
      // Find associated work order
      const associatedWorkOrder = workOrders.find(wo => wo.linkedAgreementId === agreement.id);
      
      // Determine stage
      let stage = "pending_agreement";
      let progress = 25;
      let nextAction = "Finalize Agreement Terms";
      let timeline = "Awaiting signature";
      let workOrderStatus = "Not Created";
      
      if (agreement.status === "Signed") {
        if (associatedWorkOrder) {
          // Check if work order is cancelled
          if (associatedWorkOrder.status === "Cancelled") {
            stage = "work_order_cancelled";
            progress = 0;
            nextAction = "Work Order Cancelled";
            timeline = "Contract terminated";
            workOrderStatus = "Cancelled";
          } else if (associatedWorkOrder.status === "Completed") {
            stage = "work_order_completed";
            progress = 100;
            nextAction = "Service Completed";
            timeline = "Contract fulfilled";
            workOrderStatus = "Completed";
          } else {
            stage = "work_order_active";
            progress = 100;
            nextAction = "Service Delivery";
            timeline = "Operational";
            workOrderStatus = associatedWorkOrder.status;
          }
        } else {
          stage = "agreement_signed";
          progress = 60;
          nextAction = "Generate Work Order";
          timeline = "Ready to proceed";
          workOrderStatus = "Not Created";
        }
      } else if (agreement.status === "Pending Signature") {
        stage = "pending_agreement";
        progress = 25;
        nextAction = "Finalize Agreement Terms";
        timeline = "Awaiting signature";
      }
      
      workflow.push({
        id: agreement.id,
        quotationRef: agreement.linkedQuoteId || "N/A",
        client: agreement.clientName,
        stage,
        agreementStatus: agreement.status,
        workOrderStatus,
        value: agreement.value,
        progress,
        nextAction,
        timeline,
        agreementId: agreement.id,
        workOrderId: associatedWorkOrder?.id
      });
    });
    
    setContractWorkflow(workflow);
  }, [agreements, workOrders]);

  // Filter contract workflow based on filter
  const filteredWorkflow = contractWorkflow.filter(contract => {
    if (filter === "All Contracts") return true;
    if (filter === "Pending Agreement") return contract.stage === "pending_agreement";
    if (filter === "Agreement Signed") return contract.stage === "agreement_signed";
    if (filter === "Work Order Created") return contract.workOrderStatus !== "Not Created";
    if (filter === "Active") return contract.stage === "work_order_active";
    if (filter === "Completed") return contract.stage === "work_order_completed";
    if (filter === "Cancelled") return contract.stage === "work_order_cancelled";
    return true;
  });

  const handleGenerateWorkOrder = async (contract: WorkflowItem) => {
    // Find the agreement
    const agreement = agreements.find(a => a.id === contract.agreementId);
    
    if (!agreement) {
      toast({
        title: "Error",
        description: "Agreement not found",
        variant: "destructive",
      });
      return;
    }
    
    // Create work order from agreement
    const result = await addWorkOrder({
      linkedAgreementId: agreement.id,
      clientName: agreement.clientName,
      serviceDetails: agreement.serviceDetails,
      value: agreement.value,
      status: "Draft"
    });
    
    if (result.success) {
      toast({
        title: "Work Order Created",
        description: "Work order has been generated successfully!",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to create work order",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-gray-50 dark:from-red-900/20 dark:to-gray-900/20 p-6 rounded-lg border border-red-100 dark:border-red-800/30">
        <h3 className="text-lg font-medium mb-2">Contract Management Workflow</h3>
        <p className="text-muted-foreground">
          Intelligent progression from quotation approval to agreement finalization and work order generation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 hover:shadow-lg transition-shadow border-t-4 stat-border-yellow">
          <h4 className="font-semibold text-gray-600 dark:text-gray-300">Pending Agreements</h4>
          <p className="text-3xl font-bold stat-text-yellow mt-2">
            {agreements.filter(a => a.status === "Pending Signature" || a.status === "Draft").length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Awaiting signature</p>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-shadow border-t-4 stat-border-blue">
          <h4 className="font-semibold text-gray-600 dark:text-gray-300">Agreements Signed</h4>
          <p className="text-3xl font-bold stat-text-blue mt-2">
            {agreements.filter(a => a.status === "Signed").length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Ready for work orders</p>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-shadow border-t-4 stat-border-green">
          <h4 className="font-semibold text-gray-600 dark:text-gray-300">Active Contracts</h4>
          <p className="text-3xl font-bold stat-text-green mt-2">
            {workOrders.filter(wo => wo.status === "In Progress" || wo.status === "Scheduled").length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Service delivery</p>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-shadow border-t-4 stat-border-red">
          <h4 className="font-semibold text-gray-600 dark:text-gray-300">Total Value</h4>
          <p className="text-3xl font-bold stat-text-red mt-2">
            {(() => {
              const total = agreements.reduce((sum, a) => {
                const value = parseFloat(a.value?.replace(/[₹,]/g, '') || '0');
                return sum + value;
              }, 0);
              return `₹${(total / 100000).toFixed(1)}L`;
            })()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Active contracts</p>
        </Card>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflow" className="flex gap-2">
            <ArrowRight className="h-4 w-4" />
            Workflow View
          </TabsTrigger>
          <TabsTrigger value="agreements" className="flex gap-2">
            <FileSignature className="h-4 w-4" />
            Agreements
          </TabsTrigger>
          <TabsTrigger value="workorders" className="flex gap-2">
            <ClipboardList className="h-4 w-4" />
            Work Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="space-y-4">
          <Card>
            <div className="p-6">
              <h4 className="font-semibold mb-4">Contract Progression Pipeline</h4>
              <div className="space-y-4">
                {filteredWorkflow.map((contract) => (
                  <div key={contract.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h5 className="font-medium">{contract.client}</h5>
                          <Badge className={getStageColor(contract.stage)}>
                            {contract.stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Quote Ref:</span> {contract.quotationRef}
                          </div>
                          <div>
                            <span className="font-medium">Agreement:</span> {getStatusBadge(contract.agreementStatus)}
                          </div>
                          <div>
                            <span className="font-medium">Work Order:</span> {getStatusBadge(contract.workOrderStatus)}
                          </div>
                          <div>
                            <span className="font-medium">Value:</span> {contract.value}
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress: {contract.nextAction}</span>
                            <span>{contract.progress}%</span>
                          </div>
                          <Progress value={contract.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">{contract.timeline}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {contract.stage === "pending_agreement" && (
                          <Button size="sm" variant="outline" onClick={() => onEdit(contract, "agreement")}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Agreement
                          </Button>
                        )}
                        {contract.stage === "agreement_signed" && contract.workOrderStatus === "Draft" && (
                          <Button size="sm" onClick={() => handleGenerateWorkOrder(contract)}>
                            <ClipboardList className="h-4 w-4 mr-1" />
                            Generate Work Order
                          </Button>
                        )}
                        {contract.stage === "work_order_active" && (
                          <Button size="sm" variant="outline" onClick={() => onEdit(contract, "workorder")}>
                            <Edit className="h-4 w-4 mr-1" />
                            View Work Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="agreements">
          <AgreementsTable
            filter="All Agreements"
            searchTerm={searchTerm}
            onEdit={(item) => onEdit(item, "agreement")}
          />
        </TabsContent>

        <TabsContent value="workorders">
          <WorkordersTable
            filter="All Workorders"
            searchTerm={searchTerm}
            onEdit={(item) => onEdit(item, "workorder")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}