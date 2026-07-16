import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { HiOutlineArrowRight, HiOutlineSparkles, HiStar, HiClock, HiShieldCheck, HiLightningBolt } from 'react-icons/hi';
import OfferBanner from '../components/OfferBanner';
import RestaurantCard from '../components/RestaurantCard';
import { SkeletonCard } from '../components/SkeletonLoader';

const MOCK_RESTAURANTS = [
  {
    id: '1', name: 'Meghana Foods', cuisines: ['Biryani', 'Andhra', 'South Indian'],
    rating: 4.4, deliveryTime: '31 mins', costForTwo: 500,
    coverImage: 'https://images.pexels.com/photos/7353380/pexels-photo-7353380.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['Trending'], isPureVeg: false, deliveryFee: 40,
  },
  {
    id: '2', name: 'Empire Restaurant', cuisines: ['North Indian', 'Mughlai', 'Kebabs'],
    rating: 4.2, deliveryTime: '40 mins', costForTwo: 700,
    coverImage: 'https://images.pexels.com/photos/2233688/pexels-photo-2233688.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['Top Rated'], isPureVeg: false, deliveryFee: 0,
  },
  {
    id: '3', name: 'Truffles', cuisines: ['Burgers', 'Pasta', 'American'],
    rating: 4.6, deliveryTime: '25 mins', costForTwo: 800,
    coverImage: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['New'], isPureVeg: false, deliveryFee: 0,
  },
  {
    id: '4', name: 'Corner House Ice Cream', cuisines: ['Desserts', 'Ice Cream'],
    rating: 4.8, deliveryTime: '20 mins', costForTwo: 400,
    coverImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['Top Rated'], isPureVeg: true, deliveryFee: 0,
  },
  {
    id: '5', name: 'A2B — Adyar Ananda Bhavan', cuisines: ['South Indian', 'Sweets'],
    rating: 4.3, deliveryTime: '30 mins', costForTwo: 300,
    coverImage: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['Pure Veg'], isPureVeg: true, deliveryFee: 30,
  },
  {
    id: '6', name: 'California Burrito', cuisines: ['Mexican', 'Healthy'],
    rating: 4.5, deliveryTime: '25 mins', costForTwo: 500,
    coverImage: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['Trending'], isPureVeg: false, deliveryFee: 0,
  },
  {
    id: '7', name: 'Vidyarthi Bhavan', cuisines: ['South Indian', 'Breakfast'],
    rating: 4.7, deliveryTime: '28 mins', costForTwo: 250,
    coverImage: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['Iconic', 'Pure Veg'], isPureVeg: true, deliveryFee: 20,
  },
  {
    id: '8', name: 'Nandhana Palace', cuisines: ['South Indian', 'Andhra', 'Biryani'],
    rating: 4.4, deliveryTime: '35 mins', costForTwo: 600,
    coverImage: 'https://images.pexels.com/photos/7353380/pexels-photo-7353380.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['Trending'], isPureVeg: false, deliveryFee: 40,
  },
];

const CUISINE_ITEMS = [
  { emoji: '🍔', label: 'Burgers' },
  { emoji: '🍕', label: 'Pizza' },
  { emoji: '🫓', label: 'South Indian' },
  { emoji: '🍛', label: 'Biryani' },
  { emoji: '🥗', label: 'Healthy' },
  { emoji: '🍜', label: 'Chinese' },
  { emoji: '🌮', label: 'Mexican' },
  { emoji: '🍰', label: 'Desserts' },
  { emoji: '🍗', label: 'Andhra' },
  { emoji: '☕', label: 'Cafe' },
];

const STATS = [
  { icon: <HiShieldCheck className="w-6 h-6" />, label: '100% Safe', sub: 'Hygiene certified' },
  { icon: <HiLightningBolt className="w-6 h-6" />, label: '30 Min Delivery', sub: 'Or we refund ₹50' },
  { icon: <HiStar className="w-6 h-6" />, label: '50,000+ Dishes', sub: 'From 1,200 restaurants' },
  { icon: <HiClock className="w-6 h-6" />, label: '24/7 Support', sub: 'Always here for you' },
];

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const filteredRestaurants = MOCK_RESTAURANTS.filter(r => {
    const matchesCuisine = selectedCuisine
      ? r.cuisines.some(c => c.toLowerCase().includes(selectedCuisine.toLowerCase()))
      : true;
    return matchesCuisine;
  });

  return (
    <div className="w-full">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative gradient-hero dark:bg-gray-900 overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-200/30 dark:bg-orange-900/20 rounded-full blur-3xl -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-100/30 dark:bg-yellow-900/10 rounded-full blur-3xl -ml-40 -mb-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-[#ff5200] font-semibold text-sm">
                <HiOutlineSparkles className="w-4 h-4" />
                <span>AI-Powered Recommendations</span>
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 dark:text-white leading-[1.05] tracking-tight">
                Food that<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5200] to-[#fc8019]">
                  fuels your day
                </span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
                Order from 1,200+ restaurants. Fresh, fast, and delivered right to your doorstep in 30 minutes or less.
              </p>

              {/* Search bar */}
              <div className="flex gap-3 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-xl max-w-md">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <span className="text-xl">📍</span>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Enter your delivery location…"
                    className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none placeholder-gray-400"
                  />
                </div>
                <Link to="/restaurants" className="btn-primary px-5 py-2.5 text-sm rounded-xl whitespace-nowrap">
                  Find Food <HiOutlineArrowRight className="inline w-4 h-4 ml-1" />
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[11, 12, 13, 14].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i}`} alt=""
                      className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-yellow-400 text-xs">★</span>)}
                    <span className="text-sm font-bold text-gray-800 dark:text-white ml-1">4.9</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Loved by 2M+ customers</p>
                </div>
              </div>
            </div>

            {/* Right image */}
            <div className="relative hidden lg:block animate-slide-up">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff5200]/20 to-transparent rounded-[3rem] blur-3xl scale-110" />
              <img
                src="https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Delicious South Indian food"
                className="relative z-10 w-full h-[520px] object-cover rounded-[2.5rem] shadow-2xl animate-float"
              />
              <div className="absolute -bottom-6 -left-8 glassmorphism p-4 z-20 flex items-center gap-3 animate-bounce-in">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl">✅</div>
                <div>
                  <p className="text-sm font-black text-gray-900 dark:text-white">Order Delivered!</p>
                  <p className="text-xs text-gray-500">28 mins • 5⭐</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 glassmorphism p-3 z-20 text-center animate-bounce-in stagger-2">
                <p className="text-2xl font-black text-[#ff5200]">1,200+</p>
                <p className="text-xs text-gray-500">Restaurants</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 animate-fade-in stagger-${i + 1}`}>
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white shrink-0">
                  {s.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{s.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Offers Banner ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <OfferBanner />
      </section>

      {/* ── Cuisine Explorer ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">What's on your mind?</h2>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
          {CUISINE_ITEMS.map(item => (
            <button key={item.label}
              onClick={() => setSelectedCuisine(selectedCuisine === item.label ? '' : item.label)}
              className={`shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 min-w-[80px] ${
                selectedCuisine === item.label
                  ? 'border-[#ff5200] bg-orange-50 dark:bg-orange-900/20 scale-105'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#ff5200] hover:scale-105'
              }`}
            >
              <span className="text-3xl">{item.emoji}</span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Restaurant Grid ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            {selectedCuisine ? `${selectedCuisine} Restaurants` : 'All Restaurants Near You'}
            <span className="ml-2 text-base font-normal text-gray-500">({filteredRestaurants.length})</span>
          </h2>
          <Link to="/restaurants" className="text-[#ff5200] text-sm font-bold hover:underline flex items-center gap-1">
            See all <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : filteredRestaurants.map((r, i) => (
                <div key={r.id} className={`animate-fade-in stagger-${Math.min(i + 1, 4)}`}>
                  <RestaurantCard restaurant={r} />
                </div>
              ))
          }
        </div>

        {!loading && filteredRestaurants.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽</div>
            <p className="text-xl font-bold text-gray-700 dark:text-gray-200">No restaurants found</p>
            <p className="text-gray-400 mt-1">Try a different cuisine</p>
            <button onClick={() => setSelectedCuisine('')} className="btn-primary mt-5 px-8 py-2.5 text-sm">
              Show All
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
