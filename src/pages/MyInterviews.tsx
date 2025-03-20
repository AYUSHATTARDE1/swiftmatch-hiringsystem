
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Video,
  FileText,
  Building,
  ChevronRight,
  MessageSquare,
  Search,
  ArrowUpRight,
  BarChart3,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';
import VideoCall from '@/components/VideoCall';

const MyInterviews = () => {
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [currentInterview, setCurrentInterview] = useState<string>('');
  
  const startVideoCall = (companyName: string) => {
    setCurrentInterview(companyName);
    setIsVideoCallOpen(true);
  };

  return (
    <PageTransition>
      <Navbar />
      <div className="page-container">
        <div className="page-header flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="page-title">My Interviews</h1>
            <p className="page-description">
              Manage your upcoming and past interviews
            </p>
          </div>
          
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search interviews..." 
              className="pl-10 w-full md:w-[250px]" 
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Interview Schedule</CardTitle>
                <CardDescription>
                  Your upcoming and past interviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upcoming">
                  <TabsList className="w-full mb-6">
                    <TabsTrigger value="upcoming" className="flex-1">Upcoming</TabsTrigger>
                    <TabsTrigger value="past" className="flex-1">Past</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upcoming" className="space-y-6">
                    {[
                      { 
                        company: 'Acme Corporation', 
                        role: 'Senior React Developer', 
                        date: 'Today', 
                        time: '3:00 PM', 
                        duration: '45 min', 
                        status: 'Ready to join',
                        interviewers: [
                          { name: 'Sarah Johnson', role: 'Tech Lead' },
                          { name: 'Michael Lee', role: 'HR Manager' }
                        ]
                      },
                      { 
                        company: 'TechFlow, Inc', 
                        role: 'Frontend Engineer', 
                        date: 'Tomorrow', 
                        time: '11:30 AM', 
                        duration: '30 min', 
                        status: 'Upcoming',
                        interviewers: [
                          { name: 'David Smith', role: 'Engineering Manager' }
                        ]
                      },
                      { 
                        company: 'InnovateSoft', 
                        role: 'UI/UX Developer', 
                        date: 'May 18, 2023', 
                        time: '2:00 PM', 
                        duration: '60 min', 
                        status: 'Upcoming',
                        interviewers: [
                          { name: 'Jennifer Park', role: 'Senior Designer' },
                          { name: 'Robert Chen', role: 'CTO' }
                        ]
                      }
                    ].map((interview, i) => (
                      <Card key={i} className="hover-card-animation">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="text-lg">{interview.company.charAt(0)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                <div>
                                  <h3 className="font-medium text-lg">{interview.company}</h3>
                                  <p className="text-muted-foreground">{interview.role}</p>
                                </div>
                                <Badge variant={interview.status === 'Ready to join' ? 'default' : 'outline'} className="mt-1 sm:mt-0">
                                  {interview.status}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center text-sm text-muted-foreground mb-4">
                                <Calendar size={14} className="mr-1" />
                                {interview.date} • {interview.time} • {interview.duration}
                              </div>
                              
                              <div className="mb-4">
                                <p className="text-sm font-medium mb-2">Interviewers:</p>
                                <div className="flex flex-wrap gap-2">
                                  {interview.interviewers.map((interviewer, j) => (
                                    <div key={j} className="flex items-center text-xs bg-muted rounded-full py-1 px-3">
                                      <span className="font-medium">{interviewer.name}</span>
                                      <span className="text-muted-foreground ml-1">({interviewer.role})</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  <FileText size={14} className="mr-1" />
                                  Preparation Notes
                                </Button>
                                <Button variant="outline" size="sm">
                                  <MessageSquare size={14} className="mr-1" />
                                  Contact Recruiter
                                </Button>
                                {interview.status === 'Ready to join' && (
                                  <Button 
                                    size="sm"
                                    onClick={() => startVideoCall(interview.company)}
                                  >
                                    <Video size={14} className="mr-1" />
                                    Join Interview
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="past" className="space-y-6">
                    {[
                      { 
                        company: 'WebSolutions', 
                        role: 'Frontend Developer', 
                        date: 'May 2, 2023', 
                        time: '2:00 PM', 
                        feedback: 'Positive',
                        status: 'Passed',
                        notes: 'Great technical skills. Moving forward to the next round.'
                      },
                      { 
                        company: 'DataSystems', 
                        role: 'React Engineer', 
                        date: 'April 28, 2023', 
                        time: '11:00 AM', 
                        feedback: 'Mixed',
                        status: 'Under review',
                        notes: 'Good problem-solving skills but needs more experience with state management.'
                      },
                      { 
                        company: 'MobileTech', 
                        role: 'React Native Developer', 
                        date: 'April 15, 2023', 
                        time: '10:30 AM', 
                        feedback: 'Negative',
                        status: 'Rejected',
                        notes: 'Not enough experience with mobile development frameworks.'
                      }
                    ].map((interview, i) => (
                      <Card key={i}>
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="text-lg">{interview.company.charAt(0)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                <div>
                                  <h3 className="font-medium text-lg">{interview.company}</h3>
                                  <p className="text-muted-foreground">{interview.role}</p>
                                </div>
                                <Badge variant={
                                  interview.status === 'Passed' ? 'default' :
                                  interview.status === 'Under review' ? 'outline' :
                                  'destructive'
                                } className="mt-1 sm:mt-0">
                                  {interview.status}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center text-sm text-muted-foreground mb-3">
                                <Calendar size={14} className="mr-1" />
                                {interview.date} • {interview.time}
                              </div>
                              
                              <div className="p-3 bg-muted rounded-md mb-4">
                                <div className="flex items-center mb-1">
                                  <p className="text-sm font-medium">Feedback:</p>
                                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                    interview.feedback === 'Positive' ? 'bg-green-100 text-green-700' :
                                    interview.feedback === 'Mixed' ? 'bg-amber-100 text-amber-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {interview.feedback}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{interview.notes}</p>
                              </div>
                              
                              <div className="flex justify-end">
                                <Button variant="outline" size="sm">
                                  View Interview Details
                                  <ChevronRight size={14} className="ml-1" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Interview Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium">Interview Pass Rate</p>
                    <p className="text-sm">75%</p>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Interviews</p>
                    <p className="text-xl font-medium">12</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                    <p className="text-xl font-medium">3</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Passed</p>
                    <p className="text-xl font-medium text-green-600">6</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Rejected</p>
                    <p className="text-xl font-medium text-red-600">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Interview Preparation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Review Company Information</p>
                    <p className="text-sm text-muted-foreground">Research the company's products, culture, and recent news.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Practice Common Questions</p>
                    <p className="text-sm text-muted-foreground">Prepare answers for typical interview questions in your field.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Video className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Check Your Equipment</p>
                    <p className="text-sm text-muted-foreground">Test your camera, microphone, and internet connection before the interview.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Review Your Projects</p>
                    <p className="text-sm text-muted-foreground">Be prepared to discuss your past work and achievements in detail.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Interview Preparation Guide
                  <ArrowUpRight size={14} className="ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
        
        {/* Video call component */}
        <VideoCall 
          isOpen={isVideoCallOpen} 
          onClose={() => setIsVideoCallOpen(false)} 
          participantName={currentInterview}
        />
      </div>
    </PageTransition>
  );
};

export default MyInterviews;
