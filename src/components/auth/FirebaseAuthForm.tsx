
import { useState } from "react";
import { useFirebase } from "@/contexts/FirebaseContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EnhancedButton as Button } from "@/components/ui/enhanced-button";
import { useToastWithSound } from "@/hooks/use-toast-with-sound";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

interface FirebaseAuthFormProps {
  mode?: 'signin' | 'signup';
  redirectUrl?: string;
  onSuccess?: () => void;
}

export function FirebaseAuthForm({ 
  mode = 'signin', 
  redirectUrl = '/dashboard',
  onSuccess 
}: FirebaseAuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useFirebase();
  const { toast } = useToastWithSound();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (mode === 'signin') {
        await signIn(email, password);
        toast.success({ 
          title: "Welcome back!", 
          description: "You've been successfully signed in" 
        });
      } else {
        await signUp(email, password);
        toast.success({ 
          title: "Account created", 
          description: "Welcome to Safend Control Room" 
        });
      }
      
      if (onSuccess) {
        onSuccess();
      } else if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (error: any) {
      toast.error({ 
        title: "Authentication Error", 
        description: error.message || "Failed to authenticate" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'signin' ? 'Sign In' : 'Create Account'}</CardTitle>
        <CardDescription>
          {mode === 'signin' 
            ? 'Enter your credentials to access your account' 
            : 'Sign up for a new account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {mode === 'signin' && (
            <div className="text-sm">
              <a href="#" className="text-safend-red hover:underline">
                Forgot password?
              </a>
            </div>
          )}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
            soundEffect="success"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⚙️</span>
                {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              mode === 'signin' ? 'Sign In' : 'Create Account'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {mode === 'signin' ? (
            <>
              Don't have an account?{' '}
              <a href="/signup" className="text-safend-red hover:underline">
                Sign up
              </a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a href="/signin" className="text-safend-red hover:underline">
                Sign in
              </a>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
}
