
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Create a subtle parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const heroEl = heroRef.current;
      const backgroundEl = heroEl.querySelector('.hero-background') as HTMLElement;
      const contentEl = heroEl.querySelector('.hero-content') as HTMLElement;
      
      if (backgroundEl) {
        backgroundEl.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
      
      if (contentEl) {
        contentEl.style.transform = `translateY(${scrollY * 0.1}px)`;
        contentEl.style.opacity = `${1 - scrollY * 0.002}`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const benefits = [
    'Pre-screened quality talent',
    'Real-world skill verification',
    'Streamlined interview process', 
    'Reduce time-to-hire by 70%'
  ];

  return (
    <div ref={heroRef} className="relative min-h-screen flex items-center bg-background overflow-hidden">
      {/* Background effect */}
      <div className="hero-background absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      {/* Hero content */}
      <div className="hero-content relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center md:text-left"
          >
            <div className="mb-6 inline-block">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                Next-Generation Hiring Platform
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight md:leading-tight lg:leading-tight mb-6">
              Find exceptional talent in <span className="text-primary">days, not weeks</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-lg md:max-w-xl">
              Connect with pre-screened candidates matched to your exact requirements, 
              with proven skills and real-world work samples.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Button size="lg" className="px-8 shadow-button" asChild>
                <Link to="/signup">
                  Get started
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-6 border" asChild>
                <Link to="/#how-it-works">
                  How it works
                </Link>
              </Button>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <div className="glass-card p-6 rounded-2xl shadow-elevated relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium">Top Candidates</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  95% Match Rate
                </span>
              </div>
              
              {/* Candidate cards */}
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                  className={cn(
                    "mb-3 last:mb-0 p-4 bg-background rounded-xl subtle-border hover-card-animation",
                    i === 1 ? "border-l-2 border-l-primary" : ""
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground font-medium">
                      {['JD', 'AW', 'MK'][i-1]}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">
                          {['Java Developer', 'AI Engineer', 'Marketing Lead'][i-1]}
                        </p>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          i === 1 ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                        )}>
                          {i === 1 ? "Available now" : "Available in 2 weeks"}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span>{[5, 7, 4][i-1]} years exp</span>
                        <span className="mx-2">•</span>
                        <span>{['Remote', 'Hybrid', 'On-site'][i-1]}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <Button variant="ghost" size="sm" className="w-full mt-4 text-primary">
                View all candidates <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/5 rounded-full animate-float" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
