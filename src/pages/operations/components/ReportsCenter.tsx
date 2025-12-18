
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { 
  FileBarChart2, // Changed from FileChart2 to FileBarChart2
  CalendarDays, 
  Users, 
  MapPin, 
  Clock, 
  Download, 
  Mail, 
  BarChart 
} from "lucide-react";

export function ReportsCenter() {
  const [activeTab, setActiveTab] = useState("generator");
  const [selectedReportType, setSelectedReportType] = useState("attendance");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Reports Center</h3>
        <p className="text-muted-foreground">
          Generate and view reports for operations management
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px] mb-4">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <FileBarChart2 className="h-4 w-4" />
            Report Generator
          </TabsTrigger>
          <TabsTrigger value="viewer" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Report Viewer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
              <CardDescription>
                Select report parameters and generate operational reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select 
                      defaultValue={selectedReportType} 
                      onValueChange={setSelectedReportType}
                    >
                      <SelectTrigger id="report-type">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="attendance">Attendance Report</SelectItem>
                        <SelectItem value="rota">Rota Coverage Report</SelectItem>
                        <SelectItem value="patrol">Patrol Performance</SelectItem>
                        <SelectItem value="staff">Staff Allocation</SelectItem>
                        <SelectItem value="inventory">Inventory Movement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="date-range">Date Range</Label>
                    <div className="flex items-center space-x-2">
                      <Input type="date" id="date-from" className="w-full" />
                      <span>to</span>
                      <Input type="date" id="date-to" className="w-full" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="branch">Branch</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="branch">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        <SelectItem value="hq">Headquarters</SelectItem>
                        <SelectItem value="north">Northern Branch</SelectItem>
                        <SelectItem value="south">Southern Branch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="format">Output Format</Label>
                    <Select 
                      defaultValue={selectedFormat} 
                      onValueChange={setSelectedFormat}
                    >
                      <SelectTrigger id="format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                        <SelectItem value="html">HTML Document</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Report Options</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Include summary charts</span>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Include raw data tables</span>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-email to management</span>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Save as scheduled report</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline"
                >
                  Reset Form
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Report"}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Templates</CardTitle>
              <CardDescription>
                Quick access to your saved report templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { 
                    title: "Monthly Attendance", 
                    description: "Staff attendance summary by post",
                    icon: <Users className="h-4 w-4" />
                  },
                  { 
                    title: "Weekly Rota Coverage", 
                    description: "Gap analysis for all posts",
                    icon: <CalendarDays className="h-4 w-4" />
                  },
                  { 
                    title: "Post Performance", 
                    description: "KPI dashboard for all active posts",
                    icon: <MapPin className="h-4 w-4" />
                  }
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:bg-accent">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base flex items-center gap-2">
                        {template.icon}
                        {template.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="viewer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                View and download previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    title: "Monthly Attendance Summary", 
                    date: "2025-05-01",
                    type: "PDF",
                    icon: <Clock className="h-4 w-4 text-blue-500" />
                  },
                  { 
                    title: "Quarterly Patrol Performance", 
                    date: "2025-04-15",
                    type: "Excel",
                    icon: <Clock className="h-4 w-4 text-green-500" />
                  },
                  { 
                    title: "Annual Staff Allocation Report", 
                    date: "2025-03-31",
                    type: "PDF",
                    icon: <Clock className="h-4 w-4 text-red-500" />
                  }
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center space-x-4">
                      {report.icon}
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Generated on {report.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download {report.type}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
