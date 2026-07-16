import { HiStar, HiCheckCircle } from 'react-icons/hi';

const StarRow = ({ rating, size = 'sm' }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <HiStar key={i} className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'} ${i <= rating ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-600'}`} />
    ))}
  </div>
);

const ReviewCard = ({ review }) => {
  const { user, rating, foodRating, deliveryRating, comment, isVerified, createdAt } = review;
  const dateStr = createdAt ? new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{user?.name || 'Anonymous'}</p>
              {isVerified && (
                <HiCheckCircle className="w-4 h-4 text-green-500" title="Verified Order" />
              )}
            </div>
            <p className="text-xs text-gray-400">{dateStr}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold text-white ${
          rating >= 4 ? 'bg-green-500' : rating >= 3 ? 'bg-yellow-500' : 'bg-red-400'
        }`}>
          <HiStar className="w-3.5 h-3.5" /> {rating}
        </div>
      </div>

      {/* Comment */}
      {comment && <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{comment}</p>}

      {/* Sub-ratings */}
      {(foodRating || deliveryRating) && (
        <div className="flex flex-wrap gap-4 pt-1 border-t border-gray-100 dark:border-gray-700">
          {foodRating && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Food</span>
              <StarRow rating={foodRating} />
            </div>
          )}
          {deliveryRating && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Delivery</span>
              <StarRow rating={deliveryRating} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
