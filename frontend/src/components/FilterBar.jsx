import { useState } from 'react';

const FILTERS = {
  sort: [
    { value: '', label: 'Relevance' },
    { value: 'rating', label: '⭐ Rating' },
    { value: 'delivery', label: '⚡ Fastest' },
    { value: 'cost_low', label: '💰 Price: Low' },
    { value: 'cost_high', label: '💰 Price: High' },
  ],
  cuisine: [
    'Biryani', 'Pizza', 'Burger', 'Chinese', 'South Indian',
    'North Indian', 'Desserts', 'Healthy', 'Sushi', 'Mexican',
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
      className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
        active
          ? 'bg-[#ff5200] text-white border-[#ff5200] shadow-md scale-105'
          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-[#ff5200] hover:text-[#ff5200]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-3">
      {/* Top row: Sort + Veg toggle */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
        {FILTERS.sort.map(s => chip(filters.sort === s.value, s.label, () => toggle('sort', s.value)))}
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-600 shrink-0 mx-1" />
        {chip(filters.veg === 'true', '🌿 Pure Veg', () => toggle('veg', 'true'))}
        {chip(filters.rating === '4', '⭐ 4.0+', () => toggle('rating', '4'))}
        <button
          onClick={() => setShowCuisines(v => !v)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
            showCuisines
              ? 'bg-[#ff5200] text-white border-[#ff5200]'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-[#ff5200]'
          }`}
        >
          🍽 Cuisines {filters.cuisine ? `(${filters.cuisine})` : '▾'}
        </button>
      </div>

      {/* Cuisine chips */}
      {showCuisines && (
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 animate-fade-in">
          {FILTERS.cuisine.map(c => chip(filters.cuisine === c, c, () => toggle('cuisine', c)))}
        </div>
      )}

      {/* Active filter summary + clear */}
      {(filters.sort || filters.veg || filters.rating || filters.cuisine) && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Active filters:</span>
          {filters.sort && <span className="badge badge-orange">{filters.sort}</span>}
          {filters.veg && <span className="badge badge-green">Pure Veg</span>}
          {filters.rating && <span className="badge badge-blue">4.0+ Stars</span>}
          {filters.cuisine && <span className="badge badge-orange">{filters.cuisine}</span>}
          <button
            onClick={() => onChange({ sort: '', veg: '', rating: '', cuisine: '', search: filters.search })}
            className="text-xs text-red-500 hover:text-red-700 font-medium underline ml-auto"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
