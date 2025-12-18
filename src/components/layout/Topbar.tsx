
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NotificationPanel } from "./NotificationPanel";
import { DigitalClock } from "./DigitalClock";
import { ThemeToggle } from "../ThemeToggle";
import { Bell, User, LogOut, Settings, HelpCircle } from "lucide-react";
import { useToastWithSound } from "@/hooks/use-toast-with-sound";

export function Topbar() {
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState("user");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToastWithSound();

  useEffect(() => {
    const syncFromStorage = () => {
      const name = localStorage.getItem("userName") || "User";
      const role = localStorage.getItem("userRole") || "user";
      const email = localStorage.getItem("userEmail") || "";
      setUserName(name);
      setUserRole(role);
      setUserEmail(email);
    };
    syncFromStorage();
    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

  const handleLogout = async () => {
    try {
      const { cleanupAuthState } = await import("@/utils/authCleanup");
      cleanupAuthState();
      try { await (await import("@/integrations/supabase/client")).supabase.auth.signOut({ scope: 'global' }); } catch (_) {}
    } finally {
      // Clear local data regardless
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      toast.success({ title: "Logged Out", description: "You have been successfully logged out" });
      window.location.href = "/";
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      manager: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      sales: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      operations: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      accounts: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      hr: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      branch: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  };

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B0F19] sticky top-0 z-40 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <img 
            src="https://static.wixstatic.com/media/5b3fdf_0d52b265a0004375a797c038ad88f65e~mv2.png/v1/fill/w_278,h_172,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo_edited_edited.png" 
            alt="Safend Logo" 
            className="w-8 h-8 object-contain"
          />
          <span className="font-semibold text-lg hidden sm:inline">Safend</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <DigitalClock />
        
        <ThemeToggle />
        
        <NotificationPanel />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 text-xs font-medium">
                  {getUserInitials(userName)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
              <Badge variant="secondary" className={`w-fit mt-1 text-xs ${getRoleColor(userRole)}`}>
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </Badge>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
