
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Star, MapPin, Calendar, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Candidate {
  id: string;
  name: string;
  initials: string;
  title: string;
  location: string;
  availability: string;
  yearsOfExperience: number;
  skills: string[];
  matchScore: number;
  workType: 'Remote' | 'Hybrid' | 'On-site';
}

interface CandidateCardProps {
  candidate: Candidate;
  compact?: boolean;
  className?: string;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ 
  candidate, 
  compact = false,
  className 
}) => {
  const {
    id,
    name,
    initials,
    title,
    location,
    availability,
    yearsOfExperience,
    skills,
    matchScore,
    workType
  } = candidate;

  return (
    <div 
      className={cn(
        "bg-white border border-border/40 rounded-xl shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1",
        compact ? "p-4" : "p-6",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium flex-shrink-0">
          {initials}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="font-medium truncate">
                {compact ? title : name}
              </h3>
              {!compact && (
                <p className="text-muted-foreground text-sm">{title}</p>
              )}
            </div>
            
            <Badge variant="outline" className={cn(
              "text-xs shrink-0",
              matchScore >= 90 
                ? "bg-green-50 text-green-700 border-green-200" 
                : matchScore >= 75
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
            )}>
              {matchScore}% Match
            </Badge>
          </div>
          
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin size={14} className="mr-1.5 flex-shrink-0" />
              <span className="truncate">{location}</span>
              {!compact && (
                <>
                  <span className="mx-1.5">•</span>
                  <span>{workType}</span>
                </>
              )}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar size={14} className="mr-1.5 flex-shrink-0" />
              <span>{availability}</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase size={14} className="mr-1.5 flex-shrink-0" />
              <span>{yearsOfExperience} years experience</span>
            </div>
          </div>
          
          {!compact && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-1.5">
                {skills.slice(0, 4).map((skill) => (
                  <Badge key={skill} variant="secondary" className="font-normal text-xs">
                    {skill}
                  </Badge>
                ))}
                {skills.length > 4 && (
                  <Badge variant="outline" className="font-normal text-xs">
                    +{skills.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {!compact && (
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <Button size="sm" asChild>
                <Link to={`/candidates/${id}`}>
                  View profile
                </Link>
              </Button>
              
              <Button size="sm" variant="outline">
                Schedule interview
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
