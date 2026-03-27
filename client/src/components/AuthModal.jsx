import React, { useState } from 'react';
import { X, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin ? { email: formData.email, password: formData.password } : formData;

      const res = await fetch(`http://localhost:5500${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Update global auth state
      login(data);

      toast.success(isLogin ? "Session established." : "Account provisioned.", {
        className: 'dark:bg-[#111] dark:text-white bg-white text-black border border-black dark:border-white rounded-none font-medium',
      });
      
      onClose();
    } catch (err) {
      toast.error(err.message, {
        className: 'dark:bg-[#111] dark:text-white bg-white text-black border border-red-500 rounded-none font-medium text-red-600',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Sharp Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-100/80 dark:bg-black/80 backdrop-blur-sm transition-colors"
        onClick={onClose}
      />
      
      {/* Minimalist Modal */}
      <div className="relative w-full max-w-sm bg-white dark:bg-[#0a0a0a] border-2 border-black dark:border-white overflow-hidden p-8 animate-in fade-in zoom-in-95 duration-200 transition-colors">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-black dark:text-white hover:rotate-90 transition-transform"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-10 mt-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-black dark:text-white transition-colors">
            {isLogin ? 'Sign In' : 'Register'}
          </h2>
          <div className="h-1 w-12 bg-black dark:bg-white mt-4 transition-colors"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400 mb-2">Name</label>
              <input 
                type="text"
                required
                className="w-full bg-transparent border-b-2 border-neutral-300 dark:border-neutral-800 px-0 py-2 text-black dark:text-white placeholder-neutral-300 dark:placeholder-neutral-700 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                placeholder="PROCEEDING NAME"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400 mb-2">Email</label>
            <input 
              type="email"
              required
              className="w-full bg-transparent border-b-2 border-neutral-300 dark:border-neutral-800 px-0 py-2 text-black dark:text-white placeholder-neutral-300 dark:placeholder-neutral-700 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              placeholder="IDENTITY@NODE.COM"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400 mb-2">Secret</label>
            <input 
              type="password"
              required
              className="w-full bg-transparent border-b-2 border-neutral-300 dark:border-neutral-800 px-0 py-2 text-black dark:text-white placeholder-neutral-300 dark:placeholder-neutral-700 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              placeholder="********"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black dark:bg-white text-white dark:text-black font-extrabold uppercase tracking-widest py-4 mt-8 flex justify-between items-center px-6 disabled:opacity-70 group hover:opacity-90 transition-opacity"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : (
              <>
                 <span>{isLogin ? 'Authenticate' : 'Initialize'}</span>
                 <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-900 text-xs font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400">
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            className="hover:text-black dark:hover:text-white flex items-center gap-2 transition-colors"
          >
            {isLogin ? 'CREATE NEW IDENTITY →' : 'HAVE IDENTITY? AUTHENTICATE →'}
          </button>
        </div>
      </div>
    </div>
  );
}
