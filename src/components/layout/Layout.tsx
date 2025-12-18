
import React, { useState } from "react";
import { Topbar } from "./Topbar";
import { DrawerNavigation } from "./DrawerNavigation";
import { BottomNavigation } from "./BottomNavigation";
import { Sidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "../ui/scroll-area";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="min-h-screen flex w-full flex-col bg-white dark:bg-[#0B0F19] text-black dark:text-[#E0E0E0]">
      <Topbar />
      <div className="flex flex-1 w-full overflow-hidden">
        {!isMobile && (
          <Sidebar 
            collapsed={sidebarCollapsed} 
            toggleSidebar={toggleSidebar} 
          />
        )}
        <ScrollArea className="flex-1 h-[calc(100vh-64px)]">
          <main 
            className={`flex-1 py-6 px-4 md:px-6 ${isMobile ? 'mb-16' : 'mb-0'} w-full min-h-[calc(100vh-64px)]`}
          >
            {children}
          </main>
        </ScrollArea>
      </div>
      {isMobile && <BottomNavigation />}
    </div>
  );
}
