import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import {
  HiShoppingCart, HiMenu, HiX, HiSun, HiMoon, HiUser,
  HiLogout, HiClipboardList, HiChartBar, HiTruck, HiHeart
} from 'react-icons/hi';

const Navbar = () => {
  const { getItemCount, getCartTotal } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { favoriteCount } = useFavorites();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Scroll-aware class switching
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const count = getItemCount();
  const cartTotal = getCartTotal();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const getRoleDashboardLink = () => {
    if (!user) return null;
    if (user.role === 'admin') return { to: '/admin', label: 'Admin Panel', icon: <HiChartBar /> };
    if (user.role === 'restaurant') return { to: '/restaurant-dashboard', label: 'My Restaurant', icon: <HiClipboardList /> };
    if (user.role === 'delivery') return { to: '/delivery', label: 'Deliveries', icon: <HiTruck /> };
    return null;
  };

  const dashLink = getRoleDashboardLink();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/restaurants', label: 'Restaurants' },
    { to: '/orders', label: 'Orders' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-gray-100/80 dark:border-gray-800/80 shadow-lg shadow-black/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative w-10 h-10">
              {/* Animated ring */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'conic-gradient(from 0deg, #ff5200, #fc8019, #f59e0b, #ff5200)',
                  borderRadius: '0.875rem',
                  padding: '2px',
                  animation: 'spin-slow 4s linear infinite',
                }}
              />
              <div className="relative w-full h-full gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange-300/50 transition-shadow duration-300">
                <span className="text-white text-xl" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}>🚀</span>
              </div>
            </div>
            <span className="text-xl font-black tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              <span className={`transition-colors duration-300 ${scrolled ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>Feast</span>
              <span className="text-[#ff5200]">Rocket</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-[#ff5200] bg-orange-50/90 dark:bg-orange-950/60'
                      : `hover:text-[#ff5200] hover:bg-orange-50/60 dark:hover:bg-orange-950/30 ${
                          scrolled ? 'text-gray-600 dark:text-gray-300' : 'text-gray-700 dark:text-gray-200'
                        }`
                  }`}
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#ff5200] rounded-full" />
                  )}
                </Link>
              );
            })}
            {dashLink && (
              <Link
                to={dashLink.to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:text-[#ff5200] hover:bg-orange-50 dark:hover:bg-orange-950/30 ${
                  scrolled ? 'text-gray-600 dark:text-gray-300' : 'text-gray-700 dark:text-gray-200'
                }`}
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                {dashLink.icon} {dashLink.label}
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                scrolled
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  : 'bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm text-gray-700 dark:text-gray-200 hover:bg-white/40'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDark
                ? <HiSun className="w-5 h-5 text-yellow-400" />
                : <HiMoon className="w-5 h-5" />
              }
            </button>

            {/* Favorites Icon */}
            <Link
              to="/restaurants?favorites=true"
              className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 hover:text-rose-500 ${
                scrolled
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                  : 'bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm text-gray-700 dark:text-gray-200 hover:bg-white/40'
              }`}
              title="Saved Favorites"
            >
              <HiHeart className={`w-5 h-5 transition-all ${favoriteCount > 0 ? 'text-rose-500 scale-110' : ''}`} style={favoriteCount > 0 ? { filter: 'drop-shadow(0 0 4px rgba(239,68,68,0.5))' } : {}} />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold rounded-full shadow-sm animate-bounce-in">
                  {favoriteCount > 9 ? '9+' : favoriteCount}
                </span>
              )}
            </Link>

            {/* Cart — pill with total when items exist */}
            {count > 0 ? (
              <Link
                to="/cart"
                className="flex items-center gap-2 pl-3 pr-4 py-2 gradient-primary text-white rounded-full shadow-md hover:shadow-orange-300/50 transition-all duration-200 hover:scale-105 active:scale-95 text-sm font-bold"
                style={{ fontFamily: 'Outfit, sans-serif', boxShadow: '0 4px 14px rgba(255,82,0,0.35)' }}
              >
                <HiShoppingCart className="w-4 h-4" />
                <span>{count}</span>
                <span className="text-white/80 font-normal text-xs border-l border-white/30 pl-2">₹{cartTotal.toFixed(0)}</span>
              </Link>
            ) : (
              <Link
                to="/cart"
                className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 hover:text-[#ff5200] ${
                  scrolled
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-950/40'
                    : 'bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm text-gray-700 dark:text-gray-200 hover:bg-white/40'
                }`}
                title="Shopping Cart"
              >
                <HiShoppingCart className="w-5 h-5" />
              </Link>
            )}

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-all duration-200 hover:scale-105 cursor-pointer ${
                    scrolled
                      ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      : 'bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/30'
                  }`}
                >
                  <div className="relative">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    {/* Online dot */}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white dark:border-gray-800 rounded-full" />
                  </div>
                  <span className={`hidden md:block text-sm font-medium max-w-[80px] truncate ${scrolled ? 'text-gray-700 dark:text-gray-200' : 'text-gray-800 dark:text-gray-100'}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-slide-up"
                    style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                    <div className="px-4 py-3.5 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/20 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                    {[
                      { to: '/profile', icon: <HiUser className="w-4 h-4 text-gray-400" />, label: 'My Profile' },
                      { to: '/orders', icon: <HiClipboardList className="w-4 h-4 text-gray-400" />, label: 'My Orders' },
                      { to: '/restaurants?favorites=true', icon: <HiHeart className="w-4 h-4 text-rose-500" />, label: 'Saved Favorites' },
                    ].map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50/70 dark:hover:bg-orange-950/30 hover:text-[#ff5200] transition-colors"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {item.icon} {item.label}
                      </Link>
                    ))}
                    {dashLink && (
                      <Link
                        to={dashLink.to}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50/70 dark:hover:bg-orange-950/30 hover:text-[#ff5200] transition-colors"
                      >
                        <span className="w-4 h-4 text-gray-400">{dashLink.icon}</span> {dashLink.label}
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border-t border-gray-100 dark:border-gray-800 transition-colors cursor-pointer font-medium"
                    >
                      <HiLogout className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className={`text-sm font-semibold hover:text-[#ff5200] transition-colors px-3 py-2 ${scrolled ? 'text-gray-700 dark:text-gray-200' : 'text-gray-800 dark:text-gray-100'}`}
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-5 rounded-full">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className={`md:hidden w-9 h-9 flex items-center justify-center rounded-full transition-all ${
                scrolled ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm'
              }`}
            >
              {menuOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/98 dark:bg-gray-950/98 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 px-4 pb-5 pt-2 animate-fade-in shadow-xl">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center justify-between py-3.5 text-sm font-semibold border-b border-gray-50 dark:border-gray-800/60 transition-colors ${
                location.pathname === link.to ? 'text-[#ff5200]' : 'text-gray-700 dark:text-gray-200 hover:text-[#ff5200]'
              }`}
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {link.label}
              {location.pathname === link.to && <span className="w-2 h-2 bg-[#ff5200] rounded-full" />}
            </Link>
          ))}
          <Link
            to="/restaurants?favorites=true"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-rose-500 border-b border-gray-50 dark:border-gray-800/60 transition-colors"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <HiHeart className="w-4 h-4 text-rose-500" /> Saved Favorites
            {favoriteCount > 0 && <span className="ml-auto w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{favoriteCount}</span>}
          </Link>
          {!isAuthenticated && (
            <div className="flex gap-3 mt-4">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-full border-2 border-[#ff5200] text-[#ff5200] text-sm font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-full btn-primary text-sm">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
