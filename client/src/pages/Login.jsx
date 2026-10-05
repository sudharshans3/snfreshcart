import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, logout, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // If already logged in, redirect accordingly
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'delivery') {
        navigate('/delivery');
      } else {
        navigate('/dashboard');
      }
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
      
      if (loggedUser.role === 'admin') {
        // Disallow admin login on the customer portal
        logout();
        setError('Administrator account detected. Please log in through the Dedicated Admin Portal.');
      } else if (loggedUser.role === 'delivery') {
        navigate('/delivery');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-850">
        
        {/* Title */}
        <div className="text-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-agricultural-700 to-onionorange-600 bg-clip-text text-transparent">
            SN FreshCart
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-1.5 text-sm text-slate-400">
            Sign in to check out current rates and place orders.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-405 p-3 rounded-xl border border-red-150 dark:border-red-900/50 flex items-center space-x-2 text-xs">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Email input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 block">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agricultural-600 dark:focus:ring-agricultural-500 text-slate-900 dark:text-white"
                />
                <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-500 block">Password</label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agricultural-600 dark:focus:ring-agricultural-500 text-slate-900 dark:text-white"
                />
                <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
              </div>
            </div>

          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-agricultural-750 hover:bg-agricultural-800 dark:bg-agricultural-600 dark:hover:bg-agricultural-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Log In</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Register redirection */}
        <div className="text-center pt-2 text-xs">
          <span className="text-slate-400">Don't have an account? </span>
          <Link to="/register" className="text-agricultural-750 dark:text-agricultural-400 font-bold hover:underline">
            Sign Up
          </Link>
        </div>

        <div className="text-center pt-1 text-[11px] flex justify-center space-x-4">
          <Link to="/admin-login" className="text-amber-600 hover:text-amber-750 font-medium hover:underline">
            Admin Portal
          </Link>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <Link to="/delivery-login" className="text-blue-600 hover:text-blue-500 font-medium hover:underline">
            Delivery Boy Portal
          </Link>
        </div>



      </div>
    </div>
  );
};

export default Login;
