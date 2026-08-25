import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiClock, HiRefresh, HiStar } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api/client';
import axios from 'axios';

const STATUS_COLORS = {
  delivered: 'badge-green',
  cancelled: 'badge-red',
  preparing: 'badge-orange',
  picked_up: 'badge-blue',
  ready: 'badge-blue',
  confirmed: 'badge-blue',
  pending: 'badge-orange',
};

const STATUS_LABELS = {
  delivered: '✓ Delivered',
  cancelled: '✗ Cancelled',
  preparing: '👨‍🍳 Preparing',
  ready: '📦 Ready for pickup',
  picked_up: '🛵 On the way',
  confirmed: '✅ Confirmed',
  pending: '📋 Pending',
};

const DEMO_ORDERS = [
  { id: 'ORD001', restaurantName: 'Meghana Foods', restaurantImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop', items: [{ name: 'Chicken Boneless Biryani', qty: 2 }], total: 785, status: 'delivered', date: '2024-03-15', rating: 5 },
  { id: 'ORD002', restaurantName: 'Truffles', restaurantImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop', items: [{ name: 'All American Cheese Burger', qty: 1 }, { name: 'Penne Alfredo', qty: 1 }], total: 570, status: 'delivered', date: '2024-03-10', rating: 4 },
  { id: 'ORD003', restaurantName: 'Corner House', restaurantImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&auto=format&fit=crop', items: [{ name: 'Death by Chocolate', qty: 2 }], total: 580, status: 'cancelled', date: '2024-03-05', rating: null },
  { id: 'ORD004', restaurantName: 'La Piazza', restaurantImage: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&auto=format&fit=crop', items: [{ name: 'Margherita Pizza', qty: 1 }], total: 480, status: 'preparing', date: '2024-03-20', rating: null },
];

const OrderHistoryPage = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/orders/history`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3500,
        });
        if (res.data?.success && res.data.orders?.length > 0) {
          const mapped = res.data.orders.map(o => ({
            id: o._id,
            restaurantName: o.restaurantName || o.restaurant?.name || 'Restaurant',
            restaurantImage: o.restaurant?.coverImage || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop',
            items: o.items || [],
            total: o.total,
            status: o.status,
            date: new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            rating: o.rating || null,
          }));
          setOrders(mapped);
        }
      } catch {
        // Fallback to demo orders
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const filtered = orders.filter(o => {
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
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading orders...</div>
          ) : (
            filtered.map(order => (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden card-hover">
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <img src={order.restaurantImage} alt={order.restaurantName} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-black text-gray-900 dark:text-white truncate">{order.restaurantName}</h3>
                        <span className={`badge ${STATUS_COLORS[order.status] || 'badge-blue'} shrink-0`}>{STATUS_LABELS[order.status] || order.status}</span>
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

                    <Link to="/restaurants" className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold text-[#ff5200] border-2 border-[#ff5200] py-2 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                      <HiRefresh className="w-4 h-4" /> Reorder
                    </Link>

                    {order.status === 'delivered' && !order.rating && (
                      <button className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold text-gray-600 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <HiStar className="w-4 h-4" /> Rate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {!loading && filtered.length === 0 && (
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
