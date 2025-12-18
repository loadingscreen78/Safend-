
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Building2 } from "lucide-react";
import { Branch } from "@/types/branch";
import { useBranch } from "@/contexts/BranchContext";
import { useToast } from "@/components/ui/use-toast";
import { BranchEditForm } from "./forms/BranchEditForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { UnifiedLoader } from "@/components/ui/unified-loader";

interface BranchManagerProps {
  searchTerm: string;
}

export function BranchManager({
  searchTerm
}: BranchManagerProps) {
  const { toast } = useToast();
  const { allBranches, updateBranches, isMainBranch, currentBranch } = useBranch();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const filteredBranches = allBranches.filter(branch => {
    if (!searchTerm) return true;
    return branch.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           branch.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
           branch.city.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const handleEditBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsEditDialogOpen(true);
    toast({
      title: "Edit Branch",
      description: `Editing ${branch.name}`
    });
  };
  
  const handleDeleteBranch = (branchId: string) => {
    if (branchId === 'main') {
      toast({
        title: "Cannot Delete",
        description: "Main branch cannot be deleted",
        variant: "destructive"
      });
      return;
    }
    setBranchToDelete(branchId);
  };
  
  const confirmDeleteBranch = () => {
    if (!branchToDelete) return;
    
    setIsLoading(true);
    setLoadingProgress(0);
    
    // Simulate loading
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const next = Math.min(prev + 25, 100);
        return next;
      });
    }, 200);
    
    setTimeout(() => {
      clearInterval(interval);
      setLoadingProgress(100);
      
      setTimeout(() => {
        const updatedBranches = allBranches.filter(b => b.id !== branchToDelete);
        updateBranches(updatedBranches);
        
        toast({
          title: "Branch Deleted",
          description: "Branch has been removed from the system"
        });
        
        setBranchToDelete(null);
        setIsLoading(false);
      }, 300);
    }, 800);
  };
  
  const handleAddBranch = () => {
    setSelectedBranch(null);
    setIsAddingBranch(true);
    setIsEditDialogOpen(true);
    toast({
      title: "Add Branch",
      description: "Create a new branch"
    });
  };
  
  const handleSaveBranch = (branchData: Partial<Branch>) => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    // Simulate loading
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const next = Math.min(prev + 20, 100);
        return next;
      });
    }, 200);
    
    setTimeout(() => {
      clearInterval(interval);
      setLoadingProgress(100);
      
      setTimeout(() => {
        if (isAddingBranch) {
          // Generate a unique ID for the new branch
          const newId = `b${allBranches.length + 1}`;
          const newBranch: Branch = {
            id: newId,
            name: branchData.name || '',
            code: branchData.code || '',
            address: branchData.address || '',
            city: branchData.city || '',
            state: branchData.state || '',
            country: branchData.country || 'India',
            postalCode: branchData.postalCode || '',
            phone: branchData.phone || '',
            email: branchData.email || '',
            managerName: branchData.managerName || '',
            managerId: branchData.managerId || null,
            status: branchData.status as "active" | "inactive" || "active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          const updatedBranches = [...allBranches, newBranch];
          updateBranches(updatedBranches);
          toast({
            title: "Branch Created",
            description: `${newBranch.name} has been created successfully`
          });
        } else if (selectedBranch) {
          // Update existing branch
          const updatedBranches = allBranches.map(b => {
            if (b.id === selectedBranch.id) {
              return {
                ...b,
                ...branchData,
                updatedAt: new Date().toISOString()
              };
            }
            return b;
          });
          updateBranches(updatedBranches);
          toast({
            title: "Branch Updated",
            description: `${branchData.name} has been updated successfully`
          });
        }
        
        setIsEditDialogOpen(false);
        setIsAddingBranch(false);
        setSelectedBranch(null);
        setIsLoading(false);
      }, 300);
    }, 800);
  };
  
  if (isLoading) {
    return (
      <UnifiedLoader 
        variant="fullscreen"
        progress={loadingProgress}
        message="Processing branch operations..."
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <Card className="control-centre-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">Branch Manager</CardTitle>
            <CardDescription>
              Manage branches and assign users with specific permissions
            </CardDescription>
          </div>
          {isMainBranch && <Button onClick={handleAddBranch} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Branch
            </Button>}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBranches.map(branch => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">{branch.code}</TableCell>
                  <TableCell>{branch.name}</TableCell>
                  <TableCell>{branch.city}, {branch.state}</TableCell>
                  <TableCell>{branch.managerName || "Unassigned"}</TableCell>
                  <TableCell>
                    <Badge variant={branch.status === "active" ? "default" : "secondary"}>
                      {branch.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {(isMainBranch || currentBranch?.id === branch.id) && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => handleEditBranch(branch)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {branch.id !== 'main' && (
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteBranch(branch.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Branch Edit Form */}
      <BranchEditForm 
        branch={selectedBranch} 
        isOpen={isEditDialogOpen} 
        onClose={() => {
          setIsEditDialogOpen(false);
          setIsAddingBranch(false);
          setSelectedBranch(null);
        }} 
        onSave={handleSaveBranch} 
        isNew={isAddingBranch} 
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!branchToDelete} onOpenChange={() => setBranchToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              branch and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteBranch} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
