import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Check,
  RefreshCw,
  IndianRupee,
  Activity,
  Truck,
  Database,
  Download,
  FileText,
  Calendar,
  Search,
  X
} from 'lucide-react';

// Register ChartJS elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const { user, updateProfile } = useAuth();
  
  // Dynamic Admin Theme Color selection state
  const [themeColor, setThemeColor] = useState(() => {
    return localStorage.getItem('adminTheme') || 'green';
  });

  const themes = {
    green: {
      name: 'Fresh Farm Green',
      bgClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      bgClass800: 'bg-emerald-700 hover:bg-emerald-800 text-white',
      bgClass850: 'bg-emerald-800 hover:bg-emerald-900 text-white',
      textClass: 'text-emerald-600 dark:text-emerald-450',
      activeTabClass: 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm',
      focusRingClass: 'focus:ring-emerald-500',
      focusRingClass2: 'focus:ring-2 focus:ring-emerald-600',
      progressClass: 'bg-emerald-600',
      chartBorder: '#10b981',
      chartBg: 'rgba(16, 185, 129, 0.1)',
      barBorder: '#10b981',
      barBg: 'rgba(16, 185, 129, 0.75)',
      indicator: 'bg-emerald-500',
      borderClass: 'border-emerald-600',
    },
    purple: {
      name: 'Royal Onion Purple',
      bgClass: 'bg-purple-600 hover:bg-purple-700 text-white',
      bgClass800: 'bg-purple-700 hover:bg-purple-800 text-white',
      bgClass850: 'bg-purple-800 hover:bg-purple-900 text-white',
      textClass: 'text-purple-600 dark:text-purple-450',
      activeTabClass: 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm',
      focusRingClass: 'focus:ring-purple-500',
      focusRingClass2: 'focus:ring-2 focus:ring-purple-600',
      progressClass: 'bg-purple-600',
      chartBorder: '#8b5cf6',
      chartBg: 'rgba(139, 92, 246, 0.1)',
      barBorder: '#8b5cf6',
      barBg: 'rgba(139, 92, 246, 0.75)',
      indicator: 'bg-purple-500',
      borderClass: 'border-purple-600',
    },
    orange: {
      name: 'Vibrant Orange',
      bgClass: 'bg-onionorange-600 hover:bg-onionorange-700 text-white',
      bgClass800: 'bg-onionorange-700 hover:bg-onionorange-800 text-white',
      bgClass850: 'bg-onionorange-800 hover:bg-onionorange-900/90 text-white',
      textClass: 'text-onionorange-600 dark:text-onionorange-455',
      activeTabClass: 'bg-white dark:bg-slate-900 text-onionorange-600 dark:text-onionorange-400 shadow-sm',
      focusRingClass: 'focus:ring-onionorange-500',
      focusRingClass2: 'focus:ring-2 focus:ring-onionorange-600',
      progressClass: 'bg-onionorange-600',
      chartBorder: '#ea580c',
      chartBg: 'rgba(234, 88, 12, 0.1)',
      barBorder: '#ea580c',
      barBg: 'rgba(234, 88, 12, 0.75)',
      indicator: 'bg-onionorange-500',
      borderClass: 'border-onionorange-600',
    },
    indigo: {
      name: 'Enterprise Indigo',
      bgClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      bgClass800: 'bg-indigo-700 hover:bg-indigo-800 text-white',
      bgClass850: 'bg-indigo-800 hover:bg-indigo-900 text-white',
      textClass: 'text-indigo-600 dark:text-indigo-400',
      activeTabClass: 'bg-white dark:bg-slate-900 text-indigo-650 dark:text-indigo-450 shadow-sm',
      focusRingClass: 'focus:ring-indigo-500',
      focusRingClass2: 'focus:ring-2 focus:ring-indigo-600',
      progressClass: 'bg-indigo-600',
      chartBorder: '#6366f1',
      chartBg: 'rgba(99, 102, 241, 0.1)',
      barBorder: '#6366f1',
      barBg: 'rgba(99, 102, 241, 0.75)',
      indicator: 'bg-indigo-500',
      borderClass: 'border-indigo-600',
    }
  };

  const currentTheme = themes[themeColor] || themes.green;

  const handleThemeChange = (newColor) => {
    setThemeColor(newColor);
    localStorage.setItem('adminTheme', newColor);
  };

  // Dashboard tabs: 'analytics' | 'products' | 'orders' | 'customers' | 'adminTeam' | 'settings'
  const [activeTab, setActiveTab] = useState('analytics');

  // States for Profile Settings
  const [settName, setSettName] = useState(user?.name || '');
  const [settEmail, setSettEmail] = useState(user?.email || '');
  const [settPhone, setSettPhone] = useState(user?.phone || '');
  const [settPassword, setSettPassword] = useState('');
  const [settConfirmPassword, setSettConfirmPassword] = useState('');
  const [settLoading, setSettLoading] = useState(false);
  const [settError, setSettError] = useState('');
  const [settSuccess, setSettSuccess] = useState('');
  
  // States for stats and graphs
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // States for products CRUD
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Add/Edit Product form state
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCat, setProdCat] = useState('Red Onion');
  const [prodImage, setProdImage] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');

  // Daily Price update state
  const [selectedPriceProduct, setSelectedPriceProduct] = useState(null);
  const [dailyPriceInput, setDailyPriceInput] = useState('');

  // Daily Stock update state
  const [selectedStockProduct, setSelectedStockProduct] = useState(null);
  const [dailyStockInput, setDailyStockInput] = useState('');

  // States for orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Date filter states for orders
  const [orderDatePreset, setOrderDatePreset] = useState('all');
  const [orderStartDate, setOrderStartDate] = useState('');
  const [orderEndDate, setOrderEndDate] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');

  // Edit Order modal state
  const [editingOrder, setEditingOrder] = useState(null);
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [editOrderStatus, setEditOrderStatus] = useState('Order Placed');
  const [editTrackingNumber, setEditTrackingNumber] = useState('');
  const [editStreet, setEditStreet] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editZip, setEditZip] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDeliveryCharge, setEditDeliveryCharge] = useState('');
  const [editTotalAmount, setEditTotalAmount] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  // States for customers
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  // States for admin team capacity management
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const { data } = await api.get('/orders/analytics/sales');
      setStats(data);
    } catch (err) {
      console.error('Failed to load sales analytics:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const { data } = await api.get('/users/customers');
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      setLoadingAdmins(true);
      const { data } = await api.get('/users/admins');
      setAdmins(data);
    } catch (err) {
      console.error('Failed to load admin team list:', err);
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchProducts();
    fetchOrders();
    fetchCustomers();
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (user) {
      setSettName(user.name || '');
      setSettEmail(user.email || '');
      setSettPhone(user.phone || '');
    }
  }, [user]);

  const applyDatePreset = (preset) => {
    setOrderDatePreset(preset);
    const now = new Date();
    const formatDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (preset === 'all') {
      setOrderStartDate('');
      setOrderEndDate('');
    } else if (preset === 'today') {
      const todayStr = formatDate(now);
      setOrderStartDate(todayStr);
      setOrderEndDate(todayStr);
    } else if (preset === 'yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const yestStr = formatDate(yesterday);
      setOrderStartDate(yestStr);
      setOrderEndDate(yestStr);
    } else if (preset === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      setOrderStartDate(formatDate(weekAgo));
      setOrderEndDate(formatDate(now));
    } else if (preset === 'month') {
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      setOrderStartDate(formatDate(firstOfMonth));
      setOrderEndDate(formatDate(now));
    }
  };

  const resetDateFilter = () => {
    setOrderDatePreset('all');
    setOrderStartDate('');
    setOrderEndDate('');
    setOrderSearchTerm('');
  };

  const filteredOrders = orders.filter((order) => {
    // Search query filter (customer name, email, city, order ID, tracking number)
    if (orderSearchTerm) {
      const term = orderSearchTerm.toLowerCase();
      const matchCustomer = order.user?.name?.toLowerCase().includes(term);
      const matchEmail = order.user?.email?.toLowerCase().includes(term);
      const matchCity = order.shippingAddress?.city?.toLowerCase().includes(term);
      const matchId = order._id?.toLowerCase().includes(term);
      const matchTracking = order.trackingNumber?.toLowerCase().includes(term);
      if (!matchCustomer && !matchEmail && !matchCity && !matchId && !matchTracking) {
        return false;
      }
    }

    // Date range filter
    if (!orderStartDate && !orderEndDate) return true;
    const orderDate = new Date(order.createdAt);
    if (orderStartDate) {
      const start = new Date(orderStartDate);
      start.setHours(0, 0, 0, 0);
      if (orderDate < start) return false;
    }
    if (orderEndDate) {
      const end = new Date(orderEndDate);
      end.setHours(23, 59, 59, 999);
      if (orderDate > end) return false;
    }
    return true;
  });

  const handleOpenEditOrder = (order) => {
    setEditingOrder(order);
    setEditOrderStatus(order.orderStatus || 'Order Placed');
    setEditTrackingNumber(order.trackingNumber || '');
    setEditStreet(order.shippingAddress?.street || '');
    setEditCity(order.shippingAddress?.city || '');
    setEditState(order.shippingAddress?.state || '');
    setEditZip(order.shippingAddress?.zip || '');
    setEditPhone(order.shippingAddress?.phone || '');
    setEditDeliveryCharge(order.deliveryCharge !== undefined ? order.deliveryCharge : 0);
    setEditTotalAmount(order.totalAmount !== undefined ? order.totalAmount : 0);
    setShowEditOrderModal(true);
  };

  const handleEditOrderSubmit = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;
    try {
      setEditSaving(true);
      await api.put(`/orders/${editingOrder._id}`, {
        orderStatus: editOrderStatus,
        trackingNumber: editTrackingNumber,
        shippingAddress: {
          street: editStreet,
          city: editCity,
          state: editState,
          zip: editZip,
          phone: editPhone,
        },
        deliveryCharge: Number(editDeliveryCharge),
        totalAmount: Number(editTotalAmount),
      });
      setShowEditOrderModal(false);
      setEditingOrder(null);
      await fetchOrders();
      await fetchStats();
    } catch (err) {
      alert('Failed to update order: ' + (err.response?.data?.message || err.message));
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmMessage = 'Are you sure you want to permanently delete this order? Reserved stock will be restored to inventory.';
    if (window.confirm(confirmMessage)) {
      try {
        await api.delete(`/orders/${orderId}`);
        await fetchOrders();
        await fetchStats();
      } catch (err) {
        alert('Failed to delete order: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const downloadExcelReport = () => {
    let csvContent = 'Date,Customer Email,Product Name,Category,Price/kg (INR),Quantity (kg),Total Amount (INR),Order Status\r\n';
    const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    sortedOrders.forEach(order => {
      const orderDate = new Date(order.createdAt).toLocaleDateString();
      const customerEmail = order.user?.email || 'N/A';
      const status = order.orderStatus;
      order.orderItems.forEach(item => {
        const row = [
          orderDate,
          `"${customerEmail.replace(/"/g, '""')}"`,
          `"${item.name.replace(/"/g, '""')}"`,
          `"${(item.product?.category || 'Onion').replace(/"/g, '""')}"`,
          item.price,
          item.qty,
          (item.price * item.qty).toFixed(2),
          status
        ].join(',');
        csvContent += row + '\r\n';
      });
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `fresh_onion_mart_sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDFReport = () => {
    const reportDate = new Date().toLocaleDateString();
    let totalRevenue = 0;
    let totalQty = 0;
    const dailyProductSummary = {};
    filteredOrders.forEach(order => {
      const dateStr = new Date(order.createdAt).toLocaleDateString();
      order.orderItems.forEach(item => {
        const itemTotal = item.price * item.qty;
        totalRevenue += itemTotal;
        totalQty += item.qty;
        const summaryKey = `${dateStr}_${item.name}`;
        if (!dailyProductSummary[summaryKey]) {
          dailyProductSummary[summaryKey] = {
            date: dateStr,
            product: item.name,
            price: item.price,
            qty: 0,
            total: 0
          };
        }
        dailyProductSummary[summaryKey].qty += item.qty;
        dailyProductSummary[summaryKey].total += itemTotal;
      });
    });
    const summaryRows = Object.values(dailyProductSummary).sort((a, b) => new Date(b.date) - new Date(a.date));
    const avgPrice = totalQty > 0 ? (totalRevenue / totalQty).toFixed(2) : '0.00';
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>SN FreshCart - Sales Report</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; margin: 40px; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .brand { font-size: 24px; font-weight: bold; color: #15803d; }
            .report-title { font-size: 18px; color: #475569; font-weight: 600; }
            .meta-info { text-align: right; font-size: 12px; color: #64748b; }
            .summary-cards { display: grid; grid-template-cols: repeat(2, 1fr); gap: 20px; margin-bottom: 35px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; text-align: center; }
            .card-title { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 5px; }
            .card-val { font-size: 20px; font-weight: 800; color: #0f172a; }
            h3 { font-size: 14px; text-transform: uppercase; color: #1e293b; border-left: 4px solid #16a34a; padding-left: 10px; margin-bottom: 15px; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px; }
            th { background-color: #f1f5f9; color: #475569; font-weight: 700; text-align: left; padding: 10px; border-bottom: 2px solid #cbd5e1; }
            td { padding: 10px; border-bottom: 1px solid #e2e8f0; color: #334155; }
            .right { text-align: right; }
            .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
            @media print {
              body { margin: 20px; }
              .card { background: #ffffff !important; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">SN FreshCart</div>
              <div class="report-title">Sales Price & Quantity Report</div>
            </div>
            <div class="meta-info">
              <div>Generated: ${reportDate}</div>
              <div>Scope: All System Orders</div>
            </div>
          </div>
          <div class="summary-cards">
            <div class="card">
              <div class="card-title">Total Revenue</div>
              <div class="card-val">₹${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div class="card">
              <div class="card-title">Total Quantity Sold</div>
              <div class="card-val">${totalQty.toLocaleString()} kg</div>
            </div>
          </div>

          <h3>Detailed Transaction Logs</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Onion Variety</th>
                <th class="right">Rate (₹/kg)</th>
                <th class="right">Quantity</th>
                <th class="right">Subtotal (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(order => 
                order.orderItems.map(item => `
                  <tr>
                    <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>${order.user?.name || 'Customer'}</td>
                    <td>${item.name}</td>
                    <td class="right">₹${item.price.toFixed(2)}</td>
                    <td class="right">${item.qty} kg</td>
                    <td class="right">₹${(item.price * item.qty).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                `).join('')
              ).join('')}
            </tbody>
          </table>
          <div class="footer">
            &copy; ${new Date().getFullYear()} SN FreshCart - Administrative Intelligence System. Confidential.
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSettError('');
    setSettSuccess('');

    if (settPassword && settPassword !== settConfirmPassword) {
      setSettError('Passwords do not match');
      return;
    }

    try {
      setSettLoading(true);
      const updateData = {
        name: settName,
        email: settEmail,
        phone: settPhone
      };
      if (settPassword) {
        updateData.password = settPassword;
      }
      await updateProfile(updateData);
      setSettSuccess('Admin credentials updated successfully!');
      setSettPassword('');
      setSettConfirmPassword('');
    } catch (err) {
      setSettError(err.response?.data?.message || err.message || 'Failed to update credentials');
    } finally {
      setSettLoading(false);
    }
  };

  const handleAddAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/register-admin', {
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        phone: adminPhone,
      });
      setAdminName('');
      setAdminEmail('');
      setAdminPassword('');
      setAdminPhone('');
      setShowAddAdminForm(false);
      fetchAdmins();
      fetchStats();
    } catch (err) {
      alert('Failed to register admin: ' + (err.response?.data?.message || err.message));
    }
  };

  // Product CRUD Handlers
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        name: prodName,
        description: prodDesc,
        category: prodCat,
        image: prodImage,
        pricePerKg: Number(prodPrice),
        stock: Number(prodStock),
      });
      resetProductForm();
      fetchProducts();
      fetchStats();
    } catch (err) {
      alert('Failed to add product: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${editingProduct._id}`, {
        name: prodName,
        description: prodDesc,
        category: prodCat,
        image: prodImage,
        pricePerKg: Number(prodPrice),
        stock: Number(prodStock),
      });
      resetProductForm();
      fetchProducts();
      fetchStats();
    } catch (err) {
      alert('Failed to edit product: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
        fetchStats();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleDailyPriceUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${selectedPriceProduct._id}/daily-price`, {
        price: Number(dailyPriceInput),
      });
      setSelectedPriceProduct(null);
      setDailyPriceInput('');
      fetchProducts();
      fetchStats();
    } catch (err) {
      alert('Failed to update daily price: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDailyStockUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${selectedStockProduct._id}/stock`, {
        stock: Number(dailyStockInput),
      });
      setSelectedStockProduct(null);
      setDailyStockInput('');
      fetchProducts();
      fetchStats();
    } catch (err) {
      alert('Failed to update product stock: ' + (err.response?.data?.message || err.message));
    }
  };

  const resetProductForm = () => {
    setProdName('');
    setProdDesc('');
    setProdCat('Red Onion');
    setProdImage('');
    setProdPrice('');
    setProdStock('');
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdDesc(product.description || '');
    setProdCat(product.category);
    setProdImage(product.image || '');
    setProdPrice(product.pricePerKg);
    setProdStock(product.stock);
    setShowAddForm(true);
  };

  // Order status changing dropdown
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      fetchOrders();
      fetchStats();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  // Prepare chart data objects safely
  const lineChartData = {
    labels: stats?.salesOverTime?.map((s) => s._id) || [],
    datasets: [
      {
        label: 'Daily Sales (₹)',
        data: stats?.salesOverTime?.map((s) => s.totalSales) || [],
        borderColor: currentTheme.chartBorder,
        backgroundColor: currentTheme.chartBg,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const doughnutChartData = {
    labels: stats?.categorySales?.map((c) => c._id) || [],
    datasets: [
      {
        label: 'Quantity Sold (kg)',
        data: stats?.categorySales?.map((c) => c.totalQty) || [],
        backgroundColor: ['#ea580c', '#eab308', '#22c55e', '#64748b'],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: products.map((p) => p.name) || [],
    datasets: [
      {
        label: 'Stock Availability (kg)',
        data: products.map((p) => p.stock) || [],
        backgroundColor: currentTheme.barBg,
        borderColor: currentTheme.barBorder,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title block */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider text-xs block mb-0.5">Admin Security Portal</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
              SN FreshCart Hub
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Theme Selector Widget */}
            <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-555 px-1 select-none">Theme</span>
              <button
                type="button"
                onClick={() => handleThemeChange('green')}
                className={`w-5 h-5 rounded-full bg-emerald-500 border-2 transition-all flex items-center justify-center ${
                  themeColor === 'green' ? 'border-slate-900 dark:border-white scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                }`}
                title="Fresh Farm Green"
              >
                {themeColor === 'green' && <Check size={10} className="text-white" />}
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('purple')}
                className={`w-5 h-5 rounded-full bg-purple-500 border-2 transition-all flex items-center justify-center ${
                  themeColor === 'purple' ? 'border-slate-900 dark:border-white scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                }`}
                title="Royal Onion Purple"
              >
                {themeColor === 'purple' && <Check size={10} className="text-white" />}
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('orange')}
                className={`w-5 h-5 rounded-full bg-orange-500 border-2 transition-all flex items-center justify-center ${
                  themeColor === 'orange' ? 'border-slate-900 dark:border-white scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                }`}
                title="Vibrant Sunset Orange"
              >
                {themeColor === 'orange' && <Check size={10} className="text-white" />}
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('indigo')}
                className={`w-5 h-5 rounded-full bg-indigo-500 border-2 transition-all flex items-center justify-center ${
                  themeColor === 'indigo' ? 'border-slate-900 dark:border-white scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                }`}
                title="Enterprise Indigo"
              >
                {themeColor === 'indigo' && <Check size={10} className="text-white" />}
              </button>
            </div>

            <button
              onClick={() => {
                fetchStats();
                fetchProducts();
                fetchOrders();
                fetchCustomers();
                fetchAdmins();
              }}
              className="p-2 border border-slate-250 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
              title="Sync dashboard logs"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Tab selection links */}
        <div className="flex overflow-x-auto space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'analytics'
                ? currentTheme.activeTabClass
                : 'text-slate-500 hover:text-slate-750 dark:text-slate-450 dark:hover:text-slate-200'
            }`}
          >
            Sales Analytics
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'products'
                ? currentTheme.activeTabClass
                : 'text-slate-500 hover:text-slate-750 dark:text-slate-450 dark:hover:text-slate-200'
            }`}
          >
            Inventory Stock
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? currentTheme.activeTabClass
                : 'text-slate-500 hover:text-slate-750 dark:text-slate-450 dark:hover:text-slate-200'
            }`}
          >
            Manage Orders
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'customers'
                ? currentTheme.activeTabClass
                : 'text-slate-500 hover:text-slate-750 dark:text-slate-450 dark:hover:text-slate-200'
            }`}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab('adminTeam')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'adminTeam'
                ? currentTheme.activeTabClass
                : 'text-slate-500 hover:text-slate-750 dark:text-slate-450 dark:hover:text-slate-200'
            }`}
          >
            Admin Team
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? currentTheme.activeTabClass
                : 'text-slate-500 hover:text-slate-750 dark:text-slate-450 dark:hover:text-slate-200'
            }`}
          >
            Profile Settings
          </button>
        </div>

        {/* Tab Content 1: Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* KPI 1 */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-slate-400 text-xs uppercase block font-semibold">Total Revenue</span>
                  <strong className="text-2xl font-black text-slate-900 dark:text-white">
                    ₹{stats?.totalRevenue ? stats.totalRevenue.toFixed(2) : '0.00'}
                  </strong>
                </div>
                <div className="p-3.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450 rounded-xl">
                  <IndianRupee size={22} />
                </div>
              </div>

              {/* KPI 2 */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-slate-400 text-xs uppercase block font-semibold">Total Orders</span>
                  <strong className="text-2xl font-black text-slate-900 dark:text-white">
                    {stats?.totalOrdersCount || '0'}
                  </strong>
                </div>
                <div className="p-3.5 bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 rounded-xl">
                  <ShoppingBag size={22} />
                </div>
              </div>

              {/* KPI 3 */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-slate-400 text-xs uppercase block font-semibold">Customer Accounts</span>
                  <strong className="text-2xl font-black text-slate-900 dark:text-white">
                    {customers.length || '0'}
                  </strong>
                </div>
                <div className="p-3.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 rounded-xl">
                  <Users size={22} />
                </div>
              </div>

              {/* KPI 4 */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-slate-400 text-xs uppercase block font-semibold">Low Stock Products</span>
                  <strong className="text-2xl font-black text-slate-900 dark:text-white">
                    {products.filter((p) => p.stock < 100).length}
                  </strong>
                </div>
                <div className="p-3.5 bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450 rounded-xl">
                  <AlertTriangle size={22} />
                </div>
              </div>
            </div>

            {/* Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Daily Sales Chart (2/3 width) */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-950 dark:text-white text-base">Sales Revenue Trend (₹)</h3>
                <div className="h-72">
                  {loadingStats ? <p className="text-xs text-slate-400">Loading chart...</p> : <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />}
                </div>
              </div>

              {/* Category Sales Chart (1/3 width) */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-950 dark:text-white text-base">Sales by Category (kg)</h3>
                <div className="h-72 flex items-center justify-center">
                  {loadingStats ? <p className="text-xs text-slate-400">Loading chart...</p> : <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false }} />}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Products/Inventory */}
        {activeTab === 'products' && (
          <div className="space-y-6">
                   <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">Inventory Stock</h2>
              <button
                onClick={() => { resetProductForm(); setShowAddForm(true); }}
                className={`${currentTheme.bgClass} font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm inline-flex items-center space-x-1`}
              >
                <Plus size={14} />
                <span>Add New Onion Variety</span>
              </button>
            </div>

            {/* Add / Edit Form Card */}
            {showAddForm && (
              <form onSubmit={editingProduct ? handleEditProductSubmit : handleAddProductSubmit} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
                <h3 className="text-base font-bold text-slate-950 dark:text-white">
                  {editingProduct ? 'Edit Product Variety' : 'Add New Product Variety'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 block">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      placeholder="e.g. Organic Fresh Potatoes"
                      className={`w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 ${currentTheme.focusRingClass} text-slate-950 dark:text-white`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 block">Category *</label>
                    <select
                      value={prodCat}
                      onChange={(e) => setProdCat(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-950 dark:text-white"
                    >
                      <option value="Red Onion">Red Onion</option>
                      <option value="White Onion">White Onion</option>
                      <option value="Small Onion (Shallots)">Small Onion (Shallots)</option>
                      <option value="Potato">Potato</option>
                      <option value="Garlic">Garlic</option>
                      <option value="Coconut">Coconut</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 block">Image URL</label>
                    <input
                      type="text"
                      value={prodImage}
                      onChange={(e) => setProdImage(e.target.value)}
                      placeholder="e.g. https://images.unsplash.com/..."
                      className={`w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 ${currentTheme.focusRingClass} text-slate-950 dark:text-white`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 block">Base Price per kg (INR) *</label>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      placeholder="e.g. 45"
                      className={`w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 ${currentTheme.focusRingClass} text-slate-950 dark:text-white`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 block">Initial Stock Availability (kg) *</label>
                    <input
                      type="number"
                      required
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value)}
                      placeholder="e.g. 1000"
                      className={`w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 ${currentTheme.focusRingClass} text-slate-950 dark:text-white`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">Description</label>
                  <textarea
                    rows="3"
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    placeholder="Provide sorting details, sizes, quality sorting grade details..."
                    className={`w-full p-3.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 ${currentTheme.focusRingClass} text-slate-950 dark:text-white`}
                  />
                </div>

                <div className="flex space-x-2 pt-2 justify-end">
                  <button
                    type="button"
                    onClick={resetProductForm}
                    className="px-4 py-2 border border-slate-250 dark:border-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`${currentTheme.bgClass850} font-bold text-xs px-5 py-2 rounded-xl transition-all`}
                  >
                    {editingProduct ? 'Save Variety Details' : 'Publish Product'}
                  </button>
                </div>
              </form>
            )}

            {/* Inventory Stock Levels graph and list */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Product list table */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-950 dark:text-white text-base">Active Varieties</h3>

                {loadingProducts ? (
                  <p className="text-xs text-slate-400">Loading catalog...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                          <th className="py-2.5 px-2">Name</th>
                          <th className="py-2.5 px-2">Price/kg</th>
                          <th className="py-2.5 px-2">Stock</th>
                          <th className="py-2.5 px-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {products.map((p) => (
                          <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                            <td className="py-3 px-2">
                              <span className="font-bold block text-slate-900 dark:text-slate-100">{p.name}</span>
                              <span className="text-[10px] text-slate-400 uppercase">{p.category}</span>
                            </td>
                            <td className="py-3 px-2 font-semibold">₹{p.pricePerKg.toFixed(2)}</td>
                            <td className={`py-3 px-2 font-bold ${p.stock < 100 ? 'text-red-500' : 'text-slate-800 dark:text-slate-300'}`}>
                              {p.stock} kg
                            </td>
                            <td className="py-3 px-2 text-right flex items-center justify-end space-x-2.5">
                              <button
                                onClick={() => { setSelectedPriceProduct(p); setDailyPriceInput(p.pricePerKg); }}
                                className="text-amber-600 hover:text-amber-700 font-bold hover:underline"
                                title="Update Daily Rate"
                              >
                                ₹ Price
                              </button>
                              <button
                                onClick={() => { setSelectedStockProduct(p); setDailyStockInput(p.stock); }}
                                className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
                                title="Update Stock Level"
                              >
                                Stock
                              </button>
                              <button
                                onClick={() => startEditProduct(p)}
                                className="text-blue-500 hover:text-blue-700"
                                title="Edit Product Info"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p._id)}
                                className="text-red-500 hover:text-red-700"
                                title="Remove Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Stock Bar Graph card */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 h-fit">
                <h3 className="font-bold text-slate-950 dark:text-white text-base flex items-center space-x-1">
                  <Database size={16} className="text-onionorange-600" />
                  <span>Produce Stock Levels (kg)</span>
                </h3>
                <div className="h-72">
                  <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab Content 3: Manage Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center space-x-2">
                  <Truck size={18} className={currentTheme.textClass} />
                  <span>Logistics & Order Management</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Manage customer orders, modify shipping & billing details, apply date filters, and export reports.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={downloadExcelReport}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition-all"
                  title="Export filtered orders as CSV"
                >
                  <Download size={14} />
                  <span>Download Excel (CSV)</span>
                </button>
                <button
                  onClick={downloadPDFReport}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition-all"
                  title="Export filtered orders as printable PDF report"
                >
                  <FileText size={14} />
                  <span>Download PDF Report</span>
                </button>
              </div>
            </div>

            {/* Date Filter & Search Controls */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Preset Date Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-450 flex items-center gap-1 mr-1">
                    <Calendar size={13} />
                    <span>Date Filter:</span>
                  </span>
                  {[
                    { id: 'all', label: 'All Time' },
                    { id: 'today', label: 'Today' },
                    { id: 'yesterday', label: 'Yesterday' },
                    { id: 'week', label: 'Last 7 Days' },
                    { id: 'month', label: 'This Month' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyDatePreset(preset.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        orderDatePreset === preset.id
                          ? currentTheme.activeTabClass + ' shadow-xs font-bold ring-1 ring-slate-200 dark:ring-slate-700'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Custom Date Range Pickers & Reset */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 font-medium">From:</span>
                    <input
                      type="date"
                      value={orderStartDate}
                      onChange={(e) => {
                        setOrderStartDate(e.target.value);
                        setOrderDatePreset('custom');
                      }}
                      className="bg-transparent border-0 text-slate-800 dark:text-slate-200 text-xs focus:outline-none cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 font-medium">To:</span>
                    <input
                      type="date"
                      value={orderEndDate}
                      onChange={(e) => {
                        setOrderEndDate(e.target.value);
                        setOrderDatePreset('custom');
                      }}
                      className="bg-transparent border-0 text-slate-800 dark:text-slate-200 text-xs focus:outline-none cursor-pointer"
                    />
                  </div>
                  {(orderStartDate || orderEndDate || orderDatePreset !== 'all' || orderSearchTerm) && (
                    <button
                      type="button"
                      onClick={resetDateFilter}
                      className="px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors flex items-center gap-1"
                      title="Reset all filters"
                    >
                      <X size={13} />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Search Bar + Filtered Stats Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-750">
                <div className="relative flex-grow max-w-sm">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search customer, city, or order ID..."
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>
                    Showing: <strong className="text-slate-900 dark:text-white">{filteredOrders.length}</strong> of {orders.length} orders
                  </span>
                  <span>•</span>
                  <span>
                    Revenue: <strong className="text-emerald-600 dark:text-emerald-400">₹{filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </span>
                </div>
              </div>
            </div>

            {loadingOrders ? (
              <p className="text-xs text-slate-400">Loading system orders...</p>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-3">
                <Calendar className="mx-auto opacity-40 text-slate-400" size={36} />
                <p className="font-semibold text-xs">No orders match the selected date filter or search keyword.</p>
                <button
                  type="button"
                  onClick={resetDateFilter}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-2">Customer & Destination</th>
                      <th className="py-3 px-2">Order Date</th>
                      <th className="py-3 px-2">Wholesale Weight</th>
                      <th className="py-3 px-2">Billing & Freight</th>
                      <th className="py-3 px-2">Order Status</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredOrders.map((o) => {
                      const totalQty = o.totalWeight || o.orderItems.reduce((acc, x) => acc + x.qty, 0);
                      return (
                        <tr key={o._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800 transition-colors">
                          <td className="py-4 px-2">
                            <span className="font-bold text-slate-900 dark:text-slate-100 block">{o.user?.name || 'Customer'}</span>
                            <span className="text-[10px] text-slate-400">{o.shippingAddress?.city || 'Unknown City'}, {o.shippingAddress?.state || ''}</span>
                            {o.trackingNumber && (
                              <span className="text-[10px] text-blue-500 font-mono block">Track: {o.trackingNumber}</span>
                            )}
                          </td>
                          <td className="py-4 px-2 text-slate-600 dark:text-slate-300">
                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                              {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="py-4 px-2 text-slate-700 dark:text-slate-300 font-semibold">
                            <div>{totalQty.toLocaleString()} kg</div>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
                              {(totalQty / 1000).toFixed(1)} MT Load
                            </span>
                          </td>
                          <td className="py-4 px-2 font-bold text-slate-900 dark:text-slate-200">
                            <div>₹{o.totalAmount.toFixed(2)}</div>
                            <div className="text-[10px] text-slate-400 font-normal">
                              Items: ₹{(o.itemsPrice || 0).toFixed(2)} | Freight: ₹{(o.deliveryCharge || 0).toFixed(2)} ({o.distanceKm || 0} km • ₹{(((o.deliveryCharge || 0) / (totalQty || 2000))).toFixed(2)}/kg)
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              o.orderStatus === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450'
                                : (o.orderStatus === 'Shipped' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400')
                            }`}>
                              {o.orderStatus}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <select
                                value={o.orderStatus}
                                onChange={(e) => handleOrderStatusChange(o._id, e.target.value)}
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 text-[11px] focus:outline-none"
                                title="Quick change order status"
                              >
                                <option value="Order Placed">Order Placed</option>
                                <option value="Packed">Packed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => handleOpenEditOrder(o)}
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30 transition-colors"
                                title="Edit order details"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteOrder(o._id)}
                                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
                                title="Delete order"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 4: Customers List */}
        {activeTab === 'customers' && (
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center space-x-2">
              <Users size={18} className={currentTheme.textClass} />
              <span>Registered Accounts</span>
            </h2>

            {loadingCustomers ? (
              <p className="text-xs text-slate-400">Loading user list...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-2">Name</th>
                      <th className="py-3 px-2">Email</th>
                      <th className="py-3 px-2">Phone</th>
                      <th className="py-3 px-2 text-right">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {customers.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800">
                        <td className="py-3.5 px-2 font-bold text-slate-900 dark:text-slate-100">{c.name}</td>
                        <td className="py-3.5 px-2 text-slate-500">{c.email}</td>
                        <td className="py-3.5 px-2 text-slate-500">{c.phone || 'N/A'}</td>
                        <td className="py-3.5 px-2 text-right text-slate-500 dark:text-slate-400">
                          {c.address?.city ? `${c.address.city}, ${c.address.state}` : 'Not Specified'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 5: Admin Team & Quota management */}
        {activeTab === 'adminTeam' && (
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center space-x-2">
                  <Activity size={18} className={currentTheme.textClass} />
                  <span>Admin Team Roster</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Capped at a maximum limit of 6 administrative members.</p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Quota Progress Bar indicator */}
                <div className="text-left w-36 sm:w-48 space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span>Admin Capacity</span>
                    <span className={admins.length >= 6 ? "text-red-500 font-bold" : (admins.length >= 5 ? "text-amber-500 font-bold" : `${currentTheme.textClass} font-bold`)}>
                      {admins.length} / 6
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        admins.length >= 6 ? "bg-red-500" : (admins.length >= 5 ? "bg-amber-500" : currentTheme.progressClass)
                      }`}
                      style={{ width: `${(admins.length / 6) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setShowAddAdminForm(true)}
                  disabled={admins.length >= 6}
                  className={`font-bold text-xs px-4 py-2.5 rounded-xl shadow-md inline-flex items-center space-x-1.5 transition-all ${
                    admins.length >= 6
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none"
                      : currentTheme.bgClass800
                  }`}
                >
                  <Plus size={14} />
                  <span>Add Admin</span>
                </button>
              </div>
            </div>

            {/* List of Admins */}
            {loadingAdmins ? (
              <p className="text-xs text-slate-400">Loading admin list...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-2.5 px-2">Name</th>
                      <th className="py-2.5 px-2">Email</th>
                      <th className="py-2.5 px-2">Phone</th>
                      <th className="py-2.5 px-2 text-right">Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {admins.map((a) => (
                      <tr key={a._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800">
                        <td className="py-3.5 px-2 font-bold text-slate-900 dark:text-slate-100">{a.name}</td>
                        <td className="py-3.5 px-2 text-slate-500">{a.email}</td>
                        <td className="py-3.5 px-2 text-slate-500">{a.phone || 'N/A'}</td>
                        <td className="py-3.5 px-2 text-right text-slate-400">
                          {new Date(a.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 6: Profile & Credentials Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-lg">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center space-x-2 mb-2">
              <AlertTriangle size={18} className="text-amber-500" />
              <span>Modify Admin Credentials</span>
            </h2>
            <p className="text-xs text-slate-400 mb-6">Modify your administrative access profile details, login email address (ID), and password.</p>

            {settError && (
              <div className="mb-4 bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-xs flex items-center space-x-2">
                <AlertTriangle size={16} />
                <span>{settError}</span>
              </div>
            )}

            {settSuccess && (
              <div className="mb-4 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400 p-3.5 rounded-xl text-xs flex items-center space-x-2">
                <Check size={16} className="text-emerald-500" />
                <span>{settSuccess}</span>
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 block">Name *</label>
                <input
                  type="text"
                  required
                  value={settName}
                  onChange={(e) => setSettName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 ${currentTheme.focusRingClass} text-slate-900 dark:text-white text-xs`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 block">Admin ID / Email Address *</label>
                <input
                  type="email"
                  required
                  value={settEmail}
                  onChange={(e) => setSettEmail(e.target.value)}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 ${currentTheme.focusRingClass} text-slate-900 dark:text-white text-xs`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 block">Support Phone *</label>
                <input
                  type="text"
                  required
                  value={settPhone}
                  onChange={(e) => setSettPhone(e.target.value)}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 ${currentTheme.focusRingClass} text-slate-900 dark:text-white text-xs`}
                />
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 my-6 pt-4 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350">Change Password (Leave blank to keep current)</h4>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">New Password</label>
                  <input
                    type="password"
                    value={settPassword}
                    onChange={(e) => setSettPassword(e.target.value)}
                    className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 ${currentTheme.focusRingClass} text-slate-900 dark:text-white text-xs`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">Confirm New Password</label>
                  <input
                    type="password"
                    value={settConfirmPassword}
                    onChange={(e) => setSettConfirmPassword(e.target.value)}
                    className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 ${currentTheme.focusRingClass} text-slate-900 dark:text-white text-xs`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={settLoading}
                className={`${currentTheme.bgClass850} font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2`}
              >
                {settLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <span>Save Profile Settings</span>
                )}
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Admin Registration Popup Dialog */}
      {showAddAdminForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddAdminSubmit} className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-950 dark:text-white">Register Admin Member</h3>
            
            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className={`w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 ${currentTheme.focusRingClass} text-slate-900 dark:text-white text-xs`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 block">Email Address *</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className={`w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 ${currentTheme.focusRingClass} text-slate-900 dark:text-white text-xs`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 block">Phone Support</label>
                <input
                  type="text"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className={`w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 ${currentTheme.focusRingClass} text-slate-900 dark:text-white text-xs`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 block">Secret Password * (Min 6 chars)</label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className={`w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 ${currentTheme.focusRingClass} text-slate-900 dark:text-white text-xs`}
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAddAdminForm(false)}
                className="px-4 py-2 border border-slate-250 dark:border-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${currentTheme.bgClass850} font-bold text-xs px-5 py-2 rounded-xl transition-all`}
              >
                Register Admin
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Daily Price Update Modal Dialog */}
      {selectedPriceProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleDailyPriceUpdate} className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-950 dark:text-white">Update Daily Rate</h3>
            
            <div className="text-xs text-slate-400">
              Adjust index rate for <strong className="text-slate-700 dark:text-slate-200">{selectedPriceProduct.name}</strong>. This logs a price check point in historical charts.
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 block">Rate per kg (INR) *</label>
              <input
                type="number"
                required
                value={dailyPriceInput}
                onChange={(e) => setDailyPriceInput(e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 ${currentTheme.focusRingClass} text-slate-950 dark:text-white text-sm`}
              />
            </div>

            <div className="flex space-x-2 pt-2 justify-end">
              <button
                type="button"
                onClick={() => { setSelectedPriceProduct(null); setDailyPriceInput(''); }}
                className="px-4 py-2 border border-slate-250 dark:border-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${currentTheme.bgClass850} font-bold text-xs px-5 py-2 rounded-xl transition-all`}
              >
                Apply New Rate
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Daily Stock Update Modal Dialog */}
      {selectedStockProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleDailyStockUpdate} className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-950 dark:text-white">Update Stock Quantity</h3>
            
            <div className="text-xs text-slate-400">
              Adjust stock levels for <strong className="text-slate-700 dark:text-slate-200">{selectedStockProduct.name}</strong>.
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 block">Stock Quantity (kg) *</label>
              <input
                type="number"
                required
                value={dailyStockInput}
                onChange={(e) => setDailyStockInput(e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 ${currentTheme.focusRingClass} text-slate-900 dark:text-white text-sm`}
              />
            </div>

            <div className="flex space-x-2 pt-2 justify-end">
              <button
                type="button"
                onClick={() => { setSelectedStockProduct(null); setDailyStockInput(''); }}
                className="px-4 py-2 border border-slate-250 dark:border-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${currentTheme.bgClass850} font-bold text-xs px-5 py-2 rounded-xl transition-all`}
              >
                Apply New Stock
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Order Modal Dialog */}
      {showEditOrderModal && editingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleEditOrderSubmit}
            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <Edit size={16} className="text-blue-600" />
                  <span>Edit Order #{editingOrder._id.slice(-6).toUpperCase()}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Customer: <strong className="text-slate-700 dark:text-slate-300">{editingOrder.user?.name || 'Customer'}</strong> ({editingOrder.user?.email || 'N/A'})
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowEditOrderModal(false);
                  setEditingOrder(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-1">
              {/* Status and Tracking */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block">Order Status *</label>
                  <select
                    value={editOrderStatus}
                    onChange={(e) => setEditOrderStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block">Tracking Number</label>
                  <input
                    type="text"
                    placeholder="e.g. TRK-892182"
                    value={editTrackingNumber}
                    onChange={(e) => setEditTrackingNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <span className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider text-[10px]">
                  Shipping Address
                </span>
                <div className="space-y-1">
                  <label className="text-slate-500 block">Street Address</label>
                  <input
                    type="text"
                    required
                    value={editStreet}
                    onChange={(e) => setEditStreet(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-500 block">City</label>
                    <input
                      type="text"
                      required
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block">State</label>
                    <input
                      type="text"
                      required
                      value={editState}
                      onChange={(e) => setEditState(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block">ZIP Code</label>
                    <input
                      type="text"
                      required
                      value={editZip}
                      onChange={(e) => setEditZip(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-500 block">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Billing Details */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <span className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider text-[10px]">
                  Billing & Freight Adjustments
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 block">Delivery Charge (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editDeliveryCharge}
                      onChange={(e) => setEditDeliveryCharge(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block">Total Order Amount (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editTotalAmount}
                      onChange={(e) => setEditTotalAmount(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowEditOrderModal(false);
                  setEditingOrder(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={editSaving}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
              >
                {editSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
