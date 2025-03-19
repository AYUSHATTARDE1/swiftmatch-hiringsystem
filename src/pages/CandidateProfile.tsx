
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Clock, 
  Languages, 
  GraduationCap,
  ExternalLink,
  Star,
  CheckCircle,
  Download,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';
import SkillsChart from '@/components/SkillsChart';
import InterviewScheduler from '@/components/InterviewScheduler';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

// Mock data for a single candidate
const mockCandidate = {
  id: '1',
  name: 'Jennifer Davis',
  initials: 'JD',
  title: 'Senior React Developer',
  location: 'San Francisco, CA',
  availability: 'Available now',
  yearsOfExperience: 5,
  skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Jest', 'Next.js', 'Redux', 'REST APIs'],
  matchScore: 95,
  workType: 'Remote',
  bio: 'Full-stack developer with 5+ years of experience building modern web applications. Passionate about clean code, performance optimization, and creating intuitive user experiences. Looking for a remote opportunity with a forward-thinking team.',
  education: [
    {
      degree: 'M.S. Computer Science',
      institution: 'Stanford University',
      year: '2017 - 2019'
    },
    {
      degree: 'B.S. Computer Science',
      institution: 'University of California, Berkeley',
      year: '2013 - 2017'
    }
  ],
  experience: [
    {
      title: 'Senior Frontend Developer',
      company: 'TechFlow, Inc.',
      location: 'San Francisco, CA',
      period: '2020 - Present',
      description: 'Lead developer for a SaaS platform serving 50,000+ users. Implemented performance optimizations that reduced page load times by 40%. Mentored junior developers and established frontend best practices.'
    },
    {
      title: 'Frontend Developer',
      company: 'Innovate Studio',
      location: 'San Francisco, CA',
      period: '2017 - 2020',
      description: 'Developed responsive web applications for various clients using React and TypeScript. Collaborated with designers to implement pixel-perfect UIs.'
    }
  ],
  languages: [
    { language: 'English', proficiency: 'Native' },
    { language: 'Spanish', proficiency: 'Professional' },
    { language: 'French', proficiency: 'Conversational' }
  ],
  skillRatings: [
    { skill: 'React', rating: 95, fullMark: 100 },
    { skill: 'TypeScript', rating: 90, fullMark: 100 },
    { skill: 'Node.js', rating: 85, fullMark: 100 },
    { skill: 'GraphQL', rating: 80, fullMark: 100 },
    { skill: 'CSS/SCSS', rating: 88, fullMark: 100 },
    { skill: 'Testing', rating: 85, fullMark: 100 },
  ],
  projects: [
    {
      title: 'E-commerce Platform Redesign',
      description: 'Led the frontend development for a complete redesign of an e-commerce platform serving 100,000+ monthly users. Implemented a component-based architecture using React and TypeScript, resulting in a 40% improvement in page load times and a 25% increase in conversion rates.',
      skills: ['React', 'TypeScript', 'Redux', 'Styled Components'],
      results: 'Increased conversion by 25%, reduced load time by 40%'
    },
    {
      title: 'Real-time Analytics Dashboard',
      description: 'Developed a real-time analytics dashboard that processes and visualizes data from multiple sources. Implemented WebSocket connections for live updates and complex data visualizations using D3.js.',
      skills: ['React', 'D3.js', 'WebSockets', 'Node.js'],
      results: 'Reduced reporting time from hours to seconds'
    }
  ]
};

const CandidateProfile = () => {
  const { id } = useParams<{ id: string }>();
  // In a real app, you would fetch the candidate data based on the ID
  const candidate = mockCandidate;

  const handleScheduleInterview = (date: Date, timeSlot: string, durationType: string) => {
    console.log('Scheduling interview:', { date, timeSlot, durationType });
    
    // In a real app, you would send this to your backend
    toast({
      title: "Interview Scheduled",
      description: `Your interview with ${candidate.name} is scheduled for ${date.toDateString()} at ${timeSlot}.`,
    });
  };

  if (!candidate) {
    return (
      <PageTransition>
        <Navbar />
        <div className="page-container">
          <div className="text-center py-20">
            <h2 className="text-2xl font-medium mb-4">Candidate not found</h2>
            <Button asChild>
              <Link to="/candidates">Back to Candidates</Link>
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Navbar />
      <div className="page-container">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/candidates">
              <ArrowLeft size={16} className="mr-2" />
              Back to candidates
            </Link>
          </Button>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Candidate Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="md:col-span-2"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-medium flex-shrink-0 mx-auto sm:mx-0">
                      {candidate.initials}
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                        <h1 className="text-2xl font-medium">{candidate.name}</h1>
                        <Badge variant="outline" className={cn(
                          "text-xs sm:ml-2 mb-2 sm:mb-0 mx-auto sm:mx-0",
                          candidate.matchScore >= 90 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : candidate.matchScore >= 75
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        )}>
                          {candidate.matchScore}% Match
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{candidate.title}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 text-sm mb-6">
                        <div className="flex items-center justify-center sm:justify-start">
                          <MapPin size={16} className="mr-2 text-muted-foreground" />
                          <span>{candidate.location}</span>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start">
                          <Clock size={16} className="mr-2 text-muted-foreground" />
                          <span>{candidate.availability}</span>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start">
                          <Briefcase size={16} className="mr-2 text-muted-foreground" />
                          <span>{candidate.yearsOfExperience} years exp.</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-6">
                        {candidate.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="font-normal">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      <p className="text-sm leading-relaxed">
                        {candidate.bio}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Actions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button size="lg" className="w-full">
                    <Calendar size={16} className="mr-2" />
                    Schedule Interview
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    <MessageSquare size={16} className="mr-2" />
                    Contact Candidate
                  </Button>
                  <Button variant="secondary" size="lg" className="w-full">
                    <Download size={16} className="mr-2" />
                    Download Resume
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="experience" className="w-full">
              <TabsList className="w-full justify-start mb-6">
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>
              
              {/* Experience Tab */}
              <TabsContent value="experience" className="space-y-6">
                {candidate.experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{exp.title}</h3>
                            <p className="text-muted-foreground">{exp.company}</p>
                          </div>
                          <Badge variant="outline">{exp.period}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-2 mb-4">
                          <MapPin size={14} className="mr-1.5" />
                          {exp.location}
                        </div>
                        <p className="text-sm leading-relaxed">
                          {exp.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>
              
              {/* Skills Tab */}
              <TabsContent value="skills">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Skill Assessment</CardTitle>
                      <CardDescription>
                        Skills are verified through technical assessments and previous work samples
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <SkillsChart data={candidate.skillRatings} />
                        </div>
                        <div className="space-y-4">
                          {candidate.skillRatings.map((skill, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <span className="text-sm font-medium">{skill.skill}</span>
                                  {skill.rating >= 90 && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <CheckCircle size={14} className="ml-2 text-green-500" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="text-xs">Expert level skill, verified</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {skill.rating}/100
                                </span>
                              </div>
                              <Progress value={skill.rating} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-6">
                {candidate.projects.map((project, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-medium mb-2">{project.title}</h3>
                        <p className="text-sm leading-relaxed mb-4">
                          {project.description}
                        </p>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium">Key Technologies</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {project.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="font-normal">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Results</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {project.results}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>
              
              {/* Education Tab */}
              <TabsContent value="education" className="space-y-6">
                {candidate.education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{edu.degree}</h3>
                            <p className="text-muted-foreground">{edu.institution}</p>
                          </div>
                          <Badge variant="outline">{edu.year}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Languages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {candidate.languages.map((lang, index) => (
                          <div key={index} className="flex items-center justify-between py-2">
                            <div className="flex items-center">
                              <Languages size={16} className="mr-2 text-muted-foreground" />
                              <span>{lang.language}</span>
                            </div>
                            <Badge variant="secondary">{lang.proficiency}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Interview Scheduler */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Schedule Interview</CardTitle>
                  <CardDescription>
                    Select a date and time to interview this candidate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InterviewScheduler onSchedule={handleScheduleInterview} />
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Similar Candidates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Similar Candidates</CardTitle>
                  <CardDescription>
                    Other candidates with matching skills
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { id: '2', name: 'Michael Chen', title: 'React Developer', matchScore: 89 },
                    { id: '3', name: 'Sarah Wilson', title: 'Frontend Engineer', matchScore: 84 },
                  ].map((similar, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{similar.name}</p>
                        <p className="text-sm text-muted-foreground">{similar.title}</p>
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-xs",
                        similar.matchScore >= 90 
                          ? "bg-green-50 text-green-700 border-green-200" 
                          : similar.matchScore >= 75
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      )}>
                        {similar.matchScore}% Match
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CandidateProfile;
