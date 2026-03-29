import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2, Mountain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5500/api/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login(data);
      onClose();
      toast.success(isLogin ? 'Welcome back!' : 'Account created!');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="card scale-in" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 400, padding: 36 }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', borderRadius: 8, padding: 6, display: 'flex' }}>
          <X size={20} />
        </button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, background: '#f0fdf4', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', border: '1px solid #dcfce7' }}>
            <Mountain size={26} color="#16a34a" />
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>
            {isLogin ? 'Welcome back' : 'Join SummitHub'}
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>
            {isLogin ? 'Log in to your account' : 'Create your free account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Full name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="input" required placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ paddingLeft: 40 }} />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input className="input" type="email" required placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ paddingLeft: 40 }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input className="input" type="password" required placeholder="Enter password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingLeft: 40 }} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-green btn-lg btn-full" style={{ marginTop: 8 }}>
            {loading
              ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Loading…</>
              : isLogin ? 'Log In' : 'Create Account'
            }
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#64748b' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#16a34a', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
            {isLogin ? 'Sign up free' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
