import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
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
import { Skeleton } from '@/components/ui/skeleton';
import VideoCall from '@/components/VideoCall';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';
import { useUser } from '@/contexts/UserContext';
import { getApplications, getInterviews, getJobs } from '@/services/api';

const CandidateDashboard = () => {
  const { user } = useUser();
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [currentInterview, setCurrentInterview] = useState<string>('');
  
  const { data: applications, isLoading: loadingApplications } = useQuery({
    queryKey: ['candidate-applications'],
    queryFn: () => getApplications({ candidate_id: user?.id }),
    enabled: !!user?.id,
  });
  
  const { data: interviews, isLoading: loadingInterviews } = useQuery({
    queryKey: ['candidate-interviews'],
    queryFn: async () => {
      const apps = await getApplications({ candidate_id: user?.id });
      
      const allInterviews = [];
      for (const app of apps) {
        const interviewsForApp = await getInterviews({ application_id: app.id });
        allInterviews.push(...interviewsForApp);
      }
      
      return allInterviews;
    },
    enabled: !!user?.id,
  });
  
  const { data: recommendedJobs, isLoading: loadingJobs } = useQuery({
    queryKey: ['recommended-jobs'],
    queryFn: () => getJobs({ status: 'active', limit: 3 }),
    enabled: !!user?.id,
  });
  
  const startVideoCall = (companyName: string) => {
    setCurrentInterview(companyName);
    setIsVideoCallOpen(true);
  };
  
  const calculateProfileCompleteness = () => {
    if (!user) return 0;
    
    let points = 0;
    let total = 5;
    
    if (user.profilePicture) points++;
    if (user.name && user.name.trim() !== '') points++;
    
    return Math.floor((points / total) * 100);
  };
  
  const profileCompleteness = calculateProfileCompleteness();

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
                {loadingApplications ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{applications?.length || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your job applications
                    </p>
                    <Progress value={applications?.length ? 75 : 0} className="h-1 mt-3" />
                  </>
                )}
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
                {loadingInterviews ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{interviews?.length || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Scheduled interviews
                    </p>
                    <Progress value={interviews?.length ? 60 : 0} className="h-1 mt-3" />
                  </>
                )}
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
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Coming soon
                </p>
                <Progress value={0} className="h-1 mt-3" />
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
                <div className="text-2xl font-bold">{profileCompleteness}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-amber-500 font-medium">Complete your profile</span> to improve
                </p>
                <Progress value={profileCompleteness} className="h-1 mt-3" />
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
                {loadingInterviews ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-5 w-40" />
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-4 w-32" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : interviews && interviews.length > 0 ? (
                  <div className="space-y-4">
                    {interviews.map((interview: any) => {
                      const scheduledDate = new Date(interview.scheduled_at);
                      const isToday = new Date().toDateString() === scheduledDate.toDateString();
                      const isTomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toDateString() === scheduledDate.toDateString();
                      
                      const dateDisplay = isToday 
                        ? 'Today' 
                        : isTomorrow 
                          ? 'Tomorrow' 
                          : scheduledDate.toLocaleDateString();
                      
                      const timeDisplay = scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      const companyName = interview.applications?.jobs?.companies?.name || 'Company';
                      const jobTitle = interview.applications?.jobs?.title || 'Job Position';
                      
                      const canJoin = isToday && interview.status === 'scheduled';
                      
                      return (
                        <Card key={interview.id} className="hover-card-animation">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarFallback>{companyName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="font-medium">{companyName}</h3>
                                    <p className="text-sm text-muted-foreground">{jobTitle}</p>
                                  </div>
                                  <Badge variant={canJoin ? 'default' : 'outline'}>
                                    {canJoin ? 'Ready to join' : interview.status}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar size={14} className="mr-1" />
                                  {dateDisplay} • {timeDisplay} • {interview.duration}
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
                              {canJoin && (
                                <Button 
                                  size="sm"
                                  onClick={() => startVideoCall(companyName)}
                                >
                                  <Video size={14} className="mr-1" />
                                  Join Interview
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No interviews scheduled</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Apply to jobs to get interview invitations
                    </p>
                    <Button variant="outline" className="mt-4" asChild>
                      <Link to="/job-search">
                        Browse Jobs
                      </Link>
                    </Button>
                  </div>
                )}
                
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
                    { title: 'Add professional experience', completed: false, icon: <Briefcase size={16} /> },
                    { title: 'Upload resume/CV', completed: false, icon: <FilePlus size={16} /> },
                    { title: 'Add skills assessment', completed: false, icon: <BarChart4 size={16} /> },
                    { title: 'Upload profile picture', completed: !!user?.profilePicture, icon: <User size={16} /> },
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
                {loadingJobs ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <Skeleton className="h-6 w-16" />
                            </div>
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-9 w-full" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : recommendedJobs && recommendedJobs.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendedJobs.map((job: any) => (
                      <Card key={job.id} className="hover-card-animation">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Avatar>
                              {job.companies?.logo ? (
                                <AvatarImage src={job.companies.logo} alt={job.companies.name} />
                              ) : (
                                <AvatarFallback>{job.companies?.name?.charAt(0) || 'C'}</AvatarFallback>
                              )}
                            </Avatar>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              New
                            </Badge>
                          </div>
                          
                          <h3 className="font-medium mb-1">{job.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{job.companies?.name}</p>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                            <span>{job.location || 'Remote'}</span>
                            <span>{job.salary_range || 'Competitive'}</span>
                          </div>
                          
                          <Button size="sm" className="w-full" asChild>
                            <Link to={`/apply/${job.id}`}>Apply Now</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No recommended jobs</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Complete your profile to get personalized job recommendations
                    </p>
                  </div>
                )}
                
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
