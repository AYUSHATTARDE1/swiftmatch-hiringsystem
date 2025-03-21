
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

interface InterviewSchedulerProps {
  onSchedule: (date: Date, timeSlot: string, durationType: string) => void;
  candidateId?: string;
  applicationId?: string;
  className?: string;
}

const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({ 
  onSchedule,
  candidateId,
  applicationId,
  className
}) => {
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState<string>();
  const [durationType, setDurationType] = useState<string>("30min");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, userType } = useUser();

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", 
    "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", 
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  ];

  const durationTypes = [
    { value: "15min", label: "15 minutes" },
    { value: "30min", label: "30 minutes" },
    { value: "45min", label: "45 minutes" },
    { value: "60min", label: "1 hour" },
  ];

  const handleSchedule = async () => {
    if (!date || !timeSlot) return;
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to schedule interviews",
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
    
    setLoading(true);
    
    try {
      // Create a datetime by combining date and timeSlot
      const [hours, minutes] = timeSlot.replace(/\s(AM|PM)/, '').split(':').map(Number);
      const isPM = timeSlot.includes('PM');
      
      const scheduledAt = new Date(date);
      scheduledAt.setHours(isPM && hours !== 12 ? hours + 12 : hours);
      scheduledAt.setMinutes(minutes);
      
      if (applicationId) {
        // Create the interview in the database
        const { data, error } = await supabase
          .from('interviews')
          .insert({
            application_id: applicationId,
            scheduled_at: scheduledAt.toISOString(),
            duration: durationType,
            status: 'scheduled'
          })
          .select();
          
        if (error) {
          throw error;
        }
        
        toast({
          title: "Interview scheduled",
          description: `The interview has been scheduled for ${format(scheduledAt, 'PPP')} at ${timeSlot}`,
        });
        
        // Call parent callback
        onSchedule(date, timeSlot, durationType);
      } else {
        toast({
          title: "Missing information",
          description: "Application ID is required to schedule an interview",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
      toast({
        title: "Failed to schedule interview",
        description: "There was a problem scheduling the interview. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="pointer-events-auto"
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Time</label>
          <Select onValueChange={setTimeSlot} value={timeSlot}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select time">
                {timeSlot ? (
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {timeSlot}
                  </div>
                ) : (
                  "Select time"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Duration</label>
          <Select onValueChange={setDurationType} defaultValue="30min">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {durationTypes.map((duration) => (
                <SelectItem key={duration.value} value={duration.value}>
                  {duration.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button 
        onClick={handleSchedule} 
        disabled={!date || !timeSlot || loading}
        className="w-full"
      >
        {loading ? "Scheduling..." : "Schedule Interview"}
      </Button>
    </div>
  );
};

export default InterviewScheduler;
