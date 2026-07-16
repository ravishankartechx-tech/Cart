import { useState } from 'react';
import { HiPlus, HiPencil, HiTrash, HiCheck, HiX, HiEye, HiClock, HiCurrencyRupee } from 'react-icons/hi';

const DEMO_MENU = [
  { id: 1, category: 'Biryani', name: 'Chicken Boneless Biryani', price: 345, isVeg: false, isAvailable: true, image: 'https://images.pexels.com/photos/7353380/pexels-photo-7353380.jpeg?auto=compress&cs=tinysrgb&w=200', isBestSeller: true },
  { id: 2, category: 'Biryani', name: 'Mutton Biryani', price: 420, isVeg: false, isAvailable: true, image: 'https://images.pexels.com/photos/7353380/pexels-photo-7353380.jpeg?auto=compress&cs=tinysrgb&w=200', isBestSeller: false },
  { id: 3, category: 'Starters', name: 'Guntur Chicken Dry', price: 280, isVeg: false, isAvailable: false, image: 'https://images.pexels.com/photos/604969/pexels-photo-604969.jpeg?auto=compress&cs=tinysrgb&w=200', isBestSeller: true },
  { id: 4, category: 'Starters', name: 'Chilli Paneer', price: 240, isVeg: true, isAvailable: true, image: 'https://images.pexels.com/photos/2411558/pexels-photo-2411558.jpeg?auto=compress&cs=tinysrgb&w=200', isBestSeller: false },
];

const DEMO_ORDERS = [
  { id: 'ORD001', user: 'Priya S.', items: [{ name: 'Chicken Biryani', qty: 2 }], total: 785, status: 'pending', time: '10:32 AM' },
  { id: 'ORD002', user: 'Rahul V.', items: [{ name: 'Guntur Chicken', qty: 1 }], total: 280, status: 'preparing', time: '10:25 AM' },
  { id: 'ORD003', user: 'Ananya K.', items: [{ name: 'Mutton Biryani', qty: 1 }, { name: 'Chilli Paneer', qty: 1 }], total: 660, status: 'ready', time: '10:15 AM' },
];

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [menu, setMenu] = useState(DEMO_MENU);
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: '', price: '', isVeg: false });

  const toggleAvailability = (id) => {
    setMenu(prev => prev.map(item => item.id === id ? { ...item, isAvailable: !item.isAvailable } : item));
  };

  const removeItem = (id) => setMenu(prev => prev.filter(item => item.id !== id));

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const addItem = () => {
    if (!newItem.name || !newItem.price) return;
    setMenu(prev => [...prev, { ...newItem, id: Date.now(), price: +newItem.price, isAvailable: true, image: '', isBestSeller: false }]);
    setNewItem({ name: '', category: '', price: '', isVeg: false });
    setShowAddItem(false);
  };

  const STATUS_NEXT = { pending: 'confirmed', confirmed: 'preparing', preparing: 'ready', ready: 'picked_up' };
  const STATUS_LABEL_NEXT = { pending: 'Accept', confirmed: 'Start Preparing', preparing: 'Mark Ready', ready: 'Handover' };
  const STATUS_COLOR = { pending: 'badge-orange', confirmed: 'badge-blue', preparing: 'badge-orange', ready: 'badge-green' };

  const todayRevenue = orders.filter(o => ['ready', 'picked_up', 'delivered'].includes(o.status)).reduce((s, o) => s + o.total, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">🏪</div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Restaurant Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Meghana Foods — Today's Revenue: <span className="font-bold text-green-600">₹{todayRevenue}</span></p>
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
                      <span className="font-black text-gray-900 dark:text-white">#{order.id}</span>
                      <span className={`badge ${STATUS_COLOR[order.status]}`}>{order.status}</span>
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
                  <button onClick={() => updateOrderStatus(order.id, 'cancelled')}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 border-2 border-red-200 text-red-500 text-sm font-bold rounded-xl hover:bg-red-50 transition-colors">
                    <HiX className="w-4 h-4" /> Cancel
                  </button>
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
                <div key={item.id} className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-4 ${!item.isAvailable ? 'opacity-60' : ''}`}>
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className={item.isVeg ? 'veg-dot' : 'nonveg-dot'} />
                      <span className="font-bold text-gray-900 dark:text-white text-sm truncate">{item.name}</span>
                      {item.isBestSeller && <span className="badge badge-orange text-[10px]">⭐</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                    <p className="font-bold text-[#ff5200] text-sm mt-1">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Toggle availability */}
                    <button onClick={() => toggleAvailability(item.id)}
                      className={`w-10 h-5 rounded-full transition-all relative ${item.isAvailable ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${item.isAvailable ? 'left-5' : 'left-0.5'}`} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#ff5200] transition-colors">
                      <HiPencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeItem(item.id)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
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
