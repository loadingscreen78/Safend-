
interface MessCharge {
  id: string;
  branchId: string;
  month: string;
  year: number;
  totalAmount: number;
  employeeCount: number;
  generatedAt: string;
}

interface MessChargeService {
  generateMonthlyBill(options: {
    branchId: string;
    month: string;
    year: number;
  }): {
    success: boolean;
    data?: any;
    requestId?: string;
    error?: string;
  };
}

// Mock implementation for frontend-only project
class MessChargeService {
  generateMonthlyBill(options: {
    branchId: string;
    month: string;
    year: number;
  }): {
    success: boolean;
    data?: any;
    requestId?: string;
    error?: string;
  } {
    const mockBill = {
      branchId: options.branchId,
      month: options.month,
      year: options.year,
      totalAmount: 15000,
      employeeCount: 25,
      generatedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: mockBill,
      requestId: `req_${Date.now()}`
    };
  }
}

// Frontend-only mock functions
export const getAllMealCostConfigurations = () => {
  return [];
};

export const calculateMealCostFromDistribution = (data: any) => {
  return { success: true, cost: 150 };
};

export const updatePostMealCost = (postId: string, cost: number) => {
  return { success: true };
};

export const getMealCost = (postId: string) => {
  return { cost: 150 };
};

export const sendMessBillToAccounts = (billData: any) => {
  return { success: true, billId: `bill_${Date.now()}` };
};

export const messChargeService = new MessChargeService();
export default messChargeService;
