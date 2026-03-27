import React, { useState, useEffect } from 'react';
import { X, UserPlus, UserCheck, Trophy, MapPin, Award, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function UserProfileModal({ userId, isOpen, onClose }) {
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchProfile();
    }
  }, [isOpen, userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5500/api/auth/user/${userId}`);
      const data = await res.json();
      setProfile(data);
      
      // Check if following
      if (currentUser) {
         const profileRes = await fetch('http://localhost:5500/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
         });
         const profileData = await profileRes.json();
         setIsFollowing(profileData.following?.includes(userId));
      }
    } catch (err) {
      toast.error("Failed to load operative data");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) return toast.error("Sign in to follow");
    try {
      const res = await fetch(`http://localhost:5500/api/auth/follow/${userId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      const data = await res.json();
      setIsFollowing(data.following.includes(userId));
      toast.success("Network updated");
    } catch (e) {
      toast.error("Operation failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        <button onClick={onClose} className="absolute right-8 top-8 text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
          <X className="h-6 w-6" />
        </button>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
             <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">Decrypting Profile...</p>
          </div>
        ) : profile && (
          <div className="text-center">
             <div className="h-24 w-24 mx-auto rounded-3xl border-4 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-3xl font-black uppercase mb-6 overflow-hidden">
                {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : profile.name.slice(0, 2)}
             </div>

             <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter mb-2">{profile.name}</h2>
             <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.4em] mb-8">Active Operative</p>

             <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-4 rounded-2xl">
                   <div className="text-2xl font-black text-black dark:text-white">{profile.points || 0}</div>
                   <div className="text-[8px] font-black uppercase text-neutral-400 tracking-widest mt-1">Network Pts</div>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-4 rounded-2xl">
                   <div className="text-2xl font-black text-black dark:text-white">{profile.followers?.length || 0}</div>
                   <div className="text-[8px] font-black uppercase text-neutral-400 tracking-widest mt-1">Total Followers</div>
                </div>
             </div>

             <div className="space-y-4">
                {currentUser?._id !== userId && (
                   <button 
                     onClick={handleFollow}
                     className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${
                        isFollowing ? 'bg-neutral-100 dark:bg-neutral-900 text-neutral-500 border border-neutral-200 dark:border-neutral-800' : 'bg-black dark:bg-white text-white dark:text-black shadow-xl hover:scale-105'
                     }`}
                   >
                      {isFollowing ? <><UserCheck className="h-4 w-4" /> Trusted Contact</> : <><UserPlus className="h-4 w-4" /> Follow Operative</>}
                   </button>
                )}
                
                <div className="pt-6 flex justify-center gap-3">
                   {profile.achievements?.map((ach, idx) => (
                      <div key={idx} className="h-10 w-10 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-black dark:hover:text-white transition-colors" title={ach}>
                         <Award className="h-5 w-5" />
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
