
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { BasicInfoTab } from "./workorder/BasicInfoTab";
import { PostsTab } from "./workorder/PostsTab";
import { BillingTab } from "./workorder/BillingTab";
import { DocumentsTab } from "./workorder/DocumentsTab";
import { syncPostsFromWorkOrder } from "@/services/firebase/OperationalPostService";
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface WorkorderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editData: any | null;
}

export function WorkorderForm({ isOpen, onClose, onSubmit, editData }: WorkorderFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic information
    id: editData?.id || generateWorkorderId(),
    client: editData?.client || "",
    quotationRef: editData?.quotationRef || "",
    agreementRef: editData?.agreementRef || "",
    service: editData?.service || "",
    startDate: editData?.startDate || getCurrentDate(),
    endDate: editData?.endDate || "",
    value: editData?.value?.replace("₹", "") || "",
    status: editData?.status || "Draft",
    contactPerson: editData?.contactPerson || "",
    contactPhone: editData?.contactPhone || "",
    contactEmail: editData?.contactEmail || "",
    
    // Posts (Security deployment locations)
    posts: editData?.posts || [{
      name: "",
      code: "",
      type: "permanent",
      location: {
        address: "",
        digipin: "",
      },
      dutyType: "8H", // 8H or 12H
      requiredStaff: [
        {
          role: "Security Guard",
          count: 1,
          shift: "Day",
          startTime: "06:00",
          endTime: "14:00",
          days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        }
      ]
    }],
    
    // Billing details
    billingCycle: editData?.billingCycle || "monthly",
    billingRate: editData?.billingRate || "fixed",
    invoiceDueDay: editData?.invoiceDueDay || "30", // Days after invoice issue
    gstInclusive: editData?.gstInclusive || false,
    
    // Terms and instructions
    instructions: editData?.instructions || "",
    standardOperatingProcedures: editData?.standardOperatingProcedures || "",
    termsAndConditions: editData?.termsAndConditions || "",
    
    // Operations integration
    createOperationalPosts: editData?.createOperationalPosts !== undefined ? editData?.createOperationalPosts : true,
    
    // Document uploads
    documentUrl: editData?.documentUrl || "",
    clientApproval: editData?.clientApproval || "",
  });
  
  // Generate workorder ID
  function generateWorkorderId() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `WO-${year}-${randomNum.toString().padStart(4, '0')}`;
  }
  
  // Generate post code
  function generatePostCode(index: number) {
    return `P-${formData.id.split('-')[2]}-${(index + 1).toString().padStart(2, '0')}`;
  }
  
  // Get current date in YYYY-MM-DD format
  function getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle post changes
  const handlePostChange = (index: number, field: string, value: string | boolean) => {
    const updatedPosts = [...formData.posts];
    
    if (field.includes('.')) {
      // Handle nested fields like location.address
      const [parent, child] = field.split('.');
      updatedPosts[index] = {
        ...updatedPosts[index],
        [parent]: {
          ...(updatedPosts[index][parent as keyof typeof updatedPosts[typeof index]]),
          [child]: value
        }
      };
    } else {
      // Handle direct fields
      updatedPosts[index] = { ...updatedPosts[index], [field]: value };
    }
    
    setFormData(prev => ({
      ...prev,
      posts: updatedPosts
    }));
  };
  
  // Handle staff requirement changes
  const handleStaffChange = (postIndex: number, staffIndex: number, field: string, value: string | number | string[]) => {
    const updatedPosts = [...formData.posts];
    const updatedStaff = [...updatedPosts[postIndex].requiredStaff];
    
    if (field === 'count') {
      // Ensure count is a number
      const countValue = typeof value === 'string' ? parseInt(value, 10) || 1 : value;
      updatedStaff[staffIndex] = { ...updatedStaff[staffIndex], [field]: countValue };
    } else {
      updatedStaff[staffIndex] = { ...updatedStaff[staffIndex], [field]: value };
    }
    
    updatedPosts[postIndex].requiredStaff = updatedStaff;
    
    setFormData(prev => ({
      ...prev,
      posts: updatedPosts
    }));
  };
  
  // Handle day toggle for staff shifts
  const handleDayToggle = (postIndex: number, staffIndex: number, day: string, isSelected: boolean) => {
    const updatedPosts = [...formData.posts];
    const updatedStaff = [...updatedPosts[postIndex].requiredStaff];
    const currentDays = [...updatedStaff[staffIndex].days];
    
    if (isSelected) {
      // Add day if not already included
      if (!currentDays.includes(day as any)) {
        updatedStaff[staffIndex].days = [...currentDays, day as any];
      }
    } else {
      // Remove day
      updatedStaff[staffIndex].days = currentDays.filter(d => d !== day);
    }
    
    updatedPosts[postIndex].requiredStaff = updatedStaff;
    
    setFormData(prev => ({
      ...prev,
      posts: updatedPosts
    }));
  };
  
  // Add a new post
  const addPost = () => {
    const newIndex = formData.posts.length;
    
    setFormData(prev => ({
      ...prev,
      posts: [...prev.posts, {
        name: "",
        code: generatePostCode(newIndex),
        type: "permanent",
        location: {
          address: "",
          digipin: "",
        },
        dutyType: "8H",
        requiredStaff: [
          {
            role: "Security Guard",
            count: 1,
            shift: "Day",
            startTime: "06:00",
            endTime: "14:00",
            days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
          }
        ]
      }]
    }));
  };
  
  // Remove a post
  const removePost = (index: number) => {
    if (formData.posts.length > 1) {
      const updatedPosts = [...formData.posts];
      updatedPosts.splice(index, 1);
      
      setFormData(prev => ({
        ...prev,
        posts: updatedPosts
      }));
    }
  };
  
  // Add staff requirement to a post
  const addStaffRequirement = (postIndex: number) => {
    const updatedPosts = [...formData.posts];
    
    updatedPosts[postIndex].requiredStaff = [
      ...updatedPosts[postIndex].requiredStaff,
      {
        role: "Security Guard",
        count: 1,
        shift: "Night",
        startTime: "22:00",
        endTime: "06:00",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
      }
    ];
    
    setFormData(prev => ({
      ...prev,
      posts: updatedPosts
    }));
  };
  
  // Remove staff requirement from a post
  const removeStaffRequirement = (postIndex: number, staffIndex: number) => {
    if (formData.posts[postIndex].requiredStaff.length > 1) {
      const updatedPosts = [...formData.posts];
      const updatedStaff = [...updatedPosts[postIndex].requiredStaff];
      
      updatedStaff.splice(staffIndex, 1);
      updatedPosts[postIndex].requiredStaff = updatedStaff;
      
      setFormData(prev => ({
        ...prev,
        posts: updatedPosts
      }));
    }
  };
  
  // Handle file upload
  const handleFileUpload = (field: string) => {
    toast({
      title: "Document Upload",
      description: "Document upload functionality would be integrated with server storage.",
    });
    
    // Simulate a successful upload
    setFormData(prev => ({
      ...prev,
      [field]: field === 'documentUrl' ? "workorder_document.pdf" : "approval_document.pdf"
    }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.client || !formData.service || !formData.startDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Ensure all posts have a name
    if (formData.posts.some(post => !post.name || !post.location.address)) {
      toast({
        title: "Error",
        description: "All posts must have a name and address.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Format the value with rupee sign
      const formattedData = {
        ...formData,
        value: formData.value ? `₹${formData.value}` : "",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      // Save work order to Firebase FIRST
      console.log('Saving work order to Firebase...');
      const docRef = await addDoc(collection(db, 'workorders'), formattedData);
      console.log('Work order saved with ID:', docRef.id);
      
      // Now sync posts with the real Firebase ID
      const workOrderWithId = { ...formattedData, id: docRef.id };
      
      if (formData.createOperationalPosts && formData.posts.length > 0) {
        console.log('Syncing posts to operations...');
        const result = await syncPostsFromWorkOrder(workOrderWithId);
        
        if (result.success) {
          toast({
            title: "Success!",
            description: `Work Order created and ${formData.posts.length} post(s) synced to Operations`,
          });
        } else {
          toast({
            title: "Partial Success",
            description: "Work Order created but posts sync failed: " + result.error,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Success",
          description: "Work Order created successfully",
        });
      }
      
      // Call the original onSubmit for any additional handling
      onSubmit(workOrderWithId);
      onClose();
      
    } catch (error) {
      console.error('Error saving work order:', error);
      toast({
        title: "Error",
        description: "Failed to save work order: " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Work Order" : "Create New Work Order"}</DialogTitle>
          <DialogDescription>
            {editData ? "Update work order details and security posts" : "Create a new work order with security post assignments and staff requirements"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="posts">Security Posts</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="documents">Documents & Terms</TabsTrigger>
            </TabsList>
            
            {/* Basic Information Tab */}
            <TabsContent value="basic">
              <BasicInfoTab 
                formData={formData} 
                handleChange={handleChange} 
                handleSelectChange={handleSelectChange} 
              />
            </TabsContent>
            
            {/* Security Posts Tab */}
            <TabsContent value="posts">
              <PostsTab 
                posts={formData.posts}
                createOperationalPosts={formData.createOperationalPosts}
                onPostChange={handlePostChange}
                onAddPost={addPost}
                onRemovePost={removePost}
                onStaffChange={handleStaffChange}
                onAddStaffRequirement={addStaffRequirement}
                onRemoveStaffRequirement={removeStaffRequirement}
                onDayToggle={handleDayToggle}
                handleCheckboxChange={handleCheckboxChange}
              />
            </TabsContent>
            
            {/* Billing Tab */}
            <TabsContent value="billing">
              <BillingTab 
                formData={formData} 
                handleSelectChange={handleSelectChange} 
                handleCheckboxChange={handleCheckboxChange} 
              />
            </TabsContent>
            
            {/* Documents & Terms Tab */}
            <TabsContent value="documents">
              <DocumentsTab 
                formData={formData} 
                handleChange={handleChange} 
                handleFileUpload={handleFileUpload} 
              />
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-safend-red hover:bg-red-700">
              {editData ? "Update Work Order" : "Create Work Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
