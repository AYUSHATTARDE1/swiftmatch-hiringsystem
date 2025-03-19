
import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Clock, Sparkles, Users, Search, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5, delay }}
    className={cn(
      "glass-card p-6 hover-card-animation",
      className
    )}
  >
    <div className="w-12 h-12 mb-5 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
      {icon}
    </div>
    <h3 className="text-xl font-medium mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

const FeatureSection = () => {
  const features = [
    {
      icon: <BadgeCheck size={24} />,
      title: "Pre-screened Talent",
      description: "Every candidate is thoroughly vetted for technical skills, experience, and cultural fit before joining our platform."
    },
    {
      icon: <Search size={24} />,
      title: "AI-powered Matching",
      description: "Our proprietary algorithm matches candidates to your specific requirements, saving you hours of manual screening."
    },
    {
      icon: <Calendar size={24} />,
      title: "Instant Scheduling",
      description: "Schedule structured interviews with qualified candidates instantly without the back-and-forth."
    },
    {
      icon: <Clock size={24} />,
      title: "Reduced Time-to-Hire",
      description: "Cut your hiring time from weeks to days without sacrificing quality or control."
    },
    {
      icon: <Sparkles size={24} />,
      title: "Skill Verification",
      description: "Every candidate has completed real-world assessments that prove their abilities beyond a resume."
    },
    {
      icon: <Users size={24} />,
      title: "Diverse Talent Pool",
      description: "Access candidates from various backgrounds and locations, promoting diversity in your hiring process."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute -left-40 top-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -right-40 bottom-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-medium mb-6"
          >
            How SwiftMatch Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Our platform streamlines the hiring process while maintaining the highest standards for candidate quality.
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={0.1 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
