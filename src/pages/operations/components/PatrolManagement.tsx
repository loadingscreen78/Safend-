
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UnifiedLoader } from "@/components/ui/unified-loader";
import { 
  Search, Filter, Download, Plus, 
  Clipboard, CheckSquare, AlertTriangle, Calendar, Car
} from "lucide-react";
import { useToastWithSound } from "@/hooks/use-toast-with-sound";
import { PenaltyForm } from "./PenaltyForm";

export function PatrolManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [showPenaltyForm, setShowPenaltyForm] = useState(false);
  const [selectedPatrol, setSelectedPatrol] = useState(null);
  const { toast } = useToastWithSound();
  
  const handleAddPatrol = () => {
    toast({
      title: "Info",
      description: "Patrol form will be implemented soon.",
      duration: 3000,
    });
  };
  
  const handleIssuePenalty = (patrolData: any) => {
    setSelectedPatrol(patrolData);
    setShowPenaltyForm(true);
  };
  
  const handlePenaltyFormClose = () => {
    setShowPenaltyForm(false);
    setSelectedPatrol(null);
  };
  
  const handlePenaltySubmit = (data: any) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowPenaltyForm(false);
      setSelectedPatrol(null);
      
      toast.success({
        title: "Penalty Issued",
        description: "The penalty has been successfully recorded from patrol.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">Patrol Management</h3>
          <p className="text-muted-foreground">
            Track surprise visits, inspections and client feedback
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="flex gap-2 items-center">
            <Car className="h-4 w-4" />
            <span>Select Vehicle</span>
          </Button>
          <Button onClick={handleAddPatrol} className="flex gap-2 items-center">
            <Plus className="h-4 w-4" />
            <span>Log Patrol Visit</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="h-9">
                <TabsTrigger value="all" className="px-3 h-8">
                  <Clipboard className="h-4 w-4 mr-2" />
                  All Patrols
                </TabsTrigger>
                <TabsTrigger value="completed" className="px-3 h-8">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Completed
                </TabsTrigger>
                <TabsTrigger value="issues" className="px-3 h-8">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Issues
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search patrols..."
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
        
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <UnifiedLoader size="lg" variant="gauge" />
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center">
              <Clipboard className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Patrol Management</h3>
              <p className="text-muted-foreground text-center max-w-md">
                This section will display patrol visits, surprise inspections, and client feedback. 
                It will include maps, photos, and signatures captured during visits.
              </p>
              <div className="flex gap-4 mt-6">
                <Button onClick={handleAddPatrol}>
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Log New Patrol</span>
                </Button>
                <Button variant="outline" onClick={() => handleIssuePenalty({ id: 'PATROL-DEMO', type: 'patrol' })}>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span>Issue Penalty from Patrol</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Penalty Form */}
      {showPenaltyForm && (
        <PenaltyForm
          isOpen={showPenaltyForm}
          onClose={handlePenaltyFormClose}
          onSubmit={handlePenaltySubmit}
          editData={{
            relatedEntityId: selectedPatrol?.id,
            relatedEntityType: 'patrol'
          }}
        />
      )}
    </div>
  );
}
