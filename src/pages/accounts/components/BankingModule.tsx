
import { useState } from 'react';
import { useAccountsData } from '@/hooks/accounts/useAccountsData';
import { useAccountsContext } from '@/context/AccountsContext';
import { AccountsService, BankAccount } from '@/services/accounts/AccountsService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangeSelector } from '@/components/accounts/DateRangeSelector';
import { Button } from '@/components/ui/button';
import { formatIndianCurrency } from '@/utils/errorHandler';
import { Landmark, CreditCard, Wallet, Plus, Download } from 'lucide-react';
import { useFormsController } from './forms/FormsController';

export interface BankingModuleProps {
  filter: string;
}

export function BankingModule({ filter }: BankingModuleProps) {
  const { selectedBranch, dateRange, setDateRange } = useAccountsContext();
  const [activeTab, setActiveTab] = useState(filter.toLowerCase().includes('accounts') ? 'accounts' : 
                                          filter.toLowerCase().includes('transactions') ? 'transactions' : 'accounts');
  
  const { openTransactionForm } = useFormsController();
  
  // Fetch bank accounts
  const { 
    data: bankAccounts, 
    isLoading: isLoadingAccounts 
  } = useAccountsData(
    () => AccountsService.getBankAccounts({
      branchId: selectedBranch || undefined
    }),
    [selectedBranch],
    [],
    "Failed to load bank accounts"
  );
  
  // Calculate total balance across all accounts
  const totalBalance = bankAccounts?.reduce((total, account) => total + account.balance, 0) || 0;
  
  const handleDateRangeChange = (range: { startDate: Date; endDate: Date }) => {
    setDateRange(range);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Banking & Cash Management</h2>
          <p className="text-muted-foreground">
            Manage bank accounts, transactions and reconciliation
          </p>
        </div>
        
        <DateRangeSelector onRangeChange={handleDateRangeChange} className="min-w-72" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Landmark className="h-5 w-5 text-blue-500" />
              Bank Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatIndianCurrency(totalBalance)}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {bankAccounts?.length || 0} active accounts
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-500" />
              Recent Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">+{formatIndianCurrency(25000)}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Last 30 days
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="h-5 w-5 text-red-500" />
              Recent Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">-{formatIndianCurrency(18500)}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Last 30 days
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          <TabsTrigger value="cash">Cash Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts" className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold">Bank Accounts</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Account
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoadingAccounts ? (
              <p>Loading accounts...</p>
            ) : bankAccounts && bankAccounts.length > 0 ? (
              bankAccounts.map(account => (
                <Card key={account.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{account.accountName}</h4>
                        <p className="text-sm text-muted-foreground">{account.bankName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {account.accountNumber} • IFSC: {account.ifscCode}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">
                          {formatIndianCurrency(account.balance)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {account.accountType}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p>No bank accounts found. Add your first account to get started.</p>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Bank Account
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold">Recent Transactions</h3>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button onClick={openTransactionForm}>
                <Plus className="mr-2 h-4 w-4" />
                Record Transaction
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground py-8">
                Transaction list will appear here. <br />
                Click on 'Record Transaction' to add your first transaction.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reconciliation" className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold">Bank Reconciliation</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Import Statement
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground py-8">
                Upload bank statements to reconcile with your recorded transactions. <br />
                Click 'Import Statement' to get started.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cash" className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold">Cash Register</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Cash Transaction
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold mb-2">{formatIndianCurrency(15000)}</p>
                <p className="text-muted-foreground mb-6">Cash in hand</p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="sm">Cash In</Button>
                  <Button variant="outline" size="sm">Cash Out</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* We don't need to include the TransactionForm here anymore as it's provided by the FormsProvider */}
    </div>
  );
}
