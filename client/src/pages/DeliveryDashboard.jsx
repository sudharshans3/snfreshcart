import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Truck, ClipboardList, MapPin, Phone, User, Calendar, 
  IndianRupee, Search, Filter, RefreshCw, CheckCircle2, 
  AlertCircle, ChevronRight, Package, ShieldCheck, Scale
} from 'lucide-react';

const DeliveryDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);



  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load active orders. Please check your credentials or connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      // Refresh local list
      await fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  // KPIs
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.orderStatus !== 'Delivered').length;
  const completedOrders = orders.filter(o => o.orderStatus === 'Delivered').length;

  // Filter & Search logic
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    
    const customerName = order.user?.name || '';
    const orderId = order._id || '';
    const trackingNo = order.trackingNumber || '';
    const matchesSearch = 
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trackingNo.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50';
      case 'Packed':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50';
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400 border border-green-200 dark:border-green-900/50';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-850 dark:text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
              <Truck size={32} />
            </div>
            <div>
              <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider text-xs block mb-0.5">Delivery Agent Portal</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                Hi, {user?.name || 'Delivery Partner'}
              </h1>
              <p className="text-xs text-slate-400">View customer shipments and update transit states in real-time.</p>
            </div>
          </div>
          
          <button
            onClick={fetchOrders}
            className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
            title="Refresh Orders"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* KPI 1 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <ClipboardList size={22} />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Assigned Shipments</span>
              <strong className="text-2xl font-black text-slate-900 dark:text-white">{totalOrders}</strong>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-xl">
              <Package size={22} />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Pending Transit</span>
              <strong className="text-2xl font-black text-slate-900 dark:text-white">{pendingOrders}</strong>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-xl">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Delivered Orders</span>
              <strong className="text-2xl font-black text-slate-900 dark:text-white">{completedOrders}</strong>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search by ID, Customer Name, or Tracking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
            <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
          </div>

          {/* Filter Status */}
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-slate-455" />
            <span className="text-xs font-semibold text-slate-400 uppercase">Status:</span>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
              {['All', 'Order Placed', 'Packed', 'Shipped', 'Delivered'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    statusFilter === status 
                      ? 'bg-blue-650 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {status === 'Order Placed' ? 'Placed' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 text-red-750 p-4 rounded-xl border border-red-200 dark:border-red-900/40 flex items-center space-x-2">
            <AlertCircle size={20} className="flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-xs text-slate-455">Fetching active shipment data from node server...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 text-center py-16 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <ClipboardList size={48} className="mx-auto text-slate-350" />
            <h3 className="text-base font-bold text-slate-950 dark:text-white">No Assigned Orders Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn't find any orders matching status <strong>"{statusFilter}"</strong> or your current search criteria.
            </p>
          </div>
        ) : (
          /* Orders Container */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredOrders.map(order => {
              const fullAddress = order.shippingAddress 
                ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zip}`
                : '';

              return (
                <div 
                  key={order._id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-slate-100 dark:border-slate-850 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-t-2xl">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Order ID</span>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                          #{order._id}
                        </span>
                      </div>
                      <span className="block text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar size={12} />
                        Ordered: {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/40 px-2 py-0.5 rounded flex items-center gap-1">
                        <Scale size={11} />
                        {(order.totalWeight || order.orderItems?.reduce((a, b) => a + b.qty, 0))?.toLocaleString()} kg ({order.distanceKm ? `~${order.distanceKm} km` : 'Freight'})
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-grow space-y-6">
                    {/* Customer Profile Info */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recipient Details</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center space-x-2">
                          <User size={16} className="text-slate-400 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300 font-medium">
                            {order.user?.name || 'Guest Customer'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Phone size={16} className="text-slate-400 flex-shrink-0" />
                          <a 
                            href={`tel:${order.shippingAddress?.phone || ''}`}
                            className="text-blue-650 hover:underline font-semibold"
                          >
                            {order.shippingAddress?.phone || 'No phone'}
                          </a>
                        </div>
                      </div>

                      {/* Map/Address Location */}
                      <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl flex items-start space-x-3 text-xs border border-slate-100 dark:border-slate-800">
                        <MapPin size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-grow space-y-2">
                          <p className="text-slate-600 dark:text-slate-350 leading-relaxed">
                            {fullAddress}
                          </p>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-bold text-[11px] space-x-1"
                          >
                            <span>Open Route in Google Maps</span>
                            <ChevronRight size={12} />
                          </a>
                        </div>
                      </div>


                    </div>

                    {/* Order Items Purchased */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Package Inventory</h4>
                      <div className="divide-y divide-slate-100 dark:divide-slate-850 max-h-40 overflow-y-auto pr-1">
                        {order.orderItems?.map((item) => (
                          <div key={item._id || item.product} className="py-2 flex justify-between text-xs">
                            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                              <Package size={14} className="text-slate-400" />
                              {item.name} <strong className="text-slate-700 dark:text-slate-300">x{item.qty} kg</strong>
                            </span>
                            <span className="text-slate-550 dark:text-slate-400">
                              ₹{item.price.toFixed(2)}/kg
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-5 border-t border-slate-100 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-900/30 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Amount Info */}
                    <div className="text-left w-full sm:w-auto">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">COD / Cash On Delivery</span>
                      <div className="flex items-baseline gap-2">
                        <strong className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-0.5">
                          <IndianRupee size={16} />
                          {order.totalAmount.toFixed(2)}
                        </strong>
                        <span className="text-[10px] text-slate-400 font-medium">
                          (Freight: ₹{(order.deliveryCharge || 0).toFixed(2)} • ₹{(((order.deliveryCharge || 0) / (order.totalWeight || order.orderItems?.reduce((a, b) => a + b.qty, 0) || 2000))).toFixed(2)}/kg)
                        </span>
                      </div>
                    </div>

                    {/* Status Update Controls */}
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                      {order.orderStatus === 'Order Placed' && (
                        <button
                          disabled={updatingId === order._id}
                          onClick={() => handleStatusUpdate(order._id, 'Packed')}
                          className="px-4 py-2 text-xs font-extrabold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-md flex items-center space-x-1"
                        >
                          <span>Mark Packed</span>
                        </button>
                      )}
                      
                      {order.orderStatus === 'Packed' && (
                        <button
                          disabled={updatingId === order._id}
                          onClick={() => handleStatusUpdate(order._id, 'Shipped')}
                          className="px-4 py-2 text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-750 rounded-xl transition-all shadow-md flex items-center space-x-1"
                        >
                          <span>Ship Package</span>
                        </button>
                      )}

                      {order.orderStatus === 'Shipped' && (
                        <button
                          disabled={updatingId === order._id}
                          onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                          className="px-4 py-2 text-xs font-extrabold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-md flex items-center space-x-1 animate-pulse hover:animate-none"
                        >
                          <span>Confirm Delivery</span>
                        </button>
                      )}

                      {order.orderStatus === 'Delivered' && (
                        <span className="inline-flex items-center space-x-1 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-xl border border-green-200 dark:border-green-900/30">
                          <ShieldCheck size={14} className="text-green-500" />
                          <span>Delivered successfully</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
