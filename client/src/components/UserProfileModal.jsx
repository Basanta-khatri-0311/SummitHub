import React, { useState, useEffect } from 'react';
import { UserPlus, UserCheck, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function UserProfileModal({ userId, isOpen, onClose }) {
  const { user: currentUser, isFollowing, toggleFollow } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      fetch(`http://localhost:5500/api/auth/user/${userId}`)
        .then(r => r.json())
        .then(data => { setProfile(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const following = userId ? isFollowing(userId) : false;
  const isSelf = currentUser?._id === userId;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="card scale-in" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 360, padding: 32 }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', borderRadius: 8, padding: 6, display: 'flex' }}>
          <X size={20} />
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#16a34a', margin: '0 auto' }} />
            <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 12 }}>Loading profile…</p>
          </div>
        ) : profile ? (
          <div style={{ textAlign: 'center' }}>
            {/* Avatar */}
            <div style={{
              width: 80, height: 80, borderRadius: 20, background: '#f0fdf4',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 800, color: '#16a34a', margin: '0 auto 16px',
              border: '3px solid #dcfce7'
            }}>
              {profile.avatar
                ? <img src={profile.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 17 }} />
                : profile.name?.charAt(0).toUpperCase()
              }
            </div>

            <h3 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{profile.name}</h3>
            <p style={{ margin: '0 0 24px', fontSize: 13, color: '#94a3b8' }}>Trek enthusiast</p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Followers', value: profile.followers?.length ?? 0 },
                { label: 'Points', value: profile.points ?? 0 },
              ].map(s => (
                <div key={s.label} style={{ background: '#f8fafc', borderRadius: 12, padding: '14px 8px', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Follow button */}
            {currentUser && !isSelf && (
              <button
                onClick={() => toggleFollow(userId)}
                className={`btn-follow${following ? ' following' : ''}`}
                style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: 12, fontSize: 14 }}
              >
                {following ? <><UserCheck size={16} /> Following</> : <><UserPlus size={16} /> Follow</>}
              </button>
            )}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>User not found</p>
        )}
      </div>
    </div>
  );
}
