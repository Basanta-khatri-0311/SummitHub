import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState([]); // array of user ID strings
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
    }
  }, []);

  // Fetch full profile whenever user changes (login/logout)
  useEffect(() => {
    if (user?.token) {
      fetchMyProfile(user.token);
    } else {
      setFollowing([]);
      setProfileData(null);
    }
  }, [user]);

  const fetchMyProfile = async (token) => {
    try {
      const res = await fetch('http://localhost:5500/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      setProfileData(data);
      // Extract IDs from populated objects or plain strings
      const ids = (data.following || []).map(f => (f._id || f).toString());
      setFollowing(ids);
    } catch (e) {}
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setFollowing([]);
    setProfileData(null);
    localStorage.removeItem('user');
  };

  // Global follow/unfollow — updates state immediately (optimistic UI)
  const toggleFollow = useCallback(async (targetUserId) => {
    if (!user) return toast.error('Please login to follow');
    const id = targetUserId.toString();

    // Optimistic update
    const wasFollowing = following.includes(id);
    setFollowing(prev =>
      wasFollowing ? prev.filter(f => f !== id) : [...prev, id]
    );

    try {
      const res = await fetch(`http://localhost:5500/api/auth/follow/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      // Sync with server truth
      setFollowing(data.following.map(f => f.toString()));
      toast.success(wasFollowing ? 'Unfollowed' : 'Following!');
    } catch (e) {
      // Revert optimistic update on error
      setFollowing(prev =>
        wasFollowing ? [...prev, id] : prev.filter(f => f !== id)
      );
      toast.error('Something went wrong');
    }
  }, [user, following]);

  const isFollowing = useCallback((targetUserId) => {
    return following.includes(targetUserId?.toString());
  }, [following]);

  return (
    <AuthContext.Provider value={{ user, login, logout, following, toggleFollow, isFollowing, profileData, refreshProfile: () => user?.token && fetchMyProfile(user.token) }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
