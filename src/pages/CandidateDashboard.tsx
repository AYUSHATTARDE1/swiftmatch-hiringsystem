
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Briefcase, 
  Video, 
  Clock, 
  User,
  Building,
  Check,
  ChevronRight,
  AlertCircle,
  FilePlus,
  Search,
  Star,
  BarChart4,
  BadgeCheck
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import VideoCall from '@/components/VideoCall';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';
import { useUser } from '@/contexts/UserContext';

const CandidateDashboard = () => {
  const { user } = useUser();
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [currentInterview, setCurrentInterview] = useState<string>('');
  
  const startVideoCall = (companyName: string) => {
    setCurrentInterview(companyName);
    setIsVideoCallOpen(true);
  };

  const upcomingInterviews = [
    { 
      company: 'Acme Corporation', 
      role: 'Senior React Developer', 
      date: 'Today', 
      time: '3:00 PM', 
      duration: '45 min', 
      status: 'Ready to join'
    },
    { 
      company: 'TechFlow, Inc', 
      role: 'Frontend Engineer', 
      date: 'Tomorrow', 
      time: '11:30 AM', 
      duration: '30 min', 
      status: 'Upcoming'
    },
    { 
      company: 'InnovateSoft', 
      role: 'UI/UX Developer', 
      date: 'May 18, 2023', 
      time: '2:00 PM', 
      duration: '60 min', 
      status: 'Upcoming'
    }
  ];
  
  return (
    <PageTransition>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Candidate Dashboard</h1>
            <p className="page-description">
              Welcome back, {user?.name}. Manage your interviews and job applications.
            </p>
          </div>
          <Button asChild>
            <Link to="/my-profile">
              <User size={16} className="mr-2" />
              My Profile
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 font-medium">+3</span> this week
                </p>
                <Progress value={75} className="h-1 mt-3" />
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 font-medium">+1</span> scheduled this week
                </p>
                <Progress value={60} className="h-1 mt-3" />
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 font-medium">+15%</span> from last month
                </p>
                <Progress value={80} className="h-1 mt-3" />
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Profile Completeness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-amber-500 font-medium">Add projects</span> to improve
                </p>
                <Progress value={85} className="h-1 mt-3" />
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Interviews</CardTitle>
                <CardDescription>
                  Upcoming interviews and recent activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingInterviews.map((interview, i) => (
                    <Card key={i} className="hover-card-animation">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback>{interview.company.charAt(0)}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">{interview.company}</h3>
                                <p className="text-sm text-muted-foreground">{interview.role}</p>
                              </div>
                              <Badge variant={interview.status === 'Ready to join' ? 'default' : 'outline'}>
                                {interview.status}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar size={14} className="mr-1" />
                              {interview.date} • {interview.time} • {interview.duration}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-3">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            asChild
                          >
                            <Link to="/my-interviews">View Details</Link>
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/my-interviews">
                      View All Interviews
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Profile Checklist</CardTitle>
                <CardDescription>
                  Complete your profile to attract more employers
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  {[
                    { title: 'Add professional experience', completed: true, icon: <Briefcase size={16} /> },
                    { title: 'Upload resume/CV', completed: true, icon: <FilePlus size={16} /> },
                    { title: 'Add skills assessment', completed: true, icon: <BarChart4 size={16} /> },
                    { title: 'Upload profile picture', completed: false, icon: <User size={16} /> },
                    { title: 'Add portfolio projects', completed: false, icon: <BadgeCheck size={16} /> },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`rounded-full p-1.5 ${
                        item.completed ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {item.completed ? <Check size={14} /> : item.icon}
                      </div>
                      <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/my-profile">
                    Complete Your Profile
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
        
        <div className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recommended Jobs</CardTitle>
                <CardDescription>
                  Jobs that match your skills and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      company: 'TechCorp',
                      role: 'Senior React Developer',
                      location: 'Remote',
                      salary: '$120k - $150k',
                      match: '96%'
                    },
                    {
                      company: 'WebSolutions',
                      role: 'Frontend Engineer',
                      location: 'San Francisco, CA',
                      salary: '$130k - $160k',
                      match: '92%'
                    },
                    {
                      company: 'InnovateTech',
                      role: 'Full Stack Developer',
                      location: 'New York, NY',
                      salary: '$140k - $170k',
                      match: '88%'
                    },
                  ].map((job, i) => (
                    <Card key={i} className="hover-card-animation">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Avatar>
                            <AvatarFallback>{job.company.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {job.match} Match
                          </Badge>
                        </div>
                        
                        <h3 className="font-medium mb-1">{job.role}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{job.company}</p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          <span>{job.location}</span>
                          <span>{job.salary}</span>
                        </div>
                        
                        <Button size="sm" className="w-full">Apply Now</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/job-search">
                      Browse All Jobs
                      <Search size={16} className="ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
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

export default CandidateDashboard;
