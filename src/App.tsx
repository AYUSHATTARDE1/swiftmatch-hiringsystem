
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import CandidateDashboard from '@/pages/CandidateDashboard';
import CompanyDashboard from '@/pages/CompanyDashboard';
import CandidatesPage from '@/pages/Candidates';
import CandidateProfile from '@/pages/CandidateProfile';
import UserProfile from '@/pages/UserProfile';
import JobSearch from '@/pages/JobSearch';
import JobDetails from '@/pages/JobDetails';
import JobApplication from '@/pages/ApplyJob';
import InterviewPage from '@/pages/InterviewPage';
import NotFoundPage from '@/pages/NotFound';
import { UserProvider } from '@/contexts/UserContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <UserProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/candidates/:id" element={<CandidateProfile />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/jobs" element={<JobSearch />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/jobs/:id/apply" element={<JobApplication />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster />
        </UserProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
