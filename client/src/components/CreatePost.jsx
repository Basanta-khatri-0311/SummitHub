import React, { useState } from 'react';
import { X, Image as Img, Navigation, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function CreatePost({ isOpen, onClose, onPostCreated }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ content: '', location: '', difficulty: 'MODERATE' });
  const [image, setImage] = useState(null);
  const [gpxFile, setGpxFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please log in first');
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('content', form.content);
      fd.append('location', form.location);
      fd.append('difficulty', form.difficulty);
      if (image) fd.append('image', image);
      if (gpxFile) fd.append('gpx', gpxFile);

      const res = await fetch('http://localhost:5500/api/posts', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      onPostCreated(data);
      setForm({ content: '', location: '', difficulty: 'MODERATE' });
      setImage(null); setGpxFile(null);
      onClose();
      toast.success('Trek shared! 🏔️');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="card scale-in" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 520, padding: 32, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Share Your Trek 🏔️</h2>
            <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>Let the community know about your adventure</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', borderRadius: 8, padding: 6, display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Location *</label>
              <input className="input" required placeholder="e.g. Annapurna" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Difficulty</label>
              <select className="input" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                <option value="EASY">Easy</option>
                <option value="MODERATE">Moderate</option>
                <option value="HARD">Hard</option>
                <option value="EXTREME">Extreme</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Your story *</label>
            <textarea className="input" required rows={4} placeholder="Tell us about the trek — the views, the challenges, your highlights…" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
          </div>

          {/* Upload area */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={{ cursor: 'pointer' }}>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setImage(e.target.files[0])} />
              <div style={{
                border: `2px dashed ${image ? '#16a34a' : '#e2e8f0'}`,
                borderRadius: 12, padding: '16px 12px', textAlign: 'center',
                background: image ? '#f0fdf4' : '#fafafa', cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                <Img size={22} color={image ? '#16a34a' : '#94a3b8'} style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: 12, fontWeight: 600, color: image ? '#16a34a' : '#94a3b8' }}>
                  {image ? image.name.slice(0, 18) + (image.name.length > 18 ? '…' : '') : 'Add photo'}
                </div>
              </div>
            </label>

            <label style={{ cursor: 'pointer' }}>
              <input type="file" accept=".gpx" style={{ display: 'none' }} onChange={e => setGpxFile(e.target.files[0])} />
              <div style={{
                border: `2px dashed ${gpxFile ? '#8b5cf6' : '#e2e8f0'}`,
                borderRadius: 12, padding: '16px 12px', textAlign: 'center',
                background: gpxFile ? '#f5f3ff' : '#fafafa', cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                <Navigation size={22} color={gpxFile ? '#8b5cf6' : '#94a3b8'} style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: 12, fontWeight: 600, color: gpxFile ? '#8b5cf6' : '#94a3b8' }}>
                  {gpxFile ? gpxFile.name.slice(0, 18) + '…' : 'GPX track file'}
                </div>
              </div>
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn btn-green btn-lg btn-full" style={{ marginTop: 4 }}>
            {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Sharing…</> : 'Share Trek'}
          </button>
        </form>
      </div>
    </div>
  );
}
