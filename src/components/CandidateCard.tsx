
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, Star, MapPin, Calendar, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import InterviewScheduler from './InterviewScheduler';

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
  jobId?: string;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ 
  candidate, 
  compact = false,
  className,
  jobId 
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
  
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useUser();

  const handleScheduleInterview = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in as a company to schedule interviews",
        variant: "destructive"
      });
      return;
    }
    
    if (userType !== 'company') {
      toast({
        title: "Permission denied",
        description: "Only companies can schedule interviews",
        variant: "destructive"
      });
      return;
    }
    
    if (!jobId) {
      // If no jobId is provided, open the schedule dialog
      setScheduleOpen(true);
      return;
    }
    
    setLoading(true);
    
    try {
      // Check if application exists
      const { data: existingApplication, error: fetchError } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('candidate_id', id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      let applicationId;
      
      if (!existingApplication) {
        // Create an application first
        const { data: newApplication, error: insertError } = await supabase
          .from('applications')
          .insert({
            job_id: jobId,
            candidate_id: id,
            status: 'screening'
          })
          .select('id')
          .single();
          
        if (insertError) {
          throw insertError;
        }
        
        applicationId = newApplication.id;
      } else {
        applicationId = existingApplication.id;
      }
      
      // Now open the schedule dialog with the application ID
      setScheduleOpen(true);
    } catch (error) {
      console.error("Error creating application:", error);
      toast({
        title: "Operation failed",
        description: "There was a problem scheduling the interview. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onInterviewScheduled = (date: Date, timeSlot: string, durationType: string) => {
    setScheduleOpen(false);
    toast({
      title: "Interview scheduled",
      description: `Interview with ${name} has been scheduled successfully.`,
    });
  };

  return (
    <>
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
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleScheduleInterview}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Schedule interview"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Schedule an interview with {name} for the selected position.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4">
            <InterviewScheduler 
              onSchedule={onInterviewScheduled}
              candidateId={id}
              applicationId={jobId ? undefined : undefined} // This would need to be fetched from applications table
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CandidateCard;
