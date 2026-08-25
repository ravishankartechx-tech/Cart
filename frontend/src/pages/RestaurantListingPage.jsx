import { useState, useEffect } from 'react';
import { HiSearch, HiAdjustments } from 'react-icons/hi';
import RestaurantCard from '../components/RestaurantCard';
import FilterBar from '../components/FilterBar';
import { SkeletonCard } from '../components/SkeletonLoader';
import { API_BASE_URL } from '../api/client';
import axios from 'axios';

const MOCK_RESTAURANTS = [
  { id: '1', name: 'Meghana Foods',             cuisines: ['Biryani', 'Andhra', 'South Indian'], rating: 4.6, deliveryTime: '31 mins', costForTwo: 500, coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop', tags: ['Trending'],        isPureVeg: false, deliveryFee: 40 },
  { id: '2', name: 'Empire Restaurant',          cuisines: ['North Indian', 'Mughlai', 'Kebabs'],  rating: 4.3, deliveryTime: '40 mins', costForTwo: 700, coverImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop', tags: ['Top Rated'],       isPureVeg: false, deliveryFee: 0 },
  { id: '3', name: 'Truffles',                   cuisines: ['Burgers', 'Pasta', 'American'],       rating: 4.7, deliveryTime: '25 mins', costForTwo: 800, coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop', tags: ['New'],             isPureVeg: false, deliveryFee: 0 },
  { id: '4', name: 'Corner House Ice Cream',     cuisines: ['Desserts', 'Ice Cream', 'Shakes'],    rating: 4.9, deliveryTime: '20 mins', costForTwo: 400, coverImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop', tags: ['Top Rated'],       isPureVeg: true,  deliveryFee: 0 },
  { id: '5', name: 'A2B — Adyar Ananda Bhavan', cuisines: ['South Indian', 'Sweets', 'Pure Veg'], rating: 4.4, deliveryTime: '30 mins', costForTwo: 300, coverImage: 'https://images.unsplash.com/photo-1630383249896-483b1fbf6e5f?w=800&auto=format&fit=crop', tags: ['Pure Veg'],        isPureVeg: true,  deliveryFee: 30 },
  { id: '6', name: 'La Piazza Trattoria',        cuisines: ['Italian', 'Pizza', 'Pasta'],          rating: 4.6, deliveryTime: '35 mins', costForTwo: 900, coverImage: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop', tags: ['Trending'],        isPureVeg: false, deliveryFee: 50 },
  { id: '7', name: 'Sakura Sushi & Ramen',       cuisines: ['Japanese', 'Sushi', 'Ramen'],         rating: 4.8, deliveryTime: '35 mins', costForTwo: 1200, coverImage: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&auto=format&fit=crop', tags: ['Premium'],         isPureVeg: false, deliveryFee: 60 },
  { id: '8', name: 'El Sombrero Mexican Grill',  cuisines: ['Mexican', 'Tacos', 'Burritos'],       rating: 4.5, deliveryTime: '28 mins', costForTwo: 600, coverImage: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop', tags: ['Spicy'],           isPureVeg: false, deliveryFee: 35 },
  { id: '9', name: 'Dragon Palace',              cuisines: ['Chinese', 'Dim Sum', 'Noodles'],      rating: 4.4, deliveryTime: '30 mins', costForTwo: 650, coverImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop', tags: ['Top Rated'],       isPureVeg: false, deliveryFee: 40 },
];

const RestaurantListingPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ sort: '', veg: '', rating: '', cuisine: '', search: '' });

  useEffect(() => {
    fetchRestaurants();
  }, [filters]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.cuisine) params.cuisine = filters.cuisine;
      if (filters.rating) params.rating = filters.rating;
      if (filters.veg) params.veg = filters.veg;
      if (filters.sort) params.sort = filters.sort;

      const res = await axios.get(`${API_BASE_URL}/restaurants`, { params, timeout: 3500 });
      if (res.data?.success && res.data.restaurants?.length > 0) {
        // Transform backend response to match card requirements
        const mapped = res.data.restaurants.map(r => ({
          id: r._id || r.id,
          name: r.name,
          cuisines: r.cuisines || [],
          rating: r.rating || 4.2,
          deliveryTime: r.deliveryTime || '30 mins',
          costForTwo: r.costForTwo || 500,
          coverImage: r.coverImage || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop',
          tags: r.tags || [],
          isPureVeg: r.isPureVeg || false,
          deliveryFee: r.deliveryFee !== undefined ? r.deliveryFee : 40,
        }));
        setRestaurants(mapped);
        setLoading(false);
        return;
      }
    } catch {
      // Backend not running or error - fallback to local filter logic
    }

    // Fallback to client-side filtering on mock data
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

    setRestaurants(results);
    setLoading(false);
  };

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
          {loading ? 'Loading restaurants…' : `${restaurants.length} restaurant${restaurants.length !== 1 ? 's' : ''} found`}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(9).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : restaurants.map((r, i) => (
                <div key={r.id} className={`animate-fade-in stagger-${Math.min(i % 4 + 1, 4)}`}>
                  <RestaurantCard restaurant={r} />
                </div>
              ))
          }
        </div>

        {!loading && restaurants.length === 0 && (
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
