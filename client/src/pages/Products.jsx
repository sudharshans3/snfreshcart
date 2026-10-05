import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import { Search, SlidersHorizontal, AlertCircle, ShoppingBag, Eye, X, MessageSquare, Scale, Truck, Sparkles, Check } from 'lucide-react';

const Products = () => {
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter state
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('');

  // Selected Product details modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQty, setModalQty] = useState(500);
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitError, setReviewSubmitError] = useState('');
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);

  // Categories list
  const categories = ['All', 'Red Onion', 'White Onion', 'Small Onion (Shallots)', 'Potato', 'Garlic', 'Coconut', 'Other'];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      let url = '/products';
      const params = [];
      if (keyword) params.push(`keyword=${encodeURIComponent(keyword)}`);
      if (category && category !== 'All') params.push(`category=${encodeURIComponent(category)}`);
      if (sort) params.push(`sort=${sort}`);

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const { data } = await api.get(url);
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleAddToCart = (product, qty = 1) => {
    addToCart(product, Math.min(qty, product.stock > 0 ? product.stock : 1));
    setRecentlyAddedId(product._id);
    setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === product._id ? null : prev));
    }, 1500);
  };

  // Open product details modal and load reviews
  const openProductDetails = async (product) => {
    setSelectedProduct(product);
    setModalQty(Math.min(500, product.stock > 0 ? product.stock : 500));
    setReviews([]);
    setReviewSubmitSuccess(false);
    setReviewSubmitError('');
    setReviewComment('');
    setReviewRating(5);
    
    try {
      setLoadingReviews(true);
      const { data } = await api.get(`/reviews/product/${product._id}`);
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setReviewSubmitError('You must be logged in to submit a review');
      return;
    }
    if (!reviewComment.trim()) {
      setReviewSubmitError('Please enter your comment');
      return;
    }

    try {
      setReviewSubmitError('');
      const { data } = await api.post('/reviews', {
        rating: reviewRating,
        comment: reviewComment,
        productId: selectedProduct._id,
      });

      setReviews([data, ...reviews]);
      setReviewSubmitSuccess(true);
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      setReviewSubmitError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page title and description */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Farm Fresh Produce Stock
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
            Live prices updated directly from the harvest yard. Buy onions, potatoes, garlic, or coconuts sorted and shipped on schedule.
          </p>
        </div>


        {/* Search, Filter and Sorting Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-850 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agricultural-600 dark:focus:ring-agricultural-500 text-slate-900 dark:text-white"
            />
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
          </form>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Category tabs */}
            <div className="flex flex-wrap bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    category === cat
                      ? 'bg-white dark:bg-slate-900 text-agricultural-750 dark:text-agricultural-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {cat.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <SlidersHorizontal size={15} className="text-slate-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-agricultural-650"
              >
                <option value="">Sort: Newest</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="nameAsc">Name: A to Z</option>
                <option value="nameDesc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-900/50 flex items-center space-x-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agricultural-700"></div>
            <p className="text-slate-400 text-sm">Fetching fresh produce stock...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-850 space-y-4">
            <div className="text-slate-400 text-4xl">🌾</div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">No products match your search</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Try adjusting your filtering or keyword</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const isOutOfStock = product.stock <= 0;
              return (
                <div
                  key={product._id}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-850 hover:shadow-xl transition-all group flex flex-col"
                >
                  {/* Image container */}
                  <div className="relative overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-agricultural-700/90 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md">
                      {product.category}
                    </div>

                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white font-bold tracking-wide">
                        OUT OF STOCK
                      </div>
                    )}
                  </div>

                  {/* Body details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                          {product.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-450 line-clamp-2">
                        {product.description || 'No description provided.'}
                      </p>
                    </div>

                    {/* Stock & Rating display */}
                    <div className="flex items-center justify-between text-xs border-t border-b border-slate-100 dark:border-slate-800 py-3">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Availability</span>
                        <span className={`font-bold ${isOutOfStock ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-500'}`}>
                          {isOutOfStock ? '0 kg' : `${product.stock} kg in stock`}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-slate-400 block mb-0.5">Rating</span>
                        <span className="text-slate-800 dark:text-slate-200 font-bold flex items-center space-x-1">
                          <span>★ {product.dailyPriceHistory && product.dailyPriceHistory.length > 0 ? '4.8' : '4.5'}</span>
                          <span className="text-slate-400 font-normal">({(product._id.charCodeAt(0) % 5) + 3} reviews)</span>
                        </span>
                      </div>
                    </div>

                    {/* Bottom Price & Button */}
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 block">Daily Price</span>
                          <span className="text-2xl font-extrabold text-onionorange-600 dark:text-onionorange-500">
                            ₹{product.pricePerKg.toFixed(2)}
                          </span>
                          <span className="text-slate-400 text-[10px]"> / kg</span>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => openProductDetails(product)}
                            className="p-2 border border-slate-250 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-350 transition-colors"
                            title="View Details & Reviews"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleAddToCart(product, 1)}
                            disabled={isOutOfStock}
                            className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-bold text-xs shadow-md transition-all ${
                              isOutOfStock
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                                : recentlyAddedId === product._id
                                ? 'bg-emerald-600 text-white scale-103'
                                : 'bg-agricultural-700 hover:bg-agricultural-800 text-white hover:scale-103 active:scale-95'
                            }`}
                            title={isOutOfStock ? 'Out of Stock' : 'Add to Cart (1 kg)'}
                          >
                            {recentlyAddedId === product._id ? (
                              <>
                                <Check size={14} className="stroke-[2.5]" />
                                <span>Added</span>
                              </>
                            ) : isOutOfStock ? (
                              <>
                                <ShoppingBag size={14} />
                                <span>Out of Stock</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag size={14} />
                                <span>Add to Cart</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Bulk quick increments */}
                      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-400">
                        <span>Bulk Buy:</span>
                        <div className="flex space-x-1">
                          {[500, 2000, 5000].map((bQty) => (
                            <button
                              key={bQty}
                              type="button"
                              disabled={isOutOfStock || product.stock < bQty}
                              onClick={() => handleAddToCart(product, bQty)}
                              className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-agricultural-100 dark:hover:bg-agricultural-950/40 text-slate-700 dark:text-slate-300 hover:text-agricultural-700 font-bold border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-30"
                            >
                              +{bQty >= 1000 ? `${bQty / 1000} MT` : `${bQty} kg`}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="bg-agricultural-100 dark:bg-agricultural-950/40 text-agricultural-800 dark:text-agricultural-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                  {selectedProduct.category}
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                  {selectedProduct.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Product description and summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="rounded-xl w-full h-44 object-cover border border-slate-100 dark:border-slate-800"
                />
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs text-slate-400 uppercase tracking-wide">Product Details</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed mt-1">
                      {selectedProduct.description || 'Graded fresh and dried for extended shelf storage. Harvested from our certified partner farmlands.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
                    <div>
                      <span className="text-slate-450 block">Pricing</span>
                      <strong className="text-lg text-onionorange-600 dark:text-onionorange-500 font-extrabold">₹{selectedProduct.pricePerKg.toFixed(2)}/kg</strong>
                    </div>
                    <div>
                      <span className="text-slate-455 block">Inventory</span>
                      <strong className="text-slate-800 dark:text-slate-200">{selectedProduct.stock > 0 ? `${selectedProduct.stock} kg available` : 'Out of Stock'}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews segment */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <MessageSquare size={18} className="text-agricultural-600" />
                  <span>Customer Reviews ({reviews.length})</span>
                </h3>

                {/* Reviews List */}
                <div className="space-y-3.5 max-h-48 overflow-y-auto pr-2">
                  {loadingReviews ? (
                    <p className="text-xs text-slate-400">Loading reviews...</p>
                  ) : reviews.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No reviews yet for this product. Be the first to review!</p>
                  ) : (
                    reviews.map((r) => (
                      <div key={r._id} className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl space-y-2 border border-slate-100 dark:border-slate-850">
                        <div className="flex justify-between items-center text-xs">
                          <strong className="text-slate-800 dark:text-slate-200">{r.userName}</strong>
                          <RatingStars rating={r.rating} size={13} />
                        </div>
                        <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed">
                          {r.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Review Form */}
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-150 dark:border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Add your Review</h4>
                    
                    {reviewSubmitError && (
                      <p className="text-xs text-red-500 font-semibold">{reviewSubmitError}</p>
                    )}
                    {reviewSubmitSuccess && (
                      <p className="text-xs text-emerald-600 font-semibold">Review submitted successfully!</p>
                    )}

                    <div className="flex items-center space-x-2 text-xs">
                      <span>Your Rating:</span>
                      <RatingStars rating={reviewRating} setRating={setReviewRating} clickable size={16} />
                    </div>

                    <div className="space-y-2">
                      <textarea
                        rows="2"
                        placeholder="Share your experience (e.g. skin quality, transport timing, size variance)..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full text-xs p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-agricultural-600 text-slate-900 dark:text-white"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-agricultural-700 hover:bg-agricultural-800 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition-colors"
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-550 dark:text-slate-400">
                    Please <Link to="/login" className="text-agricultural-750 dark:text-agricultural-400 font-bold hover:underline">log in</Link> to write a product review.
                  </div>
                )}
              </div>
            </div>
            
            {/* Modal footer */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 text-xs w-full sm:w-auto">
                <span className="text-slate-500 font-medium">Quantity:</span>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct.stock}
                  value={modalQty}
                  onChange={(e) => setModalQty(Math.min(selectedProduct.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-20 px-2.5 py-1 text-center font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                />
                <span className="text-slate-400 font-semibold">kg</span>
                <div className="flex flex-wrap gap-1">
                  {[500, 2000, 5000, 10000].map((pq) => (
                    <button
                      key={pq}
                      type="button"
                      disabled={selectedProduct.stock < pq}
                      onClick={() => setModalQty(pq)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                        modalQty === pq
                          ? 'bg-agricultural-700 text-white border-agricultural-700'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-350 border-slate-200 dark:border-slate-700 hover:border-agricultural-500'
                      }`}
                    >
                      {pq >= 1000 ? `${pq / 1000} MT` : `${pq} kg`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 border border-slate-250 dark:border-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    addToCart(selectedProduct, modalQty);
                    setSelectedProduct(null);
                  }}
                  disabled={selectedProduct.stock <= 0}
                  className="bg-agricultural-700 hover:bg-agricultural-850 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md disabled:bg-slate-200 dark:disabled:bg-slate-850 transition-colors"
                >
                  Add {modalQty.toLocaleString()} kg (₹{(modalQty * selectedProduct.pricePerKg).toFixed(2)})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
