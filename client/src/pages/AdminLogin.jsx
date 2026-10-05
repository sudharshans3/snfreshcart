import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ShieldAlert, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const { login, logout, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // If already logged in as admin, redirect to admin panel
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const loggedUser = await login(email, password);
      
      if (loggedUser.role !== 'admin') {
        // Force logout to clear client storage
        logout();
        setError('Access Denied: This account does not have administrator privileges.');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-slate-950 p-8 sm:p-10 rounded-2xl shadow-2xl border border-amber-900/30">
        
        {/* Title */}
        <div className="text-center">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={24} />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            SN FreshCart
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-white">
            Administrative Portal
          </h2>
          <p className="mt-1.5 text-sm text-slate-400">
            Secure administrative logging and control panel access.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-950/20 text-red-400 p-3 rounded-xl border border-red-900/50 flex items-center space-x-2 text-xs">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Email input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 block">Admin Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@onionmart.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                />
                <Mail className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 block">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                />
                <Lock className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
              </div>
            </div>

          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <ShieldAlert size={18} />
                  <span>Authenticate Admin</span>
                </>
              )}
            </button>
          </div>
        </form>



      </div>
    </div>
  );
};

export default AdminLogin;
