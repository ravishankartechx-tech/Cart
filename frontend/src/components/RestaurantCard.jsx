import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiStar, HiClock, HiCurrencyRupee, HiHeart } from 'react-icons/hi';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';

const RestaurantCard = ({ restaurant }) => {
  const {
    _id, id,
    name, cuisines, rating,
    deliveryTime, costForTwo,
    coverImage, isOpen = true,
    tags = [], isPureVeg, deliveryFee,
    location, address,
  } = restaurant;

  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToast } = useToast();
  const [heartBurst, setHeartBurst] = useState(false);

  const restaurantId = _id || id;
  const cuisineList = Array.isArray(cuisines) ? cuisines.join(' • ') : cuisines;
  const favorited = isFavorite(restaurantId);

  const fallbackImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop';
  const areaName = location || address?.city || address?.street?.split(',')[0] || '';

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

  const numRating = Number(rating) || 4.2;
  const ratingBadgeClass = numRating >= 4.5
    ? 'bg-emerald-600 text-white'
    : numRating >= 4.0
    ? 'bg-emerald-500 text-white'
    : numRating >= 3.5
    ? 'bg-amber-500 text-white'
    : 'bg-gray-500 text-white';

  // Dynamic promo label
  const promoText = deliveryFee === 0
    ? 'FREE DELIVERY'
    : tags.includes('Trending')
    ? '50% OFF UPTO ₹100'
    : tags.includes('Top Rated')
    ? 'FLAT ₹120 OFF'
    : 'ITEMS AT ₹149';

  return (
    <Link to={`/restaurant/${restaurantId}`} className="block group select-none">
      <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100/80 dark:border-gray-800 shadow-sm transition-all duration-300 group-hover:shadow-2xl group-hover:border-orange-200/60 dark:group-hover:border-orange-900/40 group-hover:-translate-y-1.5 flex flex-col h-full">
        
        {/* Image Frame */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={coverImage || fallbackImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => { e.target.src = fallbackImage; }}
          />

          {/* Bottom scrim gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Top-Left: Veg and Tag Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap pointer-events-none">
            {isPureVeg && (
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 backdrop-blur-md">
                🌿 Pure Veg
              </span>
            )}
            {tags.slice(0, 1).map(tag => (
              <span key={tag} className="bg-black/60 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Top-Right: Wishlist Button */}
          <button
            onClick={handleFavoriteClick}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-900/80 backdrop-blur-md flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-90 cursor-pointer"
          >
            <HiHeart
              className={`w-5 h-5 transition-all duration-200 ${
                favorited ? 'text-rose-500 fill-rose-500 scale-110' : 'text-gray-400 group-hover:text-rose-400'
              } ${heartBurst ? 'animate-heart-burst' : ''}`}
            />
          </button>

          {/* Bottom Overlays on Image: Promo & Delivery Time */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
            <span className="text-white font-black text-xs tracking-wider uppercase drop-shadow-md bg-gradient-to-r from-orange-600 to-amber-600 px-2.5 py-1 rounded-lg shadow-lg">
              {promoText}
            </span>
            <span className="bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/15 shadow-md flex items-center gap-1">
              <HiClock className="w-3.5 h-3.5 text-orange-400" />
              {deliveryTime || '25-30 mins'}
            </span>
          </div>

          {/* Currently closed overlay */}
          {!isOpen && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center">
              <span className="text-white font-bold text-xs bg-black/80 px-4 py-1.5 rounded-full border border-white/20">
                Currently Closed
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white leading-tight line-clamp-1 group-hover:text-[#ff5200] transition-colors duration-200" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {name}
              </h3>
              
              {/* Star rating badge */}
              <div className={`flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-lg text-xs font-black shadow-xs ${ratingBadgeClass}`}>
                <HiStar className="w-3.5 h-3.5 fill-current" />
                <span>{numRating.toFixed(1)}</span>
              </div>
            </div>

            {/* Cuisine list */}
            <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-1 mb-2 font-medium">
              {cuisineList}
            </p>
          </div>

          {/* Footer details: Cost for two & Location */}
          <div className="border-t border-gray-100 dark:border-gray-800/80 pt-3 mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-300">
              <HiCurrencyRupee className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>₹{costForTwo || 400} for two</span>
            </div>
            {areaName ? (
              <span className="text-[11px] text-gray-400 dark:text-gray-500 truncate max-w-[120px]">
                {areaName}
              </span>
            ) : (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                {deliveryFee === 0 ? 'Free Delivery' : 'Fast Delivery'}
              </span>
            )}
          </div>
        </div>

      </div>
    </Link>
  );
};

export default RestaurantCard;
