import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Home, Explore, CommunityFeed, Profile, PartnerFinder, Leaderboard } from './pages';
import { AuthModal } from './components/AuthModal';
import { Navigation } from './components/Navigation';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

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
