
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

import PageTransition from '@/components/PageTransition';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate password reset request
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <header className="h-16 px-6 flex items-center border-b border-border/50">
          <Link to="/" className="text-xl font-medium text-primary">
            Intervue
          </Link>
        </header>
        
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md space-y-8 p-8 rounded-xl glass-card"
          >
            {!submitted ? (
              <>
                <div className="text-center">
                  <h1 className="text-2xl font-semibold">Reset your password</h1>
                  <p className="text-muted-foreground mt-2">
                    Enter your email and we'll send you a link to reset your password
                  </p>
                </div>
                
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending link..." : "Send reset link"}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Check your email</h2>
                  <p className="text-muted-foreground mt-2">
                    We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Link>
                </Button>
              </div>
            )}
            
            <div className="text-center text-sm">
              <Link to="/login" className="text-primary font-medium hover:underline">
                <ArrowLeft className="inline-block mr-1 h-3 w-3" />
                Back to login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ForgotPassword;
