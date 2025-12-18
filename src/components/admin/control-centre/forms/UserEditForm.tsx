
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Copy, RefreshCw } from 'lucide-react';
import { generatePassword } from "@/utils/firebaseUserManagement";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  branch: string;
  branchId: string;
  status: "active" | "inactive";
  lastActive: string;
  avatar: string;
}

interface UserEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
  user: User | null;
  isNew: boolean;
}

export function UserEditForm({ isOpen, onClose, onSave, user, isNew }: UserEditFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "",
    branch: "",
    branchId: "",
    status: "active",
  });
  const [generatedPassword, setGeneratedPassword] = useState("");

  // Populate form data if user is provided (edit mode)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        branchId: user.branchId,
        status: user.status,
      });
    } else {
      // Reset form for new user and generate password
      setFormData({
        name: "",
        email: "",
        role: "",
        branch: "",
        branchId: "",
        status: "active",
      });
      setGeneratedPassword(generatePassword());
    }
  }, [user, isOpen]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Branch options - in a real app, these would come from an API
  const branchOptions = [
    { id: "b1", name: "Mumbai HQ" },
    { id: "b2", name: "Delhi Branch" },
    { id: "b3", name: "Bangalore Office" },
    { id: "b4", name: "Chennai Office" },
    { id: "b5", name: "Kolkata Branch" },
  ];

  // Role options - mapped to system roles
  const roleOptions = [
    { value: "admin", label: "Administrator" },
    { value: "sales", label: "Sales" },
    { value: "operations", label: "Operations" },
    { value: "hr", label: "HR" },
    { value: "accounts", label: "Accounts" },
    { value: "reports", label: "Reports" },
  ];

  const handleRegeneratePassword = () => {
    const newPassword = generatePassword();
    setGeneratedPassword(newPassword);
    toast({
      title: "Password Regenerated",
      description: "A new password has been generated",
    });
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    toast({
      title: "Password Copied",
      description: "Password copied to clipboard",
    });
  };

  const handleSaveWithPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass password along with form data for new users
    const dataToSave = isNew 
      ? { ...formData, password: generatedPassword }
      : formData;
    onSave(dataToSave);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {isNew ? "Add New User" : "Edit User"}
          </DialogTitle>
          <DialogDescription>
            {isNew
              ? "Create a new user account and set their role and permissions."
              : "Update user details, change their role, or modify access permissions."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role || ""}
                onValueChange={(value) => handleChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select
                value={formData.branchId || ""}
                onValueChange={(value) => {
                  const selectedBranch = branchOptions.find((b) => b.id === value);
                  handleChange("branchId", value);
                  handleChange("branch", selectedBranch?.name || "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branchOptions.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || "active"}
                onValueChange={(value: "active" | "inactive") =>
                  handleChange("status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isNew && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    type="text"
                    value={generatedPassword}
                    onChange={(e) => setGeneratedPassword(e.target.value)}
                    placeholder="Enter or generate password"
                    className="font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleCopyPassword}
                    title="Copy password"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleRegeneratePassword}
                    title="Regenerate password"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  You can type your own password or click regenerate for a random one
                </p>
              </div>
            )}
          </form>
        </ScrollArea>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveWithPassword}>
            {isNew ? "Create User" : "Update User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
