
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Briefcase, MapPin, Building, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';
import SearchFilters from '@/components/SearchFilters';
import { getJobs } from '@/services/api';
import { useUser } from '@/contexts/UserContext';

interface JobFilters {
  title?: string;
  location?: string;
  work_type?: string;
  skills?: string[];
}

const JobSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<JobFilters>({});
  const { toast } = useToast();
  const { userType, isAuthenticated } = useUser();

  const { 
    data: jobs, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => getJobs(filters),
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Failed to load jobs",
        description: "There was an error loading the job listings. Please try again.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters = { ...filters, title: searchQuery };
    setFilters(newFilters);
  };

  const handleFilterChange = (newFilters: JobFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <PageTransition>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Find Your Next Opportunity</h1>
          <p className="page-description">
            Browse through our curated list of job openings from top companies
          </p>
        </div>

        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <Input
              placeholder="Search for job titles, skills, or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>

          <SearchFilters 
            onSearch={handleFilterChange}
            showJobFilters={true}
          />
        </div>

        <div className="space-y-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : jobs && jobs.length > 0 ? (
            jobs.map((job: any) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover-card-animation overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        {job.companies?.logo ? (
                          <img 
                            src={job.companies.logo} 
                            alt={job.companies.name}
                            className="h-12 w-12 rounded"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center">
                            <Building className="h-6 w-6 text-primary" />
                          </div>
                        )}
                        
                        <div>
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <p className="text-sm text-muted-foreground">{job.companies?.name}</p>
                          
                          <div className="flex flex-wrap gap-2 mt-2">
                            {job.work_type && (
                              <Badge variant="outline" className="bg-primary/5">
                                {job.work_type}
                              </Badge>
                            )}
                            {job.location && (
                              <Badge variant="outline" className="bg-primary/5">
                                <MapPin className="h-3 w-3 mr-1" />
                                {job.location}
                              </Badge>
                            )}
                            {job.salary_range && (
                              <Badge variant="outline" className="bg-primary/5">
                                {job.salary_range}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/jobs/${job.id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {job.description}
                      </p>
                    </div>
                    
                    {job.required_skills && job.required_skills.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {job.required_skills.map((skill: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-6 flex justify-between items-center">
                      <Button asChild className="w-full">
                        <Link to={`/apply/${job.id}`}>
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No jobs found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default JobSearch;
