import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Compass, Map as MapIcon, Users, Triangle, Sun, Moon, User, Menu, X, Shield, Trophy } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { Home, Explore, CommunityFeed, Profile, PartnerFinder, Leaderboard } from './pages';
import { AuthModal } from './components/AuthModal';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Shield } from 'lucide-react';

function Navigation({ onOpenAuth }) {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className="border-b border-neutral-200 dark:border-neutral-900 bg-white dark:bg-[#0a0a0a] sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 shrink-0">
            <Triangle className="h-6 w-6 text-black dark:text-white fill-black dark:fill-white transition-colors" />
            <span className="text-xl font-extrabold tracking-tight text-black dark:text-white transition-colors">
              SUMMITHUB
            </span>
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-10">
              <Link to="/" className="text-sm font-semibold tracking-wide uppercase text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors flex items-center gap-2">
                <Compass className="h-4 w-4" /> Home
              </Link>
              <Link to="/explore" className="text-sm font-semibold tracking-wide uppercase text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors flex items-center gap-2">
                <MapIcon className="h-4 w-4" /> Explore
              </Link>
              <Link to="/community" className="text-sm font-semibold tracking-wide uppercase text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors flex items-center gap-2">
                <Users className="h-4 w-4" /> Community
              </Link>
              <Link to="/partners" className="text-sm font-semibold tracking-wide uppercase text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors flex items-center gap-2">
                <Shield className="h-4 w-4" /> Partners
              </Link>
              <Link to="/leaderboard" className="text-sm font-semibold tracking-wide uppercase text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors flex items-center gap-2">
                <Trophy className="h-4 w-4" /> Ranks
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors hidden sm:block"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Link to="/profile" className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white hover:text-neutral-500 transition-colors uppercase">
                    <User className="h-4 w-4" />
                    {user.name.split(' ')[0]}
                  </Link>
                  <button 
                    onClick={logout}
                    className="bg-neutral-100 hover:bg-neutral-200 text-black dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white px-4 py-2 rounded-none text-sm font-semibold tracking-wide uppercase transition-colors flex items-center gap-2"
                  >
                     Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={onOpenAuth}
                  className="bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black px-5 py-2 rounded-none text-sm font-semibold tracking-wide uppercase transition-colors"
                >
                   Sign In
                </button>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-3">
              <button 
                onClick={toggleTheme} 
                className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-black dark:text-white p-2"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-900 bg-white dark:bg-[#0a0a0a]">
          <div className="px-4 py-6 space-y-6 flex flex-col">
            <Link to="/" className="text-base font-bold tracking-widest uppercase text-black dark:text-white transition-colors flex items-center gap-3">
              <Compass className="h-5 w-5" /> Home
            </Link>
            <Link to="/explore" className="text-base font-bold tracking-widest uppercase text-black dark:text-white transition-colors flex items-center gap-3">
              <MapIcon className="h-5 w-5" /> Explore
            </Link>
            <Link to="/community" className="text-base font-bold tracking-widest uppercase text-black dark:text-white transition-colors flex items-center gap-3">
              <Users className="h-5 w-5" /> Community
            </Link>
            <Link to="/partners" className="text-base font-bold tracking-widest uppercase text-black dark:text-white transition-colors flex items-center gap-3">
              <Shield className="h-5 w-5" /> Partners
            </Link>
            <Link to="/leaderboard" className="text-base font-bold tracking-widest uppercase text-black dark:text-white transition-colors flex items-center gap-3">
              <Trophy className="h-5 w-5" /> Ranks
            </Link>

            <div className="h-px w-full bg-neutral-200 dark:bg-neutral-900 my-2"></div>

            {user ? (
               <div className="flex flex-col gap-4">
                  <Link to="/profile" className="text-base font-bold tracking-widest text-black dark:text-white uppercase transition-colors flex items-center gap-3">
                    <User className="h-5 w-5" /> Profile - {user.name}
                  </Link>
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="w-full bg-black text-white dark:bg-white dark:text-black px-5 py-4 font-bold tracking-widest uppercase transition-colors text-left pl-4"
                  >
                     Execute Logout
                  </button>
               </div>
            ) : (
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); onOpenAuth(); }}
                  className="w-full bg-black text-white dark:bg-white dark:text-black px-5 py-4 font-bold tracking-widest uppercase transition-colors text-left pl-4"
                >
                   Authenticate
                </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] text-black dark:text-white font-sans selection:bg-black/10 dark:selection:bg-white/10 transition-colors">
        <Toaster position="top-center" toastOptions={{
          style: {
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid currentColor',
            borderRadius: '0px'
          }
        }} />
        
        <Navigation onOpenAuth={() => setIsAuthModalOpen(true)} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/community" element={<CommunityFeed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/partners" element={<PartnerFinder />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
