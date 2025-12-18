import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { filterOptions } from "../constants/salesTabs";

export function useSalesModule() {
  const [activeTab, setActiveTab] = useState("crm");
  const [activeFilter, setActiveFilter] = useState("All Clients");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTabChange = (value: string) => {
    setIsLoading(true);
    setActiveTab(value);
    setActiveFilter(filterOptions[value as keyof typeof filterOptions][0]);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: `Viewing ${value.charAt(0).toUpperCase() + value.slice(1)}`,
        description: `Switched to ${value} tab`,
        duration: 2000,
      });
    }, 600);
  };
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setFilterIsOpen(false);
    
    toast({
      title: `Filter Applied: ${filter}`,
      description: `Showing data for ${filter.toLowerCase()}`,
      duration: 1500,
    });
  };
  
  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
  };

  return {
    // State
    activeTab,
    activeFilter,
    searchTerm,
    filterIsOpen,
    selectedClient,
    isLoading,
    
    // Setters
    setSearchTerm,
    setFilterIsOpen,
    setSelectedClient,
    setActiveTab,
    
    // Handlers
    handleTabChange,
    handleFilterChange,
    handleClientSelect
  };
}