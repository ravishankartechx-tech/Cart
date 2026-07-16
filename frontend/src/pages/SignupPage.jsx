import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiUser, HiMail, HiLockClosed, HiPhone, HiEye, HiEyeOff } from 'react-icons/hi';

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Invalid email.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      const res = await register(form.name, form.email, form.password, form.phone, form.role);
      if (res.success) navigate('/', { replace: true });
      else setError(res.message || 'Registration failed.');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'user', label: '🍽 Customer', desc: 'Order food online' },
    { value: 'restaurant', label: '🏪 Restaurant', desc: 'List & manage my restaurant' },
    { value: 'delivery', label: '🛵 Delivery Partner', desc: 'Earn by delivering' },
  ];

  return (
    <div className="min-h-screen gradient-hero dark:bg-gray-950 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-200/50">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Join thousands of food lovers!</p>
        </div>

        <div className="glassmorphism p-8 animate-slide-up space-y-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl border border-red-200 dark:border-red-700">
              {error}
            </div>
          )}

          {/* Role selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">I'm signing up as</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(r => (
                <button type="button" key={r.value}
                  onClick={() => setForm(p => ({ ...p, role: r.value }))}
                  className={`text-center p-3 rounded-xl border-2 transition-all duration-200 ${
                    form.role === r.value
                      ? 'border-[#ff5200] bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{r.label.split(' ')[0]}</div>
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{r.label.split(' ').slice(1).join(' ')}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Raj Kumar" className="input-base pl-10" autoComplete="name" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" className="input-base pl-10" autoComplete="email" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
              <div className="relative">
                <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+91 98765 43210" className="input-base pl-10" autoComplete="tel" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters" className="input-base pl-10 pr-10" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div className="flex gap-1 mt-1.5">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${
                      form.password.length >= i * 3 ? 'bg-[#ff5200]' : 'bg-gray-200 dark:bg-gray-600'
                    }`} />
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-xs text-center text-gray-400">
            By signing up, you agree to our{' '}
            <a href="#" className="text-[#ff5200] hover:underline">Terms</a> &{' '}
            <a href="#" className="text-[#ff5200] hover:underline">Privacy Policy</a>
          </p>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-[#ff5200] font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
