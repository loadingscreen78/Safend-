import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useToastWithSound } from "@/hooks/use-toast-with-sound";
import { UnifiedLoader } from "@/components/ui/unified-loader";
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from "@/utils/authCleanup";

interface LoginFormProps {
  onClose?: () => void;
}

export function LoginForm({ onClose }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { toast } = useToastWithSound();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Clean up any previous auth state and sign out globally
      cleanupAuthState();
      try { await supabase.auth.signOut({ scope: 'global' }); } catch (_) {}

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        // Fetch roles and persist minimal info
        try {
          const { data: roles } = await supabase.rpc('get_user_roles');
          const list = Array.isArray(roles) ? (roles as string[]) : [];
          
          // Check if user has any roles
          if (list.length === 0) {
            throw new Error('Access denied. Contact administrator for access.');
          }
          
          const role = list.includes('admin') ? 'admin' : (list[0] || '');
          if (!role) {
            throw new Error('No role assigned. Contact administrator.');
          }
          
          localStorage.setItem('userRole', role);
        } catch (err: any) {
          throw err;
        }
        localStorage.setItem('userEmail', data.user.email || '');
        localStorage.setItem('userName', data.user.email || 'User');
        localStorage.setItem('isAuthenticated', 'true');
      }
      toast.success({ title: 'Login Successful', description: 'Redirecting...' });
      // Full refresh to avoid any limbo state
      window.location.href = '/dashboard';

      if (onClose) onClose();
    } catch (err: any) {
      const msg = err?.message || 'Authentication failed';
      setError(msg);
      toast.error({ title: 'Login Failed', description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Login to Safend</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access the dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <UnifiedLoader variant="button" size="sm" />
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
