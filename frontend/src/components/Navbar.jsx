import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  HiShoppingCart, HiMenu, HiX, HiSun, HiMoon, HiUser,
  HiLogout, HiClipboardList, HiChartBar, HiTruck
} from 'react-icons/hi';

const Navbar = () => {
  const { getItemCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white text-lg">🚀</span>
            </div>
            <span className="text-xl font-black text-gray-900 dark:text-white">
              Feast<span className="text-[#ff5200]">Rocket</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'text-[#ff5200] bg-orange-50 dark:bg-orange-950'
                    : 'text-gray-600 dark:text-gray-300 hover:text-[#ff5200] hover:bg-orange-50 dark:hover:bg-orange-950'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {dashLink && (
              <Link to={dashLink.to} className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#ff5200] hover:bg-orange-50">
                {dashLink.icon} {dashLink.label}
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <HiSun className="w-5 h-5 text-yellow-400" /> : <HiMoon className="w-5 h-5" />}
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 hover:text-[#ff5200] transition-colors">
              <HiShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[#ff5200] text-white text-[10px] font-bold rounded-full animate-bounce-in">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[80px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <HiUser className="w-4 h-4 text-gray-400" /> My Profile
                    </Link>
                    <Link to="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <HiClipboardList className="w-4 h-4 text-gray-400" /> My Orders
                    </Link>
                    {dashLink && (
                      <Link to={dashLink.to} onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <span className="w-4 h-4 text-gray-400">{dashLink.icon}</span> {dashLink.label}
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-t border-gray-100 dark:border-gray-700">
                      <HiLogout className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-[#ff5200] transition-colors px-3 py-2">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-5 rounded-full">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(v => !v)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              {menuOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 pb-4 animate-fade-in">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-[#ff5200] border-b border-gray-50 dark:border-gray-800">
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="flex gap-3 mt-4">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-full border-2 border-[#ff5200] text-[#ff5200] text-sm font-semibold">Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-full btn-primary text-sm">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
