
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppData } from "@/contexts/AppDataContext";
import { useForm } from "react-hook-form";
import { emitEvent, EVENT_TYPES } from "@/services/EventService";

export function InventoryDistributionForm() {
  const { inventory, activeBranch } = useAppData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Get items for this branch that have stock
  const availableItems = inventory.filter(
    item => item.branch === activeBranch && item.currentStock > 0
  );

  const form = useForm({
    defaultValues: {
      itemId: "",
      quantity: 1,
      destinationType: "employee",
      destinationId: "",
      notes: ""
    }
  });

  const onSubmit = (data) => {
    setIsSubmitting(true);
    
    // In a real app, this would call an API
    setTimeout(() => {
      console.log("Distribution created:", data);
      
      // Emit inventory.issued event
      emitEvent("inventory.issued", {
        itemId: data.itemId,
        quantity: data.quantity,
        destinationType: data.destinationType,
        destinationId: data.destinationId,
        notes: data.notes,
        branchId: activeBranch,
        timestamp: new Date().toISOString()
      });
      
      setIsSubmitting(false);
      form.reset();
      
      // Show toast notification - this would be handled by a toast system in a real app
      alert("Inventory items distributed successfully");
    }, 1000);
  };

  const handleItemChange = (itemId) => {
    const item = inventory.find(i => i.id === itemId);
    setSelectedItem(item);
    form.setValue("itemId", itemId);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="font-medium text-blue-800 mb-1">Issue Items</h3>
        <p className="text-blue-700 text-sm">
          Create a distribution record to issue items to employees, posts, or vehicles.
          This will automatically reduce the stock level.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="itemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Item</FormLabel>
                <Select onValueChange={handleItemChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an item to distribute" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableItems.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} (Available: {item.currentStock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select an item from your inventory to distribute.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    min={1} 
                    max={selectedItem?.currentStock || 1} 
                    onChange={e => field.onChange(parseInt(e.target.value) || 1)} 
                  />
                </FormControl>
                {selectedItem && (
                  <FormDescription>
                    Maximum available: {selectedItem.currentStock}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="destinationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distribution Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select distribution type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="post">Post/Site</SelectItem>
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                    <SelectItem value="branch">Branch</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="destinationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient ID/Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter employee ID, post code, etc." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any additional notes or instructions"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Issue Items"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
