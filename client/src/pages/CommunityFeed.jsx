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

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full min-h-screen">
      <div className="flex justify-between items-center mb-10">
         <div>
            <h1 className="text-3xl font-black text-black dark:text-white tracking-tight">
               Community
            </h1>
            <p className="text-neutral-500 font-medium text-sm mt-1">Real-time expedition logs</p>
         </div>
         <button 
            onClick={() => {
              if(!user) return toast.error("Sign in to post!");
              setIsCreateOpen(true);
            }}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all shadow-md hover:scale-105"
         >
            Create Post
         </button>
      </div>

      <CreatePost 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onPostCreated={(newPost) => setPosts([newPost, ...posts])}
      />

      <div className="space-y-8">
        {loading ? (
           <div className="text-center py-20 text-neutral-400 animate-pulse">Loading secure transmissions...</div>
        ) : posts.length === 0 ? (
           <div className="text-center py-20 text-neutral-500 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl">
              No expeditions logged yet. Be the first!
           </div>
        ) : (
        posts.map(post => (
          <div key={post._id} className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white font-black text-sm uppercase">
                  {post.user?.name ? post.user.name.slice(0, 2) : 'UK'}
                </div>
                <div>
                  <h3 className="font-bold text-base text-black dark:text-white transition-colors">
                    {post.user?.name || 'Unknown Trekker'}
                  </h3>
                  <div className="flex items-center text-xs font-semibold text-neutral-500 gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5" /> {post.location} 
                    <span className="mx-1">•</span> 
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
              <div className="mb-5 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 aspect-video flex items-center justify-center">
                 <img src={post.imageUrl} alt="Trek" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
            
            <p className="text-black dark:text-neutral-200 font-medium text-base leading-relaxed transition-colors mb-5 whitespace-pre-wrap">
              {post.content}
            </p>

            <div className="flex gap-2 mb-6">
               <span className="text-xs font-bold text-black dark:text-white bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-3 py-1 rounded-lg">
                 CLASS: {post.difficulty}
               </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 border-t border-neutral-100 dark:border-neutral-900 pt-4 mt-2 transition-colors">
              <button 
                onClick={() => handleLike(post._id)}
                className={`flex items-center gap-2 font-semibold text-sm transition-colors group ${post.likes?.includes(user?._id) ? 'text-rose-500 dark:text-rose-400' : 'text-neutral-500 hover:text-rose-500 dark:hover:text-rose-400'}`}
              >
                <div className={`p-2 rounded-full transition-colors ${post.likes?.includes(user?._id) ? 'bg-rose-50 dark:bg-rose-500/10' : 'group-hover:bg-rose-50 dark:group-hover:bg-rose-500/10'}`}>
                  <Heart className="h-5 w-5" fill={post.likes?.includes(user?._id) ? "currentColor" : "none"} strokeWidth={2} />
                </div>
                {post.likes?.length || 0}
              </button>
              
              <button className="flex items-center gap-2 text-neutral-500 hover:text-black dark:hover:text-white font-semibold text-sm transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-neutral-100 dark:group-hover:bg-neutral-900 transition-colors">
                  <MessageCircle className="h-5 w-5" strokeWidth={2} />
                </div>
                {post.comments?.length || 0}
              </button>
            </div>

          </div>
        ))
        )}
      </div>
    </div>
  );
}
