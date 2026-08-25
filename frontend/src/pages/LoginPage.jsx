import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';

const DEMO_ACCOUNTS = [
  { role: 'Customer', email: 'user@feastrocket.com', pw: 'user123', icon: '👤', badge: 'User' },
  { role: 'Restaurant Owner', email: 'restaurant@feastrocket.com', pw: 'resto123', icon: '🏪', badge: 'Resto' },
  { role: 'Delivery Partner', email: 'delivery@feastrocket.com', pw: 'delivery123', icon: '🛵', badge: 'Delivery' },
  { role: 'Platform Admin', email: 'admin@feastrocket.com', pw: 'admin123', icon: '🛡', badge: 'Admin' },
];

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const performLogin = async (email, password) => {
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.user?.role === 'admin') navigate('/admin', { replace: true });
        else if (res.user?.role === 'restaurant') navigate('/restaurant-dashboard', { replace: true });
        else if (res.user?.role === 'delivery') navigate('/delivery', { replace: true });
        else navigate(from, { replace: true });
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify credentials or start backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('All fields are required.'); return; }
    await performLogin(form.email, form.password);
  };

  const handleDemoClick = (acc) => {
    setForm({ email: acc.email, password: acc.pw });
    performLogin(acc.email, acc.pw);
  };

  return (
    <div className="min-h-screen gradient-hero dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-200/50">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Welcome back!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to your FeastRocket account</p>
        </div>

        <div className="glassmorphism p-8 animate-slide-up">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl mb-5 border border-red-200 dark:border-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email" name="email" value={form.email}
                  onChange={handleChange}
                  placeholder="you@feastrocket.com"
                  className="input-base pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password" value={form.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  className="input-base pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#ff5200] font-bold hover:underline">Sign Up</Link>
          </p>
        </div>

        {/* 1-Click Demo Accounts */}
        <div className="mt-4 glassmorphism p-5 animate-slide-up stagger-2">
          <p className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>⚡ 1-Click Demo Logins</span>
            <span className="text-[10px] text-gray-400">Click to instantly log in</span>
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.role}
                type="button"
                onClick={() => handleDemoClick(acc)}
                disabled={loading}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-gray-200 dark:border-gray-700 hover:border-[#ff5200] rounded-xl p-2.5 text-left transition-all hover:scale-[1.02] shadow-sm group"
              >
                <span className="text-xl">{acc.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-[#ff5200] truncate">
                    {acc.role}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">{acc.email}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
