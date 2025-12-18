
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { calculateMealCostFromDistribution, getMealCost } from "@/services/MessChargeService";

interface MessFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editData?: any;
}

export function MessForm({ isOpen, onClose, onSubmit, editData }: MessFormProps) {
  const [formData, setFormData] = useState({
    postId: editData?.postId || '',
    date: editData?.date || new Date().toISOString().split('T')[0],
    mealType: editData?.mealType || 'breakfast',
    totalEmployees: editData?.totalEmployees || '',
    presentEmployees: editData?.presentEmployees || '',
    guestsCount: editData?.guestsCount || '0',
    specialRequests: editData?.specialRequests || '',
    notes: editData?.notes || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate cost based on attendance
      const totalConsumers = parseInt(formData.presentEmployees) + parseInt(formData.guestsCount);
      const costResult = calculateMealCostFromDistribution({
        postId: formData.postId,
        consumers: totalConsumers,
        mealType: formData.mealType
      });

      if (costResult.success) {
        const baseCost = getMealCost(formData.postId);
        const totalCost = baseCost.cost * totalConsumers;

        const messData = {
          ...formData,
          totalEmployees: parseInt(formData.totalEmployees),
          presentEmployees: parseInt(formData.presentEmployees),
          guestsCount: parseInt(formData.guestsCount),
          perPersonCost: baseCost.cost,
          totalCost: totalCost,
          id: editData?.id || `mess_${Date.now()}`
        };

        onSubmit(messData);
        onClose();
        
        toast({
          title: editData ? "Mess Record Updated" : "Mess Record Added",
          description: `Total cost: ₹${totalCost} for ${totalConsumers} people`,
        });
      }
    } catch (error) {
      console.error('Error processing mess form:', error);
      toast({
        title: "Error",
        description: "Failed to process mess record",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Mess Record' : 'Add Mess Record'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postId">Post ID</Label>
              <Input
                id="postId"
                value={formData.postId}
                onChange={(e) => handleChange('postId', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="mealType">Meal Type</Label>
            <Select value={formData.mealType} onValueChange={(value) => handleChange('mealType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snacks">Snacks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="totalEmployees">Total Staff</Label>
              <Input
                id="totalEmployees"
                type="number"
                value={formData.totalEmployees}
                onChange={(e) => handleChange('totalEmployees', e.target.value)}
                required
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="presentEmployees">Present</Label>
              <Input
                id="presentEmployees"
                type="number"
                value={formData.presentEmployees}
                onChange={(e) => handleChange('presentEmployees', e.target.value)}
                required
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="guestsCount">Guests</Label>
              <Input
                id="guestsCount"
                type="number"
                value={formData.guestsCount}
                onChange={(e) => handleChange('guestsCount', e.target.value)}
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Input
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => handleChange('specialRequests', e.target.value)}
              placeholder="Any special meal requests"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (editData ? 'Update' : 'Add')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
