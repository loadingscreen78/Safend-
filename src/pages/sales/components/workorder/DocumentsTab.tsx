
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DocumentsTabProps {
  formData: {
    documentUrl: string;
    clientApproval: string;
    instructions: string;
    standardOperatingProcedures: string;
    termsAndConditions: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileUpload: (field: string) => void;
}

export function DocumentsTab({ formData, handleChange, handleFileUpload }: DocumentsTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="documentUpload">Work Order Document</Label>
        <div className="flex gap-2">
          <Input 
            id="documentUpload" 
            type="file" 
            className="cursor-pointer flex-1" 
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => handleFileUpload('documentUrl')}
          >
            Upload
          </Button>
        </div>
        {formData.documentUrl && (
          <p className="text-xs text-green-600 mt-1">
            Document uploaded: {formData.documentUrl}
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="clientApprovalUpload">Client Approval Document</Label>
        <div className="flex gap-2">
          <Input 
            id="clientApprovalUpload" 
            type="file" 
            className="cursor-pointer flex-1" 
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => handleFileUpload('clientApproval')}
          >
            Upload
          </Button>
        </div>
        {formData.clientApproval && (
          <p className="text-xs text-green-600 mt-1">
            Document uploaded: {formData.clientApproval}
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="instructions">Special Instructions</Label>
        <Textarea 
          id="instructions" 
          name="instructions" 
          value={formData.instructions} 
          onChange={handleChange} 
          placeholder="Enter any special instructions" 
          rows={3} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="standardOperatingProcedures">Standard Operating Procedures</Label>
        <Textarea 
          id="standardOperatingProcedures" 
          name="standardOperatingProcedures" 
          value={formData.standardOperatingProcedures} 
          onChange={handleChange} 
          placeholder="Enter SOPs for the security service" 
          rows={3} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
        <Textarea 
          id="termsAndConditions" 
          name="termsAndConditions" 
          value={formData.termsAndConditions} 
          onChange={handleChange} 
          placeholder="Enter contract terms" 
          rows={3} 
        />
      </div>
    </div>
  );
}
