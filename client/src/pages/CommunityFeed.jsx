import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, MapPin, MoreHorizontal, Image as ImageIcon, CornerDownRight, UserPlus, UserCheck, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CreatePost } from '../components/CreatePost';
import { UserProfileModal } from '../components/UserProfileModal';
import toast from 'react-hot-toast';

export function CommunityFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});
  const [replyTo, setReplyTo] = useState({});
  const [following, setFollowing] = useState([]);
  
  // Profile Modal State
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
    if (user) fetchFollowing();
  }, [user]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:5500/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      toast.error('Failed to load community feed');
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowing = async () => {
     try {
        const res = await fetch('http://localhost:5500/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();
        setFollowing(data.following || []);
     } catch (e) {}
  };

  const handleLike = async (postId) => {
    if (!user) return toast.error("Please sign in to like posts");
    try {
      const res = await fetch(`http://localhost:5500/api/posts/${postId}/like`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        const updatedLikes = await res.json();
        setPosts(posts.map(p => p._id === postId ? { ...p, likes: updatedLikes } : p));
      }
    } catch (err) {
      toast.error("Failed to like post");
    }
  };

  const handleFollow = async (userId) => {
     if (!user) return toast.error("Sign in to follow");
     try {
        const res = await fetch(`http://localhost:5500/api/auth/follow/${userId}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();
        setFollowing(data.following);
        toast.success("Network status updated.");
     } catch (e) {
        toast.error("Operation failed.");
     }
  };

  const handleDelete = async (postId) => {
     if (!window.confirm("Terminate this transmission permanently?")) return;
     try {
        const res = await fetch(`http://localhost:5500/api/posts/${postId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (res.ok) {
           setPosts(posts.filter(p => p._id !== postId));
           toast.success("Transmission cleared.");
        }
     } catch (e) {
        toast.error("Delete failed.");
     }
  };

  const handleComment = async (postId) => {
    if (!user) return toast.error("Please sign in to ping");
    const text = commentText[postId];
    if (!text || text.trim() === '') return;

    try {
      const res = await fetch(`http://localhost:5500/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify({ 
           comment: text,
           parentId: replyTo[postId] || null 
        })
      });
      
      if (res.ok) {
        const updatedComments = await res.json();
        setPosts(posts.map(p => p._id === postId ? { ...p, comments: updatedComments } : p));
        setCommentText({ ...commentText, [postId]: '' });
        setReplyTo({ ...replyTo, [postId]: null });
        toast.success("Ping successful.");
      }
    } catch (err) {
      toast.error("Failed to post comment");
    }
  };

  const openProfile = (id) => {
     setSelectedProfileId(id);
     setIsProfileOpen(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 w-full min-h-screen">
      <div className="flex justify-between items-center mb-16">
         <div>
            <h1 className="text-5xl font-black text-black dark:text-white tracking-tighter uppercase font-mono">
               Global Feed
            </h1>
            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mt-3">Active Network Transmissions</p>
         </div>
         <button 
            onClick={() => {
              if(!user) return toast.error("Authentication required.");
              setIsCreateOpen(true);
            }}
            className="bg-black dark:bg-white text-white dark:text-black px-10 py-4 rounded-3xl font-black text-[11px] tracking-[0.2em] uppercase transition-all shadow-2xl hover:scale-105 active:scale-95"
         >
            Initialize Entry
         </button>
      </div>

      <CreatePost 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onPostCreated={(newPost) => setPosts([newPost, ...posts])}
      />

      <div className="space-y-16">
        {loading ? (
           <div className="text-center py-32 text-neutral-400 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Decrypting secure pings...</div>
        ) : posts.length === 0 ? (
           <div className="text-center py-32 text-neutral-500 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-[3rem] font-black uppercase tracking-widest text-[10px]">
              No expeditions logged in current sector.
           </div>
        ) : (
        posts.map(post => (
          <div key={post._id} className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-[2.5rem] p-10 shadow-sm transition-all hover:border-black dark:hover:border-white group">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-5">
                <div 
                   onClick={() => openProfile(post.user?._id)}
                   className="h-14 w-14 rounded-2xl border-2 border-black dark:border-white flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white font-black text-xs uppercase overflow-hidden shrink-0 cursor-pointer hover:scale-105 transition-transform"
                >
                  {post.user?.avatar ? <img src={post.user.avatar} className="w-full h-full object-cover" /> : post.user?.name ? post.user.name.slice(0, 2) : 'UK'}
                </div>
                <div>
                   <div className="flex items-center gap-3">
                      <h3 
                        onClick={() => openProfile(post.user?._id)}
                        className="font-black text-lg uppercase tracking-tight text-black dark:text-white transition-colors cursor-pointer hover:underline"
                      >
                        {post.user?.name || 'UNKNOWN_OPERATIVE'}
                      </h3>
                      {user && post.user?._id !== user._id && (
                         <button 
                           onClick={() => handleFollow(post.user?._id)}
                           className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                         >
                            {following.includes(post.user?._id) ? <UserCheck className="h-4 w-4 text-emerald-500" /> : <UserPlus className="h-4 w-4" />}
                         </button>
                      )}
                   </div>
                  <div className="flex items-center text-[10px] font-bold text-neutral-500 gap-2 mt-1 uppercase tracking-widest transition-colors cursor-default">
                    <MapPin className="h-3 w-3" /> {post.location} 
                    <span className="opacity-30">/</span> 
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                 {user?._id === post.user?._id && (
                    <button onClick={() => handleDelete(post._id)} className="text-neutral-400 hover:text-rose-500 transition-colors">
                       <Trash2 className="h-5 w-5" />
                    </button>
                 )}
                 <button className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                   <MoreHorizontal className="h-6 w-6" />
                 </button>
              </div>
            </div>

            {/* Content Area */}
            {post.imageUrl && (
              <div className="mb-8 rounded-3xl overflow-hidden bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 aspect-video flex items-center justify-center transition-colors group-hover:border-black dark:group-hover:border-white">
                 <img src={post.imageUrl} alt="Trek" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
            
            <p className="text-black dark:text-neutral-200 font-black text-xl leading-[1.3] tracking-tight transition-colors mb-8 whitespace-pre-wrap">
              {post.content}
            </p>

            <div className="flex gap-2 mb-10">
               <span className="text-[10px] font-black text-black dark:text-white bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-1.5 rounded-xl uppercase tracking-widest transition-colors">
                 Class: {post.difficulty}
               </span>
               {post.gpxData && (
                  <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-xl uppercase tracking-widest">
                    Route Tracked
                  </span>
               )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-10 border-t border-neutral-100 dark:border-neutral-900 pt-8 transition-colors">
              <button 
                onClick={() => handleLike(post._id)}
                className={`flex items-center gap-3 font-black text-[11px] uppercase tracking-widest transition-all group ${post.likes?.some(id => (id._id || id) === user?._id) ? 'text-rose-500' : 'text-neutral-500 hover:text-black dark:hover:text-white'}`}
              >
                <Heart className={`h-6 w-6 transition-all ${post.likes?.some(id => (id._id || id) === user?._id) ? 'fill-rose-500 scale-110' : 'group-hover:scale-110'}`} />
                {post.likes?.length || 0} Endorsements
              </button>
              
              <button className="flex items-center gap-3 text-neutral-500 hover:text-black dark:hover:text-white font-black text-[11px] uppercase tracking-widest transition-all group">
                <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
                {post.comments?.length || 0} Pings
              </button>
            </div>

            {/* Comments Section */}
            {post.comments && post.comments.length > 0 && (
              <div className="mt-10 space-y-6 border-t border-neutral-100 dark:border-neutral-900 pt-10 transition-colors">
                 {post.comments.filter(c => !c.parentId).map((c, i) => (
                   <div key={i} className="space-y-4">
                      <div className="flex gap-4 group/item">
                         <div 
                           onClick={() => openProfile(c.user)}
                           className="h-8 w-8 rounded-lg border-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-[10px] font-black shrink-0 transition-colors cursor-pointer"
                         >
                           {c.name ? c.name.slice(0, 1) : 'U'}
                         </div>
                         <div className="flex-1">
                           <div className="flex items-center gap-3 mb-1">
                              <span onClick={() => openProfile(c.user)} className="text-[11px] font-black text-black dark:text-white uppercase transition-colors cursor-pointer">{c.name}</span>
                              <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">{new Date(c.date).toLocaleDateString()}</span>
                              <button 
                                onClick={() => setReplyTo({ ...replyTo, [post._id]: c._id })}
                                className="text-[9px] font-black text-neutral-400 hover:text-black dark:hover:text-white transition-colors ml-auto opacity-0 group-hover/item:opacity-100 uppercase tracking-widest"
                              >
                                Reply
                              </button>
                           </div>
                           <p className="text-sm text-neutral-600 dark:text-neutral-400 font-bold transition-colors leading-relaxed uppercase tracking-tight">{c.comment}</p>
                         </div>
                      </div>
                      
                      {/* Sub-comments (Replies) */}
                      {post.comments.filter(reply => reply.parentId === c._id).map((reply, ridx) => (
                         <div key={ridx} className="flex gap-4 ml-12 opacity-80 border-l border-neutral-100 dark:border-neutral-900 pl-6">
                            <CornerDownRight className="h-4 w-4 text-neutral-300 shrink-0 mt-2" />
                            <div className="flex-1">
                               <div className="flex items-center gap-3 mb-1">
                                  <span onClick={() => openProfile(reply.user)} className="text-[10px] font-black text-black dark:text-white uppercase cursor-pointer">{reply.name}</span>
                                  <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">{new Date(reply.date).toLocaleDateString()}</span>
                               </div>
                               <p className="text-xs text-neutral-500 dark:text-neutral-500 font-bold uppercase tracking-tight leading-relaxed">{reply.comment}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                 ))}
              </div>
            )}

            {/* Post Comment Input */}
            <div className="mt-10 flex flex-col gap-3">
               {replyTo[post._id] && (
                  <div className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-900 px-4 py-2 rounded-xl text-[9px] font-black uppercase text-neutral-500 border border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-bottom-2 transition-colors">
                     <span>Replying to {post.comments.find(c => c._id === replyTo[post._id])?.name}'s Transmission...</span>
                     <button onClick={() => setReplyTo({...replyTo, [post._id]: null})} className="hover:text-rose-500 transition-colors">Discard</button>
                  </div>
               )}
               <div className="flex gap-4">
                  <input 
                    type="text"
                    placeholder="TYPE SECURE MESSAGE..."
                    className="flex-1 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl px-6 py-4 text-[11px] font-black tracking-[0.2em] uppercase text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all shadow-inner placeholder:text-neutral-600"
                    value={commentText[post._id] || ''}
                    onChange={e => setCommentText({...commentText, [post._id]: e.target.value})}
                    onKeyDown={e => e.key === 'Enter' && handleComment(post._id)}
                  />
                  <button 
                    onClick={() => handleComment(post._id)}
                    className="text-[11px] font-black uppercase tracking-[0.3em] text-black dark:text-white hover:opacity-50 transition-all border-b-2 border-transparent hover:border-current px-2"
                  >
                    Transmit
                  </button>
               </div>
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
    </div>
  );
}
