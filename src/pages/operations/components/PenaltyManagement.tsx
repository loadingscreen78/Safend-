
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UnifiedLoader } from "@/components/ui/unified-loader";
import { 
  Search, Filter, Download, Plus, 
  AlertCircle, CheckCircle, XCircle, Calendar, Clipboard
} from "lucide-react";
import { useToastWithSound } from "@/hooks/use-toast-with-sound";
import { PenaltyForm } from "./PenaltyForm";
import { PenaltyTable } from "./PenaltyTable";

export function PenaltyManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const { toast } = useToastWithSound();
  
  const handleAddPenalty = () => {
    setEditData(null);
    setShowForm(true);
  };
  
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
      
      toast.success({
        title: "Success",
        description: editData 
          ? "Penalty record has been updated successfully."
          : "New penalty record has been created successfully.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">Penalty Management</h3>
          <p className="text-muted-foreground">
            Track penalties, violations and deductions
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="flex gap-2 items-center" onClick={() => {}}>
            <Clipboard className="h-4 w-4" />
            <span>Related Patrols</span>
          </Button>
          <Button onClick={handleAddPenalty} className="flex gap-2 items-center">
            <Plus className="h-4 w-4" />
            <span>Record Penalty</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="h-9">
                <TabsTrigger value="all" className="px-3 h-8">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  All Penalties
                </TabsTrigger>
                <TabsTrigger value="Open" className="px-3 h-8">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Open
                </TabsTrigger>
                <TabsTrigger value="Resolved" className="px-3 h-8">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Resolved
                </TabsTrigger>
                <TabsTrigger value="patrol" className="px-3 h-8">
                  <Clipboard className="h-4 w-4 mr-2" />
                  From Patrols
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search penalties..."
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
                <Filter className="h-4 w-4 mr-2" />
                <span>Filter</span>
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
            <PenaltyTable
              filter={activeTab}
              searchTerm={searchTerm}
              onEdit={handleEdit}
            />
          )}
        </div>
      </Card>

      {/* Penalty Form */}
      {showForm && (
        <PenaltyForm
          isOpen={showForm}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          editData={editData}
        />
      )}
    </div>
  );
}
