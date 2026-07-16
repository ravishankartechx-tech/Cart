import { useState } from 'react';
import { HiTag, HiX, HiSparkles } from 'react-icons/hi';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Demo coupons — work without backend
const DEMO_COUPONS = {
  FEAST20:   { type: 'percent', value: 20, maxDiscount: 100, minOrder: 0  },
  WELCOME50: { type: 'flat',    value: 50, minOrder: 199 },
  FREEDEL:   { type: 'flat',    value: 40, minOrder: 149, label: 'Free Delivery' },
  SAVE100:   { type: 'flat',    value: 100, minOrder: 399 },
};

const CouponInput = ({ orderAmount, restaurantId, onApply, appliedCoupon }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`${API}/coupons/validate`, {
        code: code.trim().toUpperCase(),
        orderAmount,
        restaurantId,
      });
      if (data.success) {
        onApply({ code: data.coupon.code, discount: data.discount });
        setCode('');
        return;
      }
    } catch {
      // Fall through to demo coupons
    }

    // Demo coupon fallback
    const demo = DEMO_COUPONS[code.trim().toUpperCase()];
    if (demo) {
      if (orderAmount < (demo.minOrder || 0)) {
        setError(`Minimum order ₹${demo.minOrder} required for this coupon.`);
        setLoading(false);
        return;
      }
      let discount = 0;
      if (demo.type === 'percent') {
        discount = Math.min((orderAmount * demo.value) / 100, demo.maxDiscount || Infinity);
      } else {
        discount = demo.value;
      }
      onApply({ code: code.trim().toUpperCase(), discount: Math.round(discount) });
      setCode('');
    } else {
      setError('Invalid or expired coupon code.');
    }
    setLoading(false);
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <HiTag className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm font-bold text-green-700 dark:text-green-400">{appliedCoupon.code} Applied!</p>
            <p className="text-xs text-green-600">You save ₹{appliedCoupon.discount}</p>
          </div>
        </div>
        <button onClick={() => onApply(null)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
          <HiX className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <HiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && validate()}
            placeholder="Enter coupon code"
            className="input-base pl-9 text-sm"
          />
        </div>
        <button
          onClick={validate}
          disabled={loading || !code.trim()}
          className="btn-primary px-5 py-2 text-sm rounded-xl shrink-0 disabled:opacity-60"
        >
          {loading ? '...' : 'Apply'}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs px-1">{error}</p>}
    </div>
  );
};

export default CouponInput;
