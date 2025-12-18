import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ScheduleFollowupModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  companyName: string;
  onSave: (followup: FollowupData) => void;
}

export interface FollowupData {
  contact: string;
  company: string;
  type: string;
  dateTime: string;
  subject: string;
  status: string;
}

export function ScheduleFollowupModal({ 
  isOpen, 
  onClose, 
  clientName, 
  companyName,
  onSave 
}: ScheduleFollowupModalProps) {
  const { toast } = useToast();
  
  // Get current date and time
  const now = new Date();
  const currentDateTime = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  const displayDateTime = now.toLocaleString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const [status, setStatus] = useState("Pending");
  const [subject, setSubject] = useState(`Follow-up with ${clientName}`);
  const [followupType, setFollowupType] = useState("Call");
  const [scheduledDateTime, setScheduledDateTime] = useState(currentDateTime);

  const handleSave = () => {
    const followupData: FollowupData = {
      contact: clientName,
      company: companyName,
      type: followupType,
      dateTime: scheduledDateTime,
      subject: subject,
      status: status
    };

    onSave(followupData);
    
    toast({
      title: "Follow-up Scheduled!",
      description: `Follow-up with ${clientName} has been scheduled successfully.`,
      duration: 3000,
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Schedule Follow-up
          </DialogTitle>
          <DialogDescription>
            Create a follow-up reminder for this client
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Client Info */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Client:</p>
            <p className="text-lg font-bold">{clientName}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{companyName}</p>
          </div>

          {/* Current Date & Time Display */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                Current Time: {displayDateTime}
              </p>
            </div>
          </div>

          {/* Follow-up Type */}
          <div className="space-y-2">
            <Label htmlFor="followup-type">Follow-up Type</Label>
            <Select value={followupType} onValueChange={setFollowupType}>
              <SelectTrigger id="followup-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Call">Call</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Meeting">Meeting</SelectItem>
                <SelectItem value="Visit">Site Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scheduled Date & Time */}
          <div className="space-y-2">
            <Label htmlFor="scheduled-datetime">Scheduled Date & Time</Label>
            <Input
              id="scheduled-datetime"
              type="datetime-local"
              value={scheduledDateTime}
              onChange={(e) => setScheduledDateTime(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter follow-up subject"
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Clock className="h-4 w-4 mr-2" />
              Save Follow-up
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
