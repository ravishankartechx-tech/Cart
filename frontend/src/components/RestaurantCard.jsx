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

  const restaurantId = _id || id;
  const cuisineList = Array.isArray(cuisines) ? cuisines.join(', ') : cuisines;
  const favorited = isFavorite(restaurantId);

  const fallbackImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop';

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(restaurant);
    if (!favorited) {
      addToast(`Added "${name}" to your favorites! ❤️`, 'favorite');
    } else {
      addToast(`Removed "${name}" from favorites`, 'info');
    }
  };

  return (
    <Link to={`/restaurant/${restaurantId}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 card-hover relative transition-all duration-300 hover:shadow-xl dark:hover:shadow-black/50">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={coverImage || fallbackImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={e => { e.target.src = fallbackImage; }}
          />
          {/* Overlay Badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95"
          >
            <HiHeart
              className={`w-5 h-5 transition-colors ${
                favorited ? 'text-rose-500 fill-rose-500 scale-110' : 'text-gray-400 hover:text-rose-400'
              }`}
            />
          </button>

          {/* Closed overlay */}
          {!isOpen && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-white font-bold text-sm bg-black/70 px-4 py-1.5 rounded-full border border-white/20">
                Currently Closed
              </span>
            </div>
          )}

          {/* Tags row */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap pointer-events-none">
            {isPureVeg && (
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                🌿 Pure Veg
              </span>
            )}
            {tags.slice(0, 2).map(tag => (
              <span key={tag} className="badge badge-orange text-[10px] shadow-sm">{tag}</span>
            ))}
          </div>

          {/* Free delivery badge */}
          {deliveryFee === 0 && (
            <div className="absolute bottom-3 left-3 pointer-events-none">
              <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md tracking-wider">
                FREE DELIVERY
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight line-clamp-1 group-hover:text-[#ff5200] transition-colors">
              {name}
            </h3>
            {/* Rating badge */}
            <div className={`flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-lg font-bold text-sm shadow-sm ${
              rating >= 4 ? 'bg-green-600 text-white' :
              rating >= 3 ? 'bg-amber-500 text-white' :
              'bg-gray-400 text-white'
            }`}>
              <HiStar className="w-3.5 h-3.5" />
              <span className="text-xs">{rating ? Number(rating).toFixed(1) : 'New'}</span>
            </div>
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-1">{cuisineList}</p>

          {/* Divider */}
          <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <HiClock className="w-3.5 h-3.5 text-orange-500" />
              <span className="font-medium">{deliveryTime || '30-40 mins'}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <HiOutlineCurrencyRupee className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-medium">₹{costForTwo || 400} for two</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
