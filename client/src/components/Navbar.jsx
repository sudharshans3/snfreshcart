import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingCart, User, Menu, X, LogOut, ShieldAlert, Sun, Moon, Truck, Bell, CheckCheck, Trash2 } from 'lucide-react';
import api from '../utils/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'delivery')) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000); // Poll every 15s
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'delivery') {
        navigate('/delivery');
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.delete('/notifications/clear-all');
      setNotifications([]);
    } catch (err) {
      console.error('Error clearing all notifications:', err);
    }
  };

  const handleDeleteNotification = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-agricultural-700 via-slate-700 to-onionorange-600 dark:from-agricultural-500 dark:to-onionorange-500 bg-clip-text text-transparent">
                SN FreshCart
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-slate-600 hover:text-agricultural-700 dark:text-slate-300 dark:hover:text-agricultural-400 font-medium transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-slate-600 hover:text-agricultural-700 dark:text-slate-300 dark:hover:text-agricultural-400 font-medium transition-colors">
              Products
            </Link>
            <Link to="/contact" className="text-slate-600 hover:text-agricultural-700 dark:text-slate-300 dark:hover:text-agricultural-400 font-medium transition-colors">
              Contact
            </Link>

            {/* Admin Portal Info */}
            {user && user.role === 'admin' && (
              <div className="flex items-center space-x-2">
                <Link to="/admin" className="flex items-center space-x-1 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-500 font-semibold bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-900/50 transition-all">
                  <ShieldAlert size={16} />
                  <span>Admin Dashboard</span>
                </Link>
              </div>
            )}

            {/* Delivery Portal Info */}
            {user && user.role === 'delivery' && (
              <Link to="/delivery" className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 font-semibold bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/50 transition-all">
                <Truck size={16} />
                <span>Delivery Dashboard</span>
              </Link>
            )}

            {/* Customer Dashboard Info */}
            {user && user.role === 'customer' && (
              <Link to="/dashboard" className="text-slate-600 hover:text-agricultural-700 dark:text-slate-300 dark:hover:text-agricultural-400 font-medium transition-colors">
                My Orders
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:text-agricultural-700 dark:text-slate-400 dark:hover:text-agricultural-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notification Bell (Desktop) */}
            {user && (user.role === 'admin' || user.role === 'delivery') && (
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 text-slate-500 hover:text-agricultural-700 dark:text-slate-400 dark:hover:text-agricultural-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none flex items-center justify-center"
                  aria-label="View Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md pointer-events-none">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown menu */}
                {notifDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setNotifDropdownOpen(false)}
                    />
                    
                    <div className="absolute right-0 mt-2 w-84 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all">
                      <div className="p-3.5 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Bell size={16} className="text-agricultural-600 dark:text-agricultural-400" />
                            Notifications
                          </span>
                          {unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllAsRead}
                              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                              title="Mark all notifications as read"
                            >
                              <CheckCheck size={13} />
                              <span>Mark read</span>
                            </button>
                          )}
                          {notifications.length > 0 && (
                            <button
                              onClick={handleClearAll}
                              className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                              title="Delete all notifications"
                            >
                              <Trash2 size={12} />
                              <span>Clear all</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="divide-y divide-slate-100 dark:divide-slate-855 max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                            <Bell className="mx-auto mb-2 text-slate-300 dark:text-slate-700" size={24} />
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => {
                                handleMarkAsRead(notif._id);
                                setNotifDropdownOpen(false);
                              }}
                              className={`group p-3.5 flex items-start space-x-3 cursor-pointer transition-colors text-left relative ${
                                notif.isRead 
                                  ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40' 
                                  : 'bg-blue-50/40 dark:bg-blue-955/15 hover:bg-blue-50/70 dark:hover:bg-blue-955/25'
                              }`}
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                {notif.type === 'success' ? (
                                  <div className="p-1.5 bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-lg">
                                    <ShieldAlert size={14} />
                                  </div>
                                ) : (
                                  <div className="p-1.5 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                                    <Truck size={14} />
                                  </div>
                                )}
                              </div>
                              <div className="flex-grow space-y-0.5 pr-2 min-w-0">
                                <div className="flex items-center justify-between gap-1.5">
                                  <span className={`text-xs font-bold truncate ${notif.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                                    {notif.title}
                                  </span>
                                  <span className="text-[10px] text-slate-400 flex-shrink-0">
                                    {formatTimeAgo(notif.createdAt)}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">
                                  {notif.message}
                                </p>
                              </div>
                              <div className="flex flex-col items-end space-y-1.5 flex-shrink-0">
                                {!notif.isRead && (
                                  <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteNotification(notif._id, e)}
                                  className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                                  title="Dismiss notification"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Cart Icon (for customers or guests, skip for admin to keep it clean) */}
            {(!user || user.role === 'customer') && (
              <Link to="/cart" className="relative p-2 text-slate-500 hover:text-agricultural-700 dark:text-slate-400 dark:hover:text-agricultural-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-onionorange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Profile / Auth */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Hi, {user.name.split(' ')[0]}
                </span>
                {user.role === 'customer' && (
                  <Link to="/dashboard" className="p-2 text-slate-500 hover:text-agricultural-700 dark:text-slate-400 dark:hover:text-agricultural-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <User size={20} />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-agricultural-700 dark:hover:text-agricultural-400 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-agricultural-700 hover:bg-agricultural-800 dark:bg-agricultural-600 dark:hover:bg-agricultural-700 rounded-lg shadow-md transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Notification Bell */}
            {user && (user.role === 'admin' || user.role === 'delivery') && (
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none flex items-center justify-center"
                  aria-label="View Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md pointer-events-none">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown menu for mobile */}
                {notifDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setNotifDropdownOpen(false)}
                    />
                    
                    <div className="absolute right-0 mt-2 w-76 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all">
                      <div className="p-3 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                            <Bell size={14} className="text-agricultural-600 dark:text-agricultural-400" />
                            Notifications
                          </span>
                          {unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllAsRead}
                              className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                            >
                              <CheckCheck size={12} />
                              Mark read
                            </button>
                          )}
                          {notifications.length > 0 && (
                            <button
                              onClick={handleClearAll}
                              className="text-[10px] font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-0.5"
                            >
                              <Trash2 size={11} />
                              Clear
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="divide-y divide-slate-100 dark:divide-slate-855 max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-slate-400 dark:text-slate-500 text-xs">
                            No notifications
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => {
                                handleMarkAsRead(notif._id);
                                setNotifDropdownOpen(false);
                              }}
                              className={`p-3 flex items-start space-x-2 cursor-pointer transition-colors text-left relative ${
                                notif.isRead 
                                  ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40' 
                                  : 'bg-blue-50/40 dark:bg-blue-955/15 hover:bg-blue-50/70 dark:hover:bg-blue-955/25'
                              }`}
                            >
                              <div className="flex-grow space-y-1 pr-2 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate max-w-[130px]">
                                    {notif.title}
                                  </span>
                                  <span className="text-[9px] text-slate-400 flex-shrink-0">
                                    {formatTimeAgo(notif.createdAt)}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-2">
                                  {notif.message}
                                </p>
                              </div>
                              <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                                {!notif.isRead && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteNotification(notif._id, e)}
                                  className="text-slate-400 hover:text-red-500 p-0.5 rounded transition-colors"
                                  title="Dismiss notification"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {(!user || user.role === 'customer') && (
              <Link to="/cart" className="relative p-2 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-onionorange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-2 transition-all">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-agricultural-750 hover:bg-slate-50 dark:text-slate-200 dark:hover:text-agricultural-400 dark:hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-agricultural-750 hover:bg-slate-50 dark:text-slate-200 dark:hover:text-agricultural-400 dark:hover:bg-slate-800"
          >
            Products
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-agricultural-750 hover:bg-slate-50 dark:text-slate-200 dark:hover:text-agricultural-400 dark:hover:bg-slate-800"
          >
            Contact
          </Link>

          {user && user.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400"
            >
              Admin Dashboard
            </Link>
          )}

          {user && user.role === 'delivery' && (
            <Link
              to="/delivery"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400"
            >
              Delivery Dashboard
            </Link>
          )}

          {user && user.role === 'customer' && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              My Orders
            </Link>
          )}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 text-sm text-slate-500 dark:text-slate-400">
                  Signed in as: <strong className="text-slate-700 dark:text-slate-200">{user.name}</strong>
                </div>
                {user.role === 'customer' && (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Profile Settings
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2 border border-slate-300 dark:border-slate-700 text-sm font-medium rounded-lg text-slate-750 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-agricultural-700 hover:bg-agricultural-800 dark:bg-agricultural-600 dark:hover:bg-agricultural-750"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
