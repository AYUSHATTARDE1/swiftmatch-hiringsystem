
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Building, 
  MapPin, 
  Calendar, 
  Clock, 
  Globe, 
  Users, 
  BriefcaseBusiness, 
  CheckCircle, 
  ArrowLeft,
  Share2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';
import { getJob, createApplication } from '@/services/api';
import { useUser } from '@/contexts/UserContext';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, userType } = useUser();
  const [isApplying, setIsApplying] = useState(false);
  
  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => getJob(id as string),
    enabled: !!id,
  });
  
  if (error) {
    toast({
      title: "Error loading job",
      description: "There was an error loading this job posting. Please try again later.",
      variant: "destructive",
    });
  }
  
  const handleApply = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in as a candidate to apply for this job.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    
    if (userType !== 'candidate') {
      toast({
        title: "Invalid user type",
        description: "Only candidates can apply for jobs.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsApplying(true);
      
      await createApplication({
        job_id: id,
        candidate_id: user?.id,
        status: 'applied',
      });
      
      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted.",
      });
      
      navigate('/candidate/dashboard');
    } catch (error) {
      console.error("Error applying for job:", error);
      toast({
        title: "Application failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };
  
  return (
    <PageTransition>
      <Navbar />
      <div className="page-container">
        <Button variant="outline" className="mb-6" asChild>
          <Link to="/job-search">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Job Search
          </Link>
        </Button>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : job ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">{job.title}</h1>
                <div className="flex items-center text-muted-foreground mt-1">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{job.companies?.name}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {job.location && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </Badge>
                  )}
                  {job.work_type && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <BriefcaseBusiness className="h-3 w-3" />
                      {job.work_type}
                    </Badge>
                  )}
                  {job.salary_range && (
                    <Badge variant="outline">
                      {job.salary_range}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Link copied",
                      description: "Job link copied to clipboard",
                    });
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                
                <Button 
                  onClick={handleApply} 
                  disabled={isApplying || userType === 'company'}
                >
                  {isApplying ? "Applying..." : "Apply Now"}
                </Button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Tabs defaultValue="description">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="mt-6">
                    <div className="prose max-w-none dark:prose-invert">
                      <div dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br />') }} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="requirements" className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Required Skills</h3>
                        {job.required_skills && job.required_skills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {job.required_skills.map((skill: string, index: number) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No specific skills listed</p>
                        )}
                      </div>
                      
                      {job.experience_level && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Experience Level</h3>
                          <p>{job.experience_level}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Company Details</h3>
                    
                    <div className="space-y-4">
                      {job.companies?.logo ? (
                        <img 
                          src={job.companies.logo} 
                          alt={job.companies.name} 
                          className="h-16 w-16 object-contain"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-primary/10 flex items-center justify-center rounded">
                          <Building className="h-8 w-8 text-primary" />
                        </div>
                      )}
                      
                      <h4 className="font-medium">{job.companies?.name}</h4>
                      
                      {job.companies?.industry && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <BriefcaseBusiness className="h-4 w-4 mr-2" />
                          <span>{job.companies.industry}</span>
                        </div>
                      )}
                      
                      {job.companies?.website && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Globe className="h-4 w-4 mr-2" />
                          <a href={job.companies.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {job.companies.website.replace(/^https?:\/\/(www\.)?/, '')}
                          </a>
                        </div>
                      )}
                      
                      {job.companies?.size && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{job.companies.size} employees</span>
                        </div>
                      )}
                      
                      {job.created_at && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Posted on {new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {job.companies && job.companies.description && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-2">About {job.companies.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {job.companies.description}
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                <Card className="bg-primary/5 border-primary/10">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <CheckCircle className="h-8 w-8 text-primary mb-2" />
                      <h3 className="text-lg font-medium">Ready to Apply?</h3>
                      <p className="text-sm text-muted-foreground my-2">
                        Submit your application now to be considered for this position.
                      </p>
                      
                      <Button 
                        className="w-full mt-2" 
                        onClick={handleApply}
                        disabled={isApplying || userType === 'company'}
                      >
                        {isApplying ? "Applying..." : "Apply Now"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">Job Not Found</h2>
            <p className="text-muted-foreground mt-2">
              This job posting may have been removed or is no longer available.
            </p>
            <Button asChild className="mt-6">
              <Link to="/job-search">
                Browse Other Jobs
              </Link>
            </Button>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default JobDetails;
