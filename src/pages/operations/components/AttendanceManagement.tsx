
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UnifiedLoader } from "@/components/ui/unified-loader";
import { Users, Calendar, Plus, Search, Filter, Download } from "lucide-react";
import { AttendanceTable } from "./attendance/AttendanceTable";
import { AttendanceForm } from "./attendance/AttendanceForm";
import { useToast } from "@/hooks/use-toast";

export function AttendanceManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("daily");
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
        description: "Attendance data has been saved successfully.",
        duration: 3000,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">Attendance Management</h3>
          <p className="text-muted-foreground">
            Record and manage daily attendance for all posts
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={() => setShowForm(true)} className="flex gap-2 items-center">
            <Plus className="h-4 w-4" />
            <span>Mark Attendance</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="h-9">
                <TabsTrigger value="daily" className="px-3 h-8">
                  <Calendar className="h-4 w-4 mr-2" />
                  Daily
                </TabsTrigger>
                <TabsTrigger value="weekly" className="px-3 h-8">
                  <Calendar className="h-4 w-4 mr-2" />
                  Weekly
                </TabsTrigger>
                <TabsTrigger value="monthly" className="px-3 h-8">
                  <Calendar className="h-4 w-4 mr-2" />
                  Monthly
                </TabsTrigger>
                <TabsTrigger value="issues" className="px-3 h-8">
                  <Users className="h-4 w-4 mr-2" />
                  Issues
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search attendance..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
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
            <TabsContent value={activeTab} className="m-0">
              <AttendanceTable filter={activeTab} onEdit={handleEdit} />
            </TabsContent>
          )}
        </div>
      </Card>

      {/* Attendance Form */}
      {showForm && (
        <AttendanceForm
          isOpen={showForm}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          editData={editData}
        />
      )}
    </div>
  );
}
