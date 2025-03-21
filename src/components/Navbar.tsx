import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/contexts/UserContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { isAuthenticated, user, userType, logout } = useUser();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  let navItems = [
    { name: 'Dashboard', path: '/dashboard' },
  ];
  
  if (isAuthenticated) {
    if (userType === 'company') {
      navItems = [
        { name: 'Dashboard', path: '/company/dashboard' },
        { name: 'Candidates', path: '/candidates' },
        { name: 'Interviews', path: '/interviews' },
      ];
    } else {
      navItems = [
        { name: 'Dashboard', path: '/candidate/dashboard' },
        { name: 'My Interviews', path: '/my-interviews' },
        { name: 'Job Search', path: '/job-search' },
      ];
    }
  } else {
    navItems = [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'How It Works', path: '/#how-it-works' },
      { name: 'Pricing', path: '/#pricing' },
    ];
  }

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled || !isHomePage || isMobileMenuOpen 
          ? 'bg-white/90 dark:bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link 
              to="/" 
              className="flex items-center space-x-2 transition-opacity duration-200 hover:opacity-80"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-medium">
                SM
              </div>
              <span className="text-lg font-medium tracking-tight">Intervue</span>
            </Link>
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="bg-background rounded-md p-2 focus-ring"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={20} className="text-foreground" />
              ) : (
                <Menu size={20} className="text-foreground" />
              )}
            </button>
          </div>
          
          <nav className="hidden md:flex space-x-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'text-sm transition-colors duration-200',
                  location.pathname === item.path 
                    ? 'text-foreground font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profilePicture} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full md:hidden bg-background border-b border-border/50 animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-5 divide-y divide-border/50">
            <div className="space-y-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    'block text-base py-2 transition-colors duration-200',
                    location.pathname === item.path 
                      ? 'text-foreground font-medium' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <Button variant="outline" asChild className="w-full justify-center">
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </Button>
                  <Button 
                    variant="default" 
                    className="w-full justify-center"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="w-full justify-center">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign in</Link>
                  </Button>
                  <Button asChild className="w-full justify-center">
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>Get started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
