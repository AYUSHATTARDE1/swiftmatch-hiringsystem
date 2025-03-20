
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Video, 
  BarChart3, 
  Clock, 
  UserRoundPlus,
  ArrowUpRight,
  Building,
  Check,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';
import { useUser } from '@/contexts/UserContext';

const CompanyDashboard = () => {
  const { user } = useUser();
  
  return (
    <PageTransition>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Company Dashboard</h1>
            <p className="page-description">
              Welcome back, {user?.name}. Here's an overview of your hiring activities.
            </p>
          </div>
          <Button asChild>
            <Link to="/candidates">
              <UserRoundPlus size={16} className="mr-2" />
              Find Candidates
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
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 font-medium">+2</span> from last month
                </p>
                <Progress value={80} className="h-1 mt-3" />
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
                <CardTitle className="text-sm font-medium">Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 font-medium">+22%</span> from last month
                </p>
                <Progress value={65} className="h-1 mt-3" />
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
                <CardTitle className="text-sm font-medium">Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 font-medium">+4</span> scheduled this week
                </p>
                <Progress value={45} className="h-1 mt-3" />
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
                <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.5 days</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 font-medium">-2.3 days</span> from last quarter
                </p>
                <Progress value={30} className="h-1 mt-3" />
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
                <CardTitle>Upcoming Interviews</CardTitle>
                <CardDescription>
                  Your scheduled interviews for the next 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="today">
                  <TabsList className="w-full mb-6">
                    <TabsTrigger value="today" className="flex-1">Today</TabsTrigger>
                    <TabsTrigger value="tomorrow" className="flex-1">Tomorrow</TabsTrigger>
                    <TabsTrigger value="upcoming" className="flex-1">Upcoming</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="today" className="space-y-4">
                    {[
                      { 
                        id: 1, 
                        name: 'Jennifer Davis', 
                        role: 'Senior React Developer', 
                        time: '2:00 PM', 
                        duration: '45 min',
                        status: 'Confirmed'
                      },
                      { 
                        id: 2, 
                        name: 'Michael Chen', 
                        role: 'UX Designer', 
                        time: '4:30 PM', 
                        duration: '30 min',
                        status: 'Pending'
                      }
                    ].map((interview) => (
                      <Card key={interview.id} className="hover-card-animation">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarFallback>{interview.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">{interview.name}</h3>
                                  <p className="text-sm text-muted-foreground">{interview.role}</p>
                                </div>
                                <Badge variant={interview.status === 'Confirmed' ? 'default' : 'outline'}>
                                  {interview.status}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock size={14} className="mr-1" />
                                {interview.time} • {interview.duration}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-3">
                            <Button size="sm" variant="outline">View Profile</Button>
                            <Button size="sm">
                              <Video size={14} className="mr-1" />
                              Join Interview
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="tomorrow" className="space-y-4">
                    {[
                      { 
                        id: 3, 
                        name: 'Sarah Wilson', 
                        role: 'Frontend Engineer', 
                        time: '10:00 AM', 
                        duration: '60 min',
                        status: 'Confirmed'
                      }
                    ].map((interview) => (
                      <Card key={interview.id} className="hover-card-animation">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarFallback>{interview.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">{interview.name}</h3>
                                  <p className="text-sm text-muted-foreground">{interview.role}</p>
                                </div>
                                <Badge variant={interview.status === 'Confirmed' ? 'default' : 'outline'}>
                                  {interview.status}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock size={14} className="mr-1" />
                                {interview.time} • {interview.duration}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-3">
                            <Button size="sm" variant="outline">View Profile</Button>
                            <Button size="sm">
                              Prepare Notes
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="upcoming" className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center py-6">
                          <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                          <h3 className="font-medium mb-1">No more scheduled interviews</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Schedule more interviews from the candidates page
                          </p>
                          <Button asChild size="sm">
                            <Link to="/candidates">Find Candidates</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {[
                    { 
                      type: 'candidate-applied', 
                      content: 'James Brown applied for Full Stack Developer',
                      time: '2 hours ago'
                    },
                    { 
                      type: 'interview-scheduled', 
                      content: 'Interview scheduled with Jennifer Davis',
                      time: '1 day ago'
                    },
                    { 
                      type: 'candidate-hired', 
                      content: 'Offer accepted by Alex Martinez',
                      time: '3 days ago'
                    },
                    { 
                      type: 'job-posted', 
                      content: 'Posted new job: Senior UX Designer',
                      time: '5 days ago'
                    },
                  ].map((activity, i) => (
                    <div key={i} className="flex gap-2">
                      <div className={`rounded-full p-1.5 ${
                        activity.type === 'candidate-applied' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'interview-scheduled' ? 'bg-purple-100 text-purple-600' :
                        activity.type === 'candidate-hired' ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {activity.type === 'candidate-applied' ? <UserRoundPlus size={14} /> :
                          activity.type === 'interview-scheduled' ? <Calendar size={14} /> :
                          activity.type === 'candidate-hired' ? <Check size={14} /> :
                          <Building size={14} />
                        }
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.content}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/activity">
                      View All Activity
                      <ChevronRight size={14} className="ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CompanyDashboard;
