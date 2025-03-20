
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  description 
}) => {
  return (
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
          {(title || description) && (
            <div className="text-center">
              {title && <h1 className="text-2xl font-semibold">{title}</h1>}
              {description && (
                <p className="text-muted-foreground mt-2">{description}</p>
              )}
            </div>
          )}
          
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
