
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building, ArrowLeft, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';
import { getJob, createApplication } from '@/services/api';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';

const ApplyJob = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, userType } = useUser();
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect if not logged in or not a candidate
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in as a candidate to apply for this job.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: `/apply/${id}` } });
    } else if (userType !== 'candidate') {
      toast({
        title: "Invalid user type",
        description: "Only candidates can apply for jobs.",
        variant: "destructive",
      });
      navigate('/company/dashboard');
    }
  }, [isAuthenticated, userType, navigate, id, toast]);
  
  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => getJob(id as string),
    enabled: !!id && isAuthenticated && userType === 'candidate',
  });
  
  if (error) {
    toast({
      title: "Error loading job",
      description: "There was an error loading this job posting. Please try again later.",
      variant: "destructive",
    });
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || userType !== 'candidate') {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await createApplication({
        job_id: id,
        candidate_id: user?.id,
        status: 'applied',
        cover_letter: coverLetter
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
      setIsSubmitting(false);
    }
  };
  
  return (
    <PageTransition>
      <Navbar />
      <div className="page-container">
        <Button variant="outline" className="mb-6" asChild>
          <Link to={`/jobs/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Job Details
          </Link>
        </Button>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : job ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Apply for {job.title}</h1>
              <div className="flex items-center text-muted-foreground mt-1">
                <Building className="h-4 w-4 mr-2" />
                <span>{job.companies?.name}</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium mb-3">Cover Letter</h2>
                    <Textarea
                      placeholder="Tell the employer about your experience, skills, and why you're a good fit for this role..."
                      rows={10}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting Application..." : "Submit Application"}
                  </Button>
                </form>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Job Overview</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">{job.companies?.name}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.location && (
                            <Badge variant="outline">
                              {job.location}
                            </Badge>
                          )}
                          {job.work_type && (
                            <Badge variant="outline">
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
                      
                      {job.required_skills && job.required_skills.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Required Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {job.required_skills.map((skill: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Application Tips</h3>
                    
                    <ul className="space-y-3 text-sm">
                      <li className="flex gap-2">
                        <div className="bg-primary/10 text-primary rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0">
                          <FileText className="h-3 w-3" />
                        </div>
                        <span>Tailor your cover letter to match the job requirements</span>
                      </li>
                      <li className="flex gap-2">
                        <div className="bg-primary/10 text-primary rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0">
                          <Upload className="h-3 w-3" />
                        </div>
                        <span>Update your profile for more visibility</span>
                      </li>
                    </ul>
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

export default ApplyJob;
