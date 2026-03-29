import React, { useState, useEffect } from 'react';
import { Users, MapPin, Calendar, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserProfileModal } from '../components/UserProfileModal';
import toast from 'react-hot-toast';

export function PartnerFinder() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [form, setForm] = useState({
    location: '', date: '', description: '',
    experienceLevel: 'INTERMEDIATE', partnersNeeded: 2,
    coordinates: { lat: 28.3949, lng: 84.1240 }
  });

  useEffect(() => {
    fetch('http://localhost:5500/api/partners')
      .then(r => r.json())
      .then(d => { setRequests(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please log in first');
    try {
      const res = await fetch('http://localhost:5500/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setRequests(p => [data, ...p]);
      setModalOpen(false);
      setForm({ ...form, location: '', description: '' });
      toast.success('Trek request posted!');
    } catch (e) { toast.error(e.message); }
  };

  const handleJoin = async (id) => {
    if (!user) return toast.error('Please log in first');
    try {
      const res = await fetch(`http://localhost:5500/api/partners/${id}/join`, {
        method: 'PUT', headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setRequests(p => p.map(r => r._id === id ? data : r));
      toast.success('Done!');
    } catch (e) { toast.error(e.message); }
  };

  const diffBadge = { BEGINNER: 'badge-green', INTERMEDIATE: 'badge-blue', ADVANCED: 'badge-orange', EXPERT: 'badge-red' };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '32px 16px 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, color: '#0f172a' }}>Find a Trek Partner</h1>
            <p style={{ margin: 0, fontSize: 14, color: '#94a3b8' }}>Connect with other trekkers looking for companions</p>
          </div>
          <button onClick={() => user ? setModalOpen(true) : toast.error('Please log in first')} className="btn btn-green">
            + Post a Group Trek
          </button>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 32 }}>
          {[
            { label: 'Open Requests', value: requests.length, color: '#16a34a' },
            { label: 'Total Spots Needed', value: requests.reduce((a, r) => a + (r.partnersNeeded || 0), 0), color: '#2563eb' },
            { label: 'Filled Spots', value: requests.reduce((a, r) => a + (r.joinedPartners?.length || 0), 0), color: '#d97706' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Cards */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 280, borderRadius: 20 }} />)}
          </div>
        ) : requests.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <p style={{ fontSize: 36, margin: '0 0 12px' }}>🧗</p>
            <h3 style={{ margin: '0 0 8px', color: '#0f172a', fontWeight: 700 }}>No open requests</h3>
            <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>Be the first to post a group trek!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {requests.map(req => {
              const joined = (req.joinedPartners || []).some(p => (p._id || p)?.toString() === user?._id?.toString());
              const full = req.joinedPartners?.length >= req.partnersNeeded;

              return (
                <div key={req._id} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <button onClick={() => setProfileId(req.user?._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#16a34a', fontSize: 16, flexShrink: 0 }}>
                        {req.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{req.user?.name}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                        <span className={`badge ${diffBadge[req.experienceLevel] || 'badge-green'}`}>{req.experienceLevel}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#374151' }}>
                      <MapPin size={15} color="#16a34a" style={{ flexShrink: 0 }} />
                      <span style={{ fontWeight: 600 }}>{req.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b' }}>
                      <Calendar size={15} color="#94a3b8" style={{ flexShrink: 0 }} />
                      {new Date(req.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                  </div>

                  <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748b', lineHeight: 1.6, flex: 1 }}>
                    {req.description?.slice(0, 120)}{req.description?.length > 120 ? '…' : ''}
                  </p>

                  {/* Spots visual */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Spots filled</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: full ? '#dc2626' : '#16a34a' }}>
                        {req.joinedPartners?.length || 0} / {req.partnersNeeded}
                      </span>
                    </div>
                    <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(100, ((req.joinedPartners?.length || 0) / req.partnersNeeded) * 100)}%`, background: full ? '#dc2626' : '#16a34a', borderRadius: 3, transition: 'width 0.3s' }} />
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoin(req._id)}
                    disabled={full && !joined}
                    className={`btn ${joined ? 'btn-outline' : full ? 'btn-ghost' : 'btn-green'}`}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {joined ? '✓ Leave Trek' : full ? 'Fully Booked' : 'Join Trek'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Post modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="card scale-in" style={{ width: '100%', maxWidth: 480, padding: 32, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Post a Group Trek</h2>
                <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>Find companions for your next adventure</p>
              </div>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', borderRadius: 8, padding: 6, display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Location *</label>
                <input className="input" required placeholder="e.g. Everest Base Camp" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Date *</label>
                  <input className="input" type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Partners needed</label>
                  <input className="input" type="number" min="1" max="20" value={form.partnersNeeded} onChange={e => setForm({ ...form, partnersNeeded: parseInt(e.target.value) })} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Experience level</label>
                <select className="input" value={form.experienceLevel} onChange={e => setForm({ ...form, experienceLevel: e.target.value })}>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Description *</label>
                <textarea className="input" required placeholder="Tell potential partners about the trek, what to bring, difficulty, etc." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <button type="submit" className="btn btn-green btn-lg btn-full" style={{ marginTop: 4 }}>Post Request</button>
            </form>
          </div>
        </div>
      )}

      <UserProfileModal userId={profileId} isOpen={!!profileId} onClose={() => setProfileId(null)} />
    </div>
  );
}
