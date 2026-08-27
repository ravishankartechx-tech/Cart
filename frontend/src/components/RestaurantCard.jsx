import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiStar, HiClock, HiOutlineCurrencyRupee, HiHeart } from 'react-icons/hi';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';

const CUISINE_COLORS = {
  'Biryani': 'bg-amber-100 text-amber-700',
  'South Indian': 'bg-green-100 text-green-700',
  'North Indian': 'bg-orange-100 text-orange-700',
  'Chinese': 'bg-red-100 text-red-700',
  'Pizza': 'bg-blue-100 text-blue-700',
  'Burger': 'bg-yellow-100 text-yellow-700',
  'Desserts': 'bg-pink-100 text-pink-700',
  'default': 'bg-gray-100 text-gray-600',
};

// Tint the image overlay per cuisine type
const CUISINE_TINTS = {
  'Biryani': 'rgba(245,158,11,0.2)',
  'South Indian': 'rgba(34,197,94,0.15)',
  'North Indian': 'rgba(249,115,22,0.2)',
  'Chinese': 'rgba(239,68,68,0.18)',
  'Pizza': 'rgba(59,130,246,0.15)',
  'Japanese': 'rgba(236,72,153,0.15)',
  'Mexican': 'rgba(234,179,8,0.18)',
  'Korean': 'rgba(168,85,247,0.15)',
  'Thai': 'rgba(20,184,166,0.15)',
  'Lebanese': 'rgba(234,88,12,0.15)',
  'default': 'rgba(0,0,0,0)',
};

const getCuisineTint = (cuisines) => {
  if (!cuisines || !cuisines.length) return CUISINE_TINTS.default;
  for (const c of cuisines) {
    const key = Object.keys(CUISINE_TINTS).find(k => c.toLowerCase().includes(k.toLowerCase()));
    if (key) return CUISINE_TINTS[key];
  }
  return CUISINE_TINTS.default;
};

const RestaurantCard = ({ restaurant }) => {
  const {
    _id, id,
    name, cuisines, rating,
    deliveryTime, costForTwo,
    coverImage, isOpen = true,
    tags = [], isPureVeg, deliveryFee,
  } = restaurant;

  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToast } = useToast();
  const [heartBurst, setHeartBurst] = useState(false);

  const restaurantId = _id || id;
  const cuisineList = Array.isArray(cuisines) ? cuisines.join(', ') : cuisines;
  const favorited = isFavorite(restaurantId);
  const tint = getCuisineTint(Array.isArray(cuisines) ? cuisines : [cuisines]);

  const fallbackImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop';

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 500);
    toggleFavorite(restaurant);
    if (!favorited) {
      addToast(`Added "${name}" to your favorites! ❤️`, 'favorite');
    } else {
      addToast(`Removed "${name}" from favorites`, 'info');
    }
  };

  const ratingColor = rating >= 4.5
    ? { bg: 'linear-gradient(135deg, #16a34a, #15803d)', shadow: 'rgba(22,163,74,0.4)' }
    : rating >= 4.0
    ? { bg: 'linear-gradient(135deg, #22c55e, #16a34a)', shadow: 'rgba(34,197,94,0.35)' }
    : rating >= 3.5
    ? { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', shadow: 'rgba(245,158,11,0.35)' }
    : { bg: 'linear-gradient(135deg, #9ca3af, #6b7280)', shadow: 'rgba(107,114,128,0.3)' };

  return (
    <Link to={`/restaurant/${restaurantId}`} className="block group">
      <div className="card-premium shimmer-hover bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 card-hover relative transition-all duration-300 group-hover:shadow-2xl dark:group-hover:shadow-black/60"
        style={{ '--shimmer-color': 'rgba(255,255,255,0.18)' }}>

        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={coverImage || fallbackImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            style={{ transform: 'scale(1.01)' }}
            loading="lazy"
            onError={e => { e.target.src = fallbackImage; }}
          />

          {/* Cuisine-tinted gradient overlay */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to top, rgba(0,0,0,0.55) 0%, ${tint} 50%, rgba(0,0,0,0.15) 100%)`,
              transition: 'background 0.3s ease',
            }}
          />

          {/* Favorite Button with burst */}
          <button
            onClick={handleFavoriteClick}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-90"
            style={favorited ? { boxShadow: '0 0 12px rgba(239,68,68,0.4)' } : {}}
          >
            <HiHeart
              className={`w-5 h-5 transition-all duration-200 ${
                favorited ? 'text-rose-500' : 'text-gray-400 group-hover:text-rose-300'
              } ${heartBurst ? 'animate-heart-burst' : ''}`}
              style={favorited ? { filter: 'drop-shadow(0 0 3px rgba(239,68,68,0.6))' } : {}}
            />
          </button>

          {/* Closed overlay */}
          {!isOpen && (
            <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-white font-bold text-sm bg-black/60 px-4 py-1.5 rounded-full border border-white/20">
                Currently Closed
              </span>
            </div>
          )}

          {/* Tags row */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap pointer-events-none">
            {isPureVeg && (
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md"
                style={{ boxShadow: '0 2px 8px rgba(34,197,94,0.4)' }}>
                🌿 Pure Veg
              </span>
            )}
            {tags.slice(0, 2).map(tag => (
              <span key={tag} className="badge badge-orange text-[10px] shadow-sm backdrop-blur-sm bg-white/90 dark:bg-gray-900/90"
                style={{ color: '#ea580c', fontFamily: 'Outfit, sans-serif' }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Free delivery badge */}
          {deliveryFee === 0 && (
            <div className="absolute bottom-3 left-3 pointer-events-none">
              <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-lg tracking-wider"
                style={{ boxShadow: '0 4px 12px rgba(34,197,94,0.5)', fontFamily: 'Outfit, sans-serif' }}>
                FREE DELIVERY
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight line-clamp-1 group-hover:text-[#ff5200] transition-colors duration-200"
              style={{ fontFamily: 'Outfit, sans-serif' }}>
              {name}
            </h3>
            {/* Rating badge */}
            <div
              className="flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-lg font-bold text-sm shadow-md"
              style={{ background: ratingColor.bg, boxShadow: `0 4px 12px ${ratingColor.shadow}`, color: 'white' }}
            >
              <HiStar className="w-3.5 h-3.5" />
              <span className="text-xs">{rating ? Number(rating).toFixed(1) : 'New'}</span>
            </div>
          </div>

          <p className="text-gray-400 dark:text-gray-500 text-xs mb-3.5 line-clamp-1">{cuisineList}</p>

          {/* Divider + footer */}
          <div className="border-t border-dashed border-gray-100 dark:border-gray-800 pt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-orange-50 dark:bg-orange-950/30 rounded-lg flex items-center justify-center">
                <HiClock className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <span className="font-semibold">{deliveryTime || '30-40 mins'}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg flex items-center justify-center">
                <HiOutlineCurrencyRupee className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-semibold">₹{costForTwo || 400} for two</span>
            </div>
          </div>
        </div>

        {/* Bottom gradient glow accent */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(90deg, transparent, #ff5200, #fc8019, transparent)' }} />
      </div>
    </Link>
  );
};

export default RestaurantCard;
