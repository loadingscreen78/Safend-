
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Users, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMealCost, updatePostMealCost } from "@/services/MessChargeService";

interface MealCostManagerProps {
  postId: string;
  postName: string;
  currentCost?: number;
  onCostUpdate?: (newCost: number) => void;
}

export function MealCostManager({ 
  postId, 
  postName, 
  currentCost = 0, 
  onCostUpdate 
}: MealCostManagerProps) {
  const [mealCost, setMealCost] = useState(currentCost);
  const [newCost, setNewCost] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCurrentCost();
  }, [postId]);

  const loadCurrentCost = async () => {
    try {
      const result = getMealCost(postId);
      setMealCost(result.cost);
    } catch (error) {
      console.error('Error loading meal cost:', error);
    }
  };

  const handleUpdateCost = async () => {
    if (!newCost || isNaN(Number(newCost))) {
      toast({
        title: "Invalid Cost",
        description: "Please enter a valid cost amount",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      const costValue = Number(newCost);
      const result = updatePostMealCost(postId, costValue);
      
      if (result.success) {
        setMealCost(costValue);
        setNewCost('');
        onCostUpdate?.(costValue);
        
        toast({
          title: "Cost Updated",
          description: `Meal cost updated to ₹${costValue} per person`,
        });
      }
    } catch (error) {
      console.error('Error updating cost:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update meal cost",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Meal Cost Management</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Post Name</Label>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
              {postName}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Current Cost per Person</Label>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                ₹{mealCost}
              </Badge>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="newCost">Update Cost (₹ per person)</Label>
              <Input
                id="newCost"
                type="number"
                value={newCost}
                onChange={(e) => setNewCost(e.target.value)}
                placeholder="Enter new cost"
                min="0"
                step="0.01"
              />
            </div>
            <Button 
              onClick={handleUpdateCost}
              disabled={isUpdating || !newCost}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? 'Updating...' : 'Update Cost'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
