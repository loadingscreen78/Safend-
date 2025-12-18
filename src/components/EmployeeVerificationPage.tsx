import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Heart, Users, Building2, X } from "lucide-react";
import { cn } from "@/lib/utils";
interface EmployeeVerificationPageProps {
  isOpen: boolean;
  onClose: () => void;
  onEmployeeOnboard: () => void;
  onClientOnboard: () => void;
}
export default function EmployeeVerificationPage({
  isOpen,
  onClose,
  onEmployeeOnboard,
  onClientOnboard
}: EmployeeVerificationPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
  };
  if (!isOpen) return null;
  return <div className={cn("fixed inset-0 z-[200] bg-background/95 backdrop-blur-md", "animate-fade-in")}>
      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        {/* Dark mode background */}
        <div className={cn("absolute inset-0 transition-all duration-300 dark:opacity-100 opacity-0", "dark-vignette bg-gradient-to-br from-black via-black to-brand-red/30")}>
          <div className="absolute inset-0 animate-pulse-custom opacity-30 bg-[radial-gradient(circle_at_center,theme(colors.brand.red)/10,transparent_70%)]"></div>
          <div className="absolute inset-0 animate-shimmer"></div>
        </div>
        
        {/* Light mode background */}
        <div className={cn("absolute inset-0 transition-all duration-300 dark:opacity-0 opacity-100", "bg-gradient-to-br from-white via-gray-50 to-brand-red/5")}>
          <div className="absolute inset-0 light-pattern opacity-20"></div>
          <div className="absolute inset-0 animate-pulse-custom opacity-10 bg-[radial-gradient(circle_at_center,theme(colors.brand.red)/5,transparent_70%)]"></div>
        </div>
      </div>

      {/* Close button */}
      <Button variant="ghost" size="icon" onClick={onClose} className="fixed top-4 right-4 z-[210] text-foreground hover:bg-muted/20">
        <X className="h-5 w-5" />
      </Button>

      {/* Main content */}
      <div className="min-h-screen flex flex-col relative z-[201]">
        {/* Header */}
        <div className="flex justify-center pt-8 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-red/20 border border-brand-red/30">
              <Heart className="h-6 w-6 text-brand-red" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Employee Finder</h1>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 container max-w-4xl mx-auto px-4">
          {/* Verify Employee Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in-up">
              Verify an Employee
            </h2>
            <p className="text-lg text-muted-foreground animate-fade-in-up" style={{
            animationDelay: "200ms"
          }}>
              Search for employee information by name and ID
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-16 animate-fade-in-up" style={{
          animationDelay: "400ms"
        }}>
            <Card className="bg-card/80 border-border backdrop-blur-md shadow-lg">
              <CardContent className="p-8 rounded-md">
                <form onSubmit={handleSearch} className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input type="text" placeholder="Enter employee full name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 h-12" />
                  </div>
                  <Button type="submit" className="bg-brand-red hover:bg-brand-red/90 text-white px-8 h-12">
                    Next
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Onboarding Cards */}
          
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-muted-foreground">
          <p>&copy; 2025 Employee Finder. All rights reserved.</p>
        </footer>
      </div>
    </div>;
}