
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeVerificationPage from "@/components/EmployeeVerificationPage";
import LoginModal from "@/components/LoginModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import ClientSignup from "@/components/ClientSignup";
import EmployeeSignup from "@/components/EmployeeSignup";
import OnboardingForms from "@/components/OnboardingForms";
import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Index = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<"client" | "employee">("client");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showEmployeeVerification, setShowEmployeeVerification] = useState(false);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      navigate("/dashboard");
      return;
    }
    // Also check Supabase session
    (async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate("/dashboard");
    })();
  }, [navigate]);

  // Detect theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme("dark");
    }
    
    // Add event listener for theme changes
    const handleThemeChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        setTheme(e.newValue as "light" | "dark");
      }
    };
    
    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);


  const handleClientOnboard = () => {
    setFormType("client");
    setFormOpen(true);
  };

  const handleEmployeeOnboard = () => {
    setFormType("employee");
    setFormOpen(true);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden p-6 md:p-8 lg:p-12">
      {/* Enhanced Background pattern/texture */}
      <div 
        className="fixed inset-0 pointer-events-none" 
        aria-hidden="true"
      >
        <div className={cn(
          "absolute inset-0 light-pattern transition-opacity duration-300",
          theme === "light" ? "opacity-10" : "opacity-0"
        )}></div>
        
        {/* Dark mode vignette with additional red shadow effect */}
        <div className={cn(
          "absolute inset-0 transition-all duration-300",
          theme === "light" 
            ? "opacity-0" 
            : "opacity-100 dark-vignette bg-gradient-to-br from-black via-black to-brand-red/30"
        )}>
          <div className="absolute inset-0 animate-pulse-custom opacity-30 bg-[radial-gradient(circle_at_center,theme(colors.brand.red)/10,transparent_70%)]"></div>
          <div className="absolute inset-0 animate-shimmer"></div>
        </div>
        
        {/* Light mode additional shadow effect */}
        <div className={cn(
          "absolute inset-0 transition-all duration-300 bg-gradient-to-tr from-white via-white to-brand-red/10",
          theme === "light" ? "opacity-70" : "opacity-0"
        )}>
          <div className="absolute inset-0 animate-pulse-custom opacity-20 bg-[radial-gradient(circle_at_bottom,theme(colors.black)/5,transparent_60%)]"></div>
        </div>
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Employee Directory Button - Fixed Top Right */}
      <Button
        variant="outline"
        onClick={() => setShowEmployeeVerification(!showEmployeeVerification)}
        className={cn(
          "fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-2",
          "bg-background/95 backdrop-blur-sm border border-border shadow-lg",
          "hover:shadow-xl hover:bg-background transition-all duration-200",
          "text-foreground hover:text-primary font-medium",
          showEmployeeVerification && "bg-primary/10 border-primary/20 text-primary"
        )}
        aria-label={showEmployeeVerification ? "Hide Employee Directory" : "Show Employee Directory"}
      >
        <Users className="h-4 w-4" />
        <span>Employee Directory</span>
      </Button>

      {/* Logo with enhanced animation and transparent background */}
      <div className="flex justify-center pt-8 animate-fade-in-up">
        <div className={cn(
          "relative p-4 rounded-2xl transition-all duration-300 hover:scale-105",
          "backdrop-blur-sm shadow-2xl",
          "ring-2 ring-red-500/20 border border-red-500/10",
          "hover:shadow-red-500/20 hover:shadow-2xl",
          "bg-transparent"
        )}>
          <img 
            src="https://static.wixstatic.com/media/5b3fdf_0d52b265a0004375a797c038ad88f65e~mv2.png/v1/fill/w_278,h_172,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo_edited_edited.png" 
            alt="Company Logo" 
            className={cn(
              "w-40 h-auto transition-all duration-300",
              "drop-shadow-lg filter",
              "hue-rotate-0 saturate-150 contrast-110"
            )}
            style={{
              filter: 'brightness(1.1) contrast(1.2) drop-shadow(0 4px 8px rgba(255, 33, 33, 0.2))'
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "container py-12 px-4 sm:py-16 relative z-10"
      )}>
        {/* Main Login Form */}
        <div className="mb-12 flex justify-center animate-fade-in-up">
          <LoginForm />
        </div>

        {/* Onboarding buttons below login form with enhanced styling */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 items-center animate-fade-in-up">
          <div onClick={handleClientOnboard} className="animate-fade-in" style={{animationDelay: "200ms"}}>
            <ClientSignup />
          </div>
          <div onClick={handleEmployeeOnboard} className="animate-fade-in" style={{animationDelay: "400ms"}}>
            <EmployeeSignup />
          </div>
        </div>
      </div>
      
      {/* Footer with enhanced animation */}
      <footer className="text-center py-6 text-sm text-muted-foreground relative z-10 animate-fade-in" style={{animationDelay: "600ms"}}>
        <p>Employee Directory &copy; {new Date().getFullYear()}</p>
      </footer>

      {/* Employee Verification Page */}
      <EmployeeVerificationPage
        isOpen={showEmployeeVerification}
        onClose={() => setShowEmployeeVerification(false)}
        onEmployeeOnboard={handleEmployeeOnboard}
        onClientOnboard={handleClientOnboard}
      />

      {/* Onboarding Forms */}
      <OnboardingForms 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        type={formType} 
      />
    </div>
  );
};

export default Index;
