
import React, { useState } from 'react';
import { Search, X, SlidersHorizontal, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface SearchFiltersProps {
  onSearch: (filters: any) => void;
  className?: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, className }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Advanced filters
  const [experienceRange, setExperienceRange] = useState<number[]>([0, 10]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string>('');
  const [workType, setWorkType] = useState<string>('');
  
  const allSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 
    'Java', 'DevOps', 'Product Management', 'UI/UX Design',
    'Mobile Development', 'Data Science', 'Machine Learning'
  ];
  
  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };
  
  const handleClearFilters = () => {
    setActiveFilters([]);
    setExperienceRange([0, 10]);
    setSelectedSkills([]);
    setAvailability('');
    setWorkType('');
  };
  
  const handleApplyFilters = () => {
    const newFilters = [];
    
    if (experienceRange[0] > 0 || experienceRange[1] < 10) {
      newFilters.push(`${experienceRange[0]}-${experienceRange[1]} years`);
    }
    
    if (selectedSkills.length > 0) {
      if (selectedSkills.length <= 2) {
        selectedSkills.forEach(skill => newFilters.push(skill));
      } else {
        newFilters.push(`${selectedSkills.length} skills`);
      }
    }
    
    if (availability) {
      newFilters.push(availability);
    }
    
    if (workType) {
      newFilters.push(workType);
    }
    
    setActiveFilters(newFilters);
    
    // Send filters to parent component
    onSearch({
      searchTerm,
      experienceRange,
      skills: selectedSkills,
      availability,
      workType
    });
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      searchTerm,
      experienceRange,
      skills: selectedSkills,
      availability,
      workType
    });
  };
  
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for roles, skills, or locations..."
          className="pl-10 pr-20 h-11"
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader className="mb-5">
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Refine your candidate search with these filters.
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience (years)</label>
                <div className="pt-2 px-1">
                  <Slider
                    value={experienceRange}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={setExperienceRange}
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>{experienceRange[0]}+ years</span>
                    <span>{experienceRange[1]} years</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Skills</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedSkills.length === 0 ? (
                        <span className="text-muted-foreground">Select skills</span>
                      ) : (
                        <span>{selectedSkills.length} selected</span>
                      )}
                      <SlidersHorizontal className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <div className="p-4 max-h-[300px] overflow-y-auto">
                      <div className="grid grid-cols-1 gap-2">
                        {allSkills.map((skill) => (
                          <div key={skill} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`skill-${skill}`} 
                              checked={selectedSkills.includes(skill)}
                              onCheckedChange={() => toggleSkill(skill)}
                            />
                            <label 
                              htmlFor={`skill-${skill}`}
                              className="text-sm cursor-pointer flex-1"
                            >
                              {skill}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border-t">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedSkills([])}
                        disabled={selectedSkills.length === 0}
                      >
                        Clear
                      </Button>
                      <Button type="button" size="sm">
                        Apply
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Availability</label>
                <Select onValueChange={setAvailability} value={availability}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Immediately">Immediately</SelectItem>
                    <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                    <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                    <SelectItem value="1-2 months">1-2 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Work Type</label>
                <Select onValueChange={setWorkType} value={workType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="On-site">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleClearFilters}
                >
                  Clear all
                </Button>
                <Button 
                  type="button" 
                  className="flex-1"
                  onClick={handleApplyFilters}
                >
                  Apply filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </form>
      
      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {activeFilters.map((filter, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="pl-2 flex items-center gap-1"
            >
              {filter}
              <button
                type="button"
                onClick={() => handleRemoveFilter(filter)}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
