import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { HiLocationMarker, HiPlus, HiCreditCard, HiCash, HiDeviceMobile } from 'react-icons/hi';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PAYMENT_METHODS = [
  { value: 'card',  label: 'Credit / Debit Card', icon: <HiCreditCard className="w-5 h-5" /> },
  { value: 'upi',   label: 'UPI',                icon: <HiDeviceMobile className="w-5 h-5" /> },
  { value: 'cod',   label: 'Cash on Delivery',   icon: <HiCash className="w-5 h-5" /> },
];

const CheckoutPage = () => {
  const { cart, dispatch, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    label: 'Home', street: '', city: 'Bengaluru', state: 'Karnataka', pincode: '',
  });
  const [savedAddressIdx, setSavedAddressIdx] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal  = getCartTotal();
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const taxes   = Math.round(subtotal * 0.05);
  const total   = subtotal + deliveryFee + taxes;

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
    try {
      const { data } = await axios.post(`${API}/orders`, {
        restaurantId:   cart.restaurantId || '000000000000000000000001',
        restaurantName: cart.restaurantName || 'Demo Restaurant',
        items: cart.items.map(i => ({
          name: i.name, price: i.price, qty: i.qty, image: i.image,
        })),
        deliveryAddress: deliveryAddr,
        paymentMethod,
        specialInstructions: instructions,
      });
      if (data.success) {
        dispatch({ type: 'CLEAR_CART' });
        navigate(`/order-tracking/${data.order._id}`);
      }
    } catch {
      // Demo fallback — generate a fake order ID so the flow continues
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

          {/* ── Left col ─ address + payment ──────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Delivery Address */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="font-black text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                <HiLocationMarker className="w-5 h-5 text-[#ff5200]" /> Delivery Address
              </h2>

              {/* Saved addresses */}
              {user?.addresses && user.addresses.length > 0 && (
                <div className="space-y-2 mb-4">
                  {user.addresses.map((addr, idx) => (
                    <button key={idx}
                      onClick={() => setSavedAddressIdx(idx)}
                      className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                        savedAddressIdx === idx
                          ? 'border-[#ff5200] bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{addr.label}</p>
                      <p className="text-xs text-gray-500">{addr.street}, {addr.city}</p>
                    </button>
                  ))}
                  <button
                    onClick={() => setSavedAddressIdx(null)}
                    className="text-sm text-[#ff5200] font-semibold flex items-center gap-1 mt-1"
                  >
                    <HiPlus className="w-4 h-4" /> Add / use new address
                  </button>
                </div>
              )}

              {/* Manual address form (shown when no saved index selected) */}
              {savedAddressIdx === null && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {['Home', 'Work', 'Other'].map(l => (
                      <button key={l} type="button"
                        onClick={() => setAddress(p => ({ ...p, label: l }))}
                        className={`py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                          address.label === l
                            ? 'border-[#ff5200] bg-orange-50 dark:bg-orange-900/20 text-[#ff5200]'
                            : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  <textarea rows={2}
                    placeholder="Flat / House No., Building, Street…"
                    value={address.street}
                    onChange={e => setAddress(p => ({ ...p, street: e.target.value }))}
                    className="input-base resize-none text-sm"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="City" value={address.city}
                      onChange={e => setAddress(p => ({ ...p, city: e.target.value }))}
                      className="input-base text-sm" />
                    <input type="text" placeholder="Pincode" value={address.pincode}
                      onChange={e => setAddress(p => ({ ...p, pincode: e.target.value }))}
                      className="input-base text-sm" />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="font-black text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                <HiCreditCard className="w-5 h-5 text-[#ff5200]" /> Payment Method
              </h2>
              <div className="space-y-2">
                {PAYMENT_METHODS.map(m => (
                  <button key={m.value}
                    onClick={() => setPaymentMethod(m.value)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === m.value
                        ? 'border-[#ff5200] bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className={paymentMethod === m.value ? 'text-[#ff5200]' : 'text-gray-400'}>
                      {m.icon}
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{m.label}</span>
                    <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === m.value ? 'border-[#ff5200]' : 'border-gray-300'
                    }`}>
                      {paymentMethod === m.value && (
                        <div className="w-2 h-2 rounded-full bg-[#ff5200]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
                Special Instructions{' '}
                <span className="text-gray-400 font-normal text-sm">(optional)</span>
              </h2>
              <textarea rows={2}
                placeholder="Extra spicy, no onions, leave at door…"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                className="input-base resize-none text-sm"
              />
            </div>
          </div>

          {/* ── Right col ─ order summary ──────────────────────────────────── */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sticky top-24">
              <h3 className="font-black text-gray-900 dark:text-white text-lg mb-4">Order Summary</h3>

              {/* Items */}
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {cart.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 truncate flex-1">
                      {item.name} × {item.qty}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white ml-2 shrink-0">
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bill */}
              <div className="border-t border-dashed border-gray-200 dark:border-gray-600 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span><span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Delivery fee</span><span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Taxes (5%)</span><span>₹{taxes}</span>
                </div>
                <div className="flex justify-between font-black text-gray-900 dark:text-white text-base pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span>Total</span><span>₹{total}</span>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs mt-3 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn-primary w-full py-3.5 mt-5 text-base disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Placing Order…
                  </span>
                ) : (
                  `Place Order • ₹${total}`
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                🔒 100% Secure &amp; Encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
