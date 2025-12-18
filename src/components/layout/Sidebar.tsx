
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BarChart2, Building2, ChevronLeft, ChevronRight, Files, HelpCircle, LayoutDashboard, Settings, ShoppingCart, Users, ShieldAlert, MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { useTheme } from "../ThemeProvider";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define the navigation items
const navItems = [{
  title: "Admin Dashboard",
  icon: LayoutDashboard,
  path: "/dashboard",
  badge: {
    value: "Unified",
    variant: "default" as const
  },
  role: ["admin"], // Only admin can see this
  highlight: true // Add highlight property to make it stand out
}, {
  title: "Sales",
  icon: ShoppingCart,
  path: "/sales",
  role: ["admin", "sales"]
}, {
  title: "Operations",
  icon: Building2,
  path: "/operations",
  badge: {
    value: "3",
    variant: "outline" as const
  },
  role: ["admin", "operations"]
}, {
  title: "Accounts",
  icon: Files,
  path: "/accounts",
  role: ["admin", "accounts"]
}, {
  title: "HR",
  icon: Users,
  path: "/hr",
  role: ["admin", "hr"]
}, {
  title: "Office Admin",
  icon: Building2,
  path: "/office-admin",
  role: ["admin"] // Only admin can see this
}];

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}
export function Sidebar({
  collapsed,
  toggleSidebar
}: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [userRole, setUserRole] = useState<string>("admin");
  const [branchId, setBranchId] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const location = useLocation();
  const {
    theme
  } = useTheme();

  // Update expanded state based on props
  useEffect(() => {
    setExpanded(!collapsed);
  }, [collapsed]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (mobile && expanded) {
        setExpanded(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [expanded]);

  // Simulate getting user role from auth context
  useEffect(() => {
    const updateFromStorage = () => {
      const simulatedRole = localStorage.getItem("userRole") || "admin";
      setUserRole(simulatedRole);
      if (simulatedRole === "branch") {
        const simulatedBranchId = localStorage.getItem("branchId") || "branch-001";
        setBranchId(simulatedBranchId);
      }
    };
    updateFromStorage();
    window.addEventListener('storage', updateFromStorage);
    return () => window.removeEventListener('storage', updateFromStorage);
  }, []);

  // Filter menu items based on user role
  const filteredNavItems = navItems.filter(item => item.role && item.role.includes(userRole));
  const menuVariants = {
    expanded: {
      width: "16rem",
      transition: {
        duration: 0.1
      }
    },
    collapsed: {
      width: "5rem",
      transition: {
        duration: 0.1
      }
    }
  };
  const handleToggleSidebar = () => {
    setExpanded(!expanded);
    toggleSidebar();
  };
  
  return <motion.aside initial="expanded" animate={expanded ? "expanded" : "collapsed"} variants={menuVariants} className={cn("h-screen bg-white dark:bg-black sticky top-0 border-r border-gray-200 dark:border-gray-800 transition-all duration-100 z-30 flex flex-col overflow-hidden shadow-md", isMobileView && !expanded ? "w-0 border-none" : "", expanded ? "w-64" : "w-20")}>
      <div className="flex-1 py-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 mb-8">
          {expanded && <span className="font-semibold text-lg">
              Navigation
            </span>}
          <button onClick={handleToggleSidebar} className={cn("w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors btn-press-effect", !expanded && "mx-auto")}>
            {expanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </div>
        <ScrollArea className="flex-1 px-3">
          <nav className="space-y-1">
            {filteredNavItems.map(item => {
            const isActive = location.pathname === item.path;
            // Add special styling for highlighted items (like our unified dashboard)
            const isHighlighted = item.highlight;
            
            return <div key={item.path}>
                  <NavLink to={item.path} className={({
                isActive
              }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-colors", 
                isActive ? "bg-red-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800",
                // Add a subtle highlight effect for new unified dashboard
                isHighlighted && !isActive ? "bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20" : ""
              )}>
                    <div className="relative flex items-center justify-center">
                      <item.icon className={cn("h-5 w-5 flex-shrink-0", isHighlighted && !isActive ? "text-red-500" : "")} />
                    </div>
                    
                    {expanded && <div className="flex-1 flex justify-between items-center truncate">
                        <span className={cn("truncate", isHighlighted && !isActive ? "font-medium text-red-600 dark:text-red-400" : "")}>
                          {item.title}
                        </span>
                        {item.badge && <Badge variant={item.badge.variant} className={cn("ml-2 text-[10px] px-1.5 py-0.5", 
                          isHighlighted && !isActive && item.badge.variant === "default" ? "bg-red-500" : "")}>
                            {item.badge.value}
                          </Badge>}
                      </div>}
                  </NavLink>
                </div>;
          })}
          </nav>
        </ScrollArea>
      </div>
      
    </motion.aside>;
}
