import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Target, Compass, Image as ImageIcon, Settings, Heart, Award, Map as MapIcon, Calendar, MessageSquare } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchMyPosts();
    }
  }, [user]);

  const fetchMyPosts = async () => {
    try {
      const res = await fetch('http://localhost:5500/api/posts/my-posts', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMyPosts(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full min-h-[calc(100vh-64px)]">
      {/* Sleek User Banner */}
      <div className="bg-neutral-100 dark:bg-neutral-900 rounded-3xl p-8 md:p-12 mb-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden transition-colors border border-neutral-200 dark:border-neutral-800">
        
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
          <div className="inline-block border border-black dark:border-white px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase mb-4 text-neutral-500 dark:text-neutral-400">
            Active Explorer
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-2 tracking-tight uppercase">
            {user.name}
          </h1>
          <p className="text-neutral-500 font-bold flex items-center justify-center md:justify-start gap-2 text-xs uppercase tracking-widest">
            <MapPin className="h-3.5 w-3.5" /> Sector: North Himalayas
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
             <div className="flex flex-col">
                <span className="text-2xl font-black text-black dark:text-white transition-colors">{myPosts.length}</span>
                <span className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">Expeditions</span>
             </div>
             <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-800 my-auto"></div>
             <div className="flex flex-col">
                <span className="text-2xl font-black text-black dark:text-white transition-colors">12</span>
                <span className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">Achievements</span>
             </div>
          </div>
        </div>
        
        <button className="absolute top-8 right-8 p-3 text-neutral-400 hover:text-black dark:hover:text-white transition-colors bg-white dark:bg-black rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800">
           <Settings className="h-5 w-5 hover:rotate-90 transition-transform" />
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="flex gap-10 border-b border-neutral-200 dark:border-neutral-800 mb-10 transition-colors">
        {['posts', 'stats', 'awards'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors relative ${
              activeTab === tab 
                ? 'text-black dark:text-white' 
                : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
            }`}
          >
            {tab === 'posts' ? 'Mission Logs' : tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black dark:bg-white rounded-t-full transition-colors" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
         <div className="md:col-span-2">
            {loading ? (
               <div className="text-center py-20 text-neutral-400 uppercase tracking-widest text-xs font-bold animate-pulse">Decrypting logs...</div>
            ) : myPosts.length === 0 ? (
               <div className="bg-white dark:bg-[#0a0a0a] border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl p-16 flex flex-col items-center justify-center text-center transition-colors">
                  <div className="h-20 w-20 bg-neutral-50 dark:bg-neutral-900 rounded-2xl flex items-center justify-center mb-6 transition-colors border border-neutral-100 dark:border-neutral-800">
                     <ImageIcon className="h-10 w-10 text-neutral-300" />
                  </div>
                  <h3 className="text-xl font-bold text-black dark:text-white mb-2 uppercase tracking-tight">System Empty</h3>
                  <p className="text-neutral-500 max-w-xs mx-auto mb-8 text-sm font-medium">You haven't initialized any expedition logs. Start your first journey transmission.</p>
                  <Link to="/community" className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-80 transition-opacity">
                    Access Network
                  </Link>
               </div>
            ) : (
               <div className="grid grid-cols-1 gap-6">
                  {myPosts.map(post => (
                    <div key={post._id} className="group bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 hover:border-black dark:hover:border-white transition-all shadow-sm">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-[10px] font-black bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded text-neutral-500 mr-2 uppercase tracking-widest">{post.difficulty}</span>
                            <h4 className="inline-block text-lg font-black text-black dark:text-white uppercase tracking-tight">{post.location}</h4>
                            <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-bold mt-1 uppercase tracking-widest">
                               <Calendar className="h-3 w-3" /> {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex gap-4">
                             <div className="flex items-center gap-1.5 text-neutral-400">
                                <Heart className="h-4 w-4" /> <span className="text-xs font-black">{post.likes.length}</span>
                             </div>
                             <div className="flex items-center gap-1.5 text-neutral-400">
                                <MessageSquare className="h-4 w-4" /> <span className="text-xs font-black">{post.comments.length}</span>
                             </div>
                          </div>
                       </div>
                       <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium line-clamp-2 transition-colors mb-4">{post.content}</p>
                       <div className="h-px w-full bg-neutral-100 dark:bg-neutral-900 mb-4 transition-colors"></div>
                       <Link to="/community" className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-2 hover:gap-3 transition-all">
                          View in network →
                       </Link>
                    </div>
                  ))}
               </div>
            )}
         </div>
         
         <div className="space-y-8">
            <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 transition-colors">
               <h3 className="font-black text-black dark:text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
                 <Award className="h-5 w-5" /> Efficiency
               </h3>
               <div className="space-y-6">
                  {[
                    { label: 'Highest Point', value: '5,364m' },
                    { label: 'Network Points', value: '1,240' },
                    { label: 'Validation Rate', value: '98%' },
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col border-b border-neutral-200 dark:border-neutral-800 pb-4 last:border-0 last:pb-0 transition-colors">
                       <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</span>
                       <span className="text-black dark:text-white font-black text-lg tracking-tight">{stat.value}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-black/5 dark:bg-white/5 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800">
               <h4 className="text-xs font-black uppercase tracking-widest mb-4">Discovery Engine</h4>
               <p className="text-xs text-neutral-500 font-medium leading-relaxed mb-6">Connect your Garmin or Strava account to automatically sync high-fidelity expedition logs.</p>
               <button className="w-full border-2 border-black dark:border-white py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                  Sync External Core
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
