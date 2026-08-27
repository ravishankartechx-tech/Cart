import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiArrowRight } from 'react-icons/hi';

const DEMO_ACCOUNTS = [
  { role: 'Customer', email: 'user@feastrocket.com', pw: 'user123', icon: '👤', badge: 'User', color: '#ff5200', bg: 'rgba(255,82,0,0.08)', border: 'rgba(255,82,0,0.25)' },
  { role: 'Restaurant Owner', email: 'restaurant@feastrocket.com', pw: 'resto123', icon: '🏪', badge: 'Resto', color: '#16a34a', bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.25)' },
  { role: 'Delivery Partner', email: 'delivery@feastrocket.com', pw: 'delivery123', icon: '🛵', badge: 'Delivery', color: '#2563eb', bg: 'rgba(37,99,235,0.08)', border: 'rgba(37,99,235,0.25)' },
  { role: 'Platform Admin', email: 'admin@feastrocket.com', pw: 'admin123', icon: '🛡', badge: 'Admin', color: '#9333ea', bg: 'rgba(147,51,234,0.08)', border: 'rgba(147,51,234,0.25)' },
];

const FOOD_EMOJIS = ['🍕', '🍜', '🍣', '🌮', '🍔', '🍛', '🥗', '🍩', '🥩', '🍱'];

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
    <div className="min-h-screen flex">
      {/* ── Left Brand Panel ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12"
        style={{
          background: 'linear-gradient(135deg, #1a0a02 0%, #2d1204 30%, #1a1000 60%, #0d0d18 100%)',
        }}>
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 rounded-full opacity-30 animate-float-slow"
            style={{ background: 'radial-gradient(circle, rgba(255,82,0,0.5) 0%, transparent 70%)', top: '-10%', left: '-15%' }} />
          <div className="absolute w-72 h-72 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(252,128,25,0.5) 0%, transparent 70%)', bottom: '-5%', right: '-10%', animation: 'float-slow 7s ease-in-out infinite reverse' }} />
          <div className="absolute w-48 h-48 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.6) 0%, transparent 70%)', top: '50%', right: '10%', animation: 'float 5s ease-in-out infinite' }} />
        </div>

        {/* Floating food emojis */}
        {FOOD_EMOJIS.map((emoji, i) => (
          <div key={i}
            className="absolute text-3xl pointer-events-none select-none opacity-20"
            style={{
              left: `${10 + (i * 9) % 80}%`,
              top: `${8 + (i * 13) % 84}%`,
              animation: `float-slow ${4 + (i % 3)}s ease-in-out ${i * 0.5}s infinite`,
              filter: 'blur(0.5px)',
            }}>
            {emoji}
          </div>
        ))}

        {/* Brand content */}
        <div className="relative z-10 text-center space-y-6 animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-glow">
              <span className="text-4xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🚀</span>
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-black text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Feast<span className="text-gradient">Rocket</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
              Delivering the world's finest cuisines, fresh to your door — in 30 minutes or less.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { n: '2M+', label: 'Happy Users' },
              { n: '1.2K+', label: 'Restaurants' },
              { n: '30min', label: 'Avg Delivery' },
            ].map((s, i) => (
              <div key={i} className="glassmorphism p-3 text-center rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.n}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Cuisine flags */}
          <div className="flex justify-center gap-2 mt-4">
            {['🇮🇳', '🇯🇵', '🇮🇹', '🇲🇽', '🇰🇷', '🇺🇸'].map((flag, i) => (
              <span key={i} className="text-2xl animate-float" style={{ animationDelay: `${i * 0.3}s`, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>{flag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ──────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
        <div className="w-full max-w-md space-y-5">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6 animate-fade-in">
            <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl animate-pulse-glow">
              <span className="text-2xl">🚀</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Feast<span className="text-[#ff5200]">Rocket</span>
            </h1>
          </div>

          {/* Form header */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Welcome back! 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">
              Sign in to your FeastRocket account to continue.
            </p>
          </div>

          {/* Form card */}
          <div className="glassmorphism p-7 animate-slide-up rounded-3xl"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.6)' }}>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-2xl mb-5 border border-red-200 dark:border-red-800/50 animate-slide-up">
                <span className="text-lg leading-none">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Email address
                </label>
                <div className="relative">
                  <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@feastrocket.com"
                    className="input-base pl-11 rounded-xl"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Password
                  </label>
                  <button type="button" className="text-xs text-[#ff5200] font-semibold hover:underline">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Your password"
                    className="input-base pl-11 pr-11 rounded-xl"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    {showPw ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-base rounded-2xl group"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 mt-5">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400 font-medium">or</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#ff5200] font-bold hover:underline" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Sign Up Free
              </Link>
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="glassmorphism p-5 animate-slide-up stagger-2 rounded-3xl"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
            <p className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-3.5 flex items-center justify-between" style={{ fontFamily: 'Outfit, sans-serif' }}>
              <span>⚡ 1-Click Demo Logins</span>
              <span className="text-[10px] text-gray-400 font-normal normal-case">Click to instantly log in</span>
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleDemoClick(acc)}
                  disabled={loading}
                  className="flex items-center gap-2.5 rounded-2xl p-3 text-left transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer group"
                  style={{
                    background: acc.bg,
                    border: `1.5px solid ${acc.border}`,
                  }}
                >
                  <span className="text-xl">{acc.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate transition-colors" style={{ color: acc.color, fontFamily: 'Outfit, sans-serif' }}>
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
    </div>
  );
};

export default LoginPage;
