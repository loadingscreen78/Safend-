
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ReportsSettings() {
  const [emailSettings, setEmailSettings] = useState({
    defaultSender: "reports@safend.com",
    signature: "Safend Security Services - Automated Reporting",
    ccAdmin: true,
  });
  
  const [exportSettings, setExportSettings] = useState({
    defaultFormat: "pdf",
    paperSize: "a4",
    includeHeader: true,
    includeFooter: true,
  });
  
  const [dataSettings, setDataSettings] = useState({
    refreshInterval: "daily",
    cacheResults: true,
    retention: "90",
  });

  const handleSettingsSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your report settings have been saved successfully.",
    });
  };

  const handleRebuildWarehouse = () => {
    toast({
      title: "Warehouse Rebuild Scheduled",
      description: "The data warehouse rebuild has been scheduled for the next maintenance window.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 md:w-[600px] w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure global reporting settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-branch">Default Branch</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="default-branch">
                    <SelectValue placeholder="Select default branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-date-range">Default Date Range</Label>
                <Select defaultValue="current-month">
                  <SelectTrigger id="default-date-range">
                    <SelectValue placeholder="Select default date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-month">Current Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="current-quarter">Current Quarter</SelectItem>
                    <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                    <SelectItem value="last-financial-year">Last Financial Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="ist">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                    <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-refresh">Auto-refresh Dashboard</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh dashboard data
                  </p>
                </div>
                <Switch id="auto-refresh" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSettingsSave}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Settings</CardTitle>
              <CardDescription>
                Configure how reports are delivered to recipients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-sender">Default Sender Email</Label>
                <Input 
                  id="default-sender" 
                  placeholder="reports@example.com" 
                  value={emailSettings.defaultSender}
                  onChange={(e) => setEmailSettings({...emailSettings, defaultSender: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-signature">Email Signature</Label>
                <Textarea 
                  id="email-signature" 
                  placeholder="Signature text for report emails"
                  value={emailSettings.signature}
                  onChange={(e) => setEmailSettings({...emailSettings, signature: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-format">Default Export Format</Label>
                  <Select 
                    value={exportSettings.defaultFormat}
                    onValueChange={(value) => setExportSettings({...exportSettings, defaultFormat: value})}
                  >
                    <SelectTrigger id="default-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paper-size">PDF Paper Size</Label>
                  <Select 
                    value={exportSettings.paperSize}
                    onValueChange={(value) => setExportSettings({...exportSettings, paperSize: value})}
                  >
                    <SelectTrigger id="paper-size">
                      <SelectValue placeholder="Select paper size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="a3">A3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="include-header">Include Header/Logo</Label>
                  <p className="text-sm text-muted-foreground">
                    Add company header to exported reports
                  </p>
                </div>
                <Switch 
                  id="include-header" 
                  checked={exportSettings.includeHeader}
                  onCheckedChange={(checked) => setExportSettings({...exportSettings, includeHeader: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="include-footer">Include Footer</Label>
                  <p className="text-sm text-muted-foreground">
                    Add timestamp and page numbers to reports
                  </p>
                </div>
                <Switch 
                  id="include-footer" 
                  checked={exportSettings.includeFooter}
                  onCheckedChange={(checked) => setExportSettings({...exportSettings, includeFooter: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="cc-admin">CC Admins on Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Send copy of all reports to administrators
                  </p>
                </div>
                <Switch 
                  id="cc-admin" 
                  checked={emailSettings.ccAdmin}
                  onCheckedChange={(checked) => setEmailSettings({...emailSettings, ccAdmin: checked})}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSettingsSave}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Configure data warehouse settings and refresh schedules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="refresh-interval">Data Refresh Interval</Label>
                <Select 
                  value={dataSettings.refreshInterval}
                  onValueChange={(value) => setDataSettings({...dataSettings, refreshInterval: value})}
                >
                  <SelectTrigger id="refresh-interval">
                    <SelectValue placeholder="Select refresh interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How often data is refreshed from source systems
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="cache-results">Cache Query Results</Label>
                  <p className="text-sm text-muted-foreground">
                    Cache results to improve performance
                  </p>
                </div>
                <Switch 
                  id="cache-results" 
                  checked={dataSettings.cacheResults}
                  onCheckedChange={(checked) => setDataSettings({...dataSettings, cacheResults: checked})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                <Select 
                  value={dataSettings.retention}
                  onValueChange={(value) => setDataSettings({...dataSettings, retention: value})}
                >
                  <SelectTrigger id="data-retention">
                    <SelectValue placeholder="Select retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                    <SelectItem value="180">180 Days</SelectItem>
                    <SelectItem value="365">1 Year</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How long to keep generated reports and query results
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Maintenance Actions</h3>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" onClick={handleRebuildWarehouse}>
                    Rebuild Data Warehouse
                  </Button>
                  <Button variant="outline">
                    Clear Cache
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSettingsSave}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>
                Configure who can access and modify reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Role-Based Access</h3>
                
                <div className="border rounded-md divide-y">
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Administrators</p>
                      <p className="text-sm text-muted-foreground">Full access to all reports and settings</p>
                    </div>
                    <Switch id="admin-access" defaultChecked disabled />
                  </div>
                  
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Managers</p>
                      <p className="text-sm text-muted-foreground">Access to department reports and dashboards</p>
                    </div>
                    <Switch id="manager-access" defaultChecked />
                  </div>
                  
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Branch Users</p>
                      <p className="text-sm text-muted-foreground">Access to reports for their branch only</p>
                    </div>
                    <Switch id="branch-access" defaultChecked />
                  </div>
                  
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Analysts</p>
                      <p className="text-sm text-muted-foreground">Access to Ad-hoc Query and Report Builder</p>
                    </div>
                    <Switch id="analyst-access" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <h3 className="text-sm font-medium">Report Templates Access</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hr-access">HR Reports</Label>
                    <Select defaultValue="hr-manager">
                      <SelectTrigger id="hr-access">
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin-only">Admin Only</SelectItem>
                        <SelectItem value="hr-manager">HR & Managers</SelectItem>
                        <SelectItem value="all-managers">All Managers</SelectItem>
                        <SelectItem value="all">All Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="finance-access">Financial Reports</Label>
                    <Select defaultValue="admin-only">
                      <SelectTrigger id="finance-access">
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin-only">Admin Only</SelectItem>
                        <SelectItem value="finance-team">Finance Team</SelectItem>
                        <SelectItem value="all-managers">All Managers</SelectItem>
                        <SelectItem value="all">All Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="operations-access">Operations Reports</Label>
                    <Select defaultValue="operations-managers">
                      <SelectTrigger id="operations-access">
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin-only">Admin Only</SelectItem>
                        <SelectItem value="operations-managers">Operations & Managers</SelectItem>
                        <SelectItem value="all-managers">All Managers</SelectItem>
                        <SelectItem value="all">All Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="compliance-access">Compliance Reports</Label>
                    <Select defaultValue="admin-compliance">
                      <SelectTrigger id="compliance-access">
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin-only">Admin Only</SelectItem>
                        <SelectItem value="admin-compliance">Admin & Compliance</SelectItem>
                        <SelectItem value="all-managers">All Managers</SelectItem>
                        <SelectItem value="all">All Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label htmlFor="maker-checker">Enable Maker-Checker</Label>
                  <p className="text-sm text-muted-foreground">
                    Require approval for new report templates
                  </p>
                </div>
                <Switch id="maker-checker" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSettingsSave}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper component for textarea that wasn't imported above
function Textarea({ id, placeholder, value, onChange }: { id: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }) {
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      value={value}
      onChange={onChange}
    />
  );
}
