import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Edit,
  Upload,
  Save,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';
import { useUser } from '@/contexts/UserContext';
import { getUserProfile, updateUserProfile, updateCompanyProfile, updateCandidateProfile, getApplications, getJobs } from '@/services/api';

const UserProfile = () => {
  const { user, userType, isAuthenticated } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [postedJobs, setPostedJobs] = useState<any[]>([]);
  
  // Form states for editable fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [yearsExperience, setYearsExperience] = useState(0);
  const [availability, setAvailability] = useState('');
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        if (user?.id) {
          const userData = await getUserProfile(user.id);
          setProfileData(userData);
          
          // Set form values
          if (userType === 'candidate') {
            setFirstName(userData.first_name || '');
            setLastName(userData.last_name || '');
            setBio(userData.bio || '');
            setLocation(userData.location || '');
            
            if (userData.candidates && userData.candidates[0]) {
              const candidateData = userData.candidates[0];
              // Make sure candidateData.skills is an array before setting
              if (candidateData && typeof candidateData === 'object') {
                setSkills(Array.isArray(candidateData.skills) ? candidateData.skills : []);
                setYearsExperience(candidateData.years_experience !== undefined && typeof candidateData.years_experience === 'number' ? candidateData.years_experience : 0);
                setAvailability(candidateData.availability !== undefined && typeof candidateData.availability === 'string' ? candidateData.availability : '');
              }
            }
            
            // Fetch applications for candidates
            const candidateApplications = await getApplications({ candidate_id: user.id });
            setApplications(candidateApplications);
          } else if (userType === 'company') {
            if (userData.companies && userData.companies[0]) {
              const companyData = userData.companies[0];
              if (companyData && typeof companyData === 'object') {
                setCompanyName(companyData.name !== undefined && typeof companyData.name === 'string' ? companyData.name : '');
                setIndustry(companyData.industry !== undefined && typeof companyData.industry === 'string' ? companyData.industry : '');
                setCompanySize(companyData.size !== undefined && typeof companyData.size === 'string' ? companyData.size : '');
                setCompanyDescription(companyData.description !== undefined && typeof companyData.description === 'string' ? companyData.description : '');
                setLocation(companyData.location !== undefined && typeof companyData.location === 'string' ? companyData.location : userData.location || '');
              }
            }
            
            // Fetch jobs and applications for companies
            const companyJobs = await getJobs({ company_id: user.id });
            setPostedJobs(companyJobs);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Failed to load profile",
          description: "There was an error loading your profile data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id, userType, isAuthenticated, navigate]);

  const handleSaveProfile = async () => {
    try {
      if (!user?.id) return;
      
      setIsLoading(true);
      
      // Update profile data for both user types
      await updateUserProfile(user.id, {
        first_name: firstName,
        last_name: lastName,
        bio,
        location,
      });
      
      // Additional updates based on user type
      if (userType === 'candidate' && profileData?.candidates?.[0]?.id) {
        await updateCandidateProfile(profileData.candidates[0].id, {
          skills,
          years_experience: yearsExperience,
          availability,
        });
      } else if (userType === 'company' && profileData?.companies?.[0]?.id) {
        await updateCompanyProfile(profileData.companies[0].id, {
          name: companyName,
          industry,
          size: companySize,
          description: companyDescription,
          location, // Add location to company profile update
        });
      }
      
      // Refresh profile data
      const refreshedData = await getUserProfile(user.id);
      setProfileData(refreshedData);
      
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleVideoCall = (application: any) => {
    // Save application ID in sessionStorage for VideoCall component to use
    sessionStorage.setItem('currentInterview', JSON.stringify({
      applicationId: application.id,
      candidateName: `${application.candidates?.profiles?.first_name} ${application.candidates?.profiles?.last_name}`,
      jobTitle: application.jobs?.title
    }));
    
    navigate('/interview');
  };
  
  if (isLoading && !profileData) {
    return (
      <PageTransition>
        <Navbar />
        <div className="page-container flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">My Profile</h1>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "destructive" : "default"}
            disabled={isLoading}
          >
            {isEditing ? (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileData?.profile_image} alt={user?.name} />
                  <AvatarFallback className="text-2xl">
                    {userType === 'candidate' 
                      ? `${firstName.charAt(0)}${lastName.charAt(0)}`
                      : companyName.charAt(0) || 'C'}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm" className="mt-2">
                    <Upload className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                )}
              </div>
              <CardTitle className="text-xl">
                {isEditing ? (
                  userType === 'candidate' ? (
                    <div className="space-y-2">
                      <Input 
                        placeholder="First Name" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <Input 
                        placeholder="Last Name" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  ) : (
                    <Input 
                      placeholder="Company Name" 
                      value={companyName} 
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  )
                ) : (
                  userType === 'candidate' 
                    ? `${firstName} ${lastName}` 
                    : companyName
                )}
              </CardTitle>
              <div className="text-muted-foreground">
                {userType === 'candidate' 
                  ? profileData?.candidates?.[0]?.title || 'Professional' 
                  : 'Company'}
              </div>
              
              {!isEditing && (
                <div className="mt-2">
                  <Badge variant="outline" className="mr-1">
                    {userType === 'candidate' 
                      ? (availability || 'Available for work') 
                      : 'Actively hiring'}
                  </Badge>
                </div>
              )}
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{user?.email}</span>
                </div>
                
                {isEditing ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input 
                      placeholder="Location" 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                ) : (
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{location || 'Add your location'}</span>
                  </div>
                )}
                
                {userType === 'candidate' && (
                  <>
                    {isEditing ? (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Years of Experience</label>
                        <Input 
                          type="number" 
                          min="0"
                          placeholder="Years of experience" 
                          value={yearsExperience} 
                          onChange={(e) => setYearsExperience(Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center text-sm">
                        <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{yearsExperience || 0} years experience</span>
                      </div>
                    )}
                    
                    {isEditing ? (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Availability</label>
                        <Input 
                          placeholder="e.g., Available now, Available in 2 weeks" 
                          value={availability} 
                          onChange={(e) => setAvailability(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{availability || 'Not specified'}</span>
                      </div>
                    )}
                  </>
                )}
                
                {userType === 'company' && (
                  <>
                    {isEditing ? (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Industry</label>
                          <Input 
                            placeholder="Industry" 
                            value={industry} 
                            onChange={(e) => setIndustry(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Company Size</label>
                          <Input 
                            placeholder="e.g., 1-10, 11-50, 51-200" 
                            value={companySize} 
                            onChange={(e) => setCompanySize(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center text-sm">
                          <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{industry || 'Industry not specified'}</span>
                        </div>
                        
                        <div className="flex items-center text-sm">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{companySize || 'Company size not specified'}</span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
              
              {isEditing && (
                <Button className="w-full mt-6" onClick={handleSaveProfile} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
          
          {/* Main Profile Content */}
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="about">
              <TabsList className="mb-4">
                <TabsTrigger value="about">About</TabsTrigger>
                {userType === 'candidate' && (
                  <>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                  </>
                )}
                {userType === 'company' && (
                  <>
                    <TabsTrigger value="jobs">Job Postings</TabsTrigger>
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                  </>
                )}
              </TabsList>
              
              <TabsContent value="about" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About {userType === 'candidate' ? 'Me' : 'Company'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea 
                        placeholder={`Write about ${userType === 'candidate' ? 'yourself' : 'your company'}`}
                        value={userType === 'candidate' ? bio : companyDescription}
                        onChange={(e) => userType === 'candidate' 
                          ? setBio(e.target.value) 
                          : setCompanyDescription(e.target.value)
                        }
                        className="min-h-[150px]"
                      />
                    ) : (
                      <p className="text-muted-foreground">
                        {userType === 'candidate' 
                          ? (bio || 'No bio provided. Click Edit Profile to add information about yourself.') 
                          : (companyDescription || 'No company description provided. Click Edit Profile to add information about your company.')}
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                {userType === 'candidate' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Top Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="pl-2 pr-1 py-1">
                                {skill}
                                <button 
                                  className="ml-1 text-xs hover:text-destructive"
                                  onClick={() => handleRemoveSkill(skill)}
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input 
                              placeholder="Add a skill" 
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                            />
                            <Button variant="outline" onClick={handleAddSkill}>Add</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {skills && skills.length > 0 ? (
                            skills.map((skill) => (
                              <Badge key={skill} variant="secondary">{skill}</Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground">No skills added yet. Click Edit Profile to add your skills.</span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              {userType === 'candidate' && (
                <>
                  <TabsContent value="skills" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">My Skills</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              {skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="pl-2 pr-1 py-1">
                                  {skill}
                                  <button 
                                    className="ml-1 text-xs hover:text-destructive"
                                    onClick={() => handleRemoveSkill(skill)}
                                  >
                                    ×
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input 
                                placeholder="Add a skill" 
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                              />
                              <Button variant="outline" onClick={handleAddSkill}>Add</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {skills && skills.length > 0 ? (
                              skills.map((skill) => (
                                <Badge key={skill} variant="secondary">{skill}</Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground">No skills added yet. Click Edit Profile to add your skills.</span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="applications" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">My Applications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {applications && applications.length > 0 ? (
                          <div className="space-y-4">
                            {applications.map((application) => (
                              <div key={application.id} className="border rounded-md p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h3 className="font-medium">
                                    <Link to={`/jobs/${application.job_id}`} className="hover:underline">
                                      {application.jobs?.title || 'Job Title'}
                                    </Link>
                                  </h3>
                                  <Badge>{application.status}</Badge>
                                </div>
                                <div className="text-sm text-muted-foreground mb-2">
                                  {application.jobs?.companies?.name || 'Company'} • Applied on {new Date(application.created_at).toLocaleDateString()}
                                </div>
                                <div className="flex mt-2">
                                  <Button size="sm" variant="outline" asChild className="mr-2">
                                    <Link to={`/jobs/${application.job_id}`}>View Job</Link>
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground mb-4">You haven't applied to any jobs yet</p>
                            <Button asChild>
                              <Link to="/jobs">Browse Jobs</Link>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              )}
              
              {userType === 'company' && (
                <>
                  <TabsContent value="jobs" className="space-y-4">
                    <Card>
                      <CardHeader className="flex justify-between items-center">
                        <CardTitle className="text-lg">Active Job Postings</CardTitle>
                        <Button asChild>
                          <Link to="/jobs/create">Post a New Job</Link>
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {postedJobs && postedJobs.length > 0 ? (
                          postedJobs.map((job) => (
                            <div key={job.id} className="border rounded-md p-4">
                              <div className="flex justify-between mb-1">
                                <h3 className="font-medium">{job.title}</h3>
                                <Badge>{job.status}</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground mb-2">
                                {job.location || 'Remote'} • {job.work_type || 'Full-time'} • {job.salary_range || 'Salary not specified'}
                              </div>
                              <div className="flex mt-2">
                                <Button size="sm" variant="outline" asChild className="mr-2">
                                  <Link to={`/jobs/${job.id}/applications`}>View Applicants</Link>
                                </Button>
                                <Button size="sm" variant="outline" asChild>
                                  <Link to={`/jobs/${job.id}/edit`}>Edit</Link>
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground mb-4">You haven't posted any jobs yet</p>
                            <Button asChild>
                              <Link to="/jobs/create">Post Your First Job</Link>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="applications" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recent Applications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {applications && applications.length > 0 ? (
                          <div className="space-y-4">
                            {applications.map((application) => (
                              <div key={application.id} className="border rounded-md p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h3 className="font-medium">
                                    {application.candidates?.profiles?.first_name} {application.candidates?.profiles?.last_name}
                                  </h3>
                                  <Badge>{application.status}</Badge>
                                </div>
                                <div className="text-sm text-muted-foreground mb-2">
                                  Applied for: <Link to={`/jobs/${application.job_id}`} className="font-medium hover:underline">{application.jobs?.title}</Link>
                                  <span> • {new Date(application.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex mt-2">
                                  <Button size="sm" variant="outline" className="mr-2" asChild>
                                    <Link to={`/candidates/${application.candidate_id}`}>View Profile</Link>
                                  </Button>
                                  <Button size="sm" variant="default" onClick={() => handleVideoCall(application)}>
                                    Schedule Interview
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">No applications received yet</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserProfile;
