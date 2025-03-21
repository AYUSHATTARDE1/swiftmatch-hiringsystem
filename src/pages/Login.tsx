import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AuthLayout from '@/components/AuthLayout';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, userType } = useUser();
  
  // Restore the proper redirect path logic
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setError('');
      setIsLoading(true);
      
      const user = await login(email, password);
      
      if (user) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });

        // Redirect to the appropriate dashboard based on user type
        if (userType === 'company') {
          navigate('/company/dashboard');
        } else {
          navigate('/candidate/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Enter your email and password to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={isLoading}
              />
            </div>
            <div>
              <Input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                disabled={isLoading}
              />
            </div>
            <Button disabled={isLoading} className="w-full" type="submit">
              {isLoading ? (
                <>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 items-center">
          <Link to="/signup" className="text-sm hover:underline">
            Don't have an account? Sign up
          </Link>
          <Link to="/forgot-password" className="text-sm hover:underline">
            Forgot password?
          </Link>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
};

export default Login;
