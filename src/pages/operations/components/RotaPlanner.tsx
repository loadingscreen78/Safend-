
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UnifiedLoader } from "@/components/ui/unified-loader";
import { Calendar, ClipboardList, Download, Plus, RefreshCw, Save, Settings } from "lucide-react";

export function RotaPlanner() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGenerateRota = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">Rota Planner</h3>
          <p className="text-muted-foreground">
            Create, manage and assign staff to shifts
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={handleGenerateRota} className="flex gap-2 items-center">
            <Plus className="h-4 w-4" />
            <span>New Rota Plan</span>
          </Button>
        </div>
      </div>
      
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Post</p>
              <Select defaultValue="all">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Post" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="post1">Summit Tower</SelectItem>
                  <SelectItem value="post2">Metro Building</SelectItem>
                  <SelectItem value="post3">Riverside Apartments</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Start Date</p>
              <input type="date" className="border rounded p-2 h-10" />
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">End Date</p>
              <input type="date" className="border rounded p-2 h-10" />
            </div>
          </div>
          
          <div className="flex gap-2 self-end">
            <Button variant="outline" size="sm" className="h-9">
              <RefreshCw className="h-4 w-4 mr-2" />
              <span>Refresh</span>
            </Button>
            
            <Button variant="outline" size="sm" className="h-9">
              <Download className="h-4 w-4 mr-2" />
              <span>Export</span>
            </Button>
            
            <Button variant="outline" size="sm" className="h-9">
              <Settings className="h-4 w-4 mr-2" />
              <span>Options</span>
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <UnifiedLoader size="lg" variant="gauge" />
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-4">
              <div>
                <h4 className="font-medium">Metro Building Rota</h4>
                <p className="text-sm text-muted-foreground">May 10-16, 2025</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge>Draft</Badge>
                <Button size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  <span>Publish</span>
                </Button>
              </div>
            </div>
            
            <div className="h-[500px] border rounded-md bg-gray-50 flex flex-col items-center justify-center">
              <Calendar className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Rota Planner</h3>
              <p className="text-muted-foreground text-center max-w-md">
                The comprehensive rota planning interface will be implemented here,
                including drag-and-drop assignments, shift visualization, and staff management.
              </p>
              <div className="flex gap-3 mt-6">
                <Button>Generate Balanced Rota</Button>
                <Button variant="outline">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  <span>View Templates</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
