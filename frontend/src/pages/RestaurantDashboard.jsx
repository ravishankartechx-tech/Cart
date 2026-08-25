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
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'New Orders', value: orders.filter(o => o.status === 'pending').length, color: 'text-[#ff5200]', emoji: '📋' },
            { label: 'Preparing', value: orders.filter(o => o.status === 'preparing').length, color: 'text-blue-600', emoji: '👨‍🍳' },
            { label: 'Menu Items', value: menu.length, color: 'text-purple-600', emoji: '🍽' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 text-center">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-2xl p-1 mb-6 border border-gray-100 dark:border-gray-700">
          {['orders', 'menu'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === t ? 'bg-[#ff5200] text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              {t === 'orders' ? `📋 Orders (${orders.length})` : `🍽 Menu (${menu.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-gray-900 dark:text-white">#{order.id?.slice?.(-6) || order.id}</span>
                      <span className={`badge ${STATUS_COLOR[order.status] || 'badge-blue'}`}>{order.status}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{order.user} · {order.time}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {order.items.map(i => `${i.name} ×${i.qty}`).join(', ')}
                    </p>
                  </div>
                  <p className="font-black text-gray-900 dark:text-white text-lg shrink-0">₹{order.total}</p>
                </div>

                <div className="flex gap-2 pt-3 border-t border-dashed border-gray-100 dark:border-gray-700">
                  {STATUS_NEXT[order.status] && (
                    <button onClick={() => updateOrderStatus(order.id, STATUS_NEXT[order.status])}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#ff5200] text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-colors">
                      <HiCheck className="w-4 h-4" /> {STATUS_LABEL_NEXT[order.status]}
                    </button>
                  )}
                  {['pending', 'confirmed'].includes(order.status) && (
                    <button onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 border-2 border-red-200 text-red-500 text-sm font-bold rounded-xl hover:bg-red-50 transition-colors">
                      <HiX className="w-4 h-4" /> Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📭</div>
                <p className="font-bold text-gray-600 dark:text-gray-300">No active orders</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'menu' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowAddItem(v => !v)} className="btn-primary py-2.5 px-5 text-sm">
                <HiPlus className="w-4 h-4" /> Add Item
              </button>
            </div>

            {/* Add item form */}
            {showAddItem && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-[#ff5200] p-5 mb-5 animate-fade-in">
                <h3 className="font-black text-gray-900 dark:text-white mb-4">Add New Menu Item</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input placeholder="Item name" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} className="input-base text-sm" />
                  <input placeholder="Category" value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))} className="input-base text-sm" />
                  <input type="number" placeholder="Price (₹)" value={newItem.price} onChange={e => setNewItem(p => ({ ...p, price: e.target.value }))} className="input-base text-sm" />
                  <div className="flex items-center gap-2 px-4 border-1.5 border-gray-200 rounded-xl">
                    <input type="checkbox" id="isVeg" checked={newItem.isVeg} onChange={e => setNewItem(p => ({ ...p, isVeg: e.target.checked }))} className="accent-green-600" />
                    <label htmlFor="isVeg" className="text-sm text-gray-700 dark:text-gray-300">Vegetarian</label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={addItem} className="btn-primary py-2 px-6 text-sm">Add Item</button>
                  <button onClick={() => setShowAddItem(false)} className="btn-outline py-2 px-6 text-sm">Cancel</button>
                </div>
              </div>
            )}

            {/* Menu list */}
            <div className="space-y-3">
              {menu.map(item => (
                <div key={item.id || item._id} className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-4 ${!item.isAvailable ? 'opacity-60' : ''}`}>
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className={item.isVeg ? 'veg-dot' : 'nonveg-dot'} />
                      <span className="font-bold text-gray-900 dark:text-white text-sm truncate">{item.name}</span>
                      {item.isBestSeller && <span className="badge badge-orange text-[10px]">⭐ Bestseller</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                    <p className="font-bold text-[#ff5200] text-sm mt-1">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Toggle availability */}
                    <button onClick={() => toggleAvailability(item.id || item._id)}
                      className={`w-10 h-5 rounded-full transition-all relative ${item.isAvailable ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${item.isAvailable ? 'left-5' : 'left-0.5'}`} />
                    </button>
                    <button onClick={() => removeItem(item.id || item._id)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
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
