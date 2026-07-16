import { useState, useEffect } from 'react';
import { HiCheck, HiX, HiPhone, HiLocationMarker, HiCurrencyRupee } from 'react-icons/hi';

const DEMO_AVAILABLE_ORDERS = [
  { id: 'ORD821', restaurantName: 'Meghana Foods', restaurantAddress: 'Koramangala, 500m away', customerName: 'Priya S.', customerAddress: 'HSR Layout, Sector 6', distance: '3.2 km', items: 3, total: 785, tip: 40 },
  { id: 'ORD820', restaurantName: 'Truffles', restaurantAddress: 'Indiranagar, 1.2km away', customerName: 'Rahul V.', customerAddress: 'Domlur, 2nd Stage', distance: '2.8 km', items: 2, total: 570, tip: 0 },
];

const DeliveryDashboard = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [availableOrders, setAvailableOrders] = useState(DEMO_AVAILABLE_ORDERS);
  const [orderStatus, setOrderStatus] = useState('picked_up');

  const todayStats = { orders: 8, earnings: 640, distance: '42 km', rating: '4.8' };

  const acceptOrder = (order) => {
    setCurrentOrder(order);
    setAvailableOrders(prev => prev.filter(o => o.id !== order.id));
    setOrderStatus('picked_up');
  };

  const markDelivered = () => {
    setCurrentOrder(null);
    setOrderStatus(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">🛵</div>
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white">Delivery Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Welcome, Arjun R.</p>
            </div>
          </div>
          {/* Online toggle */}
          <div className="flex items-center gap-3">
            <span className={`text-sm font-bold ${isOnline ? 'text-green-600' : 'text-gray-400'}`}>{isOnline ? 'Online' : 'Offline'}</span>
            <button onClick={() => setIsOnline(v => !v)}
              className={`w-14 h-7 rounded-full transition-all relative shadow-md ${isOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${isOnline ? 'left-7' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Today Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Orders', value: todayStats.orders, emoji: '📦' },
            { label: 'Earnings', value: `₹${todayStats.earnings}`, emoji: '💰' },
            { label: 'Distance', value: todayStats.distance, emoji: '📍' },
            { label: 'Rating', value: todayStats.rating, emoji: '⭐' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-3 text-center">
              <div className="text-lg mb-0.5">{s.emoji}</div>
              <p className="font-black text-gray-900 dark:text-white text-sm">{s.value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Current delivery */}
        {currentOrder && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-[#ff5200] p-5 mb-6 animate-bounce-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-[#ff5200] rounded-full animate-ping" />
              <p className="font-black text-[#ff5200] text-sm uppercase tracking-wider">Active Delivery</p>
            </div>
            <h3 className="font-black text-gray-900 dark:text-white text-lg">{currentOrder.restaurantName} → {currentOrder.customerName}</h3>
            <div className="space-y-2 mt-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2"><HiLocationMarker className="w-4 h-4 text-[#ff5200]" /> Pickup: {currentOrder.restaurantAddress}</div>
              <div className="flex items-center gap-2"><HiLocationMarker className="w-4 h-4 text-green-500" /> Drop: {currentOrder.customerAddress}</div>
              <div className="flex items-center gap-2"><HiCurrencyRupee className="w-4 h-4 text-gray-400" /> ₹{currentOrder.total} · {currentOrder.distance}</div>
            </div>

            <div className="flex gap-2 mt-5">
              <a href="tel:+919876543210" className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200">
                <HiPhone className="w-4 h-4" /> Call Customer
              </a>
              <button onClick={markDelivered}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition-colors">
                <HiCheck className="w-4 h-4" /> Mark Delivered
              </button>
            </div>
          </div>
        )}

        {/* Available Orders */}
        {isOnline && !currentOrder && (
          <div>
            <h3 className="font-black text-gray-900 dark:text-white mb-4">
              Available Orders ({availableOrders.length})
            </h3>
            {availableOrders.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="text-5xl mb-3 animate-spin-slow">🛵</div>
                <p className="font-semibold text-gray-600 dark:text-gray-300">Searching for orders nearby…</p>
                <p className="text-xs text-gray-400 mt-1">Stay online to receive requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableOrders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 animate-fade-in">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-black text-gray-900 dark:text-white">{order.restaurantName}</h4>
                        <p className="text-xs text-gray-500">{order.restaurantAddress}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900 dark:text-white">₹{order.total}</p>
                        {order.tip > 0 && <p className="text-xs text-green-600 font-semibold">+₹{order.tip} tip</p>}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-4">
                      <div className="flex items-center gap-1.5"><HiLocationMarker className="w-3.5 h-3.5 text-green-500" /> Drop: {order.customerAddress}</div>
                      <div>📦 {order.items} items · 📍 {order.distance}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => acceptOrder(order)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#ff5200] text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-colors">
                        <HiCheck className="w-4 h-4" /> Accept
                      </button>
                      <button onClick={() => setAvailableOrders(prev => prev.filter(o => o.id !== order.id))}
                        className="px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 text-gray-500 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors">
                        <HiX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!isOnline && !currentOrder && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="text-6xl mb-4">💤</div>
            <p className="text-xl font-bold text-gray-700 dark:text-gray-200">You're offline</p>
            <p className="text-gray-400 mt-1 mb-6 text-sm">Toggle online to start receiving delivery requests</p>
            <button onClick={() => setIsOnline(true)} className="btn-primary px-8 py-3">Go Online</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
