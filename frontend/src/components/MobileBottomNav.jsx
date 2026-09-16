import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import {
  HiHome,
  HiOutlineHome,
  HiSearch,
  HiOutlineSearch,
  HiShoppingCart,
  HiOutlineShoppingCart,
  HiHeart,
  HiOutlineHeart,
  HiUser,
  HiOutlineUser,
} from 'react-icons/hi';

const MobileBottomNav = () => {
  const location = useLocation();
  const { getItemCount, getCartTotal, openCartDrawer } = useCart();
  const { isAuthenticated } = useAuth();
  const { favoriteCount } = useFavorites();

  const count = getItemCount();
  const cartTotal = getCartTotal();

  const isHome = location.pathname === '/';
  const isExplore = location.pathname === '/restaurants' && !location.search.includes('favorites=true');
  const isFavorites = location.search.includes('favorites=true');
  const isCart = location.pathname === '/cart';
  const isProfile = location.pathname === '/profile' || location.pathname === '/orders' || location.pathname === '/login';

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden mobile-bottom-nav"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1 max-w-lg mx-auto">
        
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 transition-all tap-active ${
            isHome ? 'text-[#ff5200] font-black' : 'text-gray-500 dark:text-gray-400 font-medium'
          }`}
        >
          <div className="relative">
            {isHome ? <HiHome className="w-6 h-6" /> : <HiOutlineHome className="w-6 h-6" />}
            {isHome && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#ff5200] rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Home
          </span>
        </Link>

        {/* 2. Explore */}
        <Link
          to="/restaurants"
          className={`flex flex-col items-center justify-center py-1 transition-all tap-active ${
            isExplore ? 'text-[#ff5200] font-black' : 'text-gray-500 dark:text-gray-400 font-medium'
          }`}
        >
          <div className="relative">
            {isExplore ? <HiSearch className="w-6 h-6" /> : <HiOutlineSearch className="w-6 h-6" />}
            {isExplore && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#ff5200] rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Explore
          </span>
        </Link>

        {/* 3. Cart Button — opens drawer or shows count */}
        <button
          onClick={openCartDrawer}
          className="flex flex-col items-center justify-center py-1 transition-all tap-active relative cursor-pointer"
          aria-label="Open cart drawer"
        >
          <div className="relative">
            {count > 0 ? (
              <div className="w-10 h-10 -mt-3 gradient-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30 transform transition-transform active:scale-90">
                <HiShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-[10px] font-black rounded-full flex items-center justify-center shadow-md">
                  {count > 9 ? '9+' : count}
                </span>
              </div>
            ) : (
              <div className={isCart ? 'text-[#ff5200]' : 'text-gray-500 dark:text-gray-400'}>
                {isCart ? <HiShoppingCart className="w-6 h-6" /> : <HiOutlineShoppingCart className="w-6 h-6" />}
              </div>
            )}
          </div>
          <span className={`text-[10px] mt-1 tracking-tight font-semibold ${count > 0 ? 'text-[#ff5200] font-bold' : isCart ? 'text-[#ff5200]' : 'text-gray-500 dark:text-gray-400'}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
            {count > 0 ? `₹${cartTotal.toFixed(0)}` : 'Cart'}
          </span>
        </button>

        {/* 4. Favorites */}
        <Link
          to="/restaurants?favorites=true"
          className={`flex flex-col items-center justify-center py-1 transition-all tap-active ${
            isFavorites ? 'text-rose-500 font-black' : 'text-gray-500 dark:text-gray-400 font-medium'
          }`}
        >
          <div className="relative">
            {isFavorites ? <HiHeart className="w-6 h-6 text-rose-500" /> : <HiOutlineHeart className="w-6 h-6" />}
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
            {isFavorites && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Saved
          </span>
        </Link>

        {/* 5. Account */}
        <Link
          to={isAuthenticated ? '/profile' : '/login'}
          className={`flex flex-col items-center justify-center py-1 transition-all tap-active ${
            isProfile ? 'text-[#ff5200] font-black' : 'text-gray-500 dark:text-gray-400 font-medium'
          }`}
        >
          <div className="relative">
            {isProfile ? <HiUser className="w-6 h-6" /> : <HiOutlineUser className="w-6 h-6" />}
            {isProfile && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#ff5200] rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Account
          </span>
        </Link>

      </div>
    </nav>
  );
};

export default MobileBottomNav;
