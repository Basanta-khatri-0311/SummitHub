import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Zap, Loader2 } from 'lucide-react';

const RANK_STYLES = [
  { bg: '#fefce8', border: '#fef08a', badge: '🥇', label: 'Gold' },
  { bg: '#f8fafc', border: '#e2e8f0', badge: '🥈', label: 'Silver' },
  { bg: '#fff7ed', border: '#fed7aa', badge: '🥉', label: 'Bronze' },
];

function getRankLabel(points) {
  if (points >= 1000) return 'Expert Trekker';
  if (points >= 500)  return 'Advanced';
  if (points >= 200)  return 'Regular';
  return 'Explorer';
}

export function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5500/api/auth/leaderboard')
      .then(r => r.json())
      .then(d => { setUsers(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 16px 80px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
          <h1 style={{ margin: '0 0 10px', fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>Leaderboard</h1>
          <p style={{ margin: 0, fontSize: 15, color: '#64748b' }}>
            Top trekkers ranked by community points
          </p>
        </div>

        {/* Top 3 podium (desktop) */}
        {!loading && users.length >= 3 && (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
            {[users[1], users[0], users[2]].map((u, visualIdx) => {
              const rank = visualIdx === 1 ? 1 : visualIdx === 0 ? 2 : 3;
              const heights = [140, 180, 120];
              const style = RANK_STYLES[rank - 1];
              return (
                <div key={u._id} style={{
                  flex: 1, maxWidth: 180, textAlign: 'center',
                  background: style.bg, border: `2px solid ${style.border}`,
                  borderRadius: '20px 20px 0 0', padding: '20px 12px',
                  height: heights[visualIdx], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end'
                }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{style.badge}</div>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, background: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, color: '#0f172a', fontSize: 18, marginBottom: 8,
                    border: '2px solid rgba(0,0,0,0.06)', overflow: 'hidden'
                  }}>
                    {u.avatar ? <img src={u.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.name?.charAt(0)}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{u.name?.split(' ')[0]}</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#16a34a' }}>{u.points}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>pts</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#16a34a', margin: '0 auto' }} />
            <p style={{ color: '#94a3b8', marginTop: 12, fontSize: 14 }}>Loading rankings…</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {users.map((u, i) => (
              <div key={u._id} style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px',
                borderBottom: i < users.length - 1 ? '1px solid #f8fafc' : 'none',
                background: i < 3 ? RANK_STYLES[i].bg : 'white',
                transition: 'background 0.15s'
              }}>
                {/* Rank number */}
                <div style={{ width: 36, textAlign: 'center', flexShrink: 0 }}>
                  {i < 3
                    ? <span style={{ fontSize: 22 }}>{RANK_STYLES[i].badge}</span>
                    : <span style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8' }}>#{i + 1}</span>
                  }
                </div>

                {/* Avatar */}
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: '#f0fdf4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 17, fontWeight: 700, color: '#16a34a', flexShrink: 0,
                  overflow: 'hidden', border: '2px solid #dcfce7'
                }}>
                  {u.avatar ? <img src={u.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.name?.charAt(0).toUpperCase()}
                </div>

                {/* Name & rank */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{u.name}</div>
                  <span className="badge badge-green" style={{ fontSize: 10 }}>{getRankLabel(u.points)}</span>
                </div>

                {/* Points */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#16a34a' }}>{u.points.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>points</div>
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                <p style={{ color: '#94a3b8', fontSize: 15 }}>No rankings yet — start sharing treks to earn points!</p>
              </div>
            )}
          </div>
        )}

        {/* How to earn points */}
        <div className="card" style={{ marginTop: 24, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>How to earn points</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { action: 'Share a trek', points: '+10 pts' },
              { action: 'Get a like', points: '+2 pts' },
              { action: 'Get a comment', points: '+3 pts' },
              { action: 'Join a group trek', points: '+5 pts' },
            ].map(r => (
              <div key={r.action} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
                <span style={{ color: '#475569' }}>• {r.action}</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>{r.points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
