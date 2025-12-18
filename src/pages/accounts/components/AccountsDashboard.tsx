import { useState, useEffect } from 'react';
import { useAccountsContext } from '@/context/AccountsContext';
import { useAccountsData } from '@/hooks/accounts/useAccountsData';
import { AccountsService, DashboardWidget, ReportData } from '@/services/accounts/AccountsService';
import { DateRangeSelector } from '@/components/accounts/DateRangeSelector';
import { ChartComponent } from '@/components/accounts/ChartComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatIndianCurrency } from '@/utils/errorHandler';
import { IndianRupee, Calendar, ArrowUpRight, ArrowDownRight, BarChart3, PieChart } from 'lucide-react';

export interface AccountsDashboardProps {
  filter: string;
}

export function AccountsDashboard({ filter }: AccountsDashboardProps) {
  const { selectedBranch, dateRange, setDateRange } = useAccountsContext();
  const startDate = dateRange?.startDate.toISOString().split('T')[0];
  const endDate = dateRange?.endDate.toISOString().split('T')[0];
  // Store processed widget data in state
  const [processedWidgetData, setProcessedWidgetData] = useState<Record<string, any>>({});

  // Fetch dashboard widgets - updated to pass the correct parameter
  const { 
    data: widgets, 
    isLoading: isWidgetsLoading 
  } = useAccountsData(
    () => AccountsService.getDashboardWidgets(selectedBranch || undefined),
    [selectedBranch],
    []
  );

  // Process widgets when they are loaded
  useEffect(() => {
    if (widgets && widgets.length > 0) {
      const widgetDataObj = widgets.reduce((acc, widget) => {
        acc[widget.type] = widget.data;
        return acc;
      }, {} as Record<string, any>);
      
      setProcessedWidgetData(widgetDataObj);
    }
  }, [widgets]);

  // Fetch cash flow data - updated to match method signature
  const {
    data: cashFlowData,
    isLoading: isCashFlowLoading
  } = useAccountsData(
    () => startDate && endDate 
      ? AccountsService.getCashFlowReport(startDate, endDate, selectedBranch || undefined)
      : Promise.resolve(null), 
    [selectedBranch, startDate, endDate],
    null
  );

  // Fetch Profit/Loss data - updated to use correct parameter structure
  const {
    data: profitLossData,
    isLoading: isProfitLossLoading
  } = useAccountsData(
    () => startDate && endDate
      ? AccountsService.getProfitLossReport({ 
          startDate, 
          endDate, 
          branchId: selectedBranch || undefined,
          groupBy: 'month'
        })
      : Promise.resolve(null),
    [selectedBranch, startDate, endDate],
    null
  );

  const handleDateRangeChange = (range: { startDate: Date; endDate: Date }) => {
    setDateRange(range);
  };

  const formatCashFlowData = (data: any): any => {
    if (!data) return null;
    
    return {
      labels: data.periods,
      datasets: [
        {
          name: 'Income',
          data: data.income,
          color: '#10b981'
        },
        {
          name: 'Expenses',
          data: data.expenses,
          color: '#ef4444'
        }
      ]
    };
  };

  const formatProfitLossData = (data: ReportData | null): any => {
    if (!data) return null;
    
    return {
      labels: data.labels,
      datasets: data.datasets
    };
  };

  // Prepare a summary section with key metrics
  const getSummaryCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Cash Balance */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Cash Balance</p>
                {isWidgetsLoading ? (
                  <Skeleton className="h-8 w-32 mt-1" />
                ) : (
                  <div className="flex items-baseline gap-1">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-2xl font-semibold">
                      {formatIndianCurrency(processedWidgetData?.bank_balance?.total || 0)}
                    </h3>
                  </div>
                )}
              </div>
              <div className="rounded-full p-2 bg-green-100 dark:bg-green-900">
                <IndianRupee className="h-4 w-4 text-green-600 dark:text-green-300" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center text-xs">
              <span className={`flex items-center ${processedWidgetData?.bank_balance?.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {processedWidgetData?.bank_balance?.trend > 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {Math.abs(processedWidgetData?.bank_balance?.trend || 0)}%
              </span>
              <span className="text-muted-foreground ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Receivables */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Receivables</p>
                {isWidgetsLoading ? (
                  <Skeleton className="h-8 w-32 mt-1" />
                ) : (
                  <div className="flex items-baseline gap-1">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-2xl font-semibold">
                      {formatIndianCurrency(processedWidgetData?.receivables_aging?.total || 0)}
                    </h3>
                  </div>
                )}
              </div>
              <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
            
            <div className="mt-2">
              <Badge variant="outline" className="text-amber-500 border-amber-500">
                {processedWidgetData?.receivables_aging?.overdue || 0} Overdue
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Payables */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Payables</p>
                {isWidgetsLoading ? (
                  <Skeleton className="h-8 w-32 mt-1" />
                ) : (
                  <div className="flex items-baseline gap-1">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-2xl font-semibold">
                      {formatIndianCurrency(processedWidgetData?.payables_aging?.total || 0)}
                    </h3>
                  </div>
                )}
              </div>
              <div className="rounded-full p-2 bg-purple-100 dark:bg-purple-900">
                <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
            
            <div className="mt-2">
              <Badge variant="outline" className="text-red-500 border-red-500">
                {processedWidgetData?.payables_aging?.due || 0} Due soon
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Assets Value */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Asset Value</p>
                {isWidgetsLoading ? (
                  <Skeleton className="h-8 w-32 mt-1" />
                ) : (
                  <div className="flex items-baseline gap-1">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-2xl font-semibold">
                      {formatIndianCurrency(processedWidgetData?.asset_value?.total || 0)}
                    </h3>
                  </div>
                )}
              </div>
              <div className="rounded-full p-2 bg-orange-100 dark:bg-orange-900">
                <PieChart className="h-4 w-4 text-orange-600 dark:text-orange-300" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center text-xs">
              <span className="text-muted-foreground ml-2">
                Depreciation: {formatIndianCurrency(processedWidgetData?.asset_value?.depreciation || 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your financial performance and key metrics
          </p>
        </div>
        <DateRangeSelector onRangeChange={handleDateRangeChange} className="min-w-72" />
      </div>

      {getSummaryCards()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Chart */}
        <ChartComponent
          type="bar"
          title="Cash Flow"
          description="Income and expenses over time"
          data={formatCashFlowData(cashFlowData) || {labels: [], datasets: []}}
          isLoading={isCashFlowLoading}
          currency={true}
          height={300}
        />
        
        {/* Profit & Loss Chart */}
        <ChartComponent
          type="line"
          title="Profit & Loss"
          description="Monthly profit and loss performance"
          data={formatProfitLossData(profitLossData) || {labels: [], datasets: []}}
          isLoading={isProfitLossLoading}
          currency={true}
          height={300}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* GST & TDS Compliance Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tax Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            {isWidgetsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">GST Payable</span>
                  <span className="font-medium">
                    {formatIndianCurrency(processedWidgetData?.gst_liability?.current || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">TDS Payable</span>
                  <span className="font-medium">
                    {formatIndianCurrency(processedWidgetData?.tds_liability?.current || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Next Filing</span>
                  <span className="font-medium">
                    {processedWidgetData?.gst_liability?.nextDueDate || 'N/A'}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Receivables Aging Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Receivables Aging</CardTitle>
          </CardHeader>
          <CardContent>
            {isWidgetsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-2">
                {processedWidgetData?.receivables_aging?.buckets && Object.entries(processedWidgetData.receivables_aging.buckets).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm">{key}</span>
                    <span className="font-medium">{formatIndianCurrency(value as number)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Payables Aging Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payables Aging</CardTitle>
          </CardHeader>
          <CardContent>
            {isWidgetsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-2">
                {processedWidgetData?.payables_aging?.buckets && Object.entries(processedWidgetData.payables_aging.buckets).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm">{key}</span>
                    <span className="font-medium">{formatIndianCurrency(value as number)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
