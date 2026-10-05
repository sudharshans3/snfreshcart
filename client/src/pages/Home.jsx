import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Truck,
  Sparkles,
  Search,
  AlertCircle
} from 'lucide-react';
import api from '../utils/api';
import heroImage from '../assets/hero.jpg';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch home products:', err);
      setError(err.response?.data?.message || 'Failed to retrieve live rates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getPriceTrend = (product) => {
    const history = product.dailyPriceHistory || [];
    if (history.length < 2) return { diff: '0.0', trend: 'neutral' };
    const latest = history[history.length - 1].price;
    const previous = history[history.length - 2].price;
    const diff = ((latest - previous) / previous) * 100;
    return {
      diff: Math.abs(diff).toFixed(1),
      trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral'
    };
  };

  // Group products dynamically by Category to count items
  const productsByCategory = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  // Pre-configured category data for premium grid visualization
  const categoryDetails = {
    'Red Onion': {
      title: 'Premium Red Onions',
      desc: 'Rich purple skin, sharp and robust flavor profile. Sourced directly from Nashik farms. Best for core cooking and salads.',
      image: '/red_onion.png',
      queryName: 'Red Onion'
    },
    'Small Onion (Shallots)': {
      title: 'Sambar Shallots (Small Onion)',
      desc: 'Highly concentrated sweet flavor bulbs. Essential for traditional South Indian Sambar, pickles, and exotic dressings.',
      image: '/small_onion.png',
      queryName: 'Small Onion (Shallots)'
    },
    'Potato': {
      title: 'Organic Potatoes',
      desc: 'Farm-fresh, premium-grade Russet and local potatoes. High starch quality, perfect for roasting, baking, or boiling.',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=600',
      queryName: 'Potato'
    },
    'Garlic': {
      title: 'Premium White Garlic',
      desc: 'Extremely aromatic and pungent whole garlic bulbs. Cleaned, sorted, and solar-dried for maximum storage shelf life.',
      image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=600',
      queryName: 'Garlic'
    },
   
  };

  const tickerItems = products.length > 0 ? products : [
    { name: 'Red Onion', pricePerKg: 45, dailyPriceHistory: [{ price: 43 }, { price: 45 }] },
    { name: 'Shallots', pricePerKg: 95, dailyPriceHistory: [{ price: 92 }, { price: 95 }] },
    { name: 'Potatoes', pricePerKg: 35, dailyPriceHistory: [{ price: 37 }, { price: 35 }] },
    { name: 'Garlic', pricePerKg: 130, dailyPriceHistory: [{ price: 120 }, { price: 130 }] },
    { name: 'Coconuts', pricePerKg: 60, dailyPriceHistory: [{ price: 60 }, { price: 60 }] }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-250">
      
      {/* Live Commodity Price Ticker */}
      <div className="bg-agricultural-950 text-white text-xs py-2 border-b border-agricultural-900 overflow-hidden relative z-20">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          <div className="bg-onionorange-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded mr-3 tracking-wider flex items-center space-x-1 animate-pulse">
            <Sparkles size={10} />
            <span>LIVE RATES</span>
          </div>
          <div className="flex-1 overflow-hidden relative w-full h-5">
            <div className="flex absolute space-x-12 whitespace-nowrap animate-marquee">
              {[...tickerItems, ...tickerItems].map((item, idx) => {
                const trendInfo = getPriceTrend(item);
                return (
                  <span key={idx} className="inline-flex items-center space-x-2 font-medium">
                    <span className="text-slate-350">{item.name}:</span>
                    <span className="font-extrabold">₹{item.pricePerKg.toFixed(2)}/kg</span>
                    {trendInfo.trend === 'up' && (
                      <span className="text-emerald-450 flex items-center text-[10px] font-bold">
                        <TrendingUp size={11} className="mr-0.5" /> +{trendInfo.diff}%
                      </span>
                    )}
                    {trendInfo.trend === 'down' && (
                      <span className="text-red-450 flex items-center text-[10px] font-bold">
                        <TrendingDown size={11} className="mr-0.5" /> -{trendInfo.diff}%
                      </span>
                    )}
                    {trendInfo.trend === 'neutral' && (
                      <span className="text-slate-400 text-[10px] font-bold">— 0%</span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-agricultural-900 via-slate-900 to-slate-950 text-white py-20 lg:py-28 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-onionorange-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-agricultural-600/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-agricultural-800/40 backdrop-blur-md border border-agricultural-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-agricultural-200">
              <Leaf size={14} className="animate-bounce text-emerald-450" />
              <span>Direct From Nashik & Coastal Fields</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Premium Sourced <br />
              <span className="bg-gradient-to-r from-onionorange-400 to-amber-300 bg-clip-text text-transparent">
                Agricultural Produce
              </span>{' '}
              Delivered.
            </h1>
            <p className="text-base text-slate-300 max-w-xl leading-relaxed">
              SN FreshCart delivers clean, sorted, and certified onions, garlic, potatoes, and fresh coconuts. Experience daily transparent prices, zero middlemen markup, and structured bulk delivery.
            </p>

            {/* Live Search Box */}
            <form onSubmit={handleSearchSubmit} className="flex items-center max-w-lg bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-700/50 shadow-2xl relative z-30">
              <div className="flex items-center flex-1 pl-3.5">
                <Search size={18} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search potato, garlic, onions..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-slate-800 dark:text-white px-3 text-sm placeholder-slate-450 focus:ring-0"
                />
              </div>
              <button
                type="submit"
                className="bg-agricultural-700 hover:bg-agricultural-600 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all"
              >
                Search Store
              </button>
            </form>
          </div>

          {/* Hero Image / Card */}
          <div className="lg:col-span-5 relative mx-auto max-w-md lg:max-w-none w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 hover:rotate-1 transition-transform duration-300">
              <img
                src={heroImage}
                alt="Fresh farm produce harvest"
                className="w-full h-72 sm:h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-5 left-5 right-5 glass p-4 rounded-xl border border-white/10 text-left">
                <span className="text-[10px] uppercase font-bold tracking-widest text-onionorange-400">Featured Crop</span>
                <h4 className="font-bold text-white text-sm mt-0.5">Premium Grading Process</h4>
                <p className="text-xs text-slate-200 mt-1">Our crops undergo multi-point sorting, cleaning and solar-drying, maximizing longevity and quality.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Category Showcase Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-agricultural-655 dark:text-agricultural-400">Our Catalog Selection</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Browse Agricultural Categories</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Select a category below to explore specific stock sizing, daily prices, and custom batch details.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 text-red-750 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-900/50 flex items-center space-x-2 max-w-xl mx-auto mb-8">
            <AlertCircle size={18} />
            <span className="text-xs font-semibold">{error}. Loading offline ticker rates.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.keys(categoryDetails).map((catKey) => {
            const detail = categoryDetails[catKey];
            const itemCount = productsByCategory[catKey]?.length || 0;
            return (
              <div
                key={catKey}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-850 overflow-hidden transition-all duration-300 flex flex-col group"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={detail.image}
                    alt={detail.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 bg-agricultural-750/90 backdrop-blur-xs text-white text-[10px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
                    {itemCount} {itemCount === 1 ? 'Product Listing' : 'Product Listings'}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2 text-left">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-agricultural-700 dark:group-hover:text-agricultural-400 transition-colors">
                      {detail.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {detail.desc}
                    </p>
                  </div>

                  <Link
                    to={`/products?category=${encodeURIComponent(detail.queryName)}`}
                    className="inline-flex items-center justify-between text-xs font-bold text-onionorange-600 dark:text-onionorange-500 group-hover:underline pt-2 border-t border-slate-100 dark:border-slate-800"
                  >
                    <span>View Category Inventory</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* KPI Grid Section */}
      <section className="py-16 bg-white dark:bg-slate-900 transition-colors border-t border-b border-slate-100 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Why Buy From SN FreshCart?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              We streamline wholesale and retail agricultural trade, keeping prices fair and vegetables fresh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-850 p-8 rounded-2xl space-y-4 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-agricultural-100 text-agricultural-750 dark:bg-emerald-950/30 dark:text-agricultural-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Strict Quality Sorting</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Every batch of red, white, and small onions is inspected, sorted, dried, and packaged to ensure no rot and high longevity.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-850 p-8 rounded-2xl space-y-4 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-onionorange-100 text-onionorange-700 dark:bg-onionorange-950/30 dark:text-onionorange-450 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daily Transparent Pricing</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Wholesale prices fluctuate depending on market demand. We publish daily prices directly synced with agricultural market yards.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-850 p-8 rounded-2xl space-y-4 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-450 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Truck size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reliable Bulk Delivery</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Distance-tiered bulk dispatch (2 MT &lt;100km, 5 MT 100–150km, 10 MT 150+km) with transparent ₹22/km + weight freight from Salem Central Hub.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale Fleet Logistics & Direct Dispatch Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 transition-colors border-b border-slate-100 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-agricultural-700 dark:text-agricultural-400 bg-agricultural-100 dark:bg-agricultural-950/50 px-3 py-1 rounded-full inline-block">
              Salem Dispatch Network
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Automated Wholesale Freight & Delivery
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              All consignments are dispatched directly from our Salem Central Hub, Tamil Nadu. Shipping distance (km) and delivery fees are automatically computed at checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-250 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center font-black">
                &lt;100 km
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Local Hub Dispatch</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Min. batch load: <strong>2,000 kg (2 MT)</strong>. Direct transit to Salem, Namakkal, Erode, Dharmapuri, and adjacent mandis within 24 hours.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-250 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-black">
                100-150 km
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Regional Transit</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Min. batch load: <strong>5,000 kg (5 MT)</strong>. Commercial carriers dedicated for Tiruppur, Trichy, Karur, and Coimbatore wholesale hubs.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-250 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center font-black">
                150+ km
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Interstate Long-Haul</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Min. batch load: <strong>10,000 kg (10 MT)</strong>. Heavy multi-axle freight trucks servicing Bangalore, Chennai, Madurai, Hyderabad, and Mumbai.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-agricultural-700 hover:bg-agricultural-800 text-white font-bold py-3 px-6 rounded-xl text-xs shadow-md transition-all"
            >
              <span>Explore Wholesale Produce</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">What Our Partners Say</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Hear from the commercial kitchens, exporters, and families buying from us.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-150 dark:bg-slate-900 dark:border-slate-850 space-y-4 shadow-sm bg-opacity-100">
              <p className="text-slate-600 dark:text-slate-350 italic text-sm">
                "SN FreshCart is our primary supplier for Nashik Red Onions. Their daily pricing model has saved us considerable money, and the stock is consistently dry, clean, and sorted."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-agricultural-700 text-white flex items-center justify-center font-bold text-sm">
                  RK
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Rajesh Kumar</h4>
                  <span className="text-xs text-slate-400">Owner, Nashik Spices Restaurant</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-150 dark:bg-slate-900 dark:border-slate-850 space-y-4 shadow-sm bg-opacity-100">
              <p className="text-slate-600 dark:text-slate-350 italic text-sm">
                "We export shallots and white onions to Southeast Asia. Buying from this portal guarantees strict sorting. Low percentage of bad skins, which is extremely critical for transit longevity."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-onionorange-600 text-white flex items-center justify-center font-bold text-sm">
                  PS
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Priya Sharma</h4>
                  <span className="text-xs text-slate-400">Logistics Director, Agromin Exporters</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 text-white py-20 px-4 text-center relative overflow-hidden border-t border-slate-800">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to secure your bulk agricultural inventory?</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Log in or sign up to check out live rates, manage your cart, and place bulk orders with real-time delivery tracking.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-onionorange-600 hover:bg-onionorange-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-onionorange-950/20 hover:scale-105 transition-all"
            >
              Get Started Now
            </Link>
            <Link
              to="/contact"
              className="bg-transparent hover:bg-slate-850 text-white border border-slate-800 px-6 py-3 rounded-xl font-bold transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
