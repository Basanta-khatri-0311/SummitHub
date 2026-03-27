import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, MapPin, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function CreatePost({ isOpen, onClose, onPostCreated }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    location: '',
    content: '',
    difficulty: 'MODERATE',
    imageUrl: ''
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
      onPostCreated(data); // Pass new post back to feed
      onClose();
      setFormData({ location: '', content: '', difficulty: 'MODERATE', imageUrl: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/40 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-6 top-6 text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Log Expedition</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
           <div>
              <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Location / Peak</label>
              <div className="relative">
                 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                 <input 
                   required
                   type="text"
                   className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                   placeholder="e.g. Annapurna Base Camp"
                   value={formData.location}
                   onChange={e => setFormData({...formData, location: e.target.value})}
                 />
              </div>
           </div>

           <div>
              <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Experience Log</label>
              <textarea 
                required
                rows={4}
                className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all resize-none"
                placeholder="Share the details of your ascent..."
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Difficulty</label>
                  <select 
                     className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-3 px-4 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all appearance-none"
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
                  <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Image URL (Optional)</label>
                  <div className="relative">
                     <Camera className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                     <input 
                       type="text"
                       className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                       placeholder="https://..."
                       value={formData.imageUrl}
                       onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                     />
                  </div>
              </div>
           </div>

           <button 
             type="submit"
             disabled={loading}
             className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-4 rounded-xl mt-6 flex justify-center items-center hover:opacity-80 transition-opacity"
           >
             {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Publish Log'}
           </button>
        </form>
      </div>
    </div>
  );
}
