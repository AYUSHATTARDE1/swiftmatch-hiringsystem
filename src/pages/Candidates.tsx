
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';
import SearchFilters from '@/components/SearchFilters';
import CandidateCard, { Candidate } from '@/components/CandidateCard';

// Mock candidate data
const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Jennifer Davis',
    initials: 'JD',
    title: 'Senior React Developer',
    location: 'San Francisco, CA',
    availability: 'Available now',
    yearsOfExperience: 5,
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Jest'],
    matchScore: 95,
    workType: 'Remote',
  },
  {
    id: '2',
    name: 'Mikael Karlsson',
    initials: 'MK',
    title: 'UI/UX Designer',
    location: 'Stockholm, Sweden',
    availability: 'Available in 2 weeks',
    yearsOfExperience: 7,
    skills: ['Figma', 'UI Design', 'User Research', 'Design Systems', 'Prototyping'],
    matchScore: 88,
    workType: 'Hybrid',
  },
  {
    id: '3',
    name: 'Rachel Wong',
    initials: 'RW',
    title: 'Product Manager',
    location: 'New York, NY',
    availability: 'Available in 1 month',
    yearsOfExperience: 6,
    skills: ['Product Strategy', 'Roadmapping', 'User Stories', 'Agile', 'Market Research'],
    matchScore: 82,
    workType: 'On-site',
  },
  {
    id: '4',
    name: 'David Johnson',
    initials: 'DJ',
    title: 'DevOps Engineer',
    location: 'Austin, TX',
    availability: 'Available in 2 weeks',
    yearsOfExperience: 4,
    skills: ['AWS', 'Kubernetes', 'Docker', 'CI/CD', 'Terraform'],
    matchScore: 91,
    workType: 'Remote',
  },
  {
    id: '5',
    name: 'Sarah Ahmed',
    initials: 'SA',
    title: 'Data Scientist',
    location: 'Seattle, WA',
    availability: 'Available now',
    yearsOfExperience: 3,
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Data Visualization'],
    matchScore: 87,
    workType: 'Hybrid',
  },
  {
    id: '6',
    name: 'Alex Martinez',
    initials: 'AM',
    title: 'Mobile Developer',
    location: 'Los Angeles, CA',
    availability: 'Available in 3 weeks',
    yearsOfExperience: 5,
    skills: ['React Native', 'Swift', 'Kotlin', 'Mobile Architecture', 'Redux'],
    matchScore: 79,
    workType: 'Remote',
  },
];

const Candidates = () => {
  const [viewMode, setViewMode] = useState<string>('grid');
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [searchFilters, setSearchFilters] = useState({});

  const handleSearch = (filters: any) => {
    console.log('Search filters:', filters);
    // In a real app, this would filter the candidates
    // For now, we'll just log the filters
    setSearchFilters(filters);
  };

  return (
    <PageTransition>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Candidates</h1>
          <p className="page-description">
            Browse and filter pre-screened candidates that match your requirements.
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <SearchFilters onSearch={handleSearch} />
        </motion.div>
        
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{candidates.length}</span> candidates
          </p>
          
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)}>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid3X3 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <LayoutList className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className={viewMode === 'grid' ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {candidates.map((candidate, index) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
            >
              <CandidateCard 
                candidate={candidate} 
                compact={viewMode === 'list'}
                className={viewMode === 'list' ? "flex-row" : ""}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Candidates;
