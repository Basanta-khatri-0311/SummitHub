import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, MapPin, Trash2, Send, UserPlus, UserCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import toGeoJSON from 'togeojson';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { CreatePost } from '../components/CreatePost';
import { UserProfileModal } from '../components/UserProfileModal';

const PIN_ICON = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

function parseGPX(str) {
  if (!str) return null;
  try {
    const xml = new DOMParser().parseFromString(str, 'text/xml');
    const geo = toGeoJSON.gpx(xml);
    const coords = geo.features
      .filter(f => f.geometry?.type === 'LineString')
      .flatMap(f => f.geometry.coordinates.map(c => [c[1], c[0]]));
    return coords.length ? coords : null;
  } catch { return null; }
}

function Avatar({ name, avatar, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: '#f0fdf4', border: '2px solid #dcfce7',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.32, fontWeight: 700, color: '#16a34a', overflow: 'hidden', flexShrink: 0
    }}>
      {avatar
        ? <img src={avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : name?.charAt(0).toUpperCase() || '?'}
    </div>
  );
}

function PostCard({ post, onDelete, onLike, onComment }) {
  const { user, isFollowing, toggleFollow } = useAuth();
  const [showMap, setShowMap] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [profModal, setProfModal] = useState(false);

  const coords = parseGPX(post.gpxData);
  const pin = post.coordinates?.lat ? [post.coordinates.lat, post.coordinates.lng] : null;
  const hasMap = coords || pin;
  const mapCenter = pin || (coords ? coords[0] : [28.39, 84.12]);

  const liked = post.likes?.some(id => (id._id || id).toString() === user?._id?.toString());
  const isOwn = post.user?._id === user?._id || post.user?._id?.toString() === user?._id?.toString();
  const postUserId = post.user?._id;
  const following = postUserId ? isFollowing(postUserId) : false;

  const rootComments = (post.comments || []).filter(c => !c.parentId);

  const submitComment = () => {
    if (!commentText.trim()) return;
    onComment(post._id, commentText, replyTo);
    setCommentText('');
    setReplyTo(null);
  };

  const diffColor = {
    EASY: '#16a34a', MODERATE: '#d97706', HARD: '#dc2626', EXTREME: '#7c3aed'
  }[post.difficulty] || '#64748b';

  return (
    <article className="card fade-up" style={{ overflow: 'hidden' }}>
      {/* Image */}
      {post.imageUrl && (
        <div style={{ margin: '-1px -1px 0', overflow: 'hidden', height: 240, borderRadius: '20px 20px 0 0' }}>
          <img src={post.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <div style={{ padding: '20px 24px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <button onClick={() => setProfModal(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <Avatar name={post.user?.name} avatar={post.user?.avatar} size={44} />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => setProfModal(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                {post.user?.name || 'Trekker'}
              </button>
              {user && !isOwn && (
                <button onClick={() => toggleFollow(postUserId)} className={`btn-follow${following ? ' following' : ''}`} style={{ padding: '3px 10px', fontSize: 12 }}>
                  {following ? <><UserCheck size={12} /> Following</> : <><UserPlus size={12} /> Follow</>}
                </button>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              <MapPin size={12} />
              <span>{post.location}</span>
              <span>·</span>
              <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="badge" style={{ background: `${diffColor}15`, color: diffColor }}>{post.difficulty}</span>
            {isOwn && (
              <button onClick={() => onDelete(post._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', borderRadius: 8, padding: 6, display: 'flex' }}>
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <p style={{ margin: '0 0 16px', fontSize: 15, color: '#374151', lineHeight: 1.65 }}>{post.content}</p>

        {/* Map toggle */}
        {hasMap && (
          <div style={{ marginBottom: 16 }}>
            <button
              onClick={() => setShowMap(!showMap)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}
            >
              {showMap ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showMap ? 'Hide route map' : 'Show route on map'}
            </button>
            {showMap && (
              <div style={{ height: 256, marginTop: 10, borderRadius: 14, overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl attributionControl={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {coords && <Polyline positions={coords} pathOptions={{ color: '#16a34a', weight: 3 }} />}
                  {pin && <Marker position={pin} icon={PIN_ICON} />}
                </MapContainer>
              </div>
            )}
          </div>
        )}

        <div className="divider" style={{ margin: '16px 0' }} />

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button
            onClick={() => onLike(post._id)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: liked ? '#dc2626' : '#64748b', padding: 0 }}
          >
            <Heart size={18} fill={liked ? '#dc2626' : 'none'} color={liked ? '#dc2626' : '#64748b'} />
            {post.likes?.length || 0}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#64748b', padding: 0 }}
          >
            <MessageCircle size={18} />
            {post.comments?.length || 0}
          </button>
        </div>

        {/* Comments */}
        {showComments && (
          <div style={{ marginTop: 16 }}>
            {/* Comment list */}
            {rootComments.length > 0 && (
              <div style={{ marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {rootComments.map((c, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <Avatar name={c.name} size={32} />
                      <div style={{ flex: 1, background: '#f8fafc', borderRadius: 12, padding: '8px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{c.name}</span>
                          <span style={{ fontSize: 11, color: '#cbd5e1' }}>{new Date(c.date).toLocaleDateString()}</span>
                          <button onClick={() => setReplyTo(c._id)} style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Reply</button>
                        </div>
                        <p style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{c.comment}</p>
                      </div>
                    </div>
                    {/* Replies */}
                    {(post.comments || []).filter(r => r.parentId === c._id).map((r, ri) => (
                      <div key={ri} style={{ display: 'flex', gap: 10, marginLeft: 42, marginTop: 8 }}>
                        <Avatar name={r.name} size={28} />
                        <div style={{ flex: 1, background: '#f8fafc', borderRadius: 10, padding: '6px 12px' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{r.name}</span>
                          <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748b' }}>{r.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Reply indicator */}
            {replyTo && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '6px 12px', marginBottom: 8, fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
                Replying to {(post.comments || []).find(c => c._id === replyTo)?.name}
                <button onClick={() => setReplyTo(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 12 }}>Cancel</button>
              </div>
            )}

            {/* Input */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <input
                className="input"
                style={{ flex: 1, padding: '10px 14px' }}
                placeholder="Write a comment…"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitComment()}
              />
              <button onClick={submitComment} className="btn btn-green btn-sm" style={{ height: 40, width: 40, padding: 0, borderRadius: 10, flexShrink: 0 }}>
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile modal */}
      <UserProfileModal userId={postUserId} isOpen={profModal} onClose={() => setProfModal(false)} />
    </article>
  );
}

export function CommunityFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5500/api/posts')
      .then(r => r.json())
      .then(data => { setPosts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleLike = async (postId) => {
    if (!user) return toast.error('Please log in to like posts');
    try {
      const res = await fetch(`http://localhost:5500/api/posts/${postId}/like`, {
        method: 'PUT', headers: { Authorization: `Bearer ${user.token}` }
      });
      const likes = await res.json();
      setPosts(p => p.map(pp => pp._id === postId ? { ...pp, likes } : pp));
    } catch {}
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this trek post?')) return;
    try {
      const res = await fetch(`http://localhost:5500/api/posts/${postId}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) { setPosts(p => p.filter(pp => pp._id !== postId)); toast.success('Deleted!'); }
    } catch {}
  };

  const handleComment = async (postId, comment, parentId) => {
    if (!user) return toast.error('Please log in to comment');
    try {
      const res = await fetch(`http://localhost:5500/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ comment, parentId: parentId || null })
      });
      const comments = await res.json();
      setPosts(p => p.map(pp => pp._id === postId ? { ...pp, comments } : pp));
    } catch {}
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 16px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a' }}>Trek Feed</h1>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#94a3b8' }}>Stories from the trail community</p>
          </div>
          <button onClick={() => user ? setCreateOpen(true) : toast.error('Please log in first')} className="btn btn-green">
            + Share Trek
          </button>
        </div>

        {/* Posts */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 400, borderRadius: 20 }} />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <p style={{ fontSize: 32, margin: '0 0 12px' }}>🏔️</p>
            <h3 style={{ margin: '0 0 8px', color: '#0f172a', fontWeight: 700 }}>No treks yet</h3>
            <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>Be the first to share your journey!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {posts.map(post => (
              <PostCard key={post._id} post={post} onDelete={handleDelete} onLike={handleLike} onComment={handleComment} />
            ))}
          </div>
        )}
      </div>

      <CreatePost isOpen={createOpen} onClose={() => setCreateOpen(false)} onPostCreated={p => setPosts(prev => [p, ...prev])} />
    </div>
  );
}
