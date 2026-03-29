import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Home, Explore, CommunityFeed, Profile, PartnerFinder, Leaderboard } from './pages';
import { AuthModal } from './components/AuthModal';
import { Navigation } from './components/Navigation';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Toaster
          position="top-center"
          toastOptions={{
            style: { borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: '0 8px 25px rgba(0,0,0,0.12)' },
            success: { iconTheme: { primary: '#16a34a', secondary: 'white' } }
          }}
        />
        <Navigation onOpenAuth={() => setIsAuthModalOpen(true)} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/community" element={<CommunityFeed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/partners" element={<PartnerFinder />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
