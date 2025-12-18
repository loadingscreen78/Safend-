
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
}

export const DrawerNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const userRole = localStorage.getItem("userRole") || "admin";
  
  const allNavigationItems: NavigationItem[] = [
    { name: "Admin Dashboard", path: "/dashboard", icon: () => <span>📊</span>, roles: ["admin"] },
    { name: "Sales", path: "/sales", icon: () => <span>💰</span>, roles: ["admin", "sales"] },
    { name: "Operations", path: "/operations", icon: () => <span>🔧</span>, roles: ["admin", "operations"] },
    { name: "HR", path: "/hr", icon: () => <span>👥</span>, roles: ["admin", "hr"] },
    { name: "Accounts", path: "/accounts", icon: () => <span>📝</span>, roles: ["admin", "accounts"] },
    { name: "Office Admin", path: "/office-admin", icon: () => <span>🏢</span>, roles: ["admin"] },
    { name: "Reports", path: "/reports", icon: () => <span>📈</span>, roles: ["admin", "reports"] },
  ];

  // Filter navigation items based on user role
  const navigationItems = allNavigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm p-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? "destructive" : "ghost"}
                  className={cn(
                    "flex justify-start gap-3 text-base",
                    location.pathname === item.path && "text-white"
                  )}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon />
                  <span>{item.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
