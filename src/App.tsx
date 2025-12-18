
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import { UnifiedLoader } from "./components/ui/unified-loader";
import { SalesModule } from "./pages/sales/SalesModule";
import { OperationsModule } from "./pages/operations/OperationsModule";
import { HRModule } from "./pages/hr/HRModule";
import { AccountsModule } from "./pages/accounts/AccountsModule";
import { OfficeAdminModule } from "./pages/office-admin/OfficeAdminModule";
import { AppDataProvider } from "./contexts/AppDataContext";
import { AdminDashboardModule } from "./pages/admin/unified/AdminDashboardModule";
import { BranchProvider } from "./contexts/BranchContext";
import { SoundEffectsProvider } from "./components/sound/SoundEffectsProvider";
import { SoundInitializer } from "./components/sound/SoundInitializer";
import { SoundToggle } from "./components/sound/SoundToggle";
import { FirebaseProvider } from "./contexts/FirebaseContext";
import { useSoundEffect } from "./hooks/useSoundEffect";
import { supabase } from "@/integrations/supabase/client";
import UserProfile from "./pages/UserProfile";

// Create React Query client with better performance settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000
    }
  }
});

// Role-based route wrapper with optimized loading
function ProtectedRoute({ element, allowedRoles = [] }) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const sounds = useSoundEffect();
  
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        const isAuth = !!session;
        setIsAuthenticated(isAuth);

        let role = localStorage.getItem('userRole');
        if (isAuth && !role) {
          try {
            const { data: roles, error } = await supabase.rpc('get_user_roles');
            if (!mounted) return;
            if (error) throw error;
            const list = Array.isArray(roles) ? (roles as string[]) : [];
            role = list.includes('admin') ? 'admin' : (list[0] || null);
            if (role) localStorage.setItem('userRole', role);
            if (session?.user) {
              localStorage.setItem('userEmail', session.user.email || '');
              localStorage.setItem('userName', session.user.email || 'User');
              localStorage.setItem('isAuthenticated', 'true');
            }
          } catch (err) {
            console.error('Error fetching roles', err);
          }
        }
        setUserRole(role);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (!session) {
        setUserRole(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
      }
    });

    init();

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);
  
  if (loading) {
    return <UnifiedLoader variant="fullscreen" message="Authenticating..." />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  const allowed = allowedRoles.length === 0 || (userRole && (allowedRoles.includes(userRole) || userRole === 'admin'));
  if (!allowed) {
    sounds.playError();
    return <Navigate to="/" replace />;
  }
  
  sounds.playClick();
  return element;
}

// Enhanced page transition wrapper with optimized animations
function PageTransition({ children }) {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ 
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FirebaseProvider>
      <AppDataProvider>
        <BranchProvider>
          <ThemeProvider defaultTheme="light">
            <SoundEffectsProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <SoundInitializer />
                <SoundToggle />
                <Routes>
                  <Route path="/" element={
                    <PageTransition>
                      <Index />
                    </PageTransition>
                  } />
                  
                  <Route path="/dashboard" element={
                    <PageTransition>
                      <ProtectedRoute 
                        element={<AdminDashboardModule />} 
                        allowedRoles={["admin", "sales", "operations", "accounts", "hr", "reports"]} 
                      />
                    </PageTransition>
                  } />
                  
                  <Route path="/sales" element={
                    <PageTransition>
                      <ProtectedRoute 
                        element={<SalesModule />} 
                        allowedRoles={["admin", "sales"]} 
                      />
                    </PageTransition>
                  } />
                  
                  <Route path="/operations" element={
                    <PageTransition>
                      <ProtectedRoute 
                        element={<OperationsModule />} 
                        allowedRoles={["admin", "operations"]} 
                      />
                    </PageTransition>
                  } />
                  
                  <Route path="/accounts" element={
                    <PageTransition>
                      <ProtectedRoute 
                        element={<AccountsModule />} 
                        allowedRoles={["admin", "accounts"]} 
                      />
                    </PageTransition>
                  } />
                  
                  <Route path="/hr" element={
                    <PageTransition>
                      <ProtectedRoute 
                        element={<HRModule />} 
                        allowedRoles={["admin", "hr"]} 
                      />
                    </PageTransition>
                  } />
                  
                  <Route path="/office-admin" element={
                    <PageTransition>
                      <ProtectedRoute 
                        element={<OfficeAdminModule />} 
                        allowedRoles={["admin"]} 
                      />
                    </PageTransition>
                  } />
                  
                  <Route path="/profile" element={
                    <PageTransition>
                      <ProtectedRoute 
                        element={<UserProfile />} 
                        allowedRoles={["admin", "sales", "operations", "accounts", "hr", "reports"]} 
                      />
                    </PageTransition>
                  } />
                  
                  <Route path="*" element={
                    <PageTransition>
                      <NotFound />
                    </PageTransition>
                  } />
                </Routes>
              </TooltipProvider>
            </SoundEffectsProvider>
          </ThemeProvider>
        </BranchProvider>
      </AppDataProvider>
    </FirebaseProvider>
  </QueryClientProvider>
);

export default App;
