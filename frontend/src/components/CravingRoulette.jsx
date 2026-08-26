import { useState } from 'react';
import confetti from 'canvas-confetti';
import { HiSparkles, HiRefresh, HiCheck } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const CRAVINGS = [
  { id: 'spicy', label: 'Spicy Rush', emoji: '🌶️', color: 'from-red-500 to-rose-600', filter: 'Spicy' },
  { id: 'biryani', label: 'Biryani Love', emoji: '🍗', color: 'from-amber-500 to-orange-600', filter: 'Biryani' },
  { id: 'pizza', label: 'Pizza & Pasta', emoji: '🍕', color: 'from-orange-500 to-red-500', filter: 'Pizza' },
  { id: 'healthy', label: 'Clean & Veg', emoji: '🥗', color: 'from-emerald-500 to-teal-600', filter: 'Pure Veg' },
  { id: 'burger', label: 'Juicy Burgers', emoji: '🍔', color: 'from-yellow-500 to-amber-600', filter: 'Burgers' },
  { id: 'asian', label: 'Asian & Sushi', emoji: '🍣', color: 'from-pink-500 to-rose-500', filter: 'Japanese' },
  { id: 'desserts', label: 'Sweet Tooth', emoji: '🍰', color: 'from-purple-500 to-pink-500', filter: 'Desserts' },
];

const CravingRoulette = ({ restaurants = [], onSelectCraving, activeCraving }) => {
  const [randomPick, setRandomPick] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSurpriseMe = () => {
    if (!restaurants || restaurants.length === 0) return;
    setIsSpinning(true);

    let count = 0;
    const interval = setInterval(() => {
      const random = restaurants[Math.floor(Math.random() * restaurants.length)];
      setRandomPick(random);
      count++;
      if (count > 8) {
        clearInterval(interval);
        setIsSpinning(false);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff5200', '#fc8019', '#60b246', '#ffd700']
          });
        } catch {
          // ignore if canvas-confetti is not loaded
        }
      }
    }, 90);
  };

  return (
    <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-rose-500/10 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-rose-950/30 rounded-3xl p-6 sm:p-8 border border-orange-200/60 dark:border-orange-900/40 my-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/50 text-[#ff5200] dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-2">
            <HiSparkles className="w-3.5 h-3.5" /> What are you craving today?
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Explore by Mood & Flavors
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Tap a mood to quickly filter dishes, or let our food roulette decide for you!
          </p>
        </div>

        {/* Surprise Button */}
        <button
          onClick={handleSurpriseMe}
          disabled={isSpinning}
          className="gradient-primary text-white font-extrabold px-6 py-3 rounded-2xl shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shrink-0 disabled:opacity-75 cursor-pointer"
        >
          <HiRefresh className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>{isSpinning ? 'Picking your meal...' : '🎲 Surprise Me!'}</span>
        </button>
      </div>

      {/* Craving Mood Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => onSelectCraving?.(null)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
            !activeCraving
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <span>🌟</span>
          <span>All Cravings</span>
        </button>

        {CRAVINGS.map((craving) => {
          const isActive = activeCraving === craving.filter;
          return (
            <button
              key={craving.id}
              onClick={() => onSelectCraving?.(craving.filter)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? `bg-gradient-to-r ${craving.color} text-white shadow-lg shadow-orange-500/25 scale-105`
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:scale-102'
              }`}
            >
              <span className="text-base">{craving.emoji}</span>
              <span>{craving.label}</span>
              {isActive && <HiCheck className="w-4 h-4 ml-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Surprise Result Highlight Card */}
      {randomPick && (
        <div className="mt-6 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-orange-300 dark:border-orange-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <img
              src={randomPick.coverImage}
              alt={randomPick.name}
              className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-orange-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                  Winner Pick
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ⭐ {randomPick.rating} • {randomPick.deliveryTime}
                </span>
              </div>
              <h4 className="font-extrabold text-gray-900 dark:text-white text-base mt-0.5">
                {randomPick.name}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {Array.isArray(randomPick.cuisines) ? randomPick.cuisines.join(', ') : randomPick.cuisines}
              </p>
            </div>
          </div>

          <Link
            to={`/restaurant/${randomPick.id || randomPick._id}`}
            className="w-full sm:w-auto gradient-primary text-white text-xs font-black px-5 py-2.5 rounded-xl text-center shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            Order from Here →
          </Link>
        </div>
      )}
    </div>
  );
};

export default CravingRoulette;
