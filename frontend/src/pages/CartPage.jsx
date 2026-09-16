import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { HiTrash, HiArrowLeft, HiShoppingCart, HiTag } from 'react-icons/hi';
import CouponInput from '../components/CouponInput';

const CartPage = () => {
  const { cart, dispatch, getCartTotal, getItemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = getCartTotal();
  const isFreeDelivery = subtotal >= 499;
  const deliveryFee = subtotal > 0 ? (isFreeDelivery ? 0 : 40) : 0;
  const taxes = Math.round(subtotal * 0.05);
  const discount = appliedCoupon?.discount || 0;
  const total = subtotal + deliveryFee + taxes - discount;

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-6 text-center">
        <div className="w-28 h-28 rounded-3xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-5xl mb-5 animate-float shadow-lg shadow-orange-500/10">
          🛒
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Your cart is empty
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm text-sm">
          Good food is waiting for you! Browse your favorite restaurants and dishes to place an order.
        </p>
        <Link to="/restaurants" className="btn-primary px-8 py-3.5 rounded-2xl text-sm font-extrabold shadow-xl hover:shadow-orange-500/25 transition-all">
          Explore Restaurants
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer shadow-xs"
          >
            <HiArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              <HiShoppingCart className="w-7 h-7 text-[#ff5200]" /> Checkout Cart
            </h1>
            {cart.restaurantName && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Ordering from <span className="font-bold text-[#ff5200]">{cart.restaurantName}</span>
              </p>
            )}
          </div>
        </div>

        {/* Free Delivery Milestone Progress */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-orange-950/30 border border-orange-200/80 dark:border-orange-900/30">
          <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
            <span>{isFreeDelivery ? '🎉 Congratulations! You have unlocked FREE Delivery' : `Add ₹${(499 - subtotal).toFixed(0)} more for FREE Delivery`}</span>
            <span className="text-[#ff5200] font-black">{isFreeDelivery ? 'FREE' : '₹40'}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (subtotal / 499) * 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart items column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs divide-y divide-gray-100 dark:divide-gray-800">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 sm:p-5">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-gray-100 dark:border-gray-800"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop';
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-gray-900 dark:text-white text-sm sm:text-base truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {item.name}
                    </h3>
                    <p className="text-[#ff5200] font-black text-sm mt-0.5">₹{item.price}</p>
                  </div>

                  {/* Qty control stepper */}
                  <div className="flex items-center gap-1.5 shrink-0 bg-gray-50 dark:bg-gray-800 p-1 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: { id: item.id } })}
                      aria-label="Decrease quantity"
                      className="w-8 h-8 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center justify-center font-black text-sm hover:bg-orange-50 dark:hover:bg-orange-950/50 hover:text-[#ff5200] transition-colors cursor-pointer shadow-xs"
                    >
                      −
                    </button>
                    <span className="w-7 text-center font-black text-sm text-gray-900 dark:text-white">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => dispatch({ type: 'ADD_TO_CART', payload: item })}
                      aria-label="Increase quantity"
                      className="w-8 h-8 rounded-xl gradient-primary text-white flex items-center justify-center font-black text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                    >
                      +
                    </button>
                  </div>

                  {/* Item total */}
                  <div className="text-right shrink-0 min-w-[70px]">
                    <p className="font-black text-gray-900 dark:text-white text-sm sm:text-base">
                      ₹{item.price * item.qty}
                    </p>
                    <button
                      onClick={() => dispatch({ type: 'CLEAR_ITEM', payload: { id: item.id } })}
                      className="text-gray-400 hover:text-red-500 mt-1 transition-colors text-xs inline-flex items-center gap-1 cursor-pointer"
                      title="Remove item"
                    >
                      <HiTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-5 shadow-xs">
              <h3 className="font-extrabold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm sm:text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <HiTag className="w-4 h-4 text-[#ff5200]" /> Apply Promo & Discounts
              </h3>
              <CouponInput
                orderAmount={subtotal}
                restaurantId={cart.restaurantId}
                onApply={setAppliedCoupon}
                appliedCoupon={appliedCoupon}
              />
              {!appliedCoupon && (
                <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-dashed border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-400 font-semibold self-center">Suggested:</span>
                  {['FEAST20', 'WELCOME50', 'FREEDEL', 'SAVE100'].map(c => (
                    <span key={c} className="text-xs bg-orange-50 dark:bg-orange-950/40 text-[#ff5200] border border-orange-200/80 dark:border-orange-800/60 px-2.5 py-1 rounded-full font-bold cursor-default">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Clear cart action */}
            <div className="flex justify-between items-center px-1">
              <Link to="/restaurants" className="text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-[#ff5200]">
                ← Add more items from menu
              </Link>
              <button
                onClick={() => dispatch({ type: 'CLEAR_CART' })}
                className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <HiTrash className="w-4 h-4" /> Clear entire cart
              </button>
            </div>
          </div>

          {/* Bill Summary Column */}
          <div className="lg:col-span-1 sticky top-24">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-md">
              <h3 className="font-black text-gray-900 dark:text-white text-lg mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Bill Summary
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Item total ({getItemCount()} items)</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery fee</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {deliveryFee === 0 ? <span className="text-emerald-500 font-black">FREE</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Taxes & Restaurant Packaging (5%)</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{taxes}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Coupon discount</span>
                    <span>−₹{discount}</span>
                  </div>
                )}
                <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-baseline">
                  <span className="font-black text-gray-900 dark:text-white text-base">To Pay</span>
                  <span className="font-black text-xl text-[#ff5200]">₹{Math.max(0, total).toFixed(2)}</span>
                </div>
              </div>

              {discount > 0 && (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-3 mt-4 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <span>🎉</span>
                  <span>You're saving ₹{discount} on this order!</span>
                </div>
              )}

              <button
                onClick={handleCheckout}
                className="btn-primary w-full py-4 mt-6 text-sm sm:text-base rounded-2xl font-black shadow-xl hover:shadow-orange-500/25 transition-all cursor-pointer tap-active"
              >
                Proceed to Checkout
              </button>

              <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center mt-4">
                🔒 100% Safe & Secure UPI and Card Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
