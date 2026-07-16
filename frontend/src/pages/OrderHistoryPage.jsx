import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiClock, HiRefresh, HiStar } from 'react-icons/hi';

const STATUS_COLORS = {
  delivered: 'badge-green',
  cancelled: 'badge-red',
  preparing: 'badge-orange',
  picked_up: 'badge-blue',
  confirmed: 'badge-blue',
  pending: 'badge-orange',
};

const STATUS_LABELS = {
  delivered: '✓ Delivered',
  cancelled: '✗ Cancelled',
  preparing: '👨‍🍳 Preparing',
  picked_up: '🛵 On the way',
  confirmed: '✅ Confirmed',
  pending: '📋 Pending',
};

const DEMO_ORDERS = [
  { id: 'ORD001', restaurantName: 'Meghana Foods', restaurantImage: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=200', items: [{ name: 'Chicken Boneless Biryani', qty: 2 }], total: 785, status: 'delivered', date: '2024-03-15', rating: 5 },
  { id: 'ORD002', restaurantName: 'Truffles', restaurantImage: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=200', items: [{ name: 'All American Cheese Burger', qty: 1 }, { name: 'Penne Alfredo', qty: 1 }], total: 570, status: 'delivered', date: '2024-03-10', rating: 4 },
  { id: 'ORD003', restaurantName: 'Corner House', restaurantImage: 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=200', items: [{ name: 'Death by Chocolate', qty: 2 }], total: 580, status: 'cancelled', date: '2024-03-05', rating: null },
  { id: 'ORD004', restaurantName: 'California Burrito', restaurantImage: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=200', items: [{ name: 'Crispy Chicken Burrito', qty: 1 }, { name: 'Nachos with Guacamole', qty: 1 }], total: 440, status: 'preparing', date: '2024-03-20', rating: null },
];

const OrderHistoryPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = DEMO_ORDERS.filter(o => {
    if (activeTab === 'active') return ['pending', 'confirmed', 'preparing', 'ready', 'picked_up'].includes(o.status);
    if (activeTab === 'past') return ['delivered', 'cancelled'].includes(o.status);
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">My Orders</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-2xl p-1 mb-6 border border-gray-100 dark:border-gray-700">
          {[{ key: 'all', label: 'All' }, { key: 'active', label: '🔴 Active' }, { key: 'past', label: 'Past' }].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === t.key ? 'bg-[#ff5200] text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        <div className="space-y-4">
          {filtered.map(order => (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden card-hover">
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <img src={order.restaurantImage} alt={order.restaurantName} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-black text-gray-900 dark:text-white truncate">{order.restaurantName}</h3>
                      <span className={`badge ${STATUS_COLORS[order.status]} shrink-0`}>{STATUS_LABELS[order.status]}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {order.items.map(i => `${i.name} × ${i.qty}`).join(', ')}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">₹{order.total}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><HiClock className="w-3 h-3" /> {order.date}</span>
                    </div>
                  </div>
                </div>

                {/* Rating if delivered */}
                {order.status === 'delivered' && order.rating && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-xs text-gray-500">Your rating:</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => <HiStar key={i} className={`w-4 h-4 ${i <= order.rating ? 'text-yellow-400' : 'text-gray-200'}`} />)}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-dashed border-gray-100 dark:border-gray-700">
                  {['pending', 'confirmed', 'preparing', 'ready', 'picked_up'].includes(order.status) && (
                    <Link to={`/order-tracking/${order.id}`}
                      className="flex-1 text-center text-sm font-bold text-white bg-[#ff5200] py-2 rounded-xl hover:bg-orange-600 transition-colors">
                      Track Order
                    </Link>
                  )}

                  <button className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold text-[#ff5200] border-2 border-[#ff5200] py-2 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                    <HiRefresh className="w-4 h-4" /> Reorder
                  </button>

                  {order.status === 'delivered' && !order.rating && (
                    <button className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold text-gray-600 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <HiStar className="w-4 h-4" /> Rate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-xl font-bold text-gray-700 dark:text-gray-200">No orders here</p>
              <Link to="/restaurants" className="btn-primary mt-6 px-8 py-2.5 text-sm inline-flex">Order Now</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
