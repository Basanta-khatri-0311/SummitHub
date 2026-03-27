import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, MapPin, X, Loader2, Navigation, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

export function CreatePost({ isOpen, onClose, onPostCreated }) {
  const { user } = useAuth();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    content: '',
    difficulty: 'MODERATE',
    imageUrl: '',
    coordinates: { lat: 28.3949, lng: 84.1240 },
    gpxData: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to post.");
    
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5500/api/posts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to post');
      
      toast.success('Expedition Logged Successfully!');
      onPostCreated(data); 
      onClose();
      setFormData({ 
        location: '', content: '', difficulty: 'MODERATE', imageUrl: '', 
        coordinates: { lat: 27.7172, lng: 85.3240 }, gpxData: '' 
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/40 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-[2.5rem] overflow-hidden p-10 shadow-2xl animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-10 top-10 text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
          <X className="h-6 w-6" />
        </button>

        <div className="mb-8">
           <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">Initialize Log</h2>
           <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mt-2">Expedition Data Entry</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Location Name</label>
                 <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input 
                      required
                      type="text"
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold uppercase text-black dark:text-white focus:outline-none focus:border-black transition-all"
                      placeholder="E.G. ANNAPURNA RANGE"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                 </div>
              </div>
              
              <div className="flex gap-4">
                  <div className="flex-1">
                     <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">LAT</label>
                     <input 
                       required
                       type="number" step="any"
                       className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl py-3 px-4 text-xs font-bold text-black dark:text-white focus:outline-none focus:border-black transition-all"
                       value={formData.coordinates.lat}
                       onChange={e => setFormData({...formData, coordinates: {...formData.coordinates, lat: parseFloat(e.target.value)}})}
                     />
                  </div>
                  <div className="flex-1">
                     <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">LNG</label>
                     <input 
                       required
                       type="number" step="any"
                       className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl py-3 px-4 text-xs font-bold text-black dark:text-white focus:outline-none focus:border-black transition-all"
                       value={formData.coordinates.lng}
                       onChange={e => setFormData({...formData, coordinates: {...formData.coordinates, lng: parseFloat(e.target.value)}})}
                     />
                  </div>
              </div>
           </div>

           <div>
              <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Mission Briefing</label>
              <textarea 
                required
                rows={3}
                className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 text-xs font-medium text-black dark:text-white focus:outline-none focus:border-black transition-all resize-none leading-relaxed"
                placeholder="Details of the ascent..."
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
              />
           </div>

           <div className="flex flex-col gap-6">
              <button 
                type="button" 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
              >
                 <span>Advanced Mission Data</span>
                 {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {showAdvanced && (
                 <div className="space-y-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                           <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Difficulty</label>
                           <select 
                              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl py-3 px-5 text-[10px] font-black uppercase tracking-widest text-black dark:text-white focus:outline-none appearance-none cursor-pointer"
                              value={formData.difficulty}
                              onChange={e => setFormData({...formData, difficulty: e.target.value})}
                           >
                              <option value="EASY">EASY</option>
                              <option value="MODERATE">MODERATE</option>
                              <option value="HARD">HARD</option>
                              <option value="EXTREME">EXTREME</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Image URL</label>
                           <input 
                             type="text"
                             className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl py-3 px-4 text-[10px] font-black uppercase text-black dark:text-white focus:outline-none transition-all"
                             placeholder="HTTPS://..."
                             value={formData.imageUrl}
                             onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                           />
                        </div>
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">GPX Mission Trail (XML Data)</label>
                       <textarea 
                         rows={4}
                         className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 text-[8px] font-mono text-black dark:text-white focus:outline-none focus:border-black transition-all resize-none leading-tight"
                         placeholder="Paste your <gpx>...</gpx> XML content here to visualize the trail on the map."
                         value={formData.gpxData}
                         onChange={e => setFormData({...formData, gpxData: e.target.value})}
                       />
                    </div>
                 </div>
              )}
           </div>

           <button 
             type="submit"
             disabled={loading}
             className="w-full bg-black dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-2xl mt-4 flex justify-center items-center hover:opacity-80 transition-all shadow-xl"
           >
             {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <div className="flex items-center gap-3"><Navigation className="h-4 w-4" /> Broadcast Transmission</div>}
           </button>
        </form>
      </div>
    </div>
  );
}
