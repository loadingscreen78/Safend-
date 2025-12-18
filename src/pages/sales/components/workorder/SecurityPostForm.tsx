
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StaffRequirementsForm } from "./StaffRequirementsForm";
import { DigipinMapView } from "@/components/map/DigipinMapView";
import { MapPin } from "lucide-react";

interface PostLocation {
  address: string;
  digipin?: string;
}

interface StaffRequirement {
  role: string;
  count: number;
  shift: string;
  startTime: string;
  endTime: string;
  days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
}

interface Post {
  name: string;
  code: string;
  type: 'permanent' | 'temporary';
  location: PostLocation;
  dutyType: '8H' | '12H';
  requiredStaff: StaffRequirement[];
}

interface SecurityPostFormProps {
  post: Post;
  postIndex: number;
  onPostChange: (index: number, field: string, value: string | boolean) => void;
  onRemovePost: (index: number) => void;
  onStaffChange: (postIndex: number, staffIndex: number, field: string, value: string | number | string[]) => void;
  onAddStaffRequirement: (postIndex: number) => void;
  onRemoveStaffRequirement: (postIndex: number, staffIndex: number) => void;
  onDayToggle: (postIndex: number, staffIndex: number, day: string, isSelected: boolean) => void;
  allowRemove: boolean;
}

export function SecurityPostForm({
  post,
  postIndex,
  onPostChange,
  onRemovePost,
  onStaffChange,
  onAddStaffRequirement,
  onRemoveStaffRequirement,
  onDayToggle,
  allowRemove
}: SecurityPostFormProps) {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="border rounded-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="font-medium text-base">Post {postIndex + 1}</h4>
          <p className="text-sm text-muted-foreground">Code: {post.code}</p>
        </div>
        
        {allowRemove && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:text-red-700 h-8"
            onClick={() => onRemovePost(postIndex)}
          >
            Remove
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Post Name *</Label>
          <Input 
            value={post.name} 
            onChange={(e) => onPostChange(postIndex, 'name', e.target.value)}
            placeholder="Post name" 
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>Post Type</Label>
          <Select 
            value={post.type} 
            onValueChange={(value) => onPostChange(postIndex, 'type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select post type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="permanent">Permanent</SelectItem>
              <SelectItem value="temporary">Temporary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2 mt-4">
        <Label>Post Address *</Label>
        <Input 
          value={post.location.address} 
          onChange={(e) => onPostChange(postIndex, 'location.address', e.target.value)}
          placeholder="Post address" 
          required
        />
      </div>
      
      <div className="space-y-2 mt-4">
        <div className="flex items-center justify-between">
          <Label>DigiPin (Location Code)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowMap(!showMap)}
            className="gap-2"
          >
            <MapPin className="h-4 w-4" />
            {showMap ? 'Hide Map' : 'Show Map'}
          </Button>
        </div>
        <Input 
          value={post.location.digipin || ''} 
          onChange={(e) => {
            let value = e.target.value.toUpperCase();
            // Allow alphanumeric and dashes only
            value = value.replace(/[^A-Z0-9-]/g, '');
            // Auto-format with dashes (XXX-XXX-XXXX)
            if (value.length > 3 && value[3] !== '-') {
              value = value.slice(0, 3) + '-' + value.slice(3);
            }
            if (value.length > 7 && value[7] !== '-') {
              value = value.slice(0, 7) + '-' + value.slice(7);
            }
            // Limit to format XXX-XXX-XXXX (13 chars with dashes)
            value = value.slice(0, 13);
            onPostChange(postIndex, 'location.digipin', value);
          }}
          placeholder="e.g., 5C8-8J9-7FT7" 
          maxLength={13}
        />
        <p className="text-xs text-muted-foreground">Format: XXX-XXX-XXXX (e.g., 5C8-8J9-7FT7)</p>
        
        {showMap && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <DigipinMapView 
              digipin={post.location.digipin}
              onLocationDecoded={(data) => {
                // Auto-fill address when DigiPIN is decoded
                if (!post.location.address) {
                  onPostChange(postIndex, 'location.address', data.address);
                }
              }}
            />
          </div>
        )}
      </div>
      
      <div className="space-y-2 mt-4">
        <Label>Duty Type</Label>
        <Select 
          value={post.dutyType} 
          onValueChange={(value) => onPostChange(postIndex, 'dutyType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select duty type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="8H">8-Hour Shift</SelectItem>
            <SelectItem value="12H">12-Hour Shift</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <StaffRequirementsForm 
        postIndex={postIndex}
        staffRequirements={post.requiredStaff}
        dutyType={post.dutyType}
        onStaffChange={onStaffChange}
        onAddStaffRequirement={onAddStaffRequirement}
        onRemoveStaffRequirement={onRemoveStaffRequirement}
        onDayToggle={onDayToggle}
      />
    </div>
  );
}
