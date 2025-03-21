
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface JobFormProps {
  onSuccess?: () => void;
  defaultValues?: any;
}

const JobForm: React.FC<JobFormProps> = ({ onSuccess, defaultValues }) => {
  const { toast } = useToast();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>(defaultValues?.required_skills || []);
  const [newSkill, setNewSkill] = useState('');
  
  const form = useForm({
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      location: defaultValues?.location || '',
      salary_range: defaultValues?.salary_range || '',
      work_type: defaultValues?.work_type || 'Remote',
      experience_level: defaultValues?.experience_level || '',
      status: defaultValues?.status || 'active',
    },
  });
  
  const addSkill = () => {
    if (newSkill.trim() !== '' && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };
  
  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };
  
  const onSubmit = async (values: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create job listings",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const jobData = {
        ...values,
        required_skills: skills,
        company_id: user.id,
      };
      
      let response;
      
      if (defaultValues?.id) {
        // Update existing job
        response = await supabase
          .from('jobs')
          .update(jobData)
          .eq('id', defaultValues.id)
          .select();
      } else {
        // Create new job
        response = await supabase
          .from('jobs')
          .insert(jobData)
          .select();
      }
      
      const { error } = response;
      
      if (error) {
        throw error;
      }
      
      toast({
        title: defaultValues?.id ? "Job updated" : "Job created",
        description: defaultValues?.id 
          ? "Your job listing has been updated successfully" 
          : "Your job listing has been published successfully",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      form.reset();
      setSkills([]);
      
    } catch (error) {
      console.error("Error creating/updating job:", error);
      toast({
        title: "Submission failed",
        description: "There was a problem saving your job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Senior React Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. San Francisco, CA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the role, responsibilities, and requirements" 
                  className="min-h-[150px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="work_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="On-site">On-site</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="salary_range"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Range</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. $100,000 - $150,000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="experience_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 3-5 years" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div>
          <FormLabel>Required Skills</FormLabel>
          <div className="flex mt-2 mb-2">
            <Input
              placeholder="Add a skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <Button 
              type="button" 
              onClick={addSkill} 
              className="ml-2"
            >
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1">
                {skill}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 ml-1 text-muted-foreground hover:text-foreground"
                  onClick={() => removeSkill(skill)}
                >
                  <X size={12} />
                </Button>
              </Badge>
            ))}
            {skills.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No skills added yet
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              form.reset();
              setSkills([]);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : (defaultValues?.id ? "Update Job" : "Post Job")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JobForm;
