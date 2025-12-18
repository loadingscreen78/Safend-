
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UnifiedLoader } from "@/components/ui/unified-loader";
import { Search, Filter, Download, Calendar, Clock, Plus } from "lucide-react";
import { LeaveManagementTable } from "./leave/LeaveManagementTable";
import { LeaveForm } from "./leave/LeaveForm";
import { useToast } from "@/hooks/use-toast";

export function LeaveManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleEdit = (data: any) => {
    setEditData(data);
    setShowForm(true);
  };
  
  const handleFormClose = () => {
    setShowForm(false);
    setEditData(null);
  };
  
  const handleFormSubmit = (data: any) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowForm(false);
      setEditData(null);
      
      toast({
        title: "Success",
        description: "Leave request has been submitted successfully.",
        duration: 3000,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">Leave Management</h3>
          <p className="text-muted-foreground">
            Process and track employee leave requests
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={() => setShowForm(true)} className="flex gap-2 items-center">
            <Plus className="h-4 w-4" />
            <span>New Leave Request</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="h-9">
                <TabsTrigger value="all" className="px-3 h-8">
                  All Requests
                </TabsTrigger>
                <TabsTrigger value="pending" className="px-3 h-8">
                  Pending
                </TabsTrigger>
                <TabsTrigger value="approved" className="px-3 h-8">
                  Approved
                </TabsTrigger>
                <TabsTrigger value="rejected" className="px-3 h-8">
                  Rejected
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search leave requests..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button variant="outline" size="sm" className="h-9">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Date Range</span>
              </Button>
              
              <Button variant="outline" size="sm" className="h-9">
                <Download className="h-4 w-4 mr-2" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <UnifiedLoader size="lg" variant="gauge" />
            </div>
          ) : (
            <TabsContent value={activeTab} className="m-0">
              <LeaveManagementTable 
                filter={activeTab === "all" ? "All Leave" : activeTab} 
                searchTerm={searchTerm}
                onEdit={handleEdit} 
              />
            </TabsContent>
          )}
        </div>
      </Card>

      {/* Leave Form */}
      {showForm && (
        <LeaveForm
          isOpen={showForm}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          editData={editData}
        />
      )}
    </div>
  );
}
