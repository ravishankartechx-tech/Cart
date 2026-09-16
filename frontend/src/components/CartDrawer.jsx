import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { HiX, HiTrash, HiArrowRight, HiShoppingBag, HiOutlineSparkles } from 'react-icons/hi';

const CartDrawer = () => {
  const { cart, dispatch, getCartTotal, getItemCount, isCartDrawerOpen, closeCartDrawer } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Close drawer on Escape key and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeCartDrawer();
    };

    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartDrawerOpen, closeCartDrawer]);

  if (!isCartDrawerOpen) return null;

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 0 ? (subtotal >= 499 ? 0 : 40) : 0;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + taxes;
  const itemCount = getItemCount();

  const handleProceedCheckout = () => {
    closeCartDrawer();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  const handleGoToFullCart = () => {
    closeCartDrawer();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCartDrawer}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-gray-900 shadow-2xl flex flex-col animate-drawer-right border-l border-gray-100 dark:border-gray-800">
          
          {/* Header */}
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <HiShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  My Cart
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {cart.restaurantName ? (
                    <span className="font-semibold text-[#ff5200]">{cart.restaurantName}</span>
                  ) : (
                    `${itemCount} item${itemCount !== 1 ? 's' : ''}`
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={closeCartDrawer}
              aria-label="Close cart"
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          {cart.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 rounded-3xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-4xl mb-4 animate-float">
                🛒
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Your cart is empty
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6">
                Good food is always cooking! Explore restaurants and add your cravings.
              </p>
              <button
                onClick={() => {
                  closeCartDrawer();
                  navigate('/restaurants');
                }}
                className="btn-primary px-6 py-2.5 rounded-full text-sm font-bold shadow-lg cursor-pointer"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <>
              {/* Delivery info banner */}
              <div className="px-5 py-2.5 bg-orange-50 dark:bg-orange-950/30 border-b border-orange-100 dark:border-orange-900/30 flex items-center justify-between text-xs font-semibold text-orange-800 dark:text-orange-300">
                <div className="flex items-center gap-1.5">
                  <HiOutlineSparkles className="w-4 h-4 text-[#ff5200]" />
                  <span>{subtotal >= 499 ? '🎉 Free delivery unlocked!' : `Add ₹${(499 - subtotal).toFixed(0)} more for FREE delivery`}</span>
                </div>
                {deliveryFee === 0 && (
                  <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">FREE</span>
                )}
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 px-5 py-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-100 dark:border-gray-800"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop';
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {item.name}
                      </h4>
                      <p className="text-xs font-black text-[#ff5200] mt-0.5">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Stepper control */}
                    <div className="flex items-center gap-2 shrink-0 bg-gray-50 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: { id: item.id } })}
                        aria-label="Decrease quantity"
                        className="w-6 h-6 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center font-bold text-xs hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-[#ff5200] transition-colors shadow-xs cursor-pointer"
                      >
                        −
                      </button>
                      <span className="w-5 text-center font-black text-xs text-gray-900 dark:text-white">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => dispatch({ type: 'ADD_TO_CART', payload: item })}
                        aria-label="Increase quantity"
                        className="w-6 h-6 rounded-lg gradient-primary text-white flex items-center justify-center font-bold text-xs hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right shrink-0 min-w-[50px]">
                      <p className="text-xs font-black text-gray-900 dark:text-white">
                        ₹{item.price * item.qty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Drawer Footer & Bill Summary */}
              <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/90 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Item Total</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {deliveryFee === 0 ? <span className="text-emerald-500 font-bold">FREE</span> : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Taxes & charges</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₹{taxes}</span>
                  </div>
                  <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-2 flex justify-between items-baseline">
                    <span className="font-black text-sm text-gray-900 dark:text-white">Grand Total</span>
                    <span className="font-black text-lg text-[#ff5200]">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleProceedCheckout}
                    className="w-full btn-primary py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-extrabold shadow-xl hover:shadow-orange-500/25 transition-all cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <HiArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      onClick={handleGoToFullCart}
                      className="text-gray-500 dark:text-gray-400 hover:text-[#ff5200] font-semibold underline underline-offset-2 cursor-pointer"
                    >
                      View detailed cart page
                    </button>
                    <button
                      onClick={() => dispatch({ type: 'CLEAR_CART' })}
                      className="text-red-500 hover:text-red-600 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <HiTrash className="w-3.5 h-3.5" /> Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
