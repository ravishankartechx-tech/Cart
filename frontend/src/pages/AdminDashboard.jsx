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
        <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-2xl p-1 mb-8 border border-gray-100 dark:border-gray-700 max-w-md">
          {['overview', 'restaurants', 'orders'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === t ? 'bg-[#ff5200] text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((s, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 animate-fade-in">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 ${s.bg} ${s.text}`}>
                    {s.icon}
                  </div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-8">
              <h3 className="font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <HiChartBar className="w-5 h-5 text-[#ff5200]" /> Recent Platform Revenue
              </h3>
              <div className="flex items-end gap-3 h-40">
                {dailyRevenueList.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full gradient-primary rounded-t-lg transition-all hover:opacity-90 min-h-[12px]"
                      style={{ height: `${Math.max(12, (d.revenue / maxRevenue) * 100)}%` }} />
                    <p className="text-[10px] text-gray-400 font-medium">{d._id?.slice(5) || `Day ${i+1}`}</p>
                    <p className="text-[10px] text-gray-600 dark:text-gray-300 font-bold">₹{((d.revenue || 0)/1000).toFixed(0)}k</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'restaurants' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-black text-gray-900 dark:text-white mb-4">Restaurant Partner Approvals</h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {restaurants.map(r => {
                const id = r._id || r.id;
                const isDecided = approvals[id];
                return (
                  <div key={id} className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{r.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Owner: {r.owner?.name || 'Owner'} · {Array.isArray(r.cuisines) ? r.cuisines.join(', ') : r.cuisines}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isDecided ? (
                        <span className={`badge ${isDecided === 'approved' ? 'badge-green' : 'badge-red'}`}>
                          {isDecided}
                        </span>
                      ) : (
                        <>
                          <button onClick={() => handleApproval(id, 'approved')} className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors">
                            <HiCheck className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleApproval(id, 'rejected')} className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors">
                            <HiX className="w-4 h-4" />
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-black text-gray-900 dark:text-white mb-4">Platform Orders</h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {orders.map(o => {
                const id = o._id || o.id;
                return (
                  <div key={id} className="py-4 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs text-gray-400">#{id?.slice?.(-6) || id}</span>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">
                        {o.user?.name || 'Customer'} → {o.restaurant?.name || o.restaurantName || 'Restaurant'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-sm text-gray-900 dark:text-white">₹{o.total}</span>
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
