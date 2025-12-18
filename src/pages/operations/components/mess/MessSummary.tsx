
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  FileText,
  Download,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { messChargeService, sendMessBillToAccounts } from "@/services/MessChargeService";

interface MessSummaryProps {
  month: string;
  year: number;
  branchId: string;
  totalAmount: number;
  employeeCount: number;
  onBillGenerated?: (billData: any) => void;
}

export function MessSummary({ 
  month, 
  year, 
  branchId, 
  totalAmount, 
  employeeCount,
  onBillGenerated 
}: MessSummaryProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [billGenerated, setBillGenerated] = useState(false);
  const [billData, setBillData] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerateBill = async () => {
    setIsGenerating(true);
    try {
      const result = messChargeService.generateMonthlyBill({
        branchId,
        month,
        year
      });

      if (result.success) {
        setBillData(result.data);
        setBillGenerated(true);
        onBillGenerated?.(result.data);
        
        toast({
          title: "Bill Generated",
          description: `Monthly mess bill generated successfully`,
        });
      }
    } catch (error) {
      console.error('Error generating bill:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate mess bill",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToAccounts = async () => {
    if (!billData) return;

    setIsSending(true);
    try {
      const result = sendMessBillToAccounts(billData);
      
      if (result.success) {
        toast({
          title: "Bill Sent",
          description: "Mess bill sent to accounts department",
        });
      } else {
        toast({
          title: "Send Failed", 
          description: "Failed to send bill to accounts",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending bill:', error);
      toast({
        title: "Send Failed",
        description: "Failed to send bill to accounts", 
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Monthly Mess Summary</h3>
          </div>
          <Badge variant={billGenerated ? "default" : "secondary"}>
            {billGenerated ? "Generated" : "Pending"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Calendar className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-muted-foreground">Period</p>
            <p className="font-semibold">{month} {year}</p>
          </div>

          <div className="text-center">
            <Users className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-muted-foreground">Employees</p>
            <p className="font-semibold">{employeeCount}</p>
          </div>

          <div className="text-center">
            <DollarSign className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="font-semibold">₹{totalAmount.toLocaleString()}</p>
          </div>

          <div className="text-center">
            <DollarSign className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-muted-foreground">Per Employee</p>
            <p className="font-semibold">₹{Math.round(totalAmount / employeeCount)}</p>
          </div>
        </div>

        <Separator />

        <div className="flex gap-3">
          <Button 
            onClick={handleGenerateBill}
            disabled={isGenerating || billGenerated}
            className="flex-1"
          >
            {isGenerating ? 'Generating...' : 'Generate Bill'}
          </Button>

          <Button 
            onClick={handleSendToAccounts}
            disabled={!billGenerated || isSending}
            variant="outline"
            className="flex-1"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSending ? 'Sending...' : 'Send to Accounts'}
          </Button>

          <Button 
            disabled={!billGenerated}
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>

        {billData && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Bill ID: {billData.id || 'Generated'} | 
              Generated: {new Date().toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
