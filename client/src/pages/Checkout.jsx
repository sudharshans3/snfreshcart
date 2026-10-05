import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { ShieldAlert, ArrowLeft, ChevronRight, MapPin, ShoppingBag } from 'lucide-react';

const Checkout = () => {
  const { cartItems, clearCart, totalWeight, itemsPrice, isMinOrderMet } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Prefill address using user data if available
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
      return;
    }
    if (cartItems.length === 0) {
      navigate('/products');
      return;
    }
    if (!isMinOrderMet) {
      navigate('/cart');
      return;
    }

    if (user.address) {
      setStreet(user.address.street || '');
      setCity(user.address.city || '');
      setState(user.address.state || '');
      setZip(user.address.zip || '');
    }
    if (user.phone) {
      setPhone(user.phone || '');
    }
  }, [user, cartItems, isMinOrderMet, navigate]);

  const handlePlaceOrderSubmit = async (e) => {
    e.preventDefault();
    if (!street || !city || !state || !zip || !phone) {
      setError('Please fill in all delivery address details');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      const orderItems = cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item.product,
      }));

      const shippingAddress = { street, city, state, zip, phone };

      // Post complete order payload with zero extra freight charges
      await api.post('/orders', {
        orderItems,
        shippingAddress,
        itemsPrice,
        deliveryCharge: 0,
        distanceKm: 0,
        totalWeight,
        totalAmount: itemsPrice,
      });

      clearCart();
      navigate('/dashboard?status=success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Link to="/cart" className="hover:text-slate-200 flex items-center space-x-1">
            <ArrowLeft size={12} />
            <span>Back to Cart</span>
          </Link>
          <ChevronRight size={12} />
          <span className="font-semibold text-slate-655 dark:text-slate-350">Checkout Delivery Details</span>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-405 p-4 rounded-xl border border-red-200 dark:border-red-900/50 flex items-center space-x-2 text-xs">
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Address form column */}
          <form onSubmit={handlePlaceOrderSubmit} className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <MapPin size={20} className="text-agricultural-600" />
                <span>Delivery Address</span>
              </h2>
              <span className="text-xs text-slate-400">Final Step</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 block">Delivery / Street Address *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street address, area, or landmark"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agricultural-600 dark:focus:ring-agricultural-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Salem, Bangalore, Chennai"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agricultural-600 dark:focus:ring-agricultural-500 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Tamil Nadu, Karnataka"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agricultural-600 dark:focus:ring-agricultural-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">PIN / Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="e.g. 636001"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agricultural-600 dark:focus:ring-agricultural-500 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agricultural-600 dark:focus:ring-agricultural-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold text-sm py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all bg-agricultural-750 hover:bg-agricultural-800 text-white shadow-agricultural-950/20 cursor-pointer disabled:opacity-50"
            >
              <ShoppingBag size={16} />
              <span>
                {loading
                  ? 'Submitting Order...'
                  : `Confirm Order (₹${itemsPrice.toFixed(2)})`
                }
              </span>
            </button>
          </form>

          {/* Checkout items & Summary */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basket summary */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Order Summary</h3>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-2.5 py-0.5 rounded-full font-bold">
                  {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-48 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.product} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-250 block">{item.name}</span>
                      <span className="text-slate-400 font-normal">{item.qty.toLocaleString()} kg @ ₹{item.price.toFixed(2)}/kg</span>
                    </div>
                    <strong className="text-slate-950 dark:text-white">₹{(item.qty * item.price).toFixed(2)}</strong>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Produce Weight</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {totalWeight.toLocaleString()} kg ({(totalWeight / 1000).toFixed(1)} MT)
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Produce Subtotal</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    ₹{itemsPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Included (₹0.00)
                  </span>
                </div>

                {/* Grand Total */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-end">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">Total Payable</span>
                  </div>
                  <strong className="text-2xl font-black text-onionorange-600 dark:text-onionorange-500">
                    ₹{itemsPrice.toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Directives Note */}
            <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-200 dark:border-slate-850 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed space-y-1.5">
              <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                <span>📦</span>
                <span>DISPATCH & DELIVERY</span>
              </p>
              <p>
                - Orders are sorted, packed, and dispatched directly from our warehouse facilities within 24 hours of confirmation.
              </p>
              <p>
                - Real-time order progress can be monitored in your customer dashboard after placing your order.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
