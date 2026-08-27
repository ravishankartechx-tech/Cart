import { useState, useEffect, useRef } from 'react';
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
  { icon: <HiShieldCheck className="w-6 h-6" />, label: '100% Safe', sub: 'Hygiene certified', color: 'from-emerald-400 to-teal-500' },
  { icon: <HiLightningBolt className="w-6 h-6" />, label: '30 Min Delivery', sub: 'Or we refund ₹50', color: 'from-amber-400 to-orange-500' },
  { icon: <HiStar className="w-6 h-6" />, label: '50,000+ Dishes', sub: 'From 1,200+ restaurants', color: 'from-[#ff5200] to-[#fc8019]' },
  { icon: <HiClock className="w-6 h-6" />, label: '24/7 Support', sub: 'Always here for you', color: 'from-purple-400 to-indigo-500' },
];

const TICKER_ITEMS = [
  '🇮🇳 Indian Biryani', '🇯🇵 Japanese Sushi', '🇮🇹 Italian Pizza', '🇲🇽 Mexican Tacos',
  '🇨🇳 Chinese Dim Sum', '🇰🇷 Korean BBQ', '🇹🇭 Thai Curry', '🇱🇧 Lebanese Shawarma',
  '🇺🇸 American Burgers', '🎂 Desserts & Cakes', '🥗 Healthy Bowls', '🍜 Ramen & Noodles',
];

// Animated stat counter
function StatCounter({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const num = parseFloat(value);
        const steps = 40;
        const increment = num / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= num) { setCount(num); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, 30);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

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
      {/* ── Ticker Ribbon ─────────────────────────────────────────────────── */}
      <div className="w-full gradient-primary overflow-hidden py-2.5">
        <div className="flex gap-8 animate-ticker whitespace-nowrap" style={{ width: 'max-content' }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-white/90 text-xs font-semibold tracking-wide flex items-center gap-2">
              {item}
              <span className="text-white/40 text-lg">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative gradient-mesh overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-60 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,82,0,0.15) 0%, transparent 70%)', animation: 'float-slow 8s ease-in-out infinite' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-50 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(252,128,25,0.12) 0%, transparent 70%)', animation: 'float-slow 10s ease-in-out infinite reverse' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-7 animate-slide-in-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full font-semibold text-sm shadow-md"
                style={{ background: 'linear-gradient(135deg, rgba(255,82,0,0.12), rgba(252,128,25,0.08))', border: '1px solid rgba(255,82,0,0.2)', backdropFilter: 'blur(8px)', color: '#ff5200' }}>
                <HiOutlineSparkles className="w-4 h-4 animate-spin-slow" />
                <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>World Cuisines · Delivered in 30 Mins</span>
              </div>

              {/* Heading */}
              <div>
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 dark:text-white leading-[1.05] tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Crave it.<br />
                  <span className="text-gradient animate-gradient-shift">
                    We deliver it.
                  </span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed mt-4">
                  Indian, Italian, Japanese, Mexican, and more — <strong className="text-gray-800 dark:text-gray-100">1,200+ top-rated restaurants</strong> with lightning-fast contactless delivery.
                </p>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearchSubmit}
                className="flex gap-2 bg-white/90 dark:bg-gray-900/90 p-2 rounded-2xl shadow-2xl max-w-md border border-white/60 dark:border-gray-700/60"
                style={{ backdropFilter: 'blur(16px)', boxShadow: '0 20px 60px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5)' }}>
                <div className="flex-1 flex items-center gap-2 px-3">
                  <HiSearch className="text-gray-400 w-5 h-5 shrink-0" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Search dishes, restaurants, cuisines..."
                    className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none placeholder-gray-400"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
                <button type="submit" className="btn-primary px-5 py-2.5 text-sm rounded-xl whitespace-nowrap cursor-pointer">
                  Find Food <HiOutlineArrowRight className="inline w-4 h-4 ml-1" />
                </button>
              </form>

              {/* Social proof */}
              <div className="flex items-center gap-5">
                <div className="flex -space-x-2.5">
                  {['🇮🇳', '🇯🇵', '🇮🇹', '🇲🇽', '🇰🇷'].map((flag, i) => (
                    <div key={i}
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-lg shadow-md"
                      style={{ zIndex: 5 - i }}>
                      {flag}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <span key={i} className="text-amber-400 text-base">★</span>)}
                    <span className="text-sm font-black text-gray-800 dark:text-white ml-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>4.9 / 5</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">Loved by <strong>2M+</strong> foodies across 30+ cities</p>
                </div>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative hidden lg:block animate-slide-in-right">
              {/* Outer glow */}
              <div className="absolute inset-0 rounded-[3rem] opacity-60 blur-3xl scale-105 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,82,0,0.3) 0%, rgba(252,128,25,0.15) 50%, transparent 70%)' }} />

              {/* Orbit ring 1 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[110%] h-[110%] rounded-full border border-orange-200/40 dark:border-orange-800/30"
                  style={{ animation: 'spin-slow 20s linear infinite' }} />
              </div>
              {/* Orbit ring 2 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[125%] h-[125%] rounded-full border border-dashed border-orange-200/30 dark:border-orange-900/20"
                  style={{ animation: 'spin-slow 35s linear infinite reverse' }} />
              </div>

              {/* Main image */}
              <img
                src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop"
                alt="Delicious food"
                className="relative z-10 w-full h-[520px] object-cover rounded-[2.5rem] shadow-2xl animate-float"
                style={{ boxShadow: '0 40px 80px rgba(255,82,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)' }}
              />

              {/* Express delivery floating card */}
              <div className="absolute -bottom-6 -left-10 glassmorphism p-4 z-20 flex items-center gap-3 animate-bounce-in shadow-2xl"
                style={{ animationDelay: '0.4s' }}>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 rounded-full flex items-center justify-center text-xl">
                  🚀
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Express Delivery</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="live-dot" style={{ width: '8px', height: '8px' }} />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Live GPS tracking enabled</p>
                  </div>
                </div>
              </div>

              {/* Offer floating card */}
              <div className="absolute -top-5 -right-6 glassmorphism p-3.5 z-20 text-center animate-bounce-in shadow-2xl"
                style={{ animationDelay: '0.6s' }}>
                <p className="text-2xl font-black text-gradient" style={{ fontFamily: 'Outfit, sans-serif' }}>50% OFF</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">First 3 orders</p>
              </div>

              {/* Rating floating card */}
              <div className="absolute top-1/2 -right-10 -translate-y-1/2 glassmorphism px-4 py-3 z-20 animate-bounce-in"
                style={{ animationDelay: '0.8s' }}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="text-sm font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>4.9 Rating</p>
                    <p className="text-[10px] text-gray-400">1,200+ restaurants</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Feature Bar ──────────────────────────────────────────────── */}
      <section className="relative bg-white dark:bg-gray-950 border-b border-gray-100/80 dark:border-gray-800/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div
                key={i}
                className="glassmorphism p-5 flex items-center gap-4 rounded-2xl border border-gray-100/60 dark:border-gray-800/40 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-default"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-13 h-13 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg`}
                  style={{ width: '3.25rem', height: '3.25rem', boxShadow: `0 8px 24px rgba(255,82,0,0.25)` }}>
                  {s.icon}
                </div>
                <div>
                  <p className="font-extrabold text-gray-900 dark:text-white text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Offers & Promo Bar ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <OfferBanner />
      </section>

      {/* ── Craving Roulette ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CravingRoulette
          restaurants={MOCK_RESTAURANTS}
          activeCraving={activeCraving}
          onSelectCraving={(craving) => setActiveCraving(craving)}
        />
      </section>

      {/* ── Country Filter ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <span className="heading-underline">🌍 Explore by Country</span>
          </h2>
          {selectedCountry !== 'All' && (
            <button
              onClick={() => setSelectedCountry('All')}
              className="text-xs font-bold text-[#ff5200] hover:underline px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/30 transition-all hover:scale-105"
            >
              Reset Filter ✕
            </button>
          )}
        </div>
        <div className="flex gap-3 overflow-x-auto pb-3 hide-scrollbar">
          {COUNTRIES.map((item, idx) => (
            <button
              key={item.label}
              onClick={() => setSelectedCountry(item.label)}
              className={`flag-btn shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 min-w-[88px] transition-all duration-200 ${
                selectedCountry === item.label
                  ? 'border-[#ff5200] bg-orange-50 dark:bg-orange-900/30 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-orange-300 dark:hover:border-orange-700'
              }`}
              style={selectedCountry === item.label ? { boxShadow: '0 8px 24px rgba(255,82,0,0.18)' } : {}}
            >
              <span className="text-3xl" style={{ filter: selectedCountry === item.label ? 'drop-shadow(0 2px 6px rgba(255,82,0,0.3))' : 'none' }}>{item.flag}</span>
              <span className={`text-xs font-bold ${selectedCountry === item.label ? 'text-[#ff5200]' : 'text-gray-600 dark:text-gray-400'}`}
                style={{ fontFamily: 'Outfit, sans-serif' }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Restaurant Grid ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              <span className="heading-underline">
                {activeCraving ? `Craving "${activeCraving}"` : selectedCountry === 'All' ? 'Popular Restaurants' : `${COUNTRIES.find(c => c.label === selectedCountry)?.flag} ${selectedCountry} Restaurants`}
              </span>
              <span className="ml-3 text-base font-medium text-gray-400 dark:text-gray-500">({filteredRestaurants.length})</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Handpicked places near your location</p>
          </div>

          <Link to="/restaurants" className="group flex items-center gap-1.5 text-[#ff5200] text-sm font-extrabold hover:gap-2.5 transition-all duration-200"
            style={{ fontFamily: 'Outfit, sans-serif' }}>
            See all <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : filteredRestaurants.map((r, i) => (
                <div key={r.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}>
                  <RestaurantCard restaurant={r} />
                </div>
              ))
          }
        </div>

        {!loading && filteredRestaurants.length === 0 && (
          <div className="text-center py-20 glassmorphism rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm mt-4">
            <div className="text-6xl mb-4 animate-float">🍽️</div>
            <p className="text-xl font-extrabold text-gray-800 dark:text-gray-100" style={{ fontFamily: 'Outfit, sans-serif' }}>No restaurants match your filters</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Try clearing your craving or country selection.</p>
            <button
              onClick={() => { setSelectedCountry('All'); setActiveCraving(null); }}
              className="btn-primary mt-6 px-7 py-2.5 text-sm cursor-pointer"
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
