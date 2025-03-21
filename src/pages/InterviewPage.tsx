
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import VideoCall from '@/components/VideoCall';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';
import { getApplication, createInterview, updateApplication } from '@/services/api';

const InterviewPage = () => {
  const { user, isAuthenticated, userType } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [interviewData, setInterviewData] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadInterviewData = async () => {
      try {
        setIsLoading(true);
        
        // Get data from sessionStorage
        const storedData = sessionStorage.getItem('currentInterview');
        if (!storedData) {
          toast({
            title: "Interview data missing",
            description: "No interview information found. Please try again.",
            variant: "destructive",
          });
          navigate(-1);
          return;
        }
        
        const parsedData = JSON.parse(storedData);
        setInterviewData(parsedData);
        
        // Fetch application details
        if (parsedData.applicationId) {
          const applicationData = await getApplication(parsedData.applicationId);
          setApplication(applicationData);
        }
      } catch (error) {
        console.error("Error loading interview data:", error);
        toast({
          title: "Failed to load interview",
          description: "There was an error loading the interview details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInterviewData();
  }, [isAuthenticated, navigate]);

  const handleStartInterview = async () => {
    try {
      setIsLoading(true);
      
      if (!application) {
        throw new Error("Application data is missing");
      }
      
      // Update application status to interviewing
      await updateApplication(application.id, {
        status: 'interviewing'
      });
      
      // Create an interview record
      await createInterview({
        application_id: application.id,
        scheduled_at: new Date().toISOString(),
        duration: '30min',
        status: 'in_progress'
      });
      
      setIsVideoCallOpen(true);
    } catch (error) {
      console.error("Error starting interview:", error);
      toast({
        title: "Failed to start interview",
        description: "There was an error starting the interview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndInterview = () => {
    setIsVideoCallOpen(false);
    
    toast({
      title: "Interview ended",
      description: "The interview has been successfully completed.",
    });
    
    // Navigate back to the previous page
    navigate(-1);
  };

  if (isLoading) {
    return (
      <PageTransition>
        <Navbar />
        <div className="page-container flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Loading interview...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Navbar />
      <div className="page-container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Interview Session</h1>
          
          <div className="bg-card rounded-lg border p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {userType === 'candidate' 
                ? `Interview with ${application?.jobs?.companies?.name || 'Company'}`
                : `Interview with ${interviewData?.candidateName || 'Candidate'}`}
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="text-muted-foreground">
                <p className="text-lg">{`Position: ${application?.jobs?.title || interviewData?.jobTitle || 'Job Position'}`}</p>
                <p>This virtual interview will connect you directly with {userType === 'candidate' ? 'the hiring manager' : 'the candidate'}.</p>
              </div>
              
              <div className="p-4 bg-primary/10 rounded-md border border-primary/20">
                <h3 className="font-medium mb-2">Interview Tips:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Ensure your camera and microphone are working properly</li>
                  <li>Find a quiet place with good lighting</li>
                  <li>Have your resume or notes ready for reference</li>
                  <li>Be prepared to discuss your experiences and skills</li>
                </ul>
              </div>
            </div>
            
            <Button 
              size="lg"
              className="w-full"
              onClick={handleStartInterview}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing Interview...
                </>
              ) : (
                'Start Video Interview'
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {isVideoCallOpen && (
        <VideoCall 
          isOpen={isVideoCallOpen} 
          onClose={handleEndInterview} 
          participantName={userType === 'candidate' 
            ? (application?.jobs?.companies?.name || 'Hiring Manager') 
            : (interviewData?.candidateName || 'Candidate')}
        />
      )}
    </PageTransition>
  );
};

export default InterviewPage;
