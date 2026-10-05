import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, Scale, AlertCircle, CheckCircle2 } from 'lucide-react';

const Cart = () => {
  const {
    cartItems,
    updateCartQty,
    removeFromCart,
    totalWeight,
    itemsPrice,
    isMinOrderMet,
    weightShortfall,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQtyChange = (id, currentQty, stock, change) => {
    const newQty = currentQty + change;
    if (newQty >= 1 && newQty <= stock) {
      updateCartQty(id, newQty);
    }
  };

  const handleBulkAdd = (id, currentQty, stock, addAmount) => {
    const newQty = Math.min(currentQty + addAmount, stock);
    updateCartQty(id, newQty);
  };

  const handleCheckoutRedirect = () => {
    if (!isMinOrderMet) return;
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  const progressPercent = Math.min(100, Math.round((totalWeight / 2000) * 100));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Title */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-agricultural-100 dark:bg-agricultural-950/40 text-agricultural-800 dark:text-agricultural-400 text-xs font-extrabold uppercase px-3 py-1 rounded-full flex items-center space-x-1">
              <Scale size={14} />
              <span>Wholesale Produce Cart</span>
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Shopping Cart</h1>
          <p className="text-xs text-slate-400">
            Review your selected wholesale produce and batch quantities before proceeding to checkout.
          </p>
        </div>

        {/* Wholesale Bulk Order Progress Bar Card */}
        {cartItems.length > 0 && (
          <div className={`p-5 sm:p-6 rounded-2xl border transition-all ${
            isMinOrderMet
              ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
              : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center space-x-2.5">
                {isMinOrderMet ? (
                  <CheckCircle2 className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" size={20} />
                ) : (
                  <AlertCircle className="text-amber-600 dark:text-amber-400 flex-shrink-0" size={20} />
                )}
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {isMinOrderMet
                      ? 'Wholesale Minimum (2,000 kg) Reached!'
                      : `Minimum Wholesale Order: 2,000 kg (${weightShortfall.toLocaleString()} kg needed)`}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isMinOrderMet
                      ? `Your cart has ${totalWeight.toLocaleString()} kg. Ready for wholesale order checkout.`
                      : `Minimum wholesale order is 2,000 kg. Add ${weightShortfall.toLocaleString()} kg more to checkout.`}
                  </p>
                </div>
              </div>
              <div className="text-right sm:text-right flex-shrink-0">
                <span className={`text-base font-extrabold ${isMinOrderMet ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {totalWeight.toLocaleString()} kg
                </span>
                <span className="block text-[11px] text-slate-400 font-medium">
                  {totalWeight >= 2000 ? '✅ Minimum Met' : `${progressPercent}% of 2,000 kg`}
                </span>
              </div>
            </div>

            {/* Progress Bar Track */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isMinOrderMet
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                    : 'bg-gradient-to-r from-amber-500 to-onionorange-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-250 dark:border-slate-850 space-y-6">
            <div className="text-slate-350 text-5xl">🛒</div>
            <h3 className="text-lg font-bold text-slate-805 dark:text-white">Your cart is empty</h3>
            <p className="text-slate-400 text-xs">Browse our current catalog to add red, white, or small onions in wholesale lots.</p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-agricultural-700 hover:bg-agricultural-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-md text-xs transition-all"
            >
              <ShoppingBag size={14} />
              <span>Browse Wholesale Products</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Items Column */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-150 dark:border-slate-850 shadow-xs hover:shadow-md transition-shadow space-y-3"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">₹{item.price.toFixed(2)} / kg</p>
                      <button
                        onClick={() => removeFromCart(item.product)}
                        className="text-red-500 hover:text-red-650 inline-flex items-center space-x-1 pt-1 text-[11px]"
                      >
                        <Trash2 size={12} />
                        <span>Remove</span>
                      </button>
                    </div>

                    {/* Quantity selector */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQtyChange(item.product, item.qty, item.stock, -10)}
                        disabled={item.qty <= 1}
                        title="Decrease by 10 kg"
                        className="w-7 h-7 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 disabled:opacity-40 text-xs"
                      >
                        <Minus size={12} />
                      </button>
                      
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="1"
                          max={item.stock}
                          value={item.qty}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val >= 1) {
                              const finalVal = Math.min(val, item.stock);
                              updateCartQty(item.product, finalVal);
                            } else if (e.target.value === '') {
                              updateCartQty(item.product, '');
                            }
                          }}
                          onBlur={() => {
                            const val = parseInt(item.qty);
                            if (isNaN(val) || val < 1) {
                              updateCartQty(item.product, 1);
                            }
                          }}
                          className="text-xs font-bold w-16 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1 focus:outline-none focus:ring-1 focus:ring-agricultural-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-[10px] text-slate-400 ml-1 font-semibold">kg</span>
                      </div>

                      <button
                        onClick={() => handleQtyChange(item.product, item.qty, item.stock, 10)}
                        disabled={item.qty >= item.stock}
                        title="Increase by 10 kg"
                        className="w-7 h-7 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 disabled:opacity-40 text-xs"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right pl-2 w-24 flex-shrink-0">
                      <span className="text-xs text-slate-400 block font-normal">Subtotal</span>
                      <strong className="text-sm font-bold text-slate-800 dark:text-slate-250">
                        ₹{(item.qty * item.price).toFixed(2)}
                      </strong>
                    </div>
                  </div>

                  {/* Bulk Quick Add Presets */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">Quick Bulk Increment:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[500, 1000, 2000, 5000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => handleBulkAdd(item.product, item.qty, item.stock, amt)}
                          disabled={item.qty + amt > item.stock}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-agricultural-100 dark:hover:bg-agricultural-950/40 text-slate-700 dark:text-slate-300 hover:text-agricultural-700 dark:hover:text-agricultural-400 border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-30"
                        >
                          +{amt >= 1000 ? `${amt / 1000} MT` : `${amt} kg`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-sm space-y-6 h-fit">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Order Summary</h2>
              
              <div className="space-y-3 text-xs border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Produce Weight</span>
                  <span className={`font-bold ${isMinOrderMet ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {totalWeight.toLocaleString()} kg ({(totalWeight / 1000).toFixed(1)} MT)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Base Minimum Target</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">2,000 kg (2 MT)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Produce Subtotal</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    ₹{itemsPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">Produce Subtotal</span>
                </div>
                <strong className="text-2xl font-extrabold text-onionorange-600 dark:text-onionorange-500">
                  ₹{itemsPrice.toFixed(2)}
                </strong>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCheckoutRedirect}
                  disabled={!isMinOrderMet}
                  className={`w-full font-bold text-sm py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all duration-200 ${
                    isMinOrderMet
                      ? 'bg-agricultural-750 hover:bg-agricultural-800 text-white shadow-agricultural-950/20 cursor-pointer'
                      : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed shadow-none'
                  }`}
                >
                  <span>{isMinOrderMet ? 'Proceed to Checkout' : `Add ${weightShortfall.toLocaleString()} kg More to Checkout`}</span>
                  <ArrowRight size={16} />
                </button>

                {!isMinOrderMet && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 text-center font-medium">
                    ⚠️ Wholesale minimum is 2,000 kg. Please increase your order quantity.
                  </p>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;
