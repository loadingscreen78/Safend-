
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isDark = theme === "dark";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className={cn(
              "rounded-full w-8 h-8",
              "bg-background/90 backdrop-blur-md border shadow-lg hover:shadow-xl",
              "transition-all duration-500 ease-out hover:scale-110 active:scale-95",
              "group relative overflow-hidden select-none",
              isDark 
                ? "shadow-primary/20 hover:shadow-primary/30 border-primary/20" 
                : "shadow-black/10 hover:shadow-black/20 border-border"
            )}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {/* Glow effect background */}
            <div className={cn(
              "absolute inset-0 rounded-full transition-all duration-500 ease-out",
              "opacity-0 group-hover:opacity-100",
              isDark 
                ? "bg-gradient-to-r from-primary/20 to-primary/10" 
                : "bg-gradient-to-r from-muted/50 to-muted/30"
            )} />
            
            {/* Floating sparkle effect */}
            <div className={cn(
              "absolute inset-0 rounded-full transition-all duration-700 ease-out",
              "bg-[radial-gradient(circle_at_30%_30%,theme(colors.primary)/30,transparent_50%)]",
              "opacity-0 group-hover:opacity-100 animate-pulse"
            )} />
            
            {/* Icon container with enhanced micro-interactions */}
            <div className={cn(
              "relative transition-all duration-300 ease-out",
              "group-hover:scale-125 group-active:scale-90"
            )}>
              {isDark ? (
                <Sun className={cn(
                  "h-5 w-5 drop-shadow-sm transition-all duration-300",
                  "text-primary group-hover:text-primary/80"
                )} />
              ) : (
                <Moon className={cn(
                  "h-5 w-5 drop-shadow-sm transition-all duration-300",
                  "text-foreground group-hover:text-primary"
                )} />
              )}
            </div>
            
            <span className="sr-only">
              {isDark ? "Switch to light mode" : "Switch to dark mode"}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="bg-background/95 backdrop-blur-sm border border-primary/20 shadow-xl"
          sideOffset={8}
        >
          <div className="flex items-center gap-2">
            {isDark ? <Sun className="h-3 w-3 text-primary" /> : <Moon className="h-3 w-3 text-primary" />}
            <p className="text-sm font-medium">Theme Toggle</p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Click to switch</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
