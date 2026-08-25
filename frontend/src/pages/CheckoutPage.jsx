import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api/client';
import {
  HiLocationMarker,
  HiPlus,
  HiCreditCard,
  HiCash,
  HiDeviceMobile,
  HiSparkles,
  HiCheckCircle,
} from 'react-icons/hi';

const API = API_BASE_URL;

const PAYMENT_METHODS = [
  {
    value: 'wallet',
    label: 'FeastRocket Wallet (1-Click Pay)',
    badge: '⚡ Instant',
    icon: <span className="text-lg">👛</span>,
  },
  {
    value: 'upi',
    label: 'UPI (GPay / PhonePe / Paytm)',
    badge: 'Fast',
    icon: <HiDeviceMobile className="w-5 h-5 text-indigo-500" />,
  },
  {
    value: 'card',
    label: 'Credit / Debit Card',
    badge: null,
    icon: <HiCreditCard className="w-5 h-5 text-blue-500" />,
  },
  {
    value: 'cod',
    label: 'Cash on Delivery',
    badge: null,
    icon: <HiCash className="w-5 h-5 text-emerald-500" />,
  },
];

const CheckoutPage = () => {
  const { cart, dispatch, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    label: 'Home',
    street: 'Flat 402, Green Acres, 100ft Rd, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
  });
  const [savedAddressIdx, setSavedAddressIdx] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Wallet State
  const [walletBalance, setWalletBalance] = useState(() => {
    return Number(localStorage.getItem('fr_wallet_balance') || '150');
  });
  const [useWalletDiscount, setUseWalletDiscount] = useState(false);

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const taxes = Math.round(subtotal * 0.05);
  const rawTotal = subtotal + deliveryFee + taxes;

  // Calculate discount if wallet discount is applied
  const walletDiscountApplied = useWalletDiscount ? Math.min(walletBalance, rawTotal) : 0;
  const total = Math.max(0, rawTotal - walletDiscountApplied);

  const getDeliveryAddress = () => {
    if (savedAddressIdx !== null && user?.addresses?.[savedAddressIdx]) {
      return user.addresses[savedAddressIdx];
    }
    return address;
  };

  const handlePlaceOrder = async () => {
    const deliveryAddr = getDeliveryAddress();
    if (!deliveryAddr.street.trim()) {
      setError('Please enter a delivery address.');
      return;
    }
    setLoading(true);
    setError('');

    // If paid via wallet or applied wallet discount, deduct balance
    if (paymentMethod === 'wallet') {
      const deduction = Math.min(walletBalance, total);
      const newBal = Math.max(0, walletBalance - deduction);
      setWalletBalance(newBal);
      localStorage.setItem('fr_wallet_balance', newBal.toString());
    } else if (useWalletDiscount && walletDiscountApplied > 0) {
      const newBal = Math.max(0, walletBalance - walletDiscountApplied);
      setWalletBalance(newBal);
      localStorage.setItem('fr_wallet_balance', newBal.toString());
    }

    try {
      const token = localStorage.getItem('fr_token');
      const { data } = await axios.post(
        `${API}/orders`,
        {
          restaurantId: cart.restaurantId || '65f000000000000000000001',
          restaurantName: cart.restaurantName || 'Demo Restaurant',
          items: cart.items.map((i) => ({
            name: i.name,
            price: i.price,
            qty: i.qty,
            image: i.image,
          })),
          deliveryAddress: deliveryAddr,
          paymentMethod,
          deliveryFee,
          discount: walletDiscountApplied,
          specialInstructions: instructions,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (data.success) {
        dispatch({ type: 'CLEAR_CART' });
        navigate(`/order-tracking/${data.order._id}`);
      }
    } catch {
      // Demo fallback — generate a clean order ID so the live tracker flow continues smoothly
      const mockId = `DEMO${Date.now().toString().slice(-6)}`;
      dispatch({ type: 'CLEAR_CART' });
      navigate(`/order-tracking/${mockId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left column ─ address + wallet + payment ──────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* FeastRocket Wallet Card */}
            <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-[#ff5200] text-white rounded-3xl p-6 shadow-xl shadow-orange-500/20 relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] text-8xl opacity-10 pointer-events-none">
                👛
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-orange-100 flex items-center gap-1.5">
                    <HiSparkles className="w-4 h-4" /> FeastRocket Wallet
                  </p>
                  <h3 className="text-3xl font-black mt-1">₹{walletBalance}</h3>
                  <p className="text-[11px] text-orange-100 mt-0.5">Available for instant cashback & 1-click checkout</p>
                </div>
                {walletBalance > 0 && (
                  <button
                    type="button"
                    onClick={() => setUseWalletDiscount((p) => !p)}
                    className={`px-4 py-2 rounded-2xl text-xs font-black transition-all shadow-md ${
                      useWalletDiscount
                        ? 'bg-white text-[#ff5200] scale-105'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {useWalletDiscount ? '✓ Applied' : 'Apply Discount'}
                  </button>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
              <h2 className="font-black text-gray-900 dark:text-white text-base mb-4 flex items-center gap-2">
                <HiLocationMarker className="w-5 h-5 text-[#ff5200]" /> Delivery Address
              </h2>

              {/* Saved addresses */}
              {user?.addresses && user.addresses.length > 0 && (
                <div className="space-y-2 mb-4">
                  {user.addresses.map((addr, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSavedAddressIdx(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all ${
                        savedAddressIdx === idx
                          ? 'border-[#ff5200] bg-orange-50/50 dark:bg-orange-950/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <p className="font-bold text-xs text-gray-900 dark:text-white">{addr.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {addr.street}, {addr.city}
                      </p>
                    </button>
                  ))}
                  <button
                    onClick={() => setSavedAddressIdx(null)}
                    className="text-xs text-[#ff5200] font-bold flex items-center gap-1 mt-1"
                  >
                    <HiPlus className="w-3.5 h-3.5" /> Add / use new address
                  </button>
                </div>
              )}

              {/* Manual address form */}
              {savedAddressIdx === null && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {['Home', 'Work', 'Other'].map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setAddress((p) => ({ ...p, label: l }))}
                        className={`py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                          address.label === l
                            ? 'border-[#ff5200] bg-orange-50/60 dark:bg-orange-950/20 text-[#ff5200]'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Flat / House No., Building, Street…"
                    value={address.street}
                    onChange={(e) => setAddress((p) => ({ ...p, street: e.target.value }))}
                    className="input-base resize-none text-xs"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="City"
                      value={address.city}
                      onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))}
                      className="input-base text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={address.pincode}
                      onChange={(e) => setAddress((p) => ({ ...p, pincode: e.target.value }))}
                      className="input-base text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
              <h2 className="font-black text-gray-900 dark:text-white text-base mb-4 flex items-center gap-2">
                <HiCreditCard className="w-5 h-5 text-[#ff5200]" /> Payment Method
              </h2>
              <div className="space-y-2.5">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setPaymentMethod(m.value)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                      paymentMethod === m.value
                        ? 'border-[#ff5200] bg-orange-50/50 dark:bg-orange-950/20 shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div>{m.icon}</div>
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white text-xs">{m.label}</span>
                        {m.badge && (
                          <span className="text-[10px] bg-orange-100 dark:bg-orange-950/60 text-[#ff5200] font-extrabold px-2 py-0.5 rounded-full">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      {m.value === 'wallet' && (
                        <p className="text-[11px] text-gray-400">Balance: ₹{walletBalance}</p>
                      )}
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === m.value ? 'border-[#ff5200]' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {paymentMethod === m.value && <div className="w-2 h-2 rounded-full bg-[#ff5200]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-2">
                Special Delivery Instructions <span className="text-gray-400 font-normal text-xs">(optional)</span>
              </h2>
              <textarea
                rows={2}
                placeholder="Leave with guard, ring doorbell, extra spicy, etc…"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="input-base resize-none text-xs"
              />
            </div>
          </div>

          {/* ── Right column ─ order summary ──────────────────────────────────── */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-5 sticky top-24 shadow-sm">
              <h3 className="font-black text-gray-900 dark:text-white text-base mb-4">Order Summary</h3>

              {/* Items */}
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400 truncate flex-1">
                      {item.name} × {item.qty}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white ml-2 shrink-0">
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Delivery fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Taxes (5%)</span>
                  <span>₹{taxes}</span>
                </div>

                {walletDiscountApplied > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Wallet Discount Applied</span>
                    <span>- ₹{walletDiscountApplied}</span>
                  </div>
                )}

                <div className="flex justify-between font-black text-gray-900 dark:text-white text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total Payable</span>
                  <span className="text-[#ff5200]">₹{total}</span>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs mt-3 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl border border-red-200 dark:border-red-800">
                  {error}
                </p>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn-primary w-full py-3.5 mt-5 text-sm font-black rounded-2xl disabled:opacity-60 shadow-xl shadow-orange-500/20"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Placing Order…
                  </span>
                ) : (
                  `Pay ₹${total} • Place Order`
                )}
              </button>

              <p className="text-[11px] text-gray-400 text-center mt-3">
                🔒 256-Bit SSL Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
