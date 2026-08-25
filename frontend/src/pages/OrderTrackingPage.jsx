import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import OrderStatusStepper from '../components/OrderStatusStepper';
import { HiPhone, HiRefresh } from 'react-icons/hi';
import { API_BASE_URL } from '../api/client';
import { io } from 'socket.io-client';
import axios from 'axios';

// Status progression stages
const DEMO_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered'];

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState({
    restaurantName: 'Meghana Foods',
    total: 785,
    items: [
      { name: 'Chicken Boneless Biryani', qty: 2, price: 345 },
      { name: 'Guntur Chicken Dry', qty: 1, price: 280 },
    ],
    deliveryAddress: { street: '42, 5th Cross, Indiranagar', city: 'Bengaluru', pincode: '560038' },
    deliveryPartner: { name: 'Arjun R.', phone: '+91 98765 12345', photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop' },
    estimatedDelivery: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    status: 'pending',
  });
  const [isLive, setIsLive] = useState(false);

  // Fetch real order from API
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('fr_token');
        const res = await axios.get(`${API_BASE_URL}/orders/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          timeout: 3000,
        });
        if (res.data?.success && res.data.order) {
          const ord = res.data.order;
          setOrder({
            restaurantName: ord.restaurantName || ord.restaurant?.name || 'Restaurant',
            total: ord.total,
            items: ord.items || [],
            deliveryAddress: ord.deliveryAddress || { street: 'Bengaluru', city: 'Bengaluru' },
            deliveryPartner: ord.deliveryPartner || { name: 'Arjun R.', phone: '+91 98765 12345', photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop' },
            estimatedDelivery: ord.estimatedDelivery || new Date(Date.now() + 20 * 60 * 1000).toISOString(),
            status: ord.status || 'pending',
          });
          setIsLive(true);
        }
      } catch {
        // Fallback to simulation
      }
    };

    if (id) fetchOrder();
  }, [id]);

  // Socket.io connection for live events
  useEffect(() => {
    if (!id || id.startsWith('DEMO')) return;
    const socketUrl = API_BASE_URL.replace('/api', '');
    const token = localStorage.getItem('fr_token');
    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 3,
    });

    socket.emit('join_order_room', id);

    socket.on('order_status_update', (data) => {
      if (data.status) {
        setOrder(prev => ({ ...prev, status: data.status }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  // Fallback simulation timer when not receiving live server updates
  useEffect(() => {
    if (isLive && order.status === 'delivered') return;
    if (order.status === 'delivered' || order.status === 'cancelled') return;

    const currentIdx = DEMO_STATUSES.indexOf(order.status);
    if (currentIdx >= 0 && currentIdx < DEMO_STATUSES.length - 1) {
      const timer = setTimeout(() => {
        setOrder(prev => ({
          ...prev,
          status: DEMO_STATUSES[currentIdx + 1],
        }));
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [order.status, isLive]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="text-5xl mb-3 animate-float">🛵</div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Live Order Tracking</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Order #{id?.slice(-6)?.toUpperCase() || 'DEMO01'}</p>
        </div>

        {/* Status Stepper */}
        <div className="mb-6 animate-slide-up">
          <OrderStatusStepper
            status={order.status}
            estimatedDelivery={order.estimatedDelivery}
            deliveredAt={order.status === 'delivered' ? new Date().toISOString() : null}
          />
        </div>

        {/* Map placeholder */}
        {!['delivered', 'cancelled'].includes(order.status) && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 h-48 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 relative flex items-center justify-center animate-fade-in">
            <div className="text-center">
              <div className="text-4xl mb-2">🗺</div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Live Delivery Route</p>
              <p className="text-xs text-gray-400">Partner is en route with your food</p>
            </div>
            <div className="absolute bottom-3 right-3 bg-white dark:bg-gray-800 rounded-xl px-3 py-1.5 shadow-md flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">Live GPS</span>
            </div>
          </div>
        )}

        {/* Delivery Partner */}
        {['picked_up', 'delivered'].includes(order.status) && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 mb-6 flex items-center justify-between animate-bounce-in">
            <div className="flex items-center gap-3">
              <img src={order.deliveryPartner.photoURL} alt={order.deliveryPartner.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#ff5200]" />
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Your Delivery Partner</p>
                <p className="font-bold text-gray-900 dark:text-white">{order.deliveryPartner.name}</p>
                <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-xs">★</span>)}</div>
              </div>
            </div>
            <a href={`tel:${order.deliveryPartner.phone}`}
              className="w-11 h-11 gradient-primary rounded-full flex items-center justify-center shadow-md text-white">
              <HiPhone className="w-5 h-5" />
            </a>
          </div>
        )}

        {/* Order Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 mb-6">
          <h3 className="font-black text-gray-900 dark:text-white mb-4">{order.restaurantName}'s Order</h3>
          <div className="space-y-2 text-sm">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>{item.name} × {item.qty}</span>
                <span className="font-semibold">₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-gray-200 dark:border-gray-600 mt-4 pt-3 flex justify-between font-black text-gray-900 dark:text-white">
            <span>Total Paid</span>
            <span>₹{order.total}</span>
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            📍 {order.deliveryAddress.street}, {order.deliveryAddress.city}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link to="/restaurants" className="flex-1 btn-outline py-3 text-sm text-center rounded-xl">
            Order Again
          </Link>
          {order.status === 'delivered' && (
            <Link to="/orders" className="flex-1 btn-primary py-3 text-sm text-center rounded-xl">
              Rate Order
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
