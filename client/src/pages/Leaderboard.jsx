import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Target, Award, ArrowUp, Zap, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('http://localhost:5500/api/auth/leaderboard');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to sync ranking data");
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (points) => {
    if (points >= 500) return <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />;
    if (points >= 200) return <Zap className="h-4 w-4 text-emerald-500 fill-emerald-500" />;
    return <Award className="h-4 w-4 text-neutral-400" />;
  };

  const getRankStyle = (index) => {
    if (index === 0) return "bg-black text-white dark:bg-white dark:text-black shadow-lg scale-105 border-transparent";
    if (index === 1) return "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50";
    if (index === 2) return "border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30";
    return "border-neutral-100 dark:border-neutral-900 hover:border-black dark:hover:border-white opacity-80";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 w-full min-h-screen">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">
          <Trophy className="h-3 w-3" /> Season 01 Active
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-black dark:text-white tracking-tighter uppercase">
           Global Leaderboard
        </h1>
        <p className="text-neutral-500 font-bold uppercase tracking-[0.2em] text-xs">Ranking by Expedition Activity & Impact</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 animate-pulse font-black text-[10px] uppercase tracking-widest text-neutral-400">Recalculating global ranks...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl">
             <p className="text-neutral-500 uppercase font-black text-[10px] tracking-widest">No active operatives in current database.</p>
          </div>
        ) : (
          users.map((user, index) => (
            <div 
              key={user._id} 
              className={`flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 ${getRankStyle(index)}`}
            >
              <div className="flex items-center gap-6">
                <div className="w-10 text-center">
                  {index < 3 ? (
                    <div className="flex justify-center">
                      <Medal className={`h-6 w-6 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-neutral-400' : 'text-orange-500'}`} />
                    </div>
                  ) : (
                    <span className="text-lg font-black">{index + 1}</span>
                  )}
                </div>

                <div className="h-12 w-12 rounded-2xl border border-current flex items-center justify-center font-black text-xs shrink-0 overflow-hidden">
                   {user.avatar ? (
                     <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                   ) : user.name.slice(0, 2).toUpperCase()}
                </div>

                <div>
                  <h3 className="font-black text-lg tracking-tight uppercase flex items-center gap-2">
                    {user.name}
                    {getBadgeIcon(user.points)}
                  </h3>
                  <div className="flex gap-2 mt-1">
                    {user.points >= 500 && (
                      <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 uppercase tracking-widest border border-yellow-500/20">Elite Predator</span>
                    )}
                    {user.points >= 200 && user.points < 500 && (
                      <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 uppercase tracking-widest border border-emerald-500/20">Veteran</span>
                    )}
                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-500 uppercase tracking-widest border border-current transition-colors">Operative</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end gap-2 text-black dark:text-white transition-colors">
                  <ArrowUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-2xl font-black tracking-tighter">{user.points}</span>
                </div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Network Points</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-16 bg-neutral-100 dark:bg-neutral-900 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-neutral-200 dark:border-neutral-800 transition-colors">
         <div className="text-center md:text-left">
            <h4 className="text-xl font-black text-black dark:text-white uppercase tracking-tight mb-2">Want to climb?</h4>
            <p className="text-sm text-neutral-500 font-medium max-w-sm uppercase tracking-wide leading-relaxed">Broadcast expedition logs, engage with fellow trekkers, and validate new routes to earn higher rank points.</p>
         </div>
         <button className="bg-black dark:bg-white text-white dark:text-black px-10 py-4 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase hover:scale-105 transition-all w-full md:w-auto">
            Review Guidelines
         </button>
      </div>
    </div>
  );
}
