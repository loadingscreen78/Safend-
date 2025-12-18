
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { 
  Search, Filter, Download, Plus, 
  Utensils, Calendar, Users, FileText, IndianRupee
} from "lucide-react";
import { useToastWithSound } from "@/hooks/use-toast-with-sound";
import { MessTable } from "./mess/MessTable";
import { MessForm } from "./mess/MessForm";
import { MessSummary } from "./mess/MessSummary";
import { MealCostManager } from "./mess/MealCostManager";

export function MessManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("consumption");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCostManager, setShowCostManager] = useState(false);
  
  // State for mess summary data
  const [selectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear] = useState(new Date().getFullYear());
  const [totalAmount] = useState(45000);
  const [employeeCount] = useState(25);
  
  // Mock data for current post
  const currentPost = {
    id: "POST-001",
    name: "Main Gate Security Post"
  };
  
  const { toast } = useToastWithSound();
  
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
        title: "Meal Record Added",
        description: "The meal consumption has been recorded successfully.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">Mess Management</h3>
          <p className="text-muted-foreground">
            Track meal consumption and mess charges
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setShowCostManager(!showCostManager)}
            className={showCostManager ? "bg-muted" : ""}
          >
            <IndianRupee className="h-4 w-4 mr-2" />
            <span>Meal Cost Settings</span>
          </Button>
          
          <Button onClick={() => setShowForm(true)} className="flex gap-2 items-center">
            <Plus className="h-4 w-4" />
            <span>Record Meal</span>
          </Button>
        </div>
      </div>
      
      {/* Conditionally show Meal Cost Manager */}
      {showCostManager && (
        <Card className="p-6">
          <MealCostManager 
            postId={currentPost.id}
            postName={currentPost.name}
          />
        </Card>
      )}
      
      <MessSummary 
        month={new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })}
        year={selectedYear}
        branchId="BRANCH-001"
        totalAmount={totalAmount}
        employeeCount={employeeCount}
      />
      
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="h-9">
                <TabsTrigger value="consumption" className="px-3 h-8">
                  <Utensils className="h-4 w-4 mr-2" />
                  Consumption
                </TabsTrigger>
                <TabsTrigger value="charges" className="px-3 h-8">
                  <FileText className="h-4 w-4 mr-2" />
                  Charges
                </TabsTrigger>
                <TabsTrigger value="employees" className="px-3 h-8">
                  <Users className="h-4 w-4 mr-2" />
                  By Employee
                </TabsTrigger>
                <TabsTrigger value="posts" className="px-3 h-8">
                  <Utensils className="h-4 w-4 mr-2" />
                  By Post
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search meal records..."
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
              <LoadingAnimation size="lg" color="red" showPercentage={true} />
            </div>
          ) : (
            <TabsContent value={activeTab} className="m-0">
              <MessTable 
                filter={activeTab} 
                searchTerm={searchTerm}
                onEdit={handleEdit} 
              />
            </TabsContent>
          )}
        </div>
      </Card>

      {/* Meal Record Form */}
      {showForm && (
        <MessForm
          isOpen={showForm}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          editData={editData}
        />
      )}
    </div>
  );
}
