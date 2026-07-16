import { useState } from 'react';
import { HiChartBar, HiUsers, HiShoppingCart, HiCurrencyRupee, HiOfficeBuilding, HiCheck, HiX, HiEye } from 'react-icons/hi';

const DEMO_STATS = {
  totalUsers: 12483, totalRestaurants: 347, totalOrders: 98241, totalRevenue: 4823500,
  dailyRevenue: [
    { _id: '2024-03-14', revenue: 42300, orders: 186 },
    { _id: '2024-03-15', revenue: 58700, orders: 242 },
    { _id: '2024-03-16', revenue: 51200, orders: 215 },
    { _id: '2024-03-17', revenue: 67800, orders: 298 },
    { _id: '2024-03-18', revenue: 73100, orders: 321 },
    { _id: '2024-03-19', revenue: 81200, orders: 356 },
    { _id: '2024-03-20', revenue: 59400, orders: 261 },
  ],
};

const PENDING_RESTAURANTS = [
  { id: 1, name: 'Spice Garden', owner: 'Ravi Kumar', cuisines: ['North Indian'], city: 'HSR Layout', date: '2024-03-19' },
  { id: 2, name: 'Sushi Katana', owner: 'Yuki Tanaka', cuisines: ['Japanese', 'Sushi'], city: 'Koramangala', date: '2024-03-20' },
  { id: 3, name: 'Taco Town', owner: 'Monica Pereira', cuisines: ['Mexican'], city: 'Indiranagar', date: '2024-03-20' },
];

const RECENT_ORDERS = [
  { id: 'ORD7821', user: 'Priya S.', restaurant: 'Meghana Foods', total: 785, status: 'delivered' },
  { id: 'ORD7820', user: 'Rahul V.', restaurant: 'Truffles', total: 1240, status: 'preparing' },
  { id: 'ORD7819', user: 'Ananya K.', restaurant: 'A2B', total: 330, status: 'picked_up' },
  { id: 'ORD7818', user: 'Kiran M.', restaurant: 'Empire', total: 895, status: 'delivered' },
];

const AdminDashboard = () => {
  const [approvals, setApprovals] = useState(
    PENDING_RESTAURANTS.reduce((a, r) => ({ ...a, [r.id]: null }), {})
  );
  const [activeTab, setActiveTab] = useState('overview');

  const maxRevenue = Math.max(...DEMO_STATS.dailyRevenue.map(d => d.revenue));

  const statCards = [
    { label: 'Total Users', value: DEMO_STATS.totalUsers.toLocaleString(), icon: <HiUsers />, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600' },
    { label: 'Restaurants', value: DEMO_STATS.totalRestaurants, icon: <HiOfficeBuilding />, color: 'from-purple-500 to-pink-600', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600' },
    { label: 'Total Orders', value: DEMO_STATS.totalOrders.toLocaleString(), icon: <HiShoppingCart />, color: 'from-orange-500 to-red-500', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600' },
    { label: 'Revenue', value: `₹${(DEMO_STATS.totalRevenue / 100000).toFixed(1)}L`, icon: <HiCurrencyRupee />, color: 'from-green-500 to-teal-500', bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600' },
  ];

  const STATUS_COLORS = { delivered: 'badge-green', preparing: 'badge-orange', picked_up: 'badge-blue', cancelled: 'badge-red' };

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
                <HiChartBar className="w-5 h-5 text-[#ff5200]" /> Last 7 Days Revenue
              </h3>
              <div className="flex items-end gap-3 h-40">
                {DEMO_STATS.dailyRevenue.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full gradient-primary rounded-t-lg transition-all hover:opacity-90"
                      style={{ height: `${(d.revenue / maxRevenue) * 100}%` }} />
                    <p className="text-[10px] text-gray-400 font-medium">{d._id.slice(5)}</p>
                    <p className="text-[10px] text-gray-600 dark:text-gray-300 font-bold">₹{(d.revenue/1000).toFixed(0)}k</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-black text-gray-900 dark:text-white">Recent Orders</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {RECENT_ORDERS.map(o => (
                  <div key={o.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{o.user} → {o.restaurant}</p>
                      <p className="text-xs text-gray-400">{o.id}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900 dark:text-white text-sm">₹{o.total}</span>
                      <span className={`badge ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'restaurants' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-black text-gray-900 dark:text-white">Pending Approvals ({PENDING_RESTAURANTS.length})</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {PENDING_RESTAURANTS.map(r => (
                <div key={r.id} className="px-6 py-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{r.name}</p>
                    <p className="text-xs text-gray-500">by {r.owner} · {r.cuisines.join(', ')} · {r.city}</p>
                    <p className="text-xs text-gray-400">{r.date}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {approvals[r.id] === null ? (
                      <>
                        <button onClick={() => setApprovals(p => ({ ...p, [r.id]: true }))}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition-colors">
                          <HiCheck className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => setApprovals(p => ({ ...p, [r.id]: false }))}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors">
                          <HiX className="w-4 h-4" /> Reject
                        </button>
                      </>
                    ) : (
                      <span className={`badge ${approvals[r.id] ? 'badge-green' : 'badge-red'}`}>
                        {approvals[r.id] ? '✓ Approved' : '✗ Rejected'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-black text-gray-900 dark:text-white">All Orders</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {[...RECENT_ORDERS, ...RECENT_ORDERS].map((o, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{o.user}</p>
                    <p className="text-xs text-gray-400">{o.restaurant} · {o.id}</p>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white text-sm shrink-0">₹{o.total}</span>
                  <span className={`badge ${STATUS_COLORS[o.status]} shrink-0`}>{o.status}</span>
                  <button className="text-gray-400 hover:text-[#ff5200] transition-colors shrink-0">
                    <HiEye className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
