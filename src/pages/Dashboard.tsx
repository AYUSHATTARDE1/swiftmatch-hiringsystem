
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, User, Calendar, Clock, Briefcase, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';
import CandidateCard, { Candidate } from '@/components/CandidateCard';
import { cn } from '@/lib/utils';

// Mock data
const recentCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Jennifer Davis',
    initials: 'JD',
    title: 'Senior React Developer',
    location: 'San Francisco, CA',
    availability: 'Available now',
    yearsOfExperience: 5,
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    matchScore: 95,
    workType: 'Remote',
  },
  {
    id: '2',
    name: 'Mikael Karlsson',
    initials: 'MK',
    title: 'UI/UX Designer',
    location: 'Stockholm, Sweden',
    availability: 'Available in 2 weeks',
    yearsOfExperience: 7,
    skills: ['Figma', 'UI Design', 'User Research', 'Design Systems'],
    matchScore: 88,
    workType: 'Hybrid',
  },
  {
    id: '3',
    name: 'Rachel Wong',
    initials: 'RW',
    title: 'Product Manager',
    location: 'New York, NY',
    availability: 'Available in 1 month',
    yearsOfExperience: 6,
    skills: ['Product Strategy', 'Roadmapping', 'User Stories', 'Agile'],
    matchScore: 82,
    workType: 'On-site',
  },
];

const upcomingInterviews = [
  {
    id: '1',
    candidateName: 'Jennifer Davis',
    role: 'Senior React Developer',
    date: 'Today',
    time: '3:00 PM',
    duration: '45 min',
  },
  {
    id: '2',
    candidateName: 'Mikael Karlsson',
    role: 'UI/UX Designer',
    date: 'Tomorrow',
    time: '11:30 AM',
    duration: '30 min',
  },
];

const Dashboard = () => {
  return (
    <PageTransition>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">
            Monitor your hiring activities and track candidate engagement.
          </p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: <User className="h-5 w-5" />, label: 'Active Applications', value: '32', change: '+6' },
            { icon: <Calendar className="h-5 w-5" />, label: 'Interviews Scheduled', value: '12', change: '+3' },
            { icon: <Clock className="h-5 w-5" />, label: 'Avg. Time to Hire', value: '5 days', change: '-2' },
            { icon: <Briefcase className="h-5 w-5" />, label: 'Positions Filled', value: '8', change: '+2' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-medium">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className={cn(
                      "font-medium",
                      stat.change.startsWith('+') ? "text-green-500" : "text-primary"
                    )}>
                      {stat.change}
                    </span> from last week
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hiring Pipeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Hiring Pipeline</CardTitle>
                  <CardDescription>Track candidates through your recruitment process</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { stage: 'Screening', count: 24, total: 30 },
                      { stage: 'Technical Interview', count: 15, total: 24 },
                      { stage: 'Team Interview', count: 8, total: 15 },
                      { stage: 'Final Decision', count: 5, total: 8 },
                    ].map((stage, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{stage.stage}</span>
                          <span className="text-sm text-muted-foreground">
                            {stage.count}/{stage.total}
                          </span>
                        </div>
                        <Progress value={(stage.count / stage.total) * 100} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Recent Candidates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Candidates</CardTitle>
                    <CardDescription>Candidates who match your requirements</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/candidates">
                      View all
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCandidates.map((candidate, index) => (
                      <CandidateCard 
                        key={candidate.id} 
                        candidate={candidate} 
                        compact
                      />
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to="/candidates">
                      Browse all candidates
                      <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Interviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Interviews</CardTitle>
                  <CardDescription>Your scheduled interviews for the next 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingInterviews.length > 0 ? (
                      upcomingInterviews.map((interview, index) => (
                        <div 
                          key={interview.id} 
                          className={cn(
                            "p-3 rounded-lg border",
                            index === 0 ? "bg-primary/5 border-primary/20" : ""
                          )}
                        >
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{interview.candidateName}</span>
                            <span className={cn(
                              "text-xs rounded-full px-2 py-0.5",
                              index === 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                            )}>
                              {interview.date}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{interview.role}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock size={12} className="mr-1" />
                            <span>{interview.time} • {interview.duration}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No upcoming interviews</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/interviews">
                      Manage interviews
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" asChild>
                    <Link to="/candidates">
                      <Users size={16} className="mr-2" />
                      Browse Candidates
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/interviews">
                      <Calendar size={16} className="mr-2" />
                      Schedule Interview
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
