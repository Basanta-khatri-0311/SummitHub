import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ImageIcon, Heart, MessageSquare, Users, UserCheck, Compass, Loader2 } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export function Profile() {
  const { user, profileData, following, isFollowing, toggleFollow, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('treks');
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyPosts();
      refreshProfile();
    }
  }, [user]);

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5500/api/posts/my-posts', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      setMyPosts(Array.isArray(data) ? data : []);
    } catch {}
    finally { setLoading(false); }
  };

  if (!user) return <Navigate to="/" replace />;

  const myFollowing = profileData?.following || [];
  const myFollowers = profileData?.followers || [];

  const tabs = [
    { id: 'treks', label: 'My Treks', count: myPosts.length },
    { id: 'following', label: 'Following', count: myFollowing.length },
    { id: 'followers', label: 'Followers', count: myFollowers.length },
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>

        {/* Profile header card */}
        <div className="card" style={{ padding: '32px 36px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
          {/* Big avatar */}
          <div style={{
            width: 90, height: 90, borderRadius: 22, background: '#f0fdf4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, fontWeight: 800, color: '#16a34a', border: '3px solid #dcfce7', flexShrink: 0
          }}>
            {profileData?.avatar
              ? <img src={profileData.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 19 }} />
              : user.name?.charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{user.name}</h1>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: '#94a3b8' }}>{user.email}</p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {[
                { label: 'Treks', value: myPosts.length },
                { label: 'Following', value: myFollowing.length },
                { label: 'Followers', value: myFollowers.length },
                { label: 'Points', value: profileData?.points || 0 },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'white', padding: 6, borderRadius: 14, border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: '10px 8px', border: 'none', borderRadius: 10, cursor: 'pointer',
              fontSize: 14, fontWeight: 600, transition: 'all 0.15s',
              background: activeTab === tab.id ? '#16a34a' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#64748b',
            }}>
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Tab content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: '#16a34a', margin: '0 auto' }} />
          </div>
        ) : activeTab === 'treks' ? (
          /* Trek grid */
          myPosts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <p style={{ fontSize: 28, margin: '0 0 10px' }}>🥾</p>
              <h3 style={{ margin: '0 0 8px', color: '#0f172a' }}>No treks yet</h3>
              <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>
                <Link to="/community" style={{ color: '#16a34a', fontWeight: 600 }}>Share your first trek</Link> to get started!
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {myPosts.map(post => (
                <div key={post._id} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
                  {post.imageUrl && (
                    <div style={{ height: 140, borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
                      <img src={post.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{post.location}</h4>
                    <span className="badge badge-green" style={{ fontSize: 10 }}>{post.difficulty}</span>
                  </div>
                  <p style={{ margin: '0 0 14px', fontSize: 13, color: '#64748b', lineHeight: 1.55, flex: 1 }}>
                    {post.content?.slice(0, 100)}{post.content?.length > 100 ? '…' : ''}
                  </p>
                  <div style={{ display: 'flex', gap: 14, fontSize: 13, color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Heart size={14} /> {post.likes?.length || 0}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MessageSquare size={14} /> {post.comments?.length || 0}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 12 }}>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : activeTab === 'following' ? (
          /* Following list */
          myFollowing.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <p style={{ fontSize: 28, margin: '0 0 10px' }}>🧭</p>
              <h3 style={{ margin: '0 0 8px', color: '#0f172a' }}>Not following anyone</h3>
              <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>
                <Link to="/community" style={{ color: '#16a34a', fontWeight: 600 }}>Browse the feed</Link> to find trekkers to follow.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {myFollowing.map(f => (
                <PersonRow key={f._id} person={f} showUnfollow isFollowingFunc={isFollowing} onToggle={toggleFollow} />
              ))}
            </div>
          )
        ) : (
          /* Followers list */
          myFollowers.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <p style={{ fontSize: 28, margin: '0 0 10px' }}>👥</p>
              <h3 style={{ margin: '0 0 8px', color: '#0f172a' }}>No followers yet</h3>
              <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>Share more treks to build your audience!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {myFollowers.map(f => (
                <PersonRow key={f._id} person={f} isFollowingFunc={isFollowing} onToggle={toggleFollow} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function PersonRow({ person, isFollowingFunc, onToggle }) {
  const following = isFollowingFunc(person._id);
  return (
    <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14, background: '#f0fdf4',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, fontWeight: 700, color: '#16a34a', flexShrink: 0
      }}>
        {person.avatar
          ? <img src={person.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }} />
          : person.name?.charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{person.name}</div>
        <div style={{ fontSize: 12, color: '#94a3b8' }}>Trek enthusiast · {person.points || 0} pts</div>
      </div>
      <button onClick={() => onToggle(person._id)} className={`btn-follow${following ? ' following' : ''}`}>
        {following ? <><UserCheck size={14} /> Following</> : <><Users size={14} /> Follow</>}
      </button>
    </div>
  );
}

function MessageSquare(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={props.size || 24} height={props.size || 24}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
}
