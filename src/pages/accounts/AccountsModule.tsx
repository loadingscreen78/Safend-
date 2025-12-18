
import { useState, Suspense, useEffect, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ModuleHeader } from "@/components/ui/module-header";
import { ModuleCard } from "@/components/ui/module-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { Button } from "@/components/ui/button";
import { 
  BarChart2, IndianRupee, FileText, Receipt, LineChart,
  Landmark, Briefcase, Calendar, Plus, CreditCard
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/hooks/operations/usePermissions";
import { AccountsProvider, useAccountsContext, AccountsSection } from "@/context/AccountsContext";
import { FormsProvider, useFormsController } from "./components/forms/FormsController";

// Import Accounts Components
import { AccountsDashboard } from "./components/AccountsDashboard";
import { ManagePayables } from "./components/ManagePayables";
import { ManageReceivables } from "./components/ManageReceivables";
import { ComplianceModule } from "./components/ComplianceModule";
import { AssetsLiabilities } from "./components/AssetsLiabilities";
import { BankingModule } from "./components/BankingModule";

// Define tabs structure
const accountsTabs = [
  { id: "dashboard", label: "Dashboard", icon: BarChart2, section: 'dashboard' as AccountsSection },
  { id: "payables", label: "Payables", icon: CreditCard, section: 'payables' as AccountsSection },
  { id: "receivables", label: "Receivables", icon: Receipt, section: 'receivables' as AccountsSection },
  { id: "compliance", label: "Compliance", icon: FileText, section: 'compliance' as AccountsSection },
  { id: "assets-liabilities", label: "Assets & Liabilities", icon: Briefcase, section: 'assets-liabilities' as AccountsSection },
  { id: "banking", label: "Banking", icon: Landmark, section: 'banking' as AccountsSection }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Loading component for tab content
function TabContentLoading() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const increment = Math.max(1, Math.floor((100 - prev) / 10));
        const newValue = Math.min(99, prev + increment);
        return newValue;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingAnimation size="lg" color="red" showPercentage={true} percentageValue={loadingProgress} />
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading data...</p>
    </div>
  );
}

function AccountsModuleContent() {
  const { 
    activeSection, setActiveSection, isDataLoading, 
    setCurrentFilter, setIsDataLoading, triggerRefresh, 
    filters, selectedBranch, branchName 
  } = useAccountsContext();
  
  const { openExpenseForm, openInvoiceForm, openTransactionForm } = useFormsController();
  
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { toast } = useToast();
  const { hasModuleAction } = usePermissions();
  
  // Get current filters for active section
  const currentFilters = useMemo(() => {
    return filters[activeSection] || [];
  }, [activeSection, filters]);
  
  const [activeFilter, setActiveFilter] = useState(currentFilters[0] || "All");

  useEffect(() => {
    // When section changes, reset filter to first available
    setActiveFilter(currentFilters[0] || "All");
    setCurrentFilter(currentFilters[0] || "All");
  }, [activeSection, currentFilters, setCurrentFilter]);

  const handleTabChange = (value: string) => {
    const section = accountsTabs.find(tab => tab.id === value)?.section || 'dashboard';
    if (section === activeSection) return;
    
    setIsDataLoading(true);
    setLoadingProgress(0);
    setActiveSection(section);
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newValue = prev + Math.floor(Math.random() * 20);
        return newValue >= 100 ? 100 : newValue;
      });
    }, 200);
    
    // Simulate loading delay with completion
    setTimeout(() => {
      clearInterval(progressInterval);
      setLoadingProgress(100);
      
      // Small delay to show 100% before hiding
      setTimeout(() => {
        setIsDataLoading(false);
        setLoadingProgress(0);
        
        toast({
          title: `Viewing ${value.charAt(0).toUpperCase() + value.slice(1)}`,
          description: `Switched to ${value} tab`,
          duration: 2000,
        });
      }, 300);
    }, 800);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentFilter(filter);
    triggerRefresh(); // Refresh data when filter changes
  };

  const getActionButton = () => {
    // Check if user has permission to create in the accounts module
    const canCreate = hasModuleAction("accounts", "create");
    
    if (!canCreate) return null;
    
    switch (activeSection) {
      case "payables":
        return {
          label: "New Expense",
          icon: <Plus className="mr-2 h-4 w-4" />,
          action: openExpenseForm
        };
      case "receivables":
        return {
          label: "New Invoice",
          icon: <Plus className="mr-2 h-4 w-4" />,
          action: openInvoiceForm
        };
      case "banking":
        return {
          label: "Record Transaction",
          icon: <Plus className="mr-2 h-4 w-4" />,
          action: openTransactionForm
        };
      default:
        return null;
    }
  };

  const actionButton = getActionButton();

  // Quick Action Button (floating action button)
  const getFloatingActionButton = () => {
    if (!hasModuleAction("accounts", "create")) return null;
    
    let label = "";
    let action = () => {};
    
    switch (activeSection) {
      case "payables":
        label = "Add Expense";
        action = openExpenseForm;
        break;
      case "receivables":
        label = "Add Invoice";
        action = openInvoiceForm;
        break;
      case "banking":
        label = "Add Transaction";
        action = openTransactionForm;
        break;
      default:
        return null;
    }
    
    return (
      <Button 
        variant="floating" 
        onClick={action}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        {label}
      </Button>
    );
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <ModuleHeader 
        title={`Accounts & Finance${branchName ? ` - ${branchName}` : ''}`}
        description="Manage financial operations, accounting, compliance and banking"
        actionLabel={actionButton?.label}
        actionIcon={actionButton?.icon}
        onAction={actionButton?.action}
      />
      
      <ModuleCard>
        <Tabs 
          value={accountsTabs.find(tab => tab.section === activeSection)?.id || 'dashboard'} 
          onValueChange={handleTabChange} 
          className="w-full"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <ScrollArea className="w-full">
              <TabsList className="inline-flex md:grid grid-cols-3 lg:grid-cols-6 gap-1 w-full md:w-auto bg-gray-100 dark:bg-gray-800/50 p-1 rounded-lg min-w-max">
                {accountsTabs.map(tab => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id} 
                    className="flex gap-2 items-center transition-all duration-200"
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
            
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {currentFilters.map((filter) => (
                <Button
                  key={filter}
                  variant={filter === activeFilter ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(filter)}
                  className="whitespace-nowrap"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="p-6">
              {isDataLoading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="text-center">
                    <LoadingAnimation 
                      size="lg" 
                      color="red" 
                      showPercentage={true}
                      percentageValue={loadingProgress}
                    />
                    <p className="mt-4 text-gray-500">Loading financial data...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Dashboard Tab */}
                  <TabsContent value="dashboard" className="space-y-6 animate-in fade-in-50">
                    <Suspense fallback={<TabContentLoading />}>
                      <AccountsDashboard filter={activeFilter} />
                    </Suspense>
                  </TabsContent>
                  
                  {/* Payables Tab */}
                  <TabsContent value="payables" className="space-y-6 animate-in fade-in-50">
                    <Suspense fallback={<TabContentLoading />}>
                      <ManagePayables filter={activeFilter} />
                    </Suspense>
                  </TabsContent>
                  
                  {/* Receivables Tab */}
                  <TabsContent value="receivables" className="space-y-6 animate-in fade-in-50">
                    <Suspense fallback={<TabContentLoading />}>
                      <ManageReceivables filter={activeFilter} />
                    </Suspense>
                  </TabsContent>
                  
                  {/* Compliance Tab */}
                  <TabsContent value="compliance" className="space-y-6 animate-in fade-in-50">
                    <Suspense fallback={<TabContentLoading />}>
                      <ComplianceModule filter={activeFilter} />
                    </Suspense>
                  </TabsContent>
                  
                  {/* Assets & Liabilities Tab */}
                  <TabsContent value="assets-liabilities" className="space-y-6 animate-in fade-in-50">
                    <Suspense fallback={<TabContentLoading />}>
                      <AssetsLiabilities filter={activeFilter} />
                    </Suspense>
                  </TabsContent>
                  
                  {/* Banking Tab */}
                  <TabsContent value="banking" className="space-y-6 animate-in fade-in-50">
                    <Suspense fallback={<TabContentLoading />}>
                      <BankingModule filter={activeFilter} />
                    </Suspense>
                  </TabsContent>
                </>
              )}
            </div>
          </ScrollArea>
        </Tabs>
      </ModuleCard>
      
      {/* Floating Action Button */}
      {getFloatingActionButton()}
    </motion.div>
  );
}

export function AccountsModule() {
  return (
    <AccountsProvider>
      <FormsProvider>
        <Layout>
          <AccountsModuleContent />
        </Layout>
      </FormsProvider>
    </AccountsProvider>
  );
}
