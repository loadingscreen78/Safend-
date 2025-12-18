
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Download, RefreshCw, Maximize2 } from "lucide-react";
import { BarChart, LineChart, DonutChart } from "./charts";

interface DashboardWidgetProps {
  title: string;
  description?: string;
  type: 'bar' | 'line' | 'donut' | 'area' | 'table';
}

export function DashboardWidget({ title, description, type }: DashboardWidgetProps) {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <BarChart />;
      case 'line':
        return <LineChart />;
      case 'donut':
        return <DonutChart />;
      default:
        return <div className="p-6 text-center text-muted-foreground">Chart type not supported</div>;
    }
  };

  return (
    <Card>
      <CardHeader className="py-4 px-6 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Maximize2 className="h-4 w-4" />
              <span>Expand</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[260px] w-full">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
}
