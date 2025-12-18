
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SecurityPostForm } from "./SecurityPostForm";

interface PostLocation {
  address: string;
  latitude: string | number;
  longitude: string | number;
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

interface PostsTabProps {
  posts: Post[];
  createOperationalPosts: boolean;
  onPostChange: (index: number, field: string, value: string | boolean) => void;
  onAddPost: () => void;
  onRemovePost: (index: number) => void;
  onStaffChange: (postIndex: number, staffIndex: number, field: string, value: string | number | string[]) => void;
  onAddStaffRequirement: (postIndex: number) => void;
  onRemoveStaffRequirement: (postIndex: number, staffIndex: number) => void;
  onDayToggle: (postIndex: number, staffIndex: number, day: string, isSelected: boolean) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
}

export function PostsTab({
  posts,
  createOperationalPosts,
  onPostChange,
  onAddPost,
  onRemovePost,
  onStaffChange,
  onAddStaffRequirement,
  onRemoveStaffRequirement,
  onDayToggle,
  handleCheckboxChange
}: PostsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-lg">Security Post Locations</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={onAddPost}
        >
          Add Post
        </Button>
      </div>
      
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="createOperationalPosts" 
            checked={createOperationalPosts}
            onCheckedChange={(checked) => 
              handleCheckboxChange("createOperationalPosts", checked === true)
            }
          />
          <div>
            <Label htmlFor="createOperationalPosts" className="font-medium">
              Create Operational Posts
            </Label>
            <p className="text-sm text-muted-foreground">
              Posts will be automatically created in the Operations module when the work order is approved
            </p>
          </div>
        </div>
      </div>
      
      {posts.map((post, postIndex) => (
        <SecurityPostForm
          key={postIndex}
          post={post}
          postIndex={postIndex}
          onPostChange={onPostChange}
          onRemovePost={onRemovePost}
          onStaffChange={onStaffChange}
          onAddStaffRequirement={onAddStaffRequirement}
          onRemoveStaffRequirement={onRemoveStaffRequirement}
          onDayToggle={onDayToggle}
          allowRemove={posts.length > 1}
        />
      ))}
    </div>
  );
}
