import { Link } from 'react-router-dom';
import { HiStar, HiClock, HiOutlineCurrencyRupee } from 'react-icons/hi';

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

  const restaurantId = _id || id;
  const cuisineList = Array.isArray(cuisines) ? cuisines.join(', ') : cuisines;
  const tagColor = cuisines?.[0] ? (CUISINE_COLORS[cuisines[0]] || CUISINE_COLORS.default) : CUISINE_COLORS.default;

  const fallbackImage = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600';

  return (
    <Link to={`/restaurant/${restaurantId}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 card-hover">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={coverImage || fallbackImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={e => { e.target.src = fallbackImage; }}
          />
          {/* Overlay Badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Closed overlay */}
          {!isOpen && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg bg-black/60 px-4 py-1 rounded-full">Currently Closed</span>
            </div>
          )}

          {/* Tags row */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            {isPureVeg && (
              <span className="badge badge-green text-[10px]">🌿 Pure Veg</span>
            )}
            {tags.slice(0, 2).map(tag => (
              <span key={tag} className="badge badge-orange text-[10px]">{tag}</span>
            ))}
          </div>

          {/* Free delivery badge */}
          {deliveryFee === 0 && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">FREE DELIVERY</span>
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
            <div className={`flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-lg font-bold text-sm ${
              rating >= 4 ? 'bg-green-600 text-white' :
              rating >= 3 ? 'bg-yellow-500 text-white' :
              'bg-gray-400 text-white'
            }`}>
              <HiStar className="w-3.5 h-3.5" />
              <span className="text-xs">{rating ? Number(rating).toFixed(1) : 'New'}</span>
            </div>
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-1">{cuisineList}</p>

          {/* Divider */}
          <div className="border-t border-dashed border-gray-200 dark:border-gray-600 pt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <HiClock className="w-3.5 h-3.5" />
              <span className="font-medium">{deliveryTime || '30-40 mins'}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <HiOutlineCurrencyRupee className="w-3.5 h-3.5" />
              <span className="font-medium">₹{costForTwo || 400} for two</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
