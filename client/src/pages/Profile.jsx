import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Target, Compass, Image as ImageIcon, Settings, Heart, Award, Map as MapIcon, ChevronRight, Camera } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full min-h-[calc(100vh-64px)]">
      {/* Sleek User Banner */}
      <div className="bg-neutral-100 dark:bg-neutral-900 rounded-3xl p-8 md:p-12 mb-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden transition-colors">
        
        {/* Avatar */}
        <div className="relative group">
           <div className="h-32 w-32 rounded-full border-4 border-white dark:border-black flex items-center justify-center bg-black dark:bg-white shrink-0 overflow-hidden shadow-xl transition-colors">
             <span className="text-5xl font-extrabold text-white dark:text-black tracking-tighter">
               {user.name ? user.name.slice(0, 2).toUpperCase() : 'ME'}
             </span>
           </div>
           <button className="absolute bottom-0 right-0 bg-white dark:bg-black p-2 rounded-full shadow-lg border border-neutral-200 dark:border-neutral-800 hover:scale-105 transition-transform text-black dark:text-white">
             <ImageIcon className="h-5 w-5" />
           </button>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-2 tracking-tight">
            {user.name}
          </h1>
          <p className="text-neutral-500 font-medium flex items-center justify-center md:justify-start gap-2 text-sm md:text-base">
            <MapPin className="h-4 w-4" /> Trekker Portfolio • Member since {new Date().getFullYear()}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
             <span className="bg-white dark:bg-black px-4 py-2 rounded-xl text-sm font-semibold shadow-sm border border-neutral-200 dark:border-neutral-800 text-black dark:text-white flex items-center gap-2">
                <Target className="h-4 w-4" /> 12 Peaks Conquered
             </span>
             <span className="bg-white dark:bg-black px-4 py-2 rounded-xl text-sm font-semibold shadow-sm border border-neutral-200 dark:border-neutral-800 text-black dark:text-white flex items-center gap-2">
                <MapIcon className="h-4 w-4" /> 450 km Logged
             </span>
          </div>
        </div>
        
        <button className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-black dark:hover:text-white transition-colors bg-white dark:bg-black rounded-full shadow-sm border border-neutral-200 dark:border-neutral-800">
           <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="flex gap-8 border-b border-neutral-200 dark:border-neutral-800 mb-8 transition-colors">
        {['posts', 'saved', 'achievements'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-semibold capitalize transition-colors relative ${
              activeTab === tab 
                ? 'text-black dark:text-white' 
                : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
            }`}
          >
            {tab === 'posts' ? 'My Journeys' : tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white rounded-t-full transition-colors" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-sm transition-colors">
               <div className="h-16 w-16 bg-neutral-100 dark:bg-neutral-900 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                  <Camera className="h-8 w-8 text-neutral-400" />
               </div>
               <h3 className="text-xl font-bold text-black dark:text-white mb-2">No Journeys Logged</h3>
               <p className="text-neutral-500 mb-6 text-sm">You haven't shared any trekking experiences yet. Start building your portfolio today.</p>
               <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full text-sm font-semibold hover:opacity-80 transition-opacity">
                 Create Post
               </button>
            </div>
         </div>
         
         <div className="space-y-6">
            <div className="bg-neutral-100 dark:bg-neutral-900 rounded-3xl p-6 transition-colors">
               <h3 className="font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                 <Award className="h-5 w-5" /> Highlights
               </h3>
               <div className="space-y-4">
                  {[
                    { label: 'Highest Altitude', value: '5,364m (EBC)' },
                    { label: 'Total Expeditions', value: '8' },
                    { label: 'Longest Trek', value: '14 Days' },
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 pb-3 last:border-0 last:pb-0 transition-colors">
                       <span className="text-neutral-500 text-sm font-medium">{stat.label}</span>
                       <span className="text-black dark:text-white font-bold text-sm">{stat.value}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
