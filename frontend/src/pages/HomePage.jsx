import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineSparkles, HiStar, HiClock, HiShieldCheck, HiLightningBolt, HiSearch } from 'react-icons/hi';
import OfferBanner from '../components/OfferBanner';
import RestaurantCard from '../components/RestaurantCard';
import CravingRoulette from '../components/CravingRoulette';
import { SkeletonCard } from '../components/SkeletonLoader';

const MOCK_RESTAURANTS = [
  // 🇮🇳 India
  {
    id: '1', name: 'Meghana Foods', cuisines: ['Biryani', 'Andhra', 'South Indian'],
    rating: 4.6, deliveryTime: '31 mins', costForTwo: 500,
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop',
    tags: ['Trending'], isPureVeg: false, deliveryFee: 40, country: '🇮🇳 India',
  },
  {
    id: '2', name: 'Punjabi Dhaba', cuisines: ['North Indian', 'Mughlai', 'Kebabs'],
    rating: 4.4, deliveryTime: '40 mins', costForTwo: 700,
    coverImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop',
    tags: ['Top Rated'], isPureVeg: false, deliveryFee: 0, country: '🇮🇳 India',
  },
  {
    id: '3', name: 'Vidyarthi Bhavan', cuisines: ['South Indian', 'Breakfast'],
    rating: 4.7, deliveryTime: '28 mins', costForTwo: 250,
    coverImage: 'https://images.unsplash.com/photo-1630383249896-483b1fbf6e5f?w=600&auto=format&fit=crop',
    tags: ['Iconic', 'Pure Veg'], isPureVeg: true, deliveryFee: 20, country: '🇮🇳 India',
  },
  // 🇮🇹 Italy
  {
    id: '4', name: 'La Piazza', cuisines: ['Pizza', 'Pasta', 'Italian'],
    rating: 4.6, deliveryTime: '35 mins', costForTwo: 900,
    coverImage: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop',
    tags: ['Trending'], isPureVeg: false, deliveryFee: 50, country: '🇮🇹 Italy',
  },
  {
    id: '5', name: 'Pasta Roma', cuisines: ['Pasta', 'Italian', 'Continental'],
    rating: 4.3, deliveryTime: '30 mins', costForTwo: 800,
    coverImage: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&auto=format&fit=crop',
    tags: ['New'], isPureVeg: false, deliveryFee: 0, country: '🇮🇹 Italy',
  },
  // 🇨🇳 China
  {
    id: '6', name: 'Dragon Palace', cuisines: ['Chinese', 'Dim Sum', 'Noodles'],
    rating: 4.5, deliveryTime: '25 mins', costForTwo: 600,
    coverImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop',
    tags: ['Top Rated'], isPureVeg: false, deliveryFee: 30, country: '🇨🇳 China',
  },
  {
    id: '7', name: 'Wok & Roll', cuisines: ['Chinese', 'Thai', 'Asian'],
    rating: 4.1, deliveryTime: '20 mins', costForTwo: 500,
    coverImage: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&auto=format&fit=crop',
    tags: ['Trending'], isPureVeg: false, deliveryFee: 0, country: '🇨🇳 China',
  },
  // 🇲🇽 Mexico
  {
    id: '8', name: 'El Sombrero', cuisines: ['Mexican', 'Tacos', 'Burritos'],
    rating: 4.4, deliveryTime: '28 mins', costForTwo: 700,
    coverImage: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop',
    tags: ['Spicy'], isPureVeg: false, deliveryFee: 40, country: '🇲🇽 Mexico',
  },
  {
    id: '9', name: 'Taco Fiesta', cuisines: ['Mexican', 'Nachos', 'Quesadilla'],
    rating: 4.2, deliveryTime: '22 mins', costForTwo: 600,
    coverImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop',
    tags: ['Trending'], isPureVeg: false, deliveryFee: 0, country: '🇲🇽 Mexico',
  },
  // 🇯🇵 Japan
  {
    id: '10', name: 'Sakura Sushi', cuisines: ['Japanese', 'Sushi', 'Ramen'],
    rating: 4.8, deliveryTime: '40 mins', costForTwo: 1200,
    coverImage: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&auto=format&fit=crop',
    tags: ['Premium'], isPureVeg: false, deliveryFee: 60, country: '🇯🇵 Japan',
  },
  {
    id: '11', name: 'Tokyo Ramen House', cuisines: ['Japanese', 'Ramen', 'Noodles'],
    rating: 4.6, deliveryTime: '35 mins', costForTwo: 900,
    coverImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop',
    tags: ['Top Rated'], isPureVeg: false, deliveryFee: 50, country: '🇯🇵 Japan',
  },
  // 🇺🇸 USA
  {
    id: '12', name: 'The Burger Joint', cuisines: ['Burgers', 'American', 'Fries'],
    rating: 4.5, deliveryTime: '25 mins', costForTwo: 800,
    coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop',
    tags: ['Trending'], isPureVeg: false, deliveryFee: 0, country: '🇺🇸 USA',
  },
  {
    id: '13', name: 'BBQ Nation', cuisines: ['American', 'BBQ', 'Grills'],
    rating: 4.3, deliveryTime: '45 mins', costForTwo: 1000,
    coverImage: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&auto=format&fit=crop',
    tags: ['Smoky'], isPureVeg: false, deliveryFee: 70, country: '🇺🇸 USA',
  },
  // 🇹🇭 Thailand
  {
    id: '14', name: 'Thai Orchid', cuisines: ['Thai', 'Curry', 'Pad Thai'],
    rating: 4.4, deliveryTime: '30 mins', costForTwo: 700,
    coverImage: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&auto=format&fit=crop',
    tags: ['Spicy'], isPureVeg: false, deliveryFee: 40, country: '🇹🇭 Thailand',
  },
  // 🇱🇧 Lebanon
  {
    id: '15', name: 'Beirut Bites', cuisines: ['Lebanese', 'Shawarma', 'Falafel'],
    rating: 4.5, deliveryTime: '25 mins', costForTwo: 600,
    coverImage: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=600&auto=format&fit=crop',
    tags: ['Top Rated'], isPureVeg: false, deliveryFee: 0, country: '🇱🇧 Lebanon',
  },
  // 🇰🇷 Korea
  {
    id: '16', name: 'Seoul Kitchen', cuisines: ['Korean', 'BBQ', 'Bibimbap'],
    rating: 4.7, deliveryTime: '35 mins', costForTwo: 900,
    coverImage: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop',
    tags: ['Trending'], isPureVeg: false, deliveryFee: 50, country: '🇰🇷 Korea',
  },
];

const COUNTRIES = [
  { flag: '🌍', label: 'All' },
  { flag: '🇮🇳', label: 'India' },
  { flag: '🇮🇹', label: 'Italy' },
  { flag: '🇨🇳', label: 'China' },
  { flag: '🇲🇽', label: 'Mexico' },
  { flag: '🇯🇵', label: 'Japan' },
  { flag: '🇺🇸', label: 'USA' },
  { flag: '🇹🇭', label: 'Thailand' },
  { flag: '🇱🇧', label: 'Lebanon' },
  { flag: '🇰🇷', label: 'Korea' },
];

const STATS = [
  { icon: <HiShieldCheck className="w-6 h-6" />, label: '100% Safe', sub: 'Hygiene certified' },
  { icon: <HiLightningBolt className="w-6 h-6" />, label: '30 Min Delivery', sub: 'Or we refund ₹50' },
  { icon: <HiStar className="w-6 h-6" />, label: '50,000+ Dishes', sub: 'From 1,200 restaurants' },
  { icon: <HiClock className="w-6 h-6" />, label: '24/7 Support', sub: 'Always here for you' },
];

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [activeCraving, setActiveCraving] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/restaurants');
    }
  };

  const filteredRestaurants = MOCK_RESTAURANTS.filter(r => {
    const matchesCountry = selectedCountry === 'All' ? true : r.country.includes(selectedCountry);
    const matchesCraving = !activeCraving
      ? true
      : activeCraving === 'Pure Veg'
      ? r.isPureVeg
      : r.cuisines.some(c => c.toLowerCase().includes(activeCraving.toLowerCase())) ||
        r.tags.some(t => t.toLowerCase().includes(activeCraving.toLowerCase()));

    return matchesCountry && matchesCraving;
  });

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative gradient-hero dark:bg-gray-900 overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-200/30 dark:bg-orange-900/20 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-100/30 dark:bg-yellow-900/10 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/40 text-[#ff5200] font-bold text-sm shadow-sm">
                <HiOutlineSparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
                <span>World Cuisines Delivered In 30 Mins</span>
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 dark:text-white leading-[1.05] tracking-tight">
                Crave it.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5200] via-[#fc8019] to-amber-500">
                  We deliver it.
                </span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
                Indian, Italian, Japanese, Mexican, and more — 1,200+ top-rated restaurants with lightning fast contactless delivery.
              </p>

              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="flex gap-2 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-xl max-w-md border border-gray-100 dark:border-gray-700">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <HiSearch className="text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Search dishes, restaurants, cuisines..."
                    className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none placeholder-gray-400"
                  />
                </div>
                <button type="submit" className="btn-primary px-5 py-2.5 text-sm rounded-xl whitespace-nowrap cursor-pointer">
                  Find Food <HiOutlineArrowRight className="inline w-4 h-4 ml-1" />
                </button>
              </form>

              {/* Rating & Social Proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['🇮🇳', '🇯🇵', '🇮🇹', '🇲🇽'].map((flag, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-orange-50 dark:bg-gray-800 flex items-center justify-center text-lg shadow-sm">
                      {flag}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <span key={i} className="text-amber-400 text-sm">★</span>)}
                    <span className="text-sm font-black text-gray-800 dark:text-white ml-1">4.9 / 5</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Loved by 2M+ foodies</p>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="relative hidden lg:block animate-slide-up">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff5200]/25 to-transparent rounded-[3rem] blur-3xl scale-110" />
              <img
                src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop"
                alt="Delicious food"
                className="relative z-10 w-full h-[520px] object-cover rounded-[2.5rem] shadow-2xl animate-float"
              />
              <div className="absolute -bottom-6 -left-8 glassmorphism p-4 z-20 flex items-center gap-3 animate-bounce-in shadow-2xl">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 rounded-full flex items-center justify-center text-xl">
                  🚀
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 dark:text-white">Express Delivery</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Live GPS tracking enabled</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 glassmorphism p-3 z-20 text-center animate-bounce-in shadow-2xl">
                <p className="text-2xl font-black text-[#ff5200]">50% OFF</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">First 3 orders</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Feature Bar */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md">
                  {s.icon}
                </div>
                <div>
                  <p className="font-extrabold text-gray-900 dark:text-white text-sm">{s.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers & Promo Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <OfferBanner />
      </section>

      {/* Interactive Craving Roulette & Food Moods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CravingRoulette
          restaurants={MOCK_RESTAURANTS}
          activeCraving={activeCraving}
          onSelectCraving={(craving) => setActiveCraving(craving)}
        />
      </section>

      {/* Country Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <span>🌍</span> Explore by Country
          </h2>
          {selectedCountry !== 'All' && (
            <button
              onClick={() => setSelectedCountry('All')}
              className="text-xs font-bold text-[#ff5200] hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {COUNTRIES.map(item => (
            <button
              key={item.label}
              onClick={() => setSelectedCountry(item.label)}
              className={`shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 min-w-[84px] cursor-pointer ${
                selectedCountry === item.label
                  ? 'border-[#ff5200] bg-orange-50 dark:bg-orange-900/30 scale-105 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#ff5200] hover:scale-102'
              }`}
            >
              <span className="text-3xl">{item.flag}</span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Restaurant Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              {activeCraving ? `Craving "${activeCraving}"` : selectedCountry === 'All' ? 'Popular Restaurants' : `${COUNTRIES.find(c => c.label === selectedCountry)?.flag} ${selectedCountry} Restaurants`}
              <span className="ml-2 text-base font-medium text-gray-500 dark:text-gray-400">({filteredRestaurants.length})</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Handpicked places near your location</p>
          </div>

          <Link to="/restaurants" className="text-[#ff5200] text-sm font-extrabold hover:underline flex items-center gap-1">
            See all <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : filteredRestaurants.map((r) => (
                <div key={r.id} className="animate-in fade-in zoom-in-95 duration-200">
                  <RestaurantCard restaurant={r} />
                </div>
              ))
          }
        </div>

        {!loading && filteredRestaurants.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm mt-4">
            <div className="text-5xl mb-3">🍽️</div>
            <p className="text-lg font-extrabold text-gray-800 dark:text-gray-100">No restaurants match your current filters</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Try clearing your craving or country selection.</p>
            <button
              onClick={() => { setSelectedCountry('All'); setActiveCraving(null); }}
              className="btn-primary mt-4 px-6 py-2 text-xs rounded-xl cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
