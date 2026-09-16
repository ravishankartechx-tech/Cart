import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiCheck, HiX, HiEye, HiClock, HiCurrencyRupee } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api/client';
import axios from 'axios';

const DEMO_MENU = [
  { id: '1', category: 'Biryani', name: 'Special Chicken Boneless Biryani', price: 345, isVeg: false, isAvailable: true, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop', isBestSeller: true },
  { id: '2', category: 'Biryani', name: 'Hyderabadi Mutton Dum Biryani', price: 420, isVeg: false, isAvailable: true, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&auto=format&fit=crop', isBestSeller: false },
  { id: '3', category: 'Starters', name: 'Guntur Chicken Fry (Dry)', price: 280, isVeg: false, isAvailable: true, image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=300&auto=format&fit=crop', isBestSeller: true },
  { id: '4', category: 'Starters', name: 'Chilli Paneer Dry', price: 240, isVeg: true, isAvailable: true, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&auto=format&fit=crop', isBestSeller: false },
];

const DEMO_ORDERS = [
  { id: 'ORD001', user: 'Priya S.', items: [{ name: 'Chicken Biryani', qty: 2 }], total: 785, status: 'pending', time: 'Just now' },
  { id: 'ORD002', user: 'Rahul V.', items: [{ name: 'Guntur Chicken', qty: 1 }], total: 280, status: 'preparing', time: '10 mins ago' },
  { id: 'ORD003', user: 'Ananya K.', items: [{ name: 'Mutton Biryani', qty: 1 }, { name: 'Chilli Paneer', qty: 1 }], total: 660, status: 'ready', time: '20 mins ago' },
];

const RestaurantDashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [menu, setMenu] = useState(DEMO_MENU);
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [restaurantName, setRestaurantName] = useState('Meghana Foods');
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: '', price: '', isVeg: false });

  // Fetch restaurant owner data from API
  useEffect(() => {
    const fetchRestoData = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/restaurants/owner/mine`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3000,
        });
        if (res.data?.success && res.data.restaurants?.length > 0) {
          const myResto = res.data.restaurants[0];
          setRestaurantName(myResto.name);

          // Fetch orders for this restaurant
          const ordersRes = await axios.get(`${API_BASE_URL}/orders/restaurant/${myResto._id}`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 3000,
          });
          if (ordersRes.data?.success && ordersRes.data.orders?.length > 0) {
            const mappedOrders = ordersRes.data.orders.map(o => ({
              id: o._id,
              user: o.user?.name || 'Customer',
              items: o.items || [],
              total: o.total,
              status: o.status,
              time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }));
            setOrders(mappedOrders);
          }

          // Fetch menu for this restaurant
          const menuRes = await axios.get(`${API_BASE_URL}/menu/${myResto._id}`, { timeout: 3000 });
          if (menuRes.data?.success && menuRes.data.items?.length > 0) {
            setMenu(menuRes.data.items);
          }
        }
      } catch {
        // Fallback to local demo data
      }
    };

    fetchRestoData();
  }, [token]);

  const toggleAvailability = (id) => {
    setMenu(prev => prev.map(item => item.id === id || item._id === id ? { ...item, isAvailable: !item.isAvailable } : item));
  };

  const removeItem = (id) => setMenu(prev => prev.filter(item => item.id !== id && item._id !== id));

  const updateOrderStatus = async (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    try {
      if (token && !id.startsWith('ORD')) {
        await axios.put(`${API_BASE_URL}/orders/${id}/status`, { status }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch {
      // Local state already updated
    }
  };

  const addItem = () => {
    if (!newItem.name || !newItem.price) return;
    setMenu(prev => [...prev, {
      ...newItem,
      id: `item_${Date.now()}`,
      price: +newItem.price,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop',
      isBestSeller: false
    }]);
    setNewItem({ name: '', category: '', price: '', isVeg: false });
    setShowAddItem(false);
  };

  const STATUS_NEXT = { pending: 'confirmed', confirmed: 'preparing', preparing: 'ready', ready: 'picked_up' };
  const STATUS_LABEL_NEXT = { pending: 'Accept', confirmed: 'Start Preparing', preparing: 'Mark Ready', ready: 'Handover' };
  const STATUS_COLOR = { pending: 'badge-orange', confirmed: 'badge-blue', preparing: 'badge-orange', ready: 'badge-green', picked_up: 'badge-blue', delivered: 'badge-green' };

  const todayRevenue = orders.filter(o => ['ready', 'picked_up', 'delivered'].includes(o.status)).reduce((s, o) => s + o.total, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">🏪</div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Restaurant Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{restaurantName} — Active Revenue: <span className="font-bold text-green-600">₹{todayRevenue}</span></p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Incoming Orders', value: orders.filter(o => o.status === 'pending').length, color: 'text-[#ff5200]', bg: 'bg-orange-50 dark:bg-orange-950/40', emoji: '🔔' },
            { label: 'In Kitchen', value: orders.filter(o => o.status === 'preparing').length, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/40', emoji: '👨‍🍳' },
            { label: 'Ready for Pickup', value: orders.filter(o => o.status === 'ready').length, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/40', emoji: '🛍️' },
            { label: 'Active Menu Dishes', value: menu.length, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/40', emoji: '🍽️' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-5 shadow-xs transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-2xl ${s.bg} flex items-center justify-center text-xl`}>
                  {s.emoji}
                </div>
                <span className={`text-2xl sm:text-3xl font-black ${s.color}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {s.value}
                </span>
              </div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl p-1.5 mb-6 border border-gray-200/60 dark:border-gray-700 max-w-md">
          {['orders', 'menu'].map(t => (
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
              {t === 'orders' ? `📋 Active Orders (${orders.length})` : `🍽️ Menu Dishes (${menu.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-5 sm:p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="font-black text-gray-900 dark:text-white text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        #{order.id?.slice?.(-6) || order.id}
                      </span>
                      <span className={`badge ${STATUS_COLOR[order.status] || 'badge-blue'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Customer: <strong className="text-gray-800 dark:text-gray-200">{order.user}</strong> • {order.time}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-gray-400 uppercase font-bold">Total Bill</p>
                    <p className="font-black text-[#ff5200] text-xl" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      ₹{order.total}
                    </p>
                  </div>
                </div>

                {/* Items list pill tags */}
                <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800">
                  {order.items.map((i, idx) => (
                    <span key={idx} className="text-xs font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 px-3 py-1 rounded-xl shadow-xs border border-gray-100 dark:border-gray-600">
                      {i.name} <span className="text-[#ff5200]">×{i.qty}</span>
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
                  {STATUS_NEXT[order.status] && (
                    <button
                      onClick={() => updateOrderStatus(order.id, STATUS_NEXT[order.status])}
                      className="flex-1 btn-primary py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer tap-active shadow-md"
                    >
                      <HiCheck className="w-4 h-4" /> {STATUS_LABEL_NEXT[order.status]}
                    </button>
                  )}
                  {['pending', 'confirmed'].includes(order.status) && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="px-5 py-2.5 border border-red-200 dark:border-red-900/50 text-red-500 text-xs sm:text-sm font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    >
                      <HiX className="inline w-4 h-4 mr-1" /> Reject
                    </button>
                  )}
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xs">
                <div className="text-5xl mb-3 animate-float">📭</div>
                <p className="font-black text-gray-900 dark:text-white text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  No active orders right now
                </p>
                <p className="text-xs text-gray-500 mt-1">New customer orders will appear here in real-time.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'menu' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="font-black text-gray-900 dark:text-white text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Menu Catalog ({menu.length} items)
                </h3>
                <p className="text-xs text-gray-500">Toggle availability or add fresh offerings</p>
              </div>
              <button
                onClick={() => setShowAddItem(v => !v)}
                className="btn-primary py-2 px-4 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer tap-active"
              >
                <HiPlus className="w-4 h-4" /> Add Dish
              </button>
            </div>

            {/* Add item form modal / expandable */}
            {showAddItem && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-[#ff5200] p-6 mb-6 shadow-xl animate-slide-up">
                <h3 className="font-black text-gray-900 dark:text-white text-base mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  ✨ Add New Dish to Menu
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Dish Name</label>
                    <input
                      placeholder="e.g. Paneer Butter Masala"
                      value={newItem.name}
                      onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-[#ff5200]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Category</label>
                    <input
                      placeholder="e.g. Main Course, Starters"
                      value={newItem.category}
                      onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-[#ff5200]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Price (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 290"
                      value={newItem.price}
                      onChange={e => setNewItem(p => ({ ...p, price: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-[#ff5200]"
                    />
                  </div>
                  <div className="flex items-center gap-3 px-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 mt-6 sm:mt-0">
                    <input
                      type="checkbox"
                      id="isVeg"
                      checked={newItem.isVeg}
                      onChange={e => setNewItem(p => ({ ...p, isVeg: e.target.checked }))}
                      className="w-4 h-4 accent-green-600 rounded cursor-pointer"
                    />
                    <label htmlFor="isVeg" className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                      🌿 100% Pure Vegetarian
                    </label>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={addItem}
                    className="btn-primary py-2.5 px-6 rounded-xl text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                  >
                    Save & Publish Dish
                  </button>
                  <button
                    onClick={() => setShowAddItem(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs sm:text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Menu list */}
            <div className="space-y-3">
              {menu.map(item => (
                <div
                  key={item.id || item._id}
                  className={`bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-4 transition-all shadow-xs ${
                    !item.isAvailable ? 'opacity-50 grayscale-20' : ''
                  }`}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover shrink-0 border border-gray-100 dark:border-gray-800"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop';
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${item.isVeg ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60' : 'bg-red-100 text-red-700 dark:bg-red-950/60'}`}>
                        {item.isVeg ? 'VEG' : 'NON-VEG'}
                      </span>
                      <h4 className="font-black text-gray-900 dark:text-white text-sm sm:text-base truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {item.name}
                      </h4>
                      {item.isBestSeller && (
                        <span className="badge badge-orange text-[9px] hidden sm:inline-flex">⭐ Bestseller</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{item.category}</p>
                    <p className="font-black text-[#ff5200] text-sm mt-0.5">₹{item.price}</p>
                  </div>

                  {/* Controls: In-Stock Toggle + Delete */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => toggleAvailability(item.id || item._id)}
                        aria-label="Toggle availability"
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          item.isAvailable ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                            item.isAvailable ? 'translate-x-5.5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                      <span className="text-[10px] font-bold text-gray-400">
                        {item.isAvailable ? 'In Stock' : 'Sold Out'}
                      </span>
                    </div>

                    <button
                      onClick={() => removeItem(item.id || item._id)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      title="Delete dish"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;
