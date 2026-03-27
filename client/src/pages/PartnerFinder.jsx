import React, { useState, useEffect } from 'react';
import { Users, MapPin, Calendar, Plus, MessageSquare, Shield, Check, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function PartnerFinder() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    date: '',
    description: '',
    experienceLevel: 'INTERMEDIATE',
    partnersNeeded: 1
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:5500/api/partners');
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      toast.error("Failed to load partner requests");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Authentication required");

    try {
      const res = await fetch('http://localhost:5500/api/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setRequests([data, ...requests]);
      setIsModalOpen(false);
      setFormData({ location: '', date: '', description: '', experienceLevel: 'INTERMEDIATE', partnersNeeded: 1 });
      toast.success("Request Broadcasted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleJoin = async (requestId) => {
    if (!user) return toast.error("Authentication required");
    try {
      const res = await fetch(`http://localhost:5500/api/partners/${requestId}/join`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setRequests(requests.map(r => r._id === requestId ? data : r));
      toast.success("Engagement modified");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 w-full min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
         <div>
            <h1 className="text-4xl font-black text-black dark:text-white tracking-tighter uppercase">
               Trek Partner Finder
            </h1>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mt-3">Sector Collaboration System</p>
         </div>
         <button 
           onClick={() => {
             if (!user) return toast.error("Authenticate to find partners");
             setIsModalOpen(true);
           }}
           className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all shadow-xl hover:scale-105 flex items-center gap-3"
         >
            <Plus className="h-4 w-4" /> Create Request
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
           <div className="col-span-full py-20 text-center text-neutral-400 font-bold uppercase tracking-widest text-xs animate-pulse">Scanning open sectors...</div>
        ) : requests.length === 0 ? (
           <div className="col-span-full py-20 bg-neutral-50 dark:bg-neutral-900/50 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl text-center">
              <Users className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">No active requests found in this region.</p>
           </div>
        ) : (
          requests.map(req => (
            <div key={req._id} className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-sm hover:border-black dark:hover:border-white transition-all relative overflow-hidden group">
               
               <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 text-[10px] font-black uppercase flex items-center justify-center border-2 border-black dark:border-white rounded-xl bg-neutral-100 dark:bg-neutral-900 transition-colors">
                        {req.user?.name ? req.user.name.slice(0, 2) : 'UK'}
                     </div>
                     <div>
                        <h3 className="font-bold text-black dark:text-white uppercase tracking-tight">{req.user?.name}</h3>
                        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">Lead Operative</p>
                     </div>
                  </div>
                  <div className="bg-neutral-100 dark:bg-neutral-900 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-neutral-500 transition-colors">
                     {req.experienceLevel}
                  </div>
               </div>

               <div className="flex flex-col gap-3 mb-6">
                  <div className="flex items-center gap-3 text-sm font-bold text-black dark:text-white transition-colors">
                     <MapPin className="h-4 w-4 text-neutral-400" /> {req.location}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-black dark:text-white transition-colors">
                     <Calendar className="h-4 w-4 text-neutral-400" /> {new Date(req.date).toLocaleDateString()}
                  </div>
               </div>

               <p className="text-neutral-500 text-sm font-medium leading-relaxed mb-8 line-clamp-3">
                  {req.description}
               </p>

               <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-900 pt-6 transition-colors">
                  <div className="flex -space-x-3">
                     {[...Array(req.partnersNeeded)].map((_, i) => (
                        <div key={i} className={`h-8 w-8 rounded-full border-2 border-white dark:border-black flex items-center justify-center text-[10px] font-black bg-neutral-200 dark:bg-neutral-800 transition-colors relative ${i < req.joinedPartners?.length ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-400'}`}>
                           {i < req.joinedPartners?.length ? <Check className="h-3 w-3" /> : '?'}
                        </div>
                     ))}
                  </div>
                  
                  <button 
                    onClick={() => handleJoin(req._id)}
                    className={`px-6 py-2 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${
                      req.joinedPartners?.includes(user?._id)
                        ? 'bg-rose-500 text-white'
                        : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80'
                    }`}
                  >
                    {req.joinedPartners?.includes(user?._id) ? 'Abort Join' : 'Engage'}
                  </button>
               </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
           <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-10 shadow-2xl animate-in zoom-in-95">
              <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                 <X className="h-6 w-6" />
              </button>
              
              <h2 className="text-2xl font-black text-black dark:text-white mb-8 uppercase tracking-tight">Create Mission</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Target Location</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all"
                      placeholder="E.G. GOKYO LAKES"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Expedition Date</label>
                       <input 
                         required
                         type="date"
                         className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-xs font-bold text-black dark:text-white focus:outline-none focus:border-black transition-all"
                         value={formData.date}
                         onChange={e => setFormData({...formData, date: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Partners Required</label>
                       <input 
                         required
                         type="number"
                         min="1"
                         max="10"
                         className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-xs font-bold text-black dark:text-white focus:outline-none focus:border-black transition-all"
                         value={formData.partnersNeeded}
                         onChange={e => setFormData({...formData, partnersNeeded: e.target.value})}
                       />
                    </div>
                 </div>

                 <div>
                    <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Experience Range</label>
                    <select 
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-black dark:text-white focus:outline-none focus:border-black transition-all appearance-none"
                      value={formData.experienceLevel}
                      onChange={e => setFormData({...formData, experienceLevel: e.target.value})}
                    >
                       <option value="BEGINNER">BEGINNER</option>
                       <option value="INTERMEDIATE">INTERMEDIATE</option>
                       <option value="ADVANCED">ADVANCED</option>
                       <option value="EXPERT">EXPERT</option>
                    </select>
                 </div>

                 <div>
                    <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Mission Briefing</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-xs font-medium text-black dark:text-white focus:outline-none focus:border-black transition-all resize-none"
                      placeholder="Detail the terrain, gear requirements, and pace..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                 </div>

                 <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:opacity-80 transition-all">
                    Initiate Forecast
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
