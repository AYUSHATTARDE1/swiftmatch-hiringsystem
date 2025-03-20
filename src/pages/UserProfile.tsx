
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';
import { useUser } from '@/contexts/UserContext';

const UserProfile = () => {
  const { user, userType } = useUser();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <PageTransition>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">My Profile</h1>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "destructive" : "default"}
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
                  <AvatarImage src={user?.profilePicture} alt={user?.name} />
                  <AvatarFallback className="text-2xl">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm" className="mt-2">
                    <Upload className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                )}
              </div>
              <CardTitle className="text-xl">{user?.name}</CardTitle>
              <div className="text-muted-foreground">
                {userType === 'candidate' ? 'Senior Developer' : 'Hiring Manager'}
              </div>
              
              {!isEditing && (
                <div className="mt-2">
                  <Badge variant="outline" className="mr-1">
                    {userType === 'candidate' ? 'Available for work' : 'Actively hiring'}
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
                
                {userType === 'candidate' && (
                  <>
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>San Francisco, CA</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>5 years experience</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Available now</span>
                    </div>
                  </>
                )}
                
                {userType === 'company' && (
                  <>
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Acme Corporation HQ</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Tech Industry</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>50-200 employees</span>
                    </div>
                  </>
                )}
              </div>
              
              {isEditing && (
                <Button className="w-full mt-6" onClick={handleSaveProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
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
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                  </>
                )}
                {userType === 'company' && (
                  <>
                    <TabsTrigger value="jobs">Job Postings</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                  </>
                )}
              </TabsList>
              
              <TabsContent value="about" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userType === 'candidate' ? (
                      <p className="text-muted-foreground">
                        Senior developer with 5+ years of experience in building web applications using React, TypeScript, and Node.js. 
                        Passionate about creating user-friendly interfaces and solving complex problems.
                      </p>
                    ) : (
                      <p className="text-muted-foreground">
                        Acme Corporation is a leading technology company specializing in innovative software solutions.
                        We are constantly looking for talented individuals to join our growing team.
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
                      <div className="flex flex-wrap gap-2">
                        {["React", "TypeScript", "Node.js", "GraphQL", "UI/UX Design"].map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              {userType === 'candidate' && (
                <>
                  <TabsContent value="experience" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Work Experience</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <div className="flex justify-between mb-1">
                            <h3 className="font-medium">Senior Frontend Developer</h3>
                            <span className="text-sm text-muted-foreground">2020 - Present</span>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">TechCorp, San Francisco</div>
                          <p className="text-sm">
                            Led the development of the company's main product, improving performance by 40%. 
                            Mentored junior developers and implemented best practices.
                          </p>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <h3 className="font-medium">Frontend Developer</h3>
                            <span className="text-sm text-muted-foreground">2018 - 2020</span>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">WebSolutions, New York</div>
                          <p className="text-sm">
                            Developed and maintained multiple client projects using React and TypeScript.
                            Collaborated with designers to implement responsive UIs.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="education" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Education</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <div className="flex justify-between mb-1">
                            <h3 className="font-medium">Master of Computer Science</h3>
                            <span className="text-sm text-muted-foreground">2016 - 2018</span>
                          </div>
                          <div className="text-sm text-muted-foreground">Stanford University</div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <h3 className="font-medium">Bachelor of Computer Science</h3>
                            <span className="text-sm text-muted-foreground">2012 - 2016</span>
                          </div>
                          <div className="text-sm text-muted-foreground">University of California, Berkeley</div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="skills" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Technical Skills</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-medium mb-2">Frontend</h3>
                            <ul className="space-y-1 text-sm">
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2 px-1.5 py-0">95%</Badge>
                                React
                              </li>
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2 px-1.5 py-0">90%</Badge>
                                TypeScript
                              </li>
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2 px-1.5 py-0">85%</Badge>
                                HTML/CSS
                              </li>
                            </ul>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-2">Backend</h3>
                            <ul className="space-y-1 text-sm">
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2 px-1.5 py-0">80%</Badge>
                                Node.js
                              </li>
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2 px-1.5 py-0">75%</Badge>
                                GraphQL
                              </li>
                              <li className="flex items-center">
                                <Badge variant="outline" className="mr-2 px-1.5 py-0">70%</Badge>
                                PostgreSQL
                              </li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              )}
              
              {userType === 'company' && (
                <>
                  <TabsContent value="jobs" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Active Job Postings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="border rounded-md p-4">
                          <div className="flex justify-between mb-1">
                            <h3 className="font-medium">Senior React Developer</h3>
                            <Badge>3 applicants</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">Remote • Full-time • $120k-150k</div>
                          <div className="flex mt-2">
                            <Button size="sm" variant="outline" className="mr-2">View Applicants</Button>
                            <Button size="sm" variant="outline">Edit</Button>
                          </div>
                        </div>
                        
                        <div className="border rounded-md p-4">
                          <div className="flex justify-between mb-1">
                            <h3 className="font-medium">UX Designer</h3>
                            <Badge>1 applicant</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">San Francisco • Full-time • $100k-130k</div>
                          <div className="flex mt-2">
                            <Button size="sm" variant="outline" className="mr-2">View Applicants</Button>
                            <Button size="sm" variant="outline">Edit</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="team" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Team Members</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarFallback>JD</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">Jane Doe</h3>
                                <div className="text-sm text-muted-foreground">HR Manager</div>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">View</Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarFallback>MS</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">Michael Smith</h3>
                                <div className="text-sm text-muted-foreground">Tech Lead</div>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">View</Button>
                          </div>
                        </div>
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
