import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mountain, Map, Users, Trophy, LayoutGrid, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navigation({ onOpenAuth }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const loc = useLocation();

  const links = [
    { to: '/', label: 'Home', icon: LayoutGrid },
    { to: '/explore', label: 'Map', icon: Map },
    { to: '/community', label: 'Feed', icon: Mountain },
    { to: '/partners', label: 'Find Partners', icon: Users },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <nav className="nav">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: '#16a34a', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mountain size={20} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>SummitHub</span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hide-mobile">
          {links.map(link => (
            <Link key={link.to} to={link.to} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
              borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 600,
              color: loc.pathname === link.to ? '#16a34a' : '#64748b',
              background: loc.pathname === link.to ? '#f0fdf4' : 'transparent',
              transition: 'all 0.15s'
            }}>
              <link.icon size={16} />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hide-mobile">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link to="/profile" style={{
                display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
                padding: '7px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10,
                fontSize: 14, fontWeight: 600, color: '#0f172a', background: 'white'
              }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#16a34a' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                {user.name?.split(' ')[0]}
              </Link>
              <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center' }}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onOpenAuth} className="btn btn-ghost btn-sm">Log in</button>
              <button onClick={onOpenAuth} className="btn btn-green btn-sm">Sign up free</button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }} className="show-mobile">
          {menuOpen ? <X size={24} color="#0f172a" /> : <Menu size={24} color="#0f172a" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ background: 'white', borderTop: '1px solid #f1f5f9', padding: '16px 24px 24px' }}>
          {links.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0',
              textDecoration: 'none', fontSize: 15, fontWeight: 600,
              color: loc.pathname === link.to ? '#16a34a' : '#374151',
              borderBottom: '1px solid #f8fafc'
            }}>
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: 16 }}>
            {user ? (
              <button onClick={() => { logout(); setMenuOpen(false); }} className="btn btn-ghost btn-full" style={{ marginTop: 8 }}>
                <LogOut size={16} /> Log out
              </button>
            ) : (
              <button onClick={() => { onOpenAuth(); setMenuOpen(false); }} className="btn btn-green btn-full">
                Get Started
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
      `}</style>
    </nav>
  );
}
