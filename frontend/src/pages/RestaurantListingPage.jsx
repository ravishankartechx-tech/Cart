import { useState, useEffect } from 'react';
import { HiSearch, HiAdjustments } from 'react-icons/hi';
import RestaurantCard from '../components/RestaurantCard';
import FilterBar from '../components/FilterBar';
import { SkeletonCard } from '../components/SkeletonLoader';

const MOCK_RESTAURANTS = [
  { id: '1', name: 'Meghana Foods',             cuisines: ['Biryani', 'Andhra', 'South Indian'], rating: 4.4, deliveryTime: '31 mins', costForTwo: 500, coverImage: 'https://images.pexels.com/photos/7353380/pexels-photo-7353380.jpeg?auto=compress&cs=tinysrgb&w=600',   tags: ['Trending'],        isPureVeg: false, deliveryFee: 40 },
  { id: '2', name: 'Empire Restaurant',          cuisines: ['North Indian', 'Mughlai', 'Kebabs'],  rating: 4.2, deliveryTime: '40 mins', costForTwo: 700, coverImage: 'https://images.pexels.com/photos/2233688/pexels-photo-2233688.jpeg?auto=compress&cs=tinysrgb&w=600',  tags: ['Top Rated'],       isPureVeg: false, deliveryFee: 0 },
  { id: '3', name: 'Truffles',                   cuisines: ['Burgers', 'Pasta', 'American'],       rating: 4.6, deliveryTime: '25 mins', costForTwo: 800, coverImage: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600',  tags: ['New'],             isPureVeg: false, deliveryFee: 0 },
  { id: '4', name: 'Corner House Ice Cream',     cuisines: ['Desserts', 'Ice Cream', 'Shakes'],    rating: 4.8, deliveryTime: '20 mins', costForTwo: 400, coverImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',  tags: ['Top Rated'],       isPureVeg: true,  deliveryFee: 0 },
  { id: '5', name: 'A2B — Adyar Ananda Bhavan', cuisines: ['South Indian', 'Sweets', 'Pure Veg'], rating: 4.3, deliveryTime: '30 mins', costForTwo: 300, coverImage: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600',  tags: ['Pure Veg'],        isPureVeg: true,  deliveryFee: 30 },
  { id: '6', name: 'California Burrito',         cuisines: ['Mexican', 'Healthy', 'Salads'],       rating: 4.5, deliveryTime: '25 mins', costForTwo: 500, coverImage: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=600',   tags: ['Trending'],        isPureVeg: false, deliveryFee: 0 },
  { id: '7', name: 'Vidyarthi Bhavan',           cuisines: ['South Indian', 'Breakfast'],           rating: 4.7, deliveryTime: '28 mins', costForTwo: 250, coverImage: 'https://images.pexels.com/photos/4331489/pexels-photo-4331489.jpeg?auto=compress&cs=tinysrgb&w=600',  tags: ['Iconic', 'Pure Veg'], isPureVeg: true, deliveryFee: 20 },
  { id: '8', name: 'Nandhana Palace',            cuisines: ['South Indian', 'Andhra', 'Biryani'],  rating: 4.4, deliveryTime: '35 mins', costForTwo: 600, coverImage: 'https://images.pexels.com/photos/12737713/pexels-photo-12737713.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['Trending'],        isPureVeg: false, deliveryFee: 40 },
  { id: '9', name: 'The Bowl Company',           cuisines: ['Healthy', 'Salads', 'Bowls'],         rating: 4.2, deliveryTime: '28 mins', costForTwo: 450, coverImage: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600',  tags: ['Healthy'],         isPureVeg: true,  deliveryFee: 40 },
];

const RestaurantListingPage = () => {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ sort: '', veg: '', rating: '', cuisine: '', search: '' });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  // Filter and sort
  let results = [...MOCK_RESTAURANTS];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.cuisines.some(c => c.toLowerCase().includes(q))
    );
  }
  if (filters.veg === 'true') results = results.filter(r => r.isPureVeg);
  if (filters.rating) results = results.filter(r => r.rating >= parseFloat(filters.rating));
  if (filters.cuisine) results = results.filter(r => r.cuisines.some(c => c.toLowerCase().includes(filters.cuisine.toLowerCase())));

  if (filters.sort === 'rating') results.sort((a, b) => b.rating - a.rating);
  else if (filters.sort === 'cost_low') results.sort((a, b) => a.costForTwo - b.costForTwo);
  else if (filters.sort === 'cost_high') results.sort((a, b) => b.costForTwo - a.costForTwo);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          {/* Search */}
          <div className="relative max-w-lg">
            <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={filters.search}
              onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
              placeholder="Search for restaurant, cuisine..."
              className="input-base pl-11 h-11 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200"
            />
            {filters.search && (
              <button onClick={() => setFilters(p => ({ ...p, search: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <HiAdjustments className="text-gray-400 w-5 h-5 shrink-0" />
            <FilterBar filters={filters} onChange={setFilters} />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {loading ? 'Loading restaurants…' : `${results.length} restaurant${results.length !== 1 ? 's' : ''} found`}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(9).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : results.map((r, i) => (
                <div key={r.id} className={`animate-fade-in stagger-${Math.min(i % 4 + 1, 4)}`}>
                  <RestaurantCard restaurant={r} />
                </div>
              ))
          }
        </div>

        {!loading && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-7xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No results found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => setFilters({ sort: '', veg: '', rating: '', cuisine: '', search: '' })}
              className="mt-6 btn-primary px-8 py-2.5 text-sm"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantListingPage;
