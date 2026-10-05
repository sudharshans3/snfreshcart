import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import DeliveryLogin from './pages/DeliveryLogin';
import DeliveryDashboard from './pages/DeliveryDashboard';

// Protected Route Component for registered Customers
const CustomerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 text-xs text-slate-400">Loading details...</div>;
  if (!user || user.role !== 'customer') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Protected Route Component for Admins
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 text-xs text-slate-400">Loading details...</div>;
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

// Protected Route Component for Delivery Partners
const DeliveryRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 text-xs text-slate-400">Loading details...</div>;
  if (!user || user.role !== 'delivery') {
    return <Navigate to="/delivery-login" replace />;
  }
  return children;
};

// Protected Route general login check
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 text-xs text-slate-400">Loading details...</div>;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-250">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/delivery-login" element={<DeliveryLogin />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/cart" element={<Cart />} />

                  {/* Customer protected routes */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <CustomerRoute>
                        <CustomerDashboard />
                      </CustomerRoute>
                    }
                  />

                  {/* Admin protected routes */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />

                  {/* Delivery protected routes */}
                  <Route
                    path="/delivery"
                    element={
                      <DeliveryRoute>
                        <DeliveryDashboard />
                      </DeliveryRoute>
                    }
                  />

                  {/* Fallback redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
