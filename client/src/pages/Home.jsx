import React, { useState, useEffect } from 'react';
import { Mountain, Users, Map, ArrowRight, Heart, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5500/api/posts')
      .then(r => r.json())
      .then(data => { setPosts(Array.isArray(data) ? data.slice(0, 6) : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: 'white' }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)', padding: '80px 24px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 400px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', border: '1px solid #bbf7d0', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600, color: '#16a34a', marginBottom: 24 }}>
              <span style={{ width: 8, height: 8, background: '#16a34a', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Join 250,000+ trekkers worldwide
            </div>
            <h1 style={{ margin: '0 0 20px', fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 900, color: '#0f172a', lineHeight: 1.1, letterSpacing: '-1.5px' }}>
              Your trekking<br />
              <span style={{ color: '#16a34a' }}>community.</span>
            </h1>
            <p style={{ margin: '0 0 36px', fontSize: 18, color: '#475569', lineHeight: 1.7, maxWidth: 480 }}>
              Discover trails, share your adventures, and find partners for your next big climb. All in one simple place.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/community" className="btn btn-green btn-lg">
                Browse the Feed <ArrowRight size={18} />
              </Link>
              <Link to="/explore" className="btn btn-outline btn-lg">
                <Map size={18} /> Open Map
              </Link>
            </div>
          </div>

          {/* Decorative card preview */}
          <div style={{ flex: '1 1 320px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 360, background: 'white', borderRadius: 24, padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '1px solid #f1f5f9' }}>
              <div style={{ height: 160, background: 'linear-gradient(135deg, #16a34a, #22c55e)', borderRadius: 16, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mountain size={64} color="white" strokeWidth={1.5} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#16a34a', fontSize: 14 }}>RK</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Rajan Karki</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>📍 Annapurna Base Camp</div>
                </div>
                <span className="badge badge-green" style={{ marginLeft: 'auto' }}>MODERATE</span>
              </div>
              <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>"The sunrise from base camp was something I'll never forget. 12 hours of trekking, totally worth it!"</p>
              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Heart size={14} fill="#ef4444" color="#ef4444" /> 48</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>💬 12 comments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: '#0f172a', padding: '28px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, textAlign: 'center' }}>
          {[
            { value: '250K+', label: 'Trekkers' },
            { value: '48K+', label: 'Treks Shared' },
            { value: '120+', label: 'Countries' },
            { value: '12K+', label: 'Partner Groups' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#22c55e', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '72px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 36, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Everything you need</h2>
            <p style={{ margin: 0, fontSize: 16, color: '#64748b', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
              From planning your first trek to connecting with experienced guides — we've got you covered.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { icon: <Map size={28} color="#16a34a" />, title: 'Interactive Map', desc: 'See where other trekkers are going. Explore GPX routes on a live map.', link: '/explore', linkText: 'Open Map' },
              { icon: <Mountain size={28} color="#16a34a" />, title: 'Share Your Trek', desc: 'Post photos, routes, and stories from your adventures for the community.', link: '/community', linkText: 'Browse Feed' },
              { icon: <Users size={28} color="#16a34a" />, title: 'Find Partners', desc: 'Looking for a companion? Post a request and connect with fellow trekkers.', link: '/partners', linkText: 'Find Partners' },
              { icon: <TrendingUp size={28} color="#16a34a" />, title: 'Climb the Ranks', desc: 'Earn points for sharing treks and engaging with the community.', link: '/leaderboard', linkText: 'See Rankings' },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding: 28 }}>
                <div style={{ width: 56, height: 56, background: '#f0fdf4', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, border: '1px solid #dcfce7' }}>
                  {f.icon}
                </div>
                <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{f.title}</h3>
                <p style={{ margin: '0 0 20px', fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>{f.desc}</p>
                <Link to={f.link} style={{ fontSize: 14, fontWeight: 700, color: '#16a34a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {f.linkText} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Treks */}
      <section style={{ padding: '72px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Recent Treks</h2>
              <p style={{ margin: 0, fontSize: 14, color: '#94a3b8' }}>Latest stories from the community</p>
            </div>
            <Link to="/community" className="btn btn-outline">View all treks</Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 280, borderRadius: 20 }} />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <p style={{ color: '#94a3b8' }}>No treks shared yet. Be the first!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {posts.map(post => (
                <div key={post._id} className="card" style={{ overflow: 'hidden' }}>
                  {post.imageUrl ? (
                    <div style={{ height: 160, overflow: 'hidden' }}>
                      <img src={post.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ height: 100, background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Mountain size={40} color="#16a34a" strokeWidth={1.5} />
                    </div>
                  )}
                  <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#16a34a' }}>
                        {post.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{post.user?.name}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>📍 {post.location}</div>
                      </div>
                    </div>
                    <p style={{ margin: '0 0 14px', fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                      {post.content?.slice(0, 90)}{post.content?.length > 90 ? '…' : ''}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8' }}>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Heart size={12} /> {post.likes?.length || 0}</span>
                      </div>
                      <span className="badge badge-green" style={{ fontSize: 10 }}>{post.difficulty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: '#16a34a', padding: '56px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 32, fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>Ready to start your journey?</h2>
          <p style={{ margin: '0 0 32px', fontSize: 16, color: '#bbf7d0', lineHeight: 1.7 }}>
            Join thousands of trekkers already sharing their adventures on SummitHub.
          </p>
          <Link to="/community" className="btn" style={{ background: 'white', color: '#16a34a', fontSize: 16, padding: '14px 32px', borderRadius: 12, fontWeight: 700, display: 'inline-flex', gap: 8, alignItems: 'center' }}>
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
