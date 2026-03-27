import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Compass, Map as MapIcon, Users, Hexagon } from 'lucide-react';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30">
        
        {/* Navigation */}
        <nav className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-500/10 rounded-xl">
                  <Hexagon className="h-6 w-6 text-indigo-400" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  SummitHub
                </span>
              </div>
              
              <div className="hidden md:block">
                <div className="flex items-center space-x-8">
                  <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                    <Compass className="h-4 w-4" /> Explore
                  </Link>
                  <Link to="/routes" className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                    <MapIcon className="h-4 w-4" /> Routes
                  </Link>
                  <Link to="/community" className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                    <Users className="h-4 w-4" /> Community
                  </Link>
                </div>
              </div>

              <div>
                <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              Share Your <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Trekking Experiences
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-400">
              Join the ultimate community for trekkers. Discover new routes, share your journey, and connect with adventurers worldwide.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <button className="bg-white text-slate-900 px-8 py-3 rounded-full font-semibold hover:bg-slate-100 transition-colors shadow-lg shadow-white/10">
                Start Exploring
              </button>
              <button className="bg-slate-800 text-white px-8 py-3 rounded-full font-semibold border border-slate-700 hover:bg-slate-700 transition-colors">
                Share a Route
              </button>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
            {[ 
              { title: 'Discover Routes', desc: 'Find curated routes for all difficulty levels.' },
              { title: 'Connect', desc: 'Meet fellow trekkers and plan joint expeditions.' },
              { title: 'Track Progress', desc: 'Build your portfolio of conquered peaks.' }
            ].map((item, i) => (
              <div key={i} className="bg-slate-800/20 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/40 transition-colors cursor-pointer group">
                <div className="h-12 w-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Compass className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </Router>
  );
}
