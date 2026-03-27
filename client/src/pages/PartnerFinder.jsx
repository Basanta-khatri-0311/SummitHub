import React, { useState, useEffect } from 'react';
import { Users, MapPin, Calendar, Plus, MessageSquare, Shield, Check, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserProfileModal } from '../components/UserProfileModal';
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
    partnersNeeded: 1,
    coordinates: { lat: 28.3949, lng: 84.1240 }
  });

  // Profile Modal State
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
      setFormData({ ...formData, location: '', description: '' });
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
      toast.success("Mission engagement updated.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openProfile = (id) => {
     setSelectedProfileId(id);
     setIsProfileOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 w-full min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
         <div>
            <h1 className="text-5xl font-black text-black dark:text-white tracking-tighter uppercase font-mono">
               Squad Finder
            </h1>
            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mt-3">Tactical Personnel Acquisition</p>
         </div>
         <button 
           onClick={() => {
             if (!user) return toast.error("Authenticate to find partners");
             setIsModalOpen(true);
           }}
           className="bg-black dark:bg-white text-white dark:text-black px-10 py-4 rounded-3xl font-black text-[12px] tracking-[0.2em] uppercase transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3"
         >
            <Plus className="h-5 w-5" /> Initialize Mission
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {loading ? (
           <div className="col-span-full py-20 text-center text-neutral-400 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Scanning open sectors...</div>
        ) : requests.length === 0 ? (
           <div className="col-span-full py-32 bg-neutral-50 dark:bg-neutral-900/50 border-4 border-dashed border-neutral-200 dark:border-neutral-800 rounded-[3.5rem] text-center">
              <Users className="h-16 w-16 text-neutral-300 mx-auto mb-6" />
              <p className="text-neutral-500 font-black uppercase tracking-widest text-[10px]">No active requests found in this region.</p>
           </div>
        ) : (
          requests.map(req => (
            <div key={req._id} className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-[3rem] p-10 shadow-sm hover:border-black dark:hover:border-white transition-all relative group overflow-hidden">
               
               <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-5">
                     <div 
                        onClick={() => openProfile(req.user?._id)}
                        className="h-12 w-12 text-[10px] font-black uppercase flex items-center justify-center border-2 border-black dark:border-white rounded-2xl bg-neutral-100 dark:bg-neutral-900 transition-all cursor-pointer hover:scale-105 overflow-hidden"
                     >
                        {req.user?.avatar ? <img src={req.user.avatar} className="w-full h-full object-cover" /> : req.user?.name ? req.user.name.slice(0, 2) : 'UK'}
                     </div>
                     <div>
                        <h3 
                           onClick={() => openProfile(req.user?._id)}
                           className="font-black text-lg text-black dark:text-white uppercase tracking-tight cursor-pointer hover:underline"
                        >
                           {req.user?.name}
                        </h3>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">Mission Lead</p>
                     </div>
                  </div>
                  <div className="bg-neutral-100 dark:bg-neutral-900 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-neutral-500 border border-neutral-200 dark:border-neutral-800">
                     {req.experienceLevel}
                  </div>
               </div>

               <div className="flex flex-col gap-4 mb-8">
                  <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-black dark:text-white">
                     <MapPin className="h-4 w-4 text-neutral-400" /> {req.location}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-black dark:text-white">
                     <Calendar className="h-4 w-4 text-neutral-400" /> {new Date(req.date).toLocaleDateString()}
                  </div>
               </div>

               <p className="text-neutral-500 text-sm font-bold uppercase tracking-tight leading-relaxed mb-10 line-clamp-3">
                  {req.description}
               </p>

               <div className="flex flex-col gap-6 border-t border-neutral-100 dark:border-neutral-900 pt-8 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-3">
                        {[...Array(req.partnersNeeded)].map((_, i) => {
                           const partner = req.joinedPartners[i];
                           return (
                              <div 
                                 key={i} 
                                 onClick={() => partner && openProfile(partner._id || partner)}
                                 className={`h-11 w-11 rounded-2xl border-2 border-white dark:border-black flex items-center justify-center text-[10px] font-black transition-all relative cursor-pointer hover:scale-110 z-10 ${i < req.joinedPartners?.length ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'}`}
                              >
                                 {i < req.joinedPartners?.length ? (partner.name?.slice(0, 1) || 'A') : '?'}
                              </div>
                           );
                        })}
                    </div>
                    
                    <button 
                        onClick={() => handleJoin(req._id)}
                        className={`px-10 py-4 rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase transition-all shadow-xl active:scale-95 ${
                           req.joinedPartners?.some(p => (p._id || p) === user?._id)
                           ? 'bg-rose-500 text-white'
                           : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80'
                        }`}
                    >
                        {req.joinedPartners?.some(p => (p._id || p) === user?._id) ? 'Abort Mission' : 'Engage'}
                    </button>
                  </div>

                  {req.joinedPartners?.length > 0 && (
                     <div className="flex flex-wrap gap-2 pt-2">
                        {req.joinedPartners.map((p, idx) => (
                           <button 
                              key={idx} 
                              onClick={() => openProfile(p._id || p)}
                              className="text-[9px] font-black uppercase text-neutral-400 bg-neutral-50 dark:bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-all shadow-sm"
                           >
                              {p.name}
                           </button>
                        ))}
                     </div>
                  )}
               </div>
            </div>
          ))
        )}
      </div>

      <UserProfileModal 
         userId={selectedProfileId}
         isOpen={isProfileOpen}
         onClose={() => setIsProfileOpen(false)}
      />

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-neutral-900/40 dark:bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
           <div className="relative w-full max-w-xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-[3rem] p-12 shadow-2xl animate-in zoom-in-95 duration-200">
              <button onClick={() => setIsModalOpen(false)} className="absolute right-10 top-10 text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                 <X className="h-7 w-7" />
              </button>
              
              <h2 className="text-3xl font-black text-black dark:text-white mb-2 uppercase tracking-tighter">Initialize mission</h2>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-10">Broadcast Sector Coordination</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Sector Target</label>
                       <input 
                         required
                         type="text"
                         className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-5 py-3 text-xs font-bold uppercase tracking-widest text-black dark:text-white focus:outline-none focus:border-black transition-all h-14"
                         placeholder="E.G. KHUMBU"
                         value={formData.location}
                         onChange={e => setFormData({...formData, location: e.target.value})}
                       />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Operatives Required</label>
                        <input 
                           required
                           type="number"
                           min="1"
                           max="10"
                           className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-5 py-3 text-xs font-bold text-black dark:text-white focus:outline-none focus:border-black transition-all h-14"
                           value={formData.partnersNeeded}
                           onChange={e => setFormData({...formData, partnersNeeded: e.target.value})}
                        />
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Expedition Date</label>
                       <input 
                         required
                         type="date"
                         className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-5 py-3 text-xs font-bold text-black dark:text-white focus:outline-none focus:border-black transition-all h-14"
                         value={formData.date}
                         onChange={e => setFormData({...formData, date: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">LAT/LNG Interface</label>
                       <div className="flex gap-2">
                          <input 
                             placeholder="LAT"
                             type="number" step="any"
                             className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 text-[10px] font-bold text-black dark:text-white focus:outline-none h-14"
                             value={formData.coordinates.lat}
                             onChange={e => setFormData({...formData, coordinates: {...formData.coordinates, lat: e.target.value}})}
                          />
                          <input 
                             placeholder="LNG"
                             type="number" step="any"
                             className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 text-[10px] font-bold text-black dark:text-white focus:outline-none h-14"
                             value={formData.coordinates.lng}
                             onChange={e => setFormData({...formData, coordinates: {...formData.coordinates, lng: e.target.value}})}
                          />
                       </div>
                    </div>
                 </div>

                 <div>
                    <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Experience Protocol</label>
                    <select 
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-5 py-4 text-[10px] font-black uppercase tracking-widest text-black dark:text-white focus:outline-none appearance-none cursor-pointer h-14"
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
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 text-xs font-medium text-black dark:text-white focus:outline-none focus:border-black transition-all resize-none leading-relaxed"
                      placeholder="Detail the terrain, gear requirements, and pace..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                 </div>

                 <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all mt-4">
                    Instantiate Deployment
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
