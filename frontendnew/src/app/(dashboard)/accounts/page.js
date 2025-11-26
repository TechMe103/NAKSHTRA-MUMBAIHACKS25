'use client';

import { useState, useEffect } from 'react';
// Using generic <a> tag for compilation safety
const Link = ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>; 

import { 
  User, 
  Mail, 
  Key, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Save, 
  Pencil, 
  Zap
} from 'lucide-react';

// Initial state, pulling from local storage (set during login/signup)
const getInitialUser = () => {
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : { fullName: '', email: '' };
  }
  return { fullName: '', email: '' };
};

export default function AccountPage() {
  const initialUser = getInitialUser();
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [formData, setFormData] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordChangeMode, setPasswordChangeMode] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

  // --- API CALL HANDLERS (MOCK FOR NOW, REAL PUT REQUEST LOGIC) ---

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Filter out unchanged fields
    const updates = {};
    if (formData.fullName !== currentUser.fullName) updates.fullName = formData.fullName;
    // NOTE: Email update is often a complex backend process (verification)
    if (formData.email !== currentUser.email) updates.email = formData.email; 

    if (Object.keys(updates).length === 0) {
      setSuccess("No changes to save.");
      setIsEditing(false);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // NOTE: Assuming your backend has a PUT /api/auth/profile endpoint
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile.');
      }

      // Update local state and storage
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setSuccess("Profile updated successfully!");
      setIsEditing(false);

    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // NOTE: Assuming your backend has a PATCH /api/auth/password endpoint
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(passwordData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Password update failed.');
      }
      
      setSuccess("Password changed successfully!");
      setPasswordChangeMode(false);
      setPasswordData({ currentPassword: '', newPassword: '' });

    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };


  // --- UI RENDER ---

  return (
    <div className="space-y-10 relative z-10 w-full max-w-4xl mx-auto">
      
      <header className="mb-8 border-b border-slate-800/50 pb-4">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <User size={28} className="text-indigo-400" /> Account Settings
        </h1>
        <p className="text-slate-400 mt-1">Manage your profile information and security settings.</p>
      </header>

      {/* Global Notifications */}
      {success && (
        <div className="p-4 bg-green-900/30 border border-green-800 text-green-300 rounded-xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle size={20} />
          <p>{success}</p>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-800 text-red-300 rounded-xl flex items-center gap-3 animate-in fade-in">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* --- Profile Information Card --- */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <User size={20} className="text-indigo-400" /> Personal Details
          </h2>
          {!isEditing && (
            <button
              onClick={() => {
                setIsEditing(true);
                setFormData(currentUser); // Reset form data to current user state
                setSuccess(null);
                setError(null);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full text-slate-400 hover:text-white bg-slate-800 hover:bg-indigo-600 transition-all"
            >
              <Pencil size={16} /> Edit
            </button>
          )}
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={isEditing ? formData.fullName : currentUser.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              readOnly={!isEditing || loading}
              className={`w-full px-4 py-3 border rounded-xl text-white ${
                isEditing 
                  ? 'bg-slate-950/50 border-indigo-500/50 focus:ring-indigo-500' 
                  : 'bg-slate-800/50 border-slate-700 cursor-default'
              } transition-all`}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">Email Address</label>
            <div className="flex items-center">
              <input
                type="email"
                name="email"
                value={isEditing ? formData.email : currentUser.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                readOnly={!isEditing || loading}
                className={`w-full px-4 py-3 border rounded-xl text-white ${
                  isEditing 
                    ? 'bg-slate-950/50 border-indigo-500/50 focus:ring-indigo-500' 
                    : 'bg-slate-800/50 border-slate-700 cursor-default'
                } transition-all`}
                required
              />
              <span className="ml-3 text-xs text-indigo-400 flex items-center gap-1">
                 <Zap size={14} /> Verified
              </span>
            </div>
          </div>

          {/* Action Buttons (Visible only during editing) */}
          {isEditing && (
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition-all ${
                  loading ? 'bg-indigo-700 opacity-50' : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white`}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="px-5 py-2 text-sm font-semibold rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </section>

      {/* --- Password Management Card --- */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Key size={20} className="text-red-400" /> Security
          </h2>
          {!passwordChangeMode && (
             <button
                onClick={() => {
                   setPasswordChangeMode(true);
                   setSuccess(null);
                   setError(null);
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full text-slate-400 hover:text-white bg-slate-800 hover:bg-red-600 transition-all"
             >
               Change Password
             </button>
          )}
        </div>

        {passwordChangeMode && (
          <form onSubmit={handlePasswordChange} className="space-y-4 pt-2 animate-in fade-in">
             {/* Current Password */}
             <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">Current Password</label>
                <input
                   type="password"
                   name="currentPassword"
                   value={passwordData.currentPassword}
                   onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                   className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-red-500 transition-all"
                   required
                />
             </div>
             
             {/* New Password */}
             <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">New Password (Min 6 chars)</label>
                <input
                   type="password"
                   name="newPassword"
                   value={passwordData.newPassword}
                   onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                   className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-red-500 transition-all"
                   required
                />
             </div>

             <div className="flex gap-4 pt-2">
                <button
                   type="submit"
                   disabled={loading}
                   className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition-all ${
                      loading ? 'bg-red-700 opacity-50' : 'bg-red-600 hover:bg-red-700'
                   } text-white`}
                >
                   {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                   {loading ? 'Updating...' : 'Set New Password'}
                </button>
                <button
                   type="button"
                   onClick={() => setPasswordChangeMode(false)}
                   disabled={loading}
                   className="px-5 py-2 text-sm font-semibold rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                   Cancel
                </button>
             </div>
          </form>
        )}
      </section>

      {/* --- Data Management Card (Placeholder) --- */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Zap size={20} className="text-yellow-400" /> Data Management
          </h2>
          <p className="text-slate-400 text-sm">
            Here you can manage connections to external accounts or request a full data export.
          </p>
          <button className="px-5 py-2 text-sm font-semibold rounded-xl text-white bg-slate-700 hover:bg-yellow-600 transition-colors">
            Request Data Export
          </button>
      </section>

    </div>
  );
}