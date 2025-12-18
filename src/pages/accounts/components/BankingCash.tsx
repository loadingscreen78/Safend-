
import { useState } from 'react';
import { useAccountsContext } from '@/context/AccountsContext';
import { useAccountsData } from '@/hooks/accounts/useAccountsData';
import { AccountsService, BankAccount, AccountTransaction } from '@/services/accounts/AccountsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatIndianCurrency, formatIndianDate } from '@/utils/errorHandler';
import { Landmark, Wallet, CreditCard, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';

export interface BankingCashProps {
  filter: string;
}

export function BankingCash({ filter }: BankingCashProps) {
  const { selectedBranch } = useAccountsContext();
  const [activeTab, setActiveTab] = useState('accounts');
  
  // This would normally fetch from the API, but for now we'll use mock data
  const bankAccounts: BankAccount[] = [
    {
      id: "acc-1",
      accountName: "Operations Account",
      accountNumber: "1234567890",
      bankName: "HDFC Bank",
      branchName: "MG Road", 
      ifscCode: "HDFC0001234",
      accountType: "current",
      balance: 245000,
      status: "active",
      branchId: selectedBranch || "default-branch",
      lastTransactionDate: "2024-05-01T14:20:00Z"
    },
    {
      id: "acc-2",
      accountName: "Salary Account",
      accountNumber: "9876543210",
      bankName: "SBI",
      branchName: "Indiranagar",
      ifscCode: "SBIN0005678",
      accountType: "savings",
      balance: 120000,
      status: "active",
      branchId: selectedBranch || "default-branch",
      lastTransactionDate: "2024-05-02T16:45:00Z"
    },
    {
      id: "acc-3",
      accountName: "Tax Account",
      accountNumber: "5678901234",
      bankName: "ICICI Bank",
      branchName: "Koramangala",
      ifscCode: "ICIC0007890",
      accountType: "current",
      balance: 180000,
      status: "active",
      branchId: selectedBranch || "default-branch",
      lastTransactionDate: "2024-05-03T13:10:00Z"
    }
  ];
  
  // Mock transactions with proper referenceNumber
  const recentTransactions: AccountTransaction[] = [
    {
      id: "trx-1",
      date: "2024-05-01T10:30:00Z",
      description: "Office rent payment",
      amount: 25000,
      type: "expense",
      category: "Rent",
      status: "completed",
      referenceNumber: "REF123456", 
      branchId: selectedBranch || "default-branch",
      createdAt: "2024-05-01T10:30:00Z",
      updatedAt: "2024-05-01T10:30:00Z"
    },
    {
      id: "trx-2",
      date: "2024-05-02T14:15:00Z", 
      description: "Utility bills",
      amount: 8500,
      type: "expense",
      category: "Utilities", 
      status: "completed",
      referenceNumber: "REF123457", 
      branchId: selectedBranch || "default-branch",
      createdAt: "2024-05-02T14:15:00Z",
      updatedAt: "2024-05-02T14:15:00Z"
    },
    {
      id: "trx-3",
      date: "2024-05-03T16:45:00Z",
      description: "Client payment received",
      amount: 75000,
      type: "income",
      category: "Services", 
      status: "completed",
      referenceNumber: "REF123458", 
      branchId: selectedBranch || "default-branch",
      createdAt: "2024-05-03T16:45:00Z",
      updatedAt: "2024-05-03T16:45:00Z"
    }
  ];

  // Calculate total balance
  const totalBalance = bankAccounts.reduce((total, account) => total + account.balance, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Banking & Cash Management</h2>
          <p className="text-muted-foreground">
            Manage bank accounts, transactions and cash flow
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Landmark className="h-5 w-5 text-blue-500" />
              Bank Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatIndianCurrency(totalBalance)}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {bankAccounts.length} active accounts
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-green-500" />
              Income (Month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatIndianCurrency(75000)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              +12% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowDownRight className="h-5 w-5 text-red-500" />
              Expenses (Month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {formatIndianCurrency(33500)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              -5% from last month
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="cash">Cash Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts" className="space-y-4 mt-6">
          <div className="flex justify-between">
            <h3 className="text-xl">Accounts</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankAccounts.map(account => (
              <Card key={account.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{account.accountName}</h4>
                      <p className="text-sm text-muted-foreground">{account.bankName} • {account.branchName}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {account.accountNumber} • IFSC: {account.ifscCode}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">
                        {formatIndianCurrency(account.balance)}
                      </div>
                      <Badge variant={account.accountType === 'current' ? 'outline' : 'secondary'} className="mt-2">
                        {account.accountType}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4 mt-6">
          <div className="flex justify-between">
            <h3 className="text-xl">Recent Transactions</h3>
            <div className="flex gap-2">
              <Button variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                Bank Transfer
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Transaction
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentTransactions.map(transaction => (
                  <div key={transaction.id} className="flex justify-between items-center p-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatIndianDate(transaction.date)} • Ref: {transaction.referenceNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={transaction.type === 'income' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatIndianCurrency(transaction.amount)}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {transaction.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cash" className="space-y-4 mt-6">
          <div className="flex justify-between">
            <h3 className="text-xl">Cash Register</h3>
            <Button>
              <Wallet className="h-4 w-4 mr-2" />
              Cash Transaction
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{formatIndianCurrency(15000)}</p>
                <p className="text-muted-foreground mt-1">Cash in hand</p>
                <div className="flex justify-center gap-4 mt-4">
                  <Button variant="outline" size="sm">Cash In</Button>
                  <Button variant="outline" size="sm">Cash Out</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
