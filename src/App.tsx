
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import Candidates from "./pages/Candidates";
import CandidateProfile from "./pages/CandidateProfile";
import Interviews from "./pages/Interviews";
import MyInterviews from "./pages/MyInterviews";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import JobSearch from "./pages/JobSearch";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import { UserProvider, useUser } from "./contexts/UserContext";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

// Route based on user type
const UserTypeRoute = ({ 
  children,
  allowedUserTypes 
}: { 
  children: React.ReactNode,
  allowedUserTypes: ('company' | 'candidate')[]
}) => {
  const { userType, isAuthenticated } = useUser();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (userType && !allowedUserTypes.includes(userType)) {
    return <Navigate to={userType === 'company' ? '/company/dashboard' : '/candidate/dashboard'} replace />;
  }
  
  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { userType } = useUser();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/job-search" element={<JobSearch />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        
        {/* Generic dashboard redirect based on user type */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            {userType === 'company' 
              ? <Navigate to="/company/dashboard" replace /> 
              : <Navigate to="/candidate/dashboard" replace />
            }
          </ProtectedRoute>
        } />
        
        {/* User profile route */}
        <Route path="/my-profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        
        {/* Application route - needs auth */}
        <Route path="/apply/:id" element={
          <ProtectedRoute>
            <ApplyJob />
          </ProtectedRoute>
        } />
        
        {/* Company routes */}
        <Route path="/company/dashboard" element={
          <UserTypeRoute allowedUserTypes={['company']}>
            <CompanyDashboard />
          </UserTypeRoute>
        } />
        <Route path="/candidates" element={
          <UserTypeRoute allowedUserTypes={['company']}>
            <Candidates />
          </UserTypeRoute>
        } />
        <Route path="/candidates/:id" element={
          <UserTypeRoute allowedUserTypes={['company']}>
            <CandidateProfile />
          </UserTypeRoute>
        } />
        <Route path="/interviews" element={
          <UserTypeRoute allowedUserTypes={['company']}>
            <Interviews />
          </UserTypeRoute>
        } />
        
        {/* Candidate routes */}
        <Route path="/candidate/dashboard" element={
          <UserTypeRoute allowedUserTypes={['candidate']}>
            <CandidateDashboard />
          </UserTypeRoute>
        } />
        <Route path="/my-interviews" element={
          <UserTypeRoute allowedUserTypes={['candidate']}>
            <MyInterviews />
          </UserTypeRoute>
        } />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppRoutes = () => (
  <UserProvider>
    <AnimatedRoutes />
  </UserProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
