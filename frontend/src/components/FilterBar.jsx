import { useState } from 'react';

const FILTERS = {
  sort: [
    { value: '', label: '⚡ All Cuisines' },
    { value: 'rating', label: '⭐ Rating 4.0+' },
    { value: 'delivery', label: '🚀 Fastest Delivery' },
    { value: 'cost_low', label: '💰 Price: Low to High' },
    { value: 'cost_high', label: '💎 Premium / High' },
  ],
  cuisine: [
    { name: 'Biryani', icon: '🍗' },
    { name: 'Pizza', icon: '🍕' },
    { name: 'Burger', icon: '🍔' },
    { name: 'Chinese', icon: '🍜' },
    { name: 'South Indian', icon: '🥞' },
    { name: 'North Indian', icon: '🍛' },
    { name: 'Desserts', icon: '🍰' },
    { name: 'Healthy', icon: '🥗' },
    { name: 'Sushi', icon: '🍣' },
    { name: 'Mexican', icon: '🌮' },
  ],
};

const FilterBar = ({ filters, onChange }) => {
  const [showCuisines, setShowCuisines] = useState(false);

  const toggle = (key, value) => {
    onChange({ ...filters, [key]: filters[key] === value ? '' : value });
  };

  const chip = (active, label, onClick) => (
    <button
      key={label}
      onClick={onClick}
      className={`shrink-0 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all duration-200 cursor-pointer select-none tap-active ${
        active
          ? 'gradient-primary text-white border-transparent shadow-md shadow-orange-500/25 scale-[1.03]'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200/80 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-800 hover:text-[#ff5200]'
      }`}
      style={{ fontFamily: 'Outfit, sans-serif' }}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-2.5 w-full">
      {/* Top row: Sort, Veg toggle, Rating, and Cuisine expander */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
        {chip(filters.sort === '', '⚡ Relevance', () => toggle('sort', ''))}
        {chip(filters.rating === '4', '⭐ Rating 4.0+', () => toggle('rating', '4'))}
        {chip(filters.veg === 'true', '🌿 Pure Veg', () => toggle('veg', 'true'))}
        {chip(filters.sort === 'cost_low', '💰 Price: Low to High', () => toggle('sort', 'cost_low'))}
        {chip(filters.sort === 'cost_high', '💎 Price: High to Low', () => toggle('sort', 'cost_high'))}
        
        <button
          onClick={() => setShowCuisines(v => !v)}
          className={`shrink-0 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all duration-200 cursor-pointer select-none tap-active ${
            showCuisines || filters.cuisine
              ? 'gradient-primary text-white border-transparent shadow-md shadow-orange-500/25'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200/80 dark:border-gray-700 hover:border-orange-400'
          }`}
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          🍽️ Cuisines {filters.cuisine ? `(${filters.cuisine})` : '▾'}
        </button>
      </div>

      {/* Expandable cuisine chips */}
      {showCuisines && (
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1 animate-fade-in">
          {FILTERS.cuisine.map(c => chip(
            filters.cuisine === c.name,
            `${c.icon} ${c.name}`,
            () => toggle('cuisine', c.name)
          ))}
        </div>
      )}

      {/* Active filter summary pill bar */}
      {(filters.sort || filters.veg || filters.rating || filters.cuisine) && (
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
          <span className="text-gray-400 dark:text-gray-500 font-semibold">Active:</span>
          {filters.sort && <span className="badge badge-orange">{filters.sort}</span>}
          {filters.veg && <span className="badge badge-green">Pure Veg</span>}
          {filters.rating && <span className="badge badge-blue">4.0+ Stars</span>}
          {filters.cuisine && <span className="badge badge-orange">{filters.cuisine}</span>}
          <button
            onClick={() => onChange({ sort: '', veg: '', rating: '', cuisine: '', search: filters.search })}
            className="text-xs text-red-500 hover:text-red-700 font-bold underline ml-auto cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
