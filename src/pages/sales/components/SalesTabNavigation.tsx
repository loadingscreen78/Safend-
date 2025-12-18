import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Filter, ChevronDown, FileSignature, Mail, DollarSign, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { salesTabs, filterOptions } from "../constants/salesTabs";

interface SalesTabNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  filterIsOpen: boolean;
  setFilterIsOpen: (open: boolean) => void;
  onShowAgreementForm: () => void;
  onShowAgingInvoiceForm: () => void;
  onShowLeadForm?: () => void;
}

export function SalesTabNavigation({
  activeTab,
  onTabChange,
  activeFilter,
  onFilterChange,
  filterIsOpen,
  setFilterIsOpen,
  onShowAgreementForm,
  onShowAgingInvoiceForm,
  onShowLeadForm
}: SalesTabNavigationProps) {
  const getActionButton = () => {
    switch (activeTab) {
      case "crm":
        return (
          <Button className="bg-safend-red hover:bg-red-700" onClick={onShowLeadForm}>
            <UserPlus className="mr-2 h-4 w-4" />
            New Lead
          </Button>
        );
      case "contracts":
        return (
          <Button className="bg-safend-red hover:bg-red-700" onClick={onShowAgreementForm}>
            <FileSignature className="mr-2 h-4 w-4" />
            New Contract
          </Button>
        );
      case "aging":
        return (
          <Button className="bg-safend-red hover:bg-red-700" onClick={onShowAgingInvoiceForm}>
            <DollarSign className="mr-2 h-4 w-4" />
            Add Collection Task
          </Button>
        );
      default:
        return null;
    }
  };

  const currentFilters = filterOptions[activeTab as keyof typeof filterOptions];

  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-1 w-full md:w-auto bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {salesTabs.map((tab) => (
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
        
        <div className="flex items-center gap-3">
          {getActionButton()}
          <DropdownMenu open={filterIsOpen} onOpenChange={setFilterIsOpen}>
            <DropdownMenuTrigger asChild>
              <motion.button 
                className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Filter className="h-4 w-4" />
                <span>{activeFilter}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${filterIsOpen ? 'rotate-180' : ''}`} />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="animate-in fade-in-80 w-56">
              {currentFilters.map((filter) => (
                <DropdownMenuItem 
                  key={filter} 
                  onClick={() => onFilterChange(filter)}
                  className={`cursor-pointer transition-colors ${filter === activeFilter ? 'bg-red-100 dark:bg-red-900/20 font-medium' : ''}`}
                >
                  {filter}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}