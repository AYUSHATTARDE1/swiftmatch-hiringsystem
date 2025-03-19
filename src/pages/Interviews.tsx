
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';
import InterviewScheduler from '@/components/InterviewScheduler';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

// Mock interviews data
const upcomingInterviews = [
  {
    id: '1',
    candidateName: 'Jennifer Davis',
    candidateInitials: 'JD',
    role: 'Senior React Developer',
    date: new Date(),
    time: '3:00 PM',
    duration: '45 min',
    status: 'Confirmed',
  },
  {
    id: '2',
    candidateName: 'Mikael Karlsson',
    candidateInitials: 'MK',
    role: 'UI/UX Designer',
    date: addDays(new Date(), 1),
    time: '11:30 AM',
    duration: '30 min',
    status: 'Scheduled',
  },
  {
    id: '3',
    candidateName: 'Sarah Ahmed',
    candidateInitials: 'SA',
    role: 'Data Scientist',
    date: addDays(new Date(), 3),
    time: '2:00 PM',
    duration: '60 min',
    status: 'Pending',
  },
];

const pastInterviews = [
  {
    id: '4',
    candidateName: 'David Johnson',
    candidateInitials: 'DJ',
    role: 'DevOps Engineer',
    date: addDays(new Date(), -5),
    time: '10:00 AM',
    duration: '45 min',
    status: 'Completed',
    feedback: 'Strong technical skills, good culture fit',
  },
  {
    id: '5',
    candidateName: 'Alex Martinez',
    candidateInitials: 'AM',
    role: 'Mobile Developer',
    date: addDays(new Date(), -10),
    time: '1:00 PM',
    duration: '30 min',
    status: 'Completed',
    feedback: 'Good potential, needs more experience',
  },
];

const Interviews = () => {
  const [date, setDate] = useState<Date>();
  const [selectedDateInterviews, setSelectedDateInterviews] = useState<any[]>([]);
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [candidateSearch, setCandidateSearch] = useState('');
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    
    if (selectedDate) {
      // In a real app, you would filter interviews based on the selected date
      // For now, we'll just show a different set based on whether it's today, tomorrow, or other
      const today = new Date();
      const tomorrow = addDays(today, 1);
      
      if (selectedDate.toDateString() === today.toDateString()) {
        setSelectedDateInterviews(upcomingInterviews.filter(i => i.date.toDateString() === today.toDateString()));
      } else if (selectedDate.toDateString() === tomorrow.toDateString()) {
        setSelectedDateInterviews(upcomingInterviews.filter(i => i.date.toDateString() === tomorrow.toDateString()));
      } else {
        setSelectedDateInterviews(upcomingInterviews.filter(i => i.date.toDateString() === selectedDate.toDateString()));
      }
    } else {
      setSelectedDateInterviews([]);
    }
  };
  
  const handleScheduleInterview = (date: Date, timeSlot: string, durationType: string) => {
    console.log('Scheduling interview:', { date, timeSlot, durationType });
    
    // In a real app, you would send this to your backend
    toast({
      title: "Interview Scheduled",
      description: `Your interview is scheduled for ${date.toDateString()} at ${timeSlot}.`,
    });
    
    setIsSchedulingOpen(false);
  };

  return (
    <PageTransition>
      <Navbar />
      <div className="page-container">
        <div className="page-header flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="page-title">Interviews</h1>
            <p className="page-description">
              Manage your scheduled interviews and provide feedback.
            </p>
          </div>
          
          <Sheet open={isSchedulingOpen} onOpenChange={setIsSchedulingOpen}>
            <SheetTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" />
                Schedule Interview
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle>Schedule New Interview</SheetTitle>
                <SheetDescription>
                  Select a candidate and schedule an interview time.
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Candidate</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      value={candidateSearch}
                      onChange={(e) => setCandidateSearch(e.target.value)}
                      placeholder="Candidate name or role..."
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Candidate</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a candidate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jennifer">Jennifer Davis - React Developer</SelectItem>
                      <SelectItem value="mikael">Mikael Karlsson - UI/UX Designer</SelectItem>
                      <SelectItem value="sarah">Sarah Ahmed - Data Scientist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Interview Details</label>
                  <InterviewScheduler onSchedule={handleScheduleInterview} />
                </div>
              </div>
              
              <SheetFooter className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => setIsSchedulingOpen(false)}>Cancel</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle>Interview Calendar</CardTitle>
                <CardDescription>Select a date to view scheduled interviews</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  className="mx-auto pointer-events-auto"
                />
                
                {date && (
                  <div className="mt-6">
                    <h3 className="font-medium text-sm mb-2">
                      Interviews on {format(date, 'MMMM d, yyyy')}
                    </h3>
                    
                    {selectedDateInterviews.length > 0 ? (
                      <div className="space-y-2">
                        {selectedDateInterviews.map((interview) => (
                          <div
                            key={interview.id}
                            className="p-2 border rounded-md flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium mr-2">
                                {interview.candidateInitials}
                              </div>
                              <div>
                                <p className="font-medium">{interview.time}</p>
                                <p className="text-muted-foreground text-xs">{interview.duration}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {interview.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No interviews scheduled on this date.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Interview Lists */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>All Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upcoming">
                  <TabsList className="w-full mb-6">
                    <TabsTrigger value="upcoming" className="flex-1">Upcoming</TabsTrigger>
                    <TabsTrigger value="past" className="flex-1">Past</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upcoming" className="space-y-4">
                    {upcomingInterviews.map((interview, index) => (
                      <motion.div
                        key={interview.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.05 * index }}
                      >
                        <Card className="hover-card-animation">
                          <CardContent className="p-5">
                            <div className="flex items-start">
                              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium mr-4 flex-shrink-0">
                                {interview.candidateInitials}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{interview.candidateName}</h3>
                                    <p className="text-sm text-muted-foreground">{interview.role}</p>
                                  </div>
                                  <Badge variant={
                                    interview.status === 'Confirmed' 
                                      ? "default" 
                                      : interview.status === 'Scheduled' 
                                        ? "secondary" 
                                        : "outline"
                                  }>
                                    {interview.status}
                                  </Badge>
                                </div>
                                
                                <div className="mt-3 flex items-center text-sm text-muted-foreground">
                                  <CalendarIcon size={14} className="mr-1" />
                                  <span>
                                    {format(interview.date, 'MMM d, yyyy')} • {interview.time} • {interview.duration}
                                  </span>
                                </div>
                                
                                <div className="mt-4 flex justify-end space-x-2">
                                  <Button variant="outline" size="sm">Reschedule</Button>
                                  <Button size="sm">Join Interview</Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="past" className="space-y-4">
                    {pastInterviews.map((interview, index) => (
                      <motion.div
                        key={interview.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.05 * index }}
                      >
                        <Card>
                          <CardContent className="p-5">
                            <div className="flex items-start">
                              <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-medium mr-4 flex-shrink-0">
                                {interview.candidateInitials}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{interview.candidateName}</h3>
                                    <p className="text-sm text-muted-foreground">{interview.role}</p>
                                  </div>
                                  <Badge variant="outline">
                                    {interview.status}
                                  </Badge>
                                </div>
                                
                                <div className="mt-3 flex items-center text-sm text-muted-foreground">
                                  <CalendarIcon size={14} className="mr-1" />
                                  <span>
                                    {format(interview.date, 'MMM d, yyyy')} • {interview.time} • {interview.duration}
                                  </span>
                                </div>
                                
                                <div className="mt-3">
                                  <h4 className="text-sm font-medium">Feedback:</h4>
                                  <p className="text-sm text-muted-foreground">{interview.feedback}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Interviews;
