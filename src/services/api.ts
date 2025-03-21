
import { supabase } from '@/integrations/supabase/client';

// User services
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      companies(*),
      candidates(*)
    `)
    .eq('id', userId)
    .single();
    
  if (error) {
    throw error;
  }
  
  return data;
};

export const updateUserProfile = async (userId: string, profile: any) => {
  const { error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', userId);
    
  if (error) {
    throw error;
  }
  
  return true;
};

// Company services
export const updateCompanyProfile = async (companyId: string, companyData: any) => {
  const { error } = await supabase
    .from('companies')
    .update(companyData)
    .eq('id', companyId);
    
  if (error) {
    throw error;
  }
  
  return true;
};

// Candidate services
export const updateCandidateProfile = async (candidateId: string, candidateData: any) => {
  const { error } = await supabase
    .from('candidates')
    .update(candidateData)
    .eq('id', candidateId);
    
  if (error) {
    throw error;
  }
  
  return true;
};

export const getCandidates = async (filters?: any) => {
  let query = supabase
    .from('candidates')
    .select(`
      *,
      profiles(id, first_name, last_name, location, profile_image)
    `);
    
  // Apply filters if provided
  if (filters) {
    if (filters.skills && filters.skills.length > 0) {
      query = query.contains('skills', filters.skills);
    }
    
    if (filters.experience_min) {
      query = query.gte('years_experience', filters.experience_min);
    }
    
    if (filters.experience_max) {
      query = query.lte('years_experience', filters.experience_max);
    }
    
    if (filters.work_type) {
      query = query.eq('work_type', filters.work_type);
    }
    
    if (filters.availability) {
      query = query.ilike('availability', `%${filters.availability}%`);
    }
    
    if (filters.searchTerm) {
      query = query.or(`
        profiles.first_name.ilike.%${filters.searchTerm}%,
        profiles.last_name.ilike.%${filters.searchTerm}%,
        title.ilike.%${filters.searchTerm}%
      `);
    }
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const getCandidate = async (candidateId: string) => {
  const { data, error } = await supabase
    .from('candidates')
    .select(`
      *,
      profiles(id, first_name, last_name, bio, location, profile_image)
    `)
    .eq('id', candidateId)
    .single();
    
  if (error) {
    throw error;
  }
  
  return data;
};

// Job services
export const getJobs = async (filters?: any) => {
  let query = supabase
    .from('jobs')
    .select(`
      *,
      companies(id, name, logo)
    `);
    
  // Apply filters
  if (filters) {
    if (filters.status) {
      query = query.eq('status', filters.status);
    } else {
      // By default, only show active jobs
      query = query.eq('status', 'active');
    }
    
    if (filters.work_type) {
      query = query.eq('work_type', filters.work_type);
    }
    
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    
    if (filters.searchTerm) {
      query = query.or(`
        title.ilike.%${filters.searchTerm}%,
        description.ilike.%${filters.searchTerm}%,
        location.ilike.%${filters.searchTerm}%
      `);
    }
    
    if (filters.company_id) {
      query = query.eq('company_id', filters.company_id);
    }
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const getJob = async (jobId: string) => {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      companies(id, name, logo, website, industry, size, description)
    `)
    .eq('id', jobId)
    .single();
    
  if (error) {
    throw error;
  }
  
  return data;
};

export const createJob = async (jobData: any) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert(jobData)
    .select();
    
  if (error) {
    throw error;
  }
  
  return data[0];
};

export const updateJob = async (jobId: string, jobData: any) => {
  const { error } = await supabase
    .from('jobs')
    .update(jobData)
    .eq('id', jobId);
    
  if (error) {
    throw error;
  }
  
  return true;
};

// Application services
export const getApplications = async (filters: any) => {
  let query = supabase
    .from('applications')
    .select(`
      *,
      jobs(id, title, company_id, companies(id, name)),
      candidates(id, profiles(id, first_name, last_name))
    `);
    
  if (filters.candidate_id) {
    query = query.eq('candidate_id', filters.candidate_id);
  }
  
  if (filters.job_id) {
    query = query.eq('job_id', filters.job_id);
  }
  
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  // If company_id is provided, filter by jobs posted by that company
  if (filters.company_id) {
    query = query.eq('jobs.company_id', filters.company_id);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const getApplication = async (applicationId: string) => {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      jobs(*, companies(*)),
      candidates(*, profiles(*))
    `)
    .eq('id', applicationId)
    .single();
    
  if (error) {
    throw error;
  }
  
  return data;
};

export const createApplication = async (applicationData: any) => {
  const { data, error } = await supabase
    .from('applications')
    .insert(applicationData)
    .select();
    
  if (error) {
    throw error;
  }
  
  return data[0];
};

export const updateApplication = async (applicationId: string, applicationData: any) => {
  const { error } = await supabase
    .from('applications')
    .update(applicationData)
    .eq('id', applicationId);
    
  if (error) {
    throw error;
  }
  
  return true;
};

// Interview services
export const getInterviews = async (filters: any) => {
  let query = supabase
    .from('interviews')
    .select(`
      *,
      applications(
        id,
        job_id,
        candidate_id,
        jobs(id, title, companies(id, name)),
        candidates(id, profiles(id, first_name, last_name))
      )
    `);
    
  if (filters.application_id) {
    query = query.eq('application_id', filters.application_id);
  }
  
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  // Filter by date range
  if (filters.from_date) {
    query = query.gte('scheduled_at', filters.from_date);
  }
  
  if (filters.to_date) {
    query = query.lte('scheduled_at', filters.to_date);
  }
  
  // Filter for a company's interviews
  if (filters.company_id) {
    query = query.eq('applications.jobs.company_id', filters.company_id);
  }
  
  // Filter for a candidate's interviews
  if (filters.candidate_id) {
    query = query.eq('applications.candidate_id', filters.candidate_id);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const createInterview = async (interviewData: any) => {
  const { data, error } = await supabase
    .from('interviews')
    .insert(interviewData)
    .select();
    
  if (error) {
    throw error;
  }
  
  return data[0];
};

export const updateInterview = async (interviewId: string, interviewData: any) => {
  const { error } = await supabase
    .from('interviews')
    .update(interviewData)
    .eq('id', interviewId);
    
  if (error) {
    throw error;
  }
  
  return true;
};

// Task services
export const getTasks = async (filters: any) => {
  let query = supabase
    .from('tasks')
    .select(`
      *,
      applications(
        id,
        jobs(id, title, companies(id, name)),
        candidates(id, profiles(id, first_name, last_name))
      )
    `);
    
  if (filters.application_id) {
    query = query.eq('application_id', filters.application_id);
  }
  
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const createTask = async (taskData: any) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(taskData)
    .select();
    
  if (error) {
    throw error;
  }
  
  return data[0];
};

export const updateTask = async (taskId: string, taskData: any) => {
  const { error } = await supabase
    .from('tasks')
    .update(taskData)
    .eq('id', taskId);
    
  if (error) {
    throw error;
  }
  
  return true;
};
