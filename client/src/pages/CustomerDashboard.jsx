import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import OrderStatusTracker from '../components/OrderStatusTracker';
import { User, ClipboardList, CheckCircle2, AlertCircle, RefreshCw, Eye, Edit, Truck, Scale, IndianRupee } from 'lucide-react';

const CustomerDashboard = () => {
  const { user, updateProfile } = useAuth();
  
  // Orders list
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Profile Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Load orders
  const fetchMyOrders = async () => {
    try {
      setLoadingOrders(true);
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
      if (data.length > 0) {
        setSelectedOrder(prev => {
          if (prev) {
            const updated = data.find(o => o._id === prev._id);
            return updated || data[0];
          }
          return data[0];
        });
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();

    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      if (user.address) {
        setStreet(user.address.street || '');
        setCity(user.address.city || '');
        setState(user.address.state || '');
        setZip(user.address.zip || '');
      }
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    setProfileLoading(true);

    try {
      await updateProfile({
        name,
        email,
        phone,
        address: { street, city, state, zip }
      });
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 4000);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Welcome Header */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-agricultural-700 dark:text-agricultural-450 font-bold uppercase tracking-wider text-xs block mb-1">Customer Portal</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
              Hello, {user?.name || 'Customer'}
            </h1>
            <p className="text-xs text-slate-400">Manage shipping addresses and track current shipments.</p>
          </div>
          <button
            onClick={fetchMyOrders}
            className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-500 hover:text-slate-700"
            title="Refresh order history"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Selected Order Tracking Stepper */}
        {selectedOrder && (
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 gap-2">
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">Active Shipment Tracking</span>
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                  Order ID: #{selectedOrder._id}
                </h2>
              </div>
              <div className="text-left sm:text-right">
                <span className="bg-agricultural-100 dark:bg-agricultural-950/40 text-agricultural-800 dark:text-agricultural-400 px-3 py-1 text-xs font-bold rounded-full">
                  Status: {selectedOrder.orderStatus}
                </span>
                <span className="block text-[11px] text-slate-400 mt-1">Tracking ID: {selectedOrder.trackingNumber || 'N/A'}</span>
              </div>
            </div>

            {/* Stepper component */}
            <OrderStatusTracker currentStatus={selectedOrder.orderStatus} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-2">
                <strong className="text-slate-800 dark:text-slate-200 block">Shipping Location</strong>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.zip}
                </p>
                <p className="text-slate-500 dark:text-slate-400">Phone: {selectedOrder.shippingAddress.phone}</p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-400">
                  <span>Dispatch Hub: Salem Central Hub, TN</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <strong className="text-slate-800 dark:text-slate-200 block">Manifest Items</strong>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    {(selectedOrder.totalWeight || selectedOrder.orderItems.reduce((acc, i) => acc + (Number(i.qty) || 0), 0)).toLocaleString()} kg Load
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-36 overflow-y-auto pr-1">
                  {selectedOrder.orderItems.map((item) => (
                    <div key={item.product} className="py-1.5 flex justify-between">
                      <span className="text-slate-500">{item.name} ({item.qty.toLocaleString()} kg)</span>
                      <strong className="text-slate-900 dark:text-white">₹{(item.qty * item.price).toFixed(2)}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-2">
                <strong className="text-slate-800 dark:text-slate-200 block">Commercial Freight & Total</strong>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-500">
                    <span>Produce Subtotal:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      ₹{(selectedOrder.itemsPrice || selectedOrder.orderItems.reduce((a, b) => a + b.qty * b.price, 0)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Highway Transit:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      ~{selectedOrder.distanceKm || 0} km
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Freight Charge:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ₹{(selectedOrder.deliveryCharge || 0).toFixed(2)} ({`₹${(((selectedOrder.deliveryCharge || 0) / (selectedOrder.totalWeight || selectedOrder.orderItems.reduce((a, b) => a + b.qty, 0) || 2000))).toFixed(2)}/kg`})
                    </span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 dark:text-white">Grand Total:</span>
                    <strong className="text-sm font-black text-onionorange-600 dark:text-onionorange-500">
                      ₹{selectedOrder.totalAmount.toFixed(2)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Grid: Profile Form and Orders List */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Profile Form (cols-2) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <User size={18} className="text-agricultural-600" />
              <span>Contact Profile</span>
            </h2>

            {profileSuccess && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 p-3 rounded-xl border border-emerald-150 dark:border-emerald-900/50 flex items-center space-x-2 text-xs">
                <CheckCircle2 size={16} />
                <span>{profileSuccess}</span>
              </div>
            )}
            {profileError && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 p-3 rounded-xl border border-red-150 dark:border-red-900/50 flex items-center space-x-2 text-xs">
                <AlertCircle size={16} />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agricultural-600 text-slate-900 dark:text-white"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">Email (Read Only)</label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full px-3.5 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">Phone Support</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agricultural-600 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Address details */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
                <h3 className="text-xs font-bold text-slate-950 dark:text-white uppercase tracking-wider">Default Delivery Address</h3>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">Street</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agricultural-600 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 block">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agricultural-600 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 block">ZIP</label>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agricultural-600 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agricultural-600 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="w-full bg-agricultural-700 hover:bg-agricultural-850 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
              >
                {profileLoading ? 'Updating profile...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          {/* Orders History List (cols-3) */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <ClipboardList size={18} className="text-agricultural-600" />
              <span>Purchase History</span>
            </h2>

            {loadingOrders ? (
              <p className="text-xs text-slate-400">Loading purchase archives...</p>
            ) : orders.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No orders logged under this profile yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-450 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-2">Order Date</th>
                      <th className="py-3 px-2">Total Amount</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {orders.map((o) => (
                      <tr key={o._id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/50 ${selectedOrder?._id === o._id ? 'bg-slate-50 dark:bg-slate-800' : ''}`}>
                        <td className="py-3.5 px-2 font-medium">
                          {new Date(o.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-3.5 px-2 font-bold text-slate-900 dark:text-slate-200">
                          <div>₹{o.totalAmount.toFixed(2)}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {(o.totalWeight || o.orderItems?.reduce((a, b) => a + b.qty, 0))?.toLocaleString()} kg • {o.distanceKm ? `~${o.distanceKm} km` : 'Freight'}
                          </div>
                        </td>
                        <td className="py-3.5 px-2">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            o.orderStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450'
                              : (o.orderStatus === 'Shipped' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400')
                          }`}>
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="text-agricultural-750 dark:text-agricultural-400 font-bold hover:underline inline-flex items-center space-x-1"
                          >
                            <Eye size={12} />
                            <span>Track</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default CustomerDashboard;
