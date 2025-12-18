import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { MapPin, Search, Building2, ChevronDown, ChevronUp, Navigation, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { subscribeToOperationalPosts, type OperationalPost } from "@/services/firebase/OperationalPostService";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Group posts by client
interface ClientPostsGroup {
  clientName: string;
  posts: OperationalPost[];
  totalPosts: number;
  activePosts: number;
}

export function PostManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<OperationalPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openClients, setOpenClients] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Subscribe to real-time operational posts from Firebase
  useEffect(() => {
    console.log('PostManagement: Setting up Firebase subscription...');
    try {
      const unsubscribe = subscribeToOperationalPosts((operationalPosts) => {
        console.log('PostManagement: Received posts from Firebase:', operationalPosts.length, operationalPosts);
        setPosts(operationalPosts);
        setIsLoading(false);
        setError(null);
      });

      return () => {
        console.log('PostManagement: Cleaning up Firebase subscription');
        unsubscribe();
      };
    } catch (err) {
      console.error('PostManagement: Error setting up subscription:', err);
      setError((err as Error).message);
      setIsLoading(false);
    }
  }, []);

  // Group posts by client
  const groupedPosts: ClientPostsGroup[] = posts.reduce((acc, post) => {
    const clientName = post.clientName || "Unknown Client";
    const existingGroup = acc.find(g => g.clientName === clientName);
    
    if (existingGroup) {
      existingGroup.posts.push(post);
      existingGroup.totalPosts++;
      if (post.status === 'active') existingGroup.activePosts++;
    } else {
      acc.push({
        clientName,
        posts: [post],
        totalPosts: 1,
        activePosts: post.status === 'active' ? 1 : 0
      });
    }
    
    return acc;
  }, [] as ClientPostsGroup[]);

  console.log('PostManagement: Grouped posts:', groupedPosts.length, 'groups', groupedPosts);

  // Filter groups based on search term
  const filteredGroups = groupedPosts.filter(group =>
    group.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.posts.some(post => 
      post.postName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.postCode.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleClient = (clientName: string) => {
    setOpenClients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clientName)) {
        newSet.delete(clientName);
      } else {
        newSet.add(clientName);
      }
      return newSet;
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    toast({
      title: "Refreshing",
      description: "Syncing posts from Sales Work Orders...",
    });
    // The subscription will automatically update
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">Operational Posts</h3>
          <p className="text-muted-foreground">
            Posts synced from Sales Work Orders - Organized by Client
          </p>
        </div>
        
        <Button onClick={handleRefresh} variant="outline" className="flex gap-2 items-center">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>
      
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search by client or post name..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{filteredGroups.length} Clients</span>
              <span className="mx-2">•</span>
              <MapPin className="h-4 w-4" />
              <span>{posts.length} Posts</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <LoadingAnimation size="lg" color="red" showPercentage={true} />
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              Error loading posts. Please try again.
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Posts Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? "No posts match your search criteria" 
                  : "Posts will appear here when Work Orders are created in Sales module"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGroups.map((group) => (
                <Card key={group.clientName} className="overflow-hidden">
                  <Collapsible
                    open={openClients.has(group.clientName)}
                    onOpenChange={() => toggleClient(group.clientName)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold text-lg">{group.clientName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {group.totalPosts} {group.totalPosts === 1 ? 'Post' : 'Posts'} • {group.activePosts} Active
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Badge variant={group.activePosts > 0 ? "default" : "secondary"}>
                            {group.activePosts > 0 ? "Active" : "Inactive"}
                          </Badge>
                          {openClients.has(group.clientName) ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="border-t border-gray-200 dark:border-gray-800">
                        <div className="p-4 space-y-3">
                          {group.posts.map((post) => (
                            <div 
                              key={post.id} 
                              className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-semibold">{post.postName}</h5>
                                    <Badge variant="outline" className="text-xs">
                                      {post.postCode}
                                    </Badge>
                                    <Badge variant={post.type === 'permanent' ? 'default' : 'secondary'} className="text-xs">
                                      {post.type}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {post.location.address}
                                  </p>
                                </div>
                                <Badge 
                                  variant={post.status === 'active' ? 'default' : 'secondary'}
                                  className="ml-2"
                                >
                                  {post.status}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                  <div className="text-sm">
                                    <p className="font-medium text-gray-700 dark:text-gray-300">DigiPIN</p>
                                    <p className="text-muted-foreground font-mono">{post.location.digipin || 'N/A'}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-start gap-2">
                                  <Navigation className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                  <div className="text-sm">
                                    <p className="font-medium text-gray-700 dark:text-gray-300">Coordinates</p>
                                    {post.location.latitude !== undefined && post.location.longitude !== undefined ? (
                                      <div className="text-muted-foreground font-mono text-xs">
                                        <div>Lat: {post.location.latitude.toFixed(6)}</div>
                                        <div>Lng: {post.location.longitude.toFixed(6)}</div>
                                        {post.location.latitude === 0 && post.location.longitude === 0 ? (
                                          <div className="text-amber-600 dark:text-amber-400 mt-1 text-xs">
                                            ⚠️ Old post - recreate to get real coordinates
                                          </div>
                                        ) : (
                                          <div className="text-green-600 dark:text-green-400 mt-1 text-xs">
                                            ✓ Decoded from DigiPIN
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-muted-foreground text-xs">
                                        No coordinates available
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-4">
                                    <span className="text-muted-foreground">
                                      <span className="font-medium text-gray-700 dark:text-gray-300">Duty:</span> {post.dutyType}
                                    </span>
                                    <span className="text-muted-foreground">
                                      <span className="font-medium text-gray-700 dark:text-gray-300">Staff:</span> {post.requiredStaff.reduce((sum, s) => sum + s.count, 0)} Required
                                    </span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    Work Order: {post.workOrderId}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
