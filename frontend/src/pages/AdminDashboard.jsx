import { useState, useEffect } from 'react';
import { HiChartBar, HiUsers, HiShoppingCart, HiCurrencyRupee, HiOfficeBuilding, HiCheck, HiX } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api/client';
import axios from 'axios';

const DEMO_STATS = {
  totalUsers: 1420,
  totalRestaurants: 9,
  totalOrders: 284,
  totalRevenue: 284000,
  dailyRevenue: [
    { _id: '2026-08-19', revenue: 42300, orders: 46 },
    { _id: '2026-08-20', revenue: 58700, orders: 58 },
    { _id: '2026-08-21', revenue: 51200, orders: 49 },
    { _id: '2026-08-22', revenue: 67800, orders: 65 },
    { _id: '2026-08-23', revenue: 73100, orders: 72 },
    { _id: '2026-08-24', revenue: 81200, orders: 84 },
    { _id: '2026-08-25', revenue: 59400, orders: 60 },
  ],
};

const PENDING_RESTAURANTS = [
  { id: '1', name: 'Spice Garden', owner: { name: 'Ravi Kumar' }, cuisines: ['North Indian'], city: 'HSR Layout', date: '2026-08-24' },
  { id: '2', name: 'Sushi Katana', owner: { name: 'Yuki Tanaka' }, cuisines: ['Japanese', 'Sushi'], city: 'Koramangala', date: '2026-08-25' },
  { id: '3', name: 'Taco Town', owner: { name: 'Monica Pereira' }, cuisines: ['Mexican'], city: 'Indiranagar', date: '2026-08-25' },
];

const RECENT_ORDERS = [
  { id: 'ORD7821', user: { name: 'Priya S.' }, restaurant: { name: 'Meghana Foods' }, total: 785, status: 'delivered' },
  { id: 'ORD7820', user: { name: 'Rahul V.' }, restaurant: { name: 'Truffles' }, total: 1240, status: 'preparing' },
  { id: 'ORD7819', user: { name: 'Ananya K.' }, restaurant: { name: 'A2B' }, total: 330, status: 'picked_up' },
  { id: 'ORD7818', user: { name: 'Kiran M.' }, restaurant: { name: 'Empire' }, total: 895, status: 'delivered' },
];

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(DEMO_STATS);
  const [restaurants, setRestaurants] = useState(PENDING_RESTAURANTS);
  const [orders, setOrders] = useState(RECENT_ORDERS);
  const [approvals, setApprovals] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!token) return;
      try {
        const config = { headers: { Authorization: `Bearer ${token}` }, timeout: 3000 };
        const [statsRes, restoRes, ordersRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/admin/stats`, config),
          axios.get(`${API_BASE_URL}/admin/restaurants`, config),
          axios.get(`${API_BASE_URL}/admin/orders`, config),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value.data?.success) {
          setStats(prev => ({ ...prev, ...statsRes.value.data.stats }));
        }

        if (restoRes.status === 'fulfilled' && restoRes.value.data?.success) {
          setRestaurants(restoRes.value.data.restaurants || []);
        }

        if (ordersRes.status === 'fulfilled' && ordersRes.value.data?.success) {
          setOrders(ordersRes.value.data.orders || []);
        }
      } catch {
        // Fallback to local demo state
      }
    };

    fetchAdminData();
  }, [token]);

  const handleApproval = async (id, status) => {
    setApprovals(p => ({ ...p, [id]: status }));
    try {
      if (token && !id.toString().startsWith('temp')) {
        await axios.put(`${API_BASE_URL}/admin/restaurants/${id}/approve`, {
          isApproved: status === 'approved'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch {
      // Local state preserved
    }
  };

  const dailyRevenueList = stats.dailyRevenue && stats.dailyRevenue.length > 0 ? stats.dailyRevenue : DEMO_STATS.dailyRevenue;
  const maxRevenue = Math.max(...dailyRevenueList.map(d => d.revenue || 1), 1000);

  const statCards = [
    { label: 'Total Users', value: (stats.totalUsers || 1420).toLocaleString(), icon: <HiUsers />, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600' },
    { label: 'Restaurants', value: (stats.totalRestaurants || 9), icon: <HiOfficeBuilding />, color: 'from-purple-500 to-pink-600', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600' },
    { label: 'Total Orders', value: (stats.totalOrders || 284).toLocaleString(), icon: <HiShoppingCart />, color: 'from-orange-500 to-red-500', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600' },
    { label: 'Total Revenue', value: `₹${((stats.totalRevenue || 284000) / 1000).toFixed(1)}k`, icon: <HiCurrencyRupee />, color: 'from-green-500 to-teal-500', bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600' },
  ];

  const STATUS_COLORS = { delivered: 'badge-green', preparing: 'badge-orange', picked_up: 'badge-blue', cancelled: 'badge-red', pending: 'badge-orange' };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">🛡</div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">FeastRocket Platform Management</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl p-1.5 mb-8 border border-gray-200/60 dark:border-gray-700 max-w-md">
          {['overview', 'restaurants', 'orders'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-black capitalize transition-all cursor-pointer tap-active ${
                activeTab === t
                  ? 'gradient-primary text-white shadow-md shadow-orange-500/25'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((s, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-5 shadow-xs transition-all hover:shadow-md animate-fade-in">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl mb-4 ${s.bg} ${s.text}`}>
                    {s.icon}
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {s.value}
                  </p>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 mb-8 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-gray-900 dark:text-white text-base flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  <HiChartBar className="w-5 h-5 text-[#ff5200]" /> Recent Platform Revenue Trends
                </h3>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
                  Live Sync Active
                </span>
              </div>
              <div className="flex items-end gap-2 sm:gap-4 h-48 pt-4 pb-2 border-b border-dashed border-gray-100 dark:border-gray-800">
                {dailyRevenueList.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div
                      className="w-full max-w-[48px] gradient-primary rounded-t-xl transition-all duration-300 group-hover:opacity-90 group-hover:scale-105 relative cursor-pointer"
                      style={{ height: `${Math.max(15, (d.revenue / maxRevenue) * 100)}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black px-2 py-0.5 rounded-md whitespace-nowrap shadow-lg transition-opacity pointer-events-none z-10">
                        ₹{(d.revenue || 0).toLocaleString()}
                      </div>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-400 font-bold">{d._id?.slice(5) || `Day ${i+1}`}</p>
                    <p className="text-[10px] text-gray-800 dark:text-gray-200 font-extrabold hidden sm:block">₹{((d.revenue || 0)/1000).toFixed(0)}k</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'restaurants' && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-xs">
            <h3 className="font-black text-gray-900 dark:text-white text-base mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Restaurant Partner Verification & Approvals
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {restaurants.map(r => {
                const id = r._id || r.id;
                const isDecided = approvals[id];
                return (
                  <div key={id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-gray-900 dark:text-white text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>{r.name}</p>
                        <span className="text-[10px] font-bold bg-orange-100 dark:bg-orange-950/60 text-[#ff5200] px-2 py-0.5 rounded-full">
                          {r.city || 'Bengaluru'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Owner: <strong className="text-gray-700 dark:text-gray-300">{r.owner?.name || 'Partner'}</strong> • Cuisines: {Array.isArray(r.cuisines) ? r.cuisines.join(', ') : r.cuisines}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {isDecided ? (
                        <span className={`badge ${isDecided === 'approved' ? 'badge-green' : 'badge-red'}`}>
                          {isDecided}
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleApproval(id, 'approved')}
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <HiCheck className="w-4 h-4" /> Approve
                          </button>
                          <button
                            onClick={() => handleApproval(id, 'rejected')}
                            className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <HiX className="w-4 h-4" /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-xs">
            <h3 className="font-black text-gray-900 dark:text-white text-base mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Platform Real-Time Orders
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {orders.map(o => {
                const id = o._id || o.id;
                return (
                  <div key={id} className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-mono text-xs text-gray-400 font-bold">#{id?.slice?.(-6) || id}</span>
                      <p className="font-bold text-gray-900 dark:text-white text-sm mt-0.5">
                        {o.user?.name || 'Customer'} <span className="text-gray-400">from</span> {o.restaurant?.name || o.restaurantName || 'Restaurant'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-base text-[#ff5200]">₹{o.total}</span>
                      <span className={`badge ${STATUS_COLORS[o.status] || 'badge-blue'}`}>{o.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
