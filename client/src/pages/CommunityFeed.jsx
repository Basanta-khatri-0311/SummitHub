import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, MapPin, MoreHorizontal, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CreatePost } from '../components/CreatePost';
import toast from 'react-hot-toast';

export function CommunityFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const handleComment = async (postId) => {
    if (!user) return toast.error("Please sign in to comment");
    const text = commentText[postId];
    if (!text || text.trim() === '') return;

    try {
      const res = await fetch(`http://localhost:5500/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify({ comment: text })
      });
      
      if (res.ok) {
        const updatedComments = await res.json();
        setPosts(posts.map(p => p._id === postId ? { ...p, comments: updatedComments } : p));
        setCommentText({ ...commentText, [postId]: '' });
        toast.success("Ping successful.");
      }
    } catch (err) {
      toast.error("Failed to post comment");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full min-h-screen">
      <div className="flex justify-between items-center mb-10">
         <div>
            <h1 className="text-3xl font-black text-black dark:text-white tracking-tight uppercase">
               Community Feed
            </h1>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mt-2">Active Network Transmissions</p>
         </div>
         <button 
            onClick={() => {
              if(!user) return toast.error("Authentication required.");
              setIsCreateOpen(true);
            }}
            className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all shadow-xl hover:scale-105"
         >
            New Entry
         </button>
      </div>

      <CreatePost 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onPostCreated={(newPost) => setPosts([newPost, ...posts])}
      />

      <div className="space-y-12">
        {loading ? (
           <div className="text-center py-20 text-neutral-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Decrypting secure pings...</div>
        ) : posts.length === 0 ? (
           <div className="text-center py-20 text-neutral-500 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl">
              No expeditions logged in current sector.
           </div>
        ) : (
        posts.map(post => (
          <div key={post._id} className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-sm transition-all">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl border-2 border-black dark:border-white flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white font-black text-xs uppercase transition-colors">
                  {post.user?.name ? post.user.name.slice(0, 2) : 'UK'}
                </div>
                <div>
                  <h3 className="font-black text-base uppercase tracking-tight text-black dark:text-white transition-colors">
                    {post.user?.name || 'UNKNOWN_OPERATIVE'}
                  </h3>
                  <div className="flex items-center text-[10px] font-bold text-neutral-500 gap-2 mt-1 uppercase tracking-widest transition-colors">
                    <MapPin className="h-3 w-3" /> {post.location} 
                    <span className="opacity-30">/</span> 
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <button className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* Content Area */}
            {post.imageUrl && (
              <div className="mb-6 rounded-2xl overflow-hidden bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 aspect-video flex items-center justify-center transition-colors">
                 <img src={post.imageUrl} alt="Trek" className="w-full h-full object-cover transition-opacity duration-500" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
            
            <p className="text-black dark:text-neutral-200 font-medium text-lg leading-relaxed transition-colors mb-6 whitespace-pre-wrap">
              {post.content}
            </p>

            <div className="flex gap-2 mb-8">
               <span className="text-[10px] font-black text-black dark:text-white bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-3 py-1 rounded-lg uppercase tracking-widest transition-colors">
                 Class: {post.difficulty}
               </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-8 border-t border-neutral-100 dark:border-neutral-900 pt-6 transition-colors">
              <button 
                onClick={() => handleLike(post._id)}
                className={`flex items-center gap-3 font-black text-[10px] uppercase tracking-widest transition-colors group ${post.likes?.includes(user?._id) ? 'text-rose-500' : 'text-neutral-500 hover:text-black dark:hover:text-white'}`}
              >
                <Heart className={`h-5 w-5 transition-all ${post.likes?.includes(user?._id) ? 'fill-rose-500 scale-110' : 'group-hover:scale-110'}`} />
                {post.likes?.length || 0} Likes
              </button>
              
              <button className="flex items-center gap-3 text-neutral-500 hover:text-black dark:hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors group">
                <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                {post.comments?.length || 0} Pings
              </button>
            </div>

            {/* Comments Section */}
            {post.comments && post.comments.length > 0 && (
              <div className="mt-8 space-y-4 border-t border-neutral-100 dark:border-neutral-900 pt-6 transition-colors">
                 {post.comments.map((c, i) => (
                   <div key={i} className="flex gap-3">
                      <div className="h-6 w-6 rounded border border-black dark:border-white bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-[8px] font-black shrink-0 transition-colors">
                        {c.name ? c.name.slice(0, 1) : 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                           <span className="text-[10px] font-black text-black dark:text-white uppercase transition-colors">{c.name}</span>
                           <span className="text-[8px] font-bold text-neutral-400 uppercase">{new Date(c.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium transition-colors">{c.comment}</p>
                      </div>
                   </div>
                 ))}
              </div>
            )}

            {/* Post Comment Input */}
            <div className="mt-6 flex gap-3">
               <input 
                 type="text"
                 placeholder="TYPE MESSAGE..."
                 className="flex-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2 text-[10px] font-bold tracking-widest uppercase text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all"
                 value={commentText[post._id] || ''}
                 onChange={e => setCommentText({...commentText, [post._id]: e.target.value})}
                 onKeyDown={e => e.key === 'Enter' && handleComment(post._id)}
               />
               <button 
                 onClick={() => handleComment(post._id)}
                 className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white hover:opacity-50 transition-opacity"
               >
                 Transmit
               </button>
            </div>

          </div>
        ))
        )}
      </div>
    </div>
  );
}
