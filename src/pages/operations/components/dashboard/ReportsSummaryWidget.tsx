
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReportType {
  name: string;
  status: "new" | "generated" | "scheduled";
  date?: string;
  type: string;
}

const recentReports: ReportType[] = [
  {
    name: "Monthly Attendance Summary",
    status: "new",
    type: "attendance"
  },
  {
    name: "Weekly Patrol Report",
    status: "generated",
    date: "2025-05-01",
    type: "patrol"
  },
  {
    name: "Rota Coverage Analysis",
    status: "scheduled",
    date: "2025-05-10",
    type: "rota"
  }
];

interface ReportsSummaryWidgetProps {
  onViewAllReports: () => void;
}

export default function ReportsSummaryWidget({ onViewAllReports }: ReportsSummaryWidgetProps) {
  return (
    <Card className="h-[260px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Reports Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentReports.map((report, index) => (
            <div 
              key={index}
              className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0"
            >
              <div>
                <p className="text-sm font-medium">{report.name}</p>
                <div className="flex items-center">
                  <Badge 
                    variant={
                      report.status === "new" ? "default" : 
                      report.status === "generated" ? "outline" : 
                      "secondary"
                    }
                    className="text-xs mr-2"
                  >
                    {report.status}
                  </Badge>
                  {report.date && (
                    <p className="text-xs text-muted-foreground">
                      {report.date}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={onViewAllReports}
          >
            View All Reports
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
