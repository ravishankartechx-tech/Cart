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
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const taxes = Math.round(subtotal * 0.05);
  const discount = appliedCoupon?.discount || 0;
  const total = subtotal + deliveryFee + taxes - discount;

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
        <div className="text-8xl mb-6 animate-float">🛒</div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-sm">
          Looks like you haven't added anything yet. Browse restaurants and add your favourites!
        </p>
        <Link to="/restaurants" className="btn-primary px-8 py-3">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-colors">
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <HiShoppingCart className="w-7 h-7 text-[#ff5200]" /> Your Cart
            </h1>
            {cart.restaurantName && (
              <p className="text-sm text-gray-500 dark:text-gray-400">from <span className="font-semibold">{cart.restaurantName}</span></p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              {cart.items.map((item, idx) => (
                <div key={item.id} className={`flex items-center gap-4 p-5 ${idx !== cart.items.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
                  {item.image && (
                    <img src={item.image} alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base truncate">{item.name}</h3>
                    <p className="text-[#ff5200] font-bold mt-1">₹{item.price}</p>
                  </div>

                  {/* Qty control */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: { id: item.id } })}
                      className="w-8 h-8 rounded-full border-2 border-[#ff5200] text-[#ff5200] flex items-center justify-center font-bold text-lg hover:bg-[#ff5200] hover:text-white transition-colors"
                    >−</button>
                    <span className="w-8 text-center font-black text-gray-900 dark:text-white">{item.qty}</span>
                    <button
                      onClick={() => dispatch({ type: 'ADD_TO_CART', payload: item })}
                      className="w-8 h-8 rounded-full bg-[#ff5200] text-white flex items-center justify-center font-bold text-lg hover:bg-orange-600 transition-colors"
                    >+</button>
                  </div>

                  {/* Item total */}
                  <div className="text-right shrink-0 w-16">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">₹{item.price * item.qty}</p>
                    <button
                      onClick={() => dispatch({ type: 'CLEAR_ITEM', payload: { id: item.id } })}
                      className="text-red-400 hover:text-red-600 mt-1 transition-colors"
                      title="Remove item"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <HiTag className="w-4 h-4 text-[#ff5200]" /> Have a coupon?
              </h3>
              <CouponInput
                orderAmount={subtotal}
                restaurantId={cart.restaurantId}
                onApply={setAppliedCoupon}
                appliedCoupon={appliedCoupon}
              />
              {!appliedCoupon && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {['FEAST20','WELCOME50','FREEDEL','SAVE100'].map(c => (
                    <span key={c} className="text-xs bg-orange-50 dark:bg-orange-900/20 text-[#ff5200] border border-orange-200 dark:border-orange-800 px-2 py-1 rounded-full font-semibold cursor-default">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Clear cart */}
            <button
              onClick={() => dispatch({ type: 'CLEAR_CART' })}
              className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
            >
              <HiTrash className="w-4 h-4" /> Clear entire cart
            </button>
          </div>

          {/* Bill Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sticky top-24">
              <h3 className="font-black text-gray-900 dark:text-white text-lg mb-4">Bill Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Item total ({getItemCount()} items)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery fee</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Taxes & charges (5%)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{taxes}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon discount</span>
                    <span className="font-semibold">−₹{discount}</span>
                  </div>
                )}
                <div className="border-t border-dashed border-gray-200 dark:border-gray-600 pt-3 flex justify-between">
                  <span className="font-black text-gray-900 dark:text-white">Total</span>
                  <span className="font-black text-gray-900 dark:text-white text-lg">₹{Math.max(0, total).toFixed(2)}</span>
                </div>
              </div>

              {discount > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2 mt-3 text-xs font-semibold text-green-700 dark:text-green-400">
                  🎉 You're saving ₹{discount} on this order!
                </div>
              )}

              <button onClick={handleCheckout} className="btn-primary w-full py-3.5 mt-5 text-base">
                Proceed to Checkout
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                🔒 Secure payments powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
