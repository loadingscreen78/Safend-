
import { Post } from "@/types/operations";
import MapboxMap from "../dashboard/MapboxMap";
import { Card } from "@/components/ui/card";
import { usePermissions } from "@/hooks/operations/usePermissions";

interface PostMapViewProps {
  posts: Post[];
  onSelectPost: (postId: string) => void;
  className?: string; // Add className prop
}

export function PostMapView({ posts, onSelectPost, className }: PostMapViewProps) {
  const { hasPermission } = usePermissions();
  const canManagePosts = hasPermission("POST_MANAGEMENT");
  
  const handlePostSelect = (postId: string) => {
    if (canManagePosts) {
      onSelectPost(postId);
    }
  };

  return (
    <div className={`h-[600px] ${className || ''}`}>
      <MapboxMap 
        posts={posts}
        config={{
          showLabels: true,
          clusterMarkers: true,
          mapStyle: 'streets'
        }}
        onPostSelect={handlePostSelect}
      />
    </div>
  );
}
