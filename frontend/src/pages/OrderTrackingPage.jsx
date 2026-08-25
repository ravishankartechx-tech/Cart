import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import OrderStatusStepper from '../components/OrderStatusStepper';
import LiveDeliveryMap from '../components/LiveDeliveryMap';
import RiderChatDrawer from '../components/RiderChatDrawer';
import ScratchCardModal from '../components/ScratchCardModal';
import { HiPhone, HiChatAlt2, HiSparkles } from 'react-icons/hi';
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
    deliveryPartner: {
      name: 'Arjun R.',
      phone: '+91 98765 12345',
      photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop',
    },
    estimatedDelivery: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    status: 'picked_up',
  });
  const [isLive, setIsLive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [hasScratched, setHasScratched] = useState(false);

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
            deliveryPartner: ord.deliveryPartner || {
              name: 'Arjun R.',
              phone: '+91 98765 12345',
              photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop',
            },
            estimatedDelivery: ord.estimatedDelivery || new Date(Date.now() + 20 * 60 * 1000).toISOString(),
            status: ord.status || 'picked_up',
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
        setOrder((prev) => ({ ...prev, status: data.status }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  // Auto progression simulation
  useEffect(() => {
    if (isLive && order.status === 'delivered') return;
    if (order.status === 'delivered' || order.status === 'cancelled') {
      if (order.status === 'delivered' && !hasScratched) {
        setTimeout(() => setShowScratchCard(true), 1200);
      }
      return;
    }

    const currentIdx = DEMO_STATUSES.indexOf(order.status);
    if (currentIdx >= 0 && currentIdx < DEMO_STATUSES.length - 1) {
      const timer = setTimeout(() => {
        const nextStatus = DEMO_STATUSES[currentIdx + 1];
        setOrder((prev) => ({ ...prev, status: nextStatus }));
        if (nextStatus === 'delivered' && !hasScratched) {
          setTimeout(() => setShowScratchCard(true), 1200);
        }
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [order.status, isLive, hasScratched]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6 text-center animate-fade-in">
          <div className="text-5xl mb-2 animate-float">🛵</div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Live Order Tracking</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            Order #{id?.slice(-6)?.toUpperCase() || 'DEMO01'} • Real-Time GPS Active
          </p>
        </div>

        {/* Status Stepper */}
        <div className="mb-6 animate-slide-up">
          <OrderStatusStepper
            status={order.status}
            estimatedDelivery={order.estimatedDelivery}
            deliveredAt={order.status === 'delivered' ? new Date().toISOString() : null}
          />
        </div>

        {/* Interactive Leaflet GPS Map */}
        <div className="mb-6 animate-slide-up">
          <LiveDeliveryMap
            status={order.status}
            restaurantName={order.restaurantName}
            customerAddress={order.deliveryAddress.street}
            riderName={order.deliveryPartner.name}
          />
        </div>

        {/* Delivery Partner Card with Call & Live Chat */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-5 mb-6 shadow-sm flex items-center justify-between animate-bounce-in">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={order.deliveryPartner.photoURL}
                alt={order.deliveryPartner.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#ff5200]"
              />
              <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white absolute bottom-0 right-0" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">Your Delivery Partner</p>
              <p className="font-bold text-gray-900 dark:text-white text-sm">{order.deliveryPartner.name}</p>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                <span>★ 4.9</span>
                <span className="text-gray-400 font-normal">(1,240 deliveries)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-3.5 py-2.5 bg-orange-50 dark:bg-orange-950/40 text-[#ff5200] font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-[#ff5200] hover:text-white transition-all shadow-sm group border border-orange-200 dark:border-orange-900/40"
            >
              <HiChatAlt2 className="w-4 h-4 text-[#ff5200] group-hover:text-white" />
              Chat
            </button>
            <a
              href={`tel:${order.deliveryPartner.phone}`}
              className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-md text-white hover:scale-105 transition-transform"
            >
              <HiPhone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Scratch Card Trigger Banner if Delivered */}
        {order.status === 'delivered' && (
          <div className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-[#ff5200] text-white shadow-xl flex items-center justify-between animate-scale-up">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-bounce">🎁</span>
              <div>
                <h4 className="font-black text-sm">Order Delivered! You Won a Reward!</h4>
                <p className="text-xs text-orange-100">Scratch to reveal in-app wallet cashback</p>
              </div>
            </div>
            <button
              onClick={() => setShowScratchCard(true)}
              className="px-4 py-2 bg-white text-[#ff5200] font-black text-xs rounded-xl hover:bg-orange-50 transition-all shadow-md shrink-0"
            >
              Scratch Now ✨
            </button>
          </div>
        )}

        {/* Order Items & Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-5 mb-6 shadow-sm">
          <h3 className="font-black text-gray-900 dark:text-white text-base mb-3">{order.restaurantName}</h3>
          <div className="space-y-2 text-sm">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-gray-700 dark:text-gray-300 text-xs">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span className="font-bold">₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-gray-200 dark:border-gray-700 mt-4 pt-3 flex justify-between font-black text-gray-900 dark:text-white text-sm">
            <span>Total Paid</span>
            <span className="text-[#ff5200]">₹{order.total}</span>
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-2xl">
            📍 <span className="font-semibold">Delivering to:</span> {order.deliveryAddress.street}, {order.deliveryAddress.city}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link to="/restaurants" className="flex-1 btn-outline py-3 text-xs text-center rounded-2xl font-bold">
            Order Again
          </Link>
          {order.status === 'delivered' && (
            <Link to="/orders" className="flex-1 btn-primary py-3 text-xs text-center rounded-2xl font-bold">
              Rate Order ★
            </Link>
          )}
        </div>
      </div>

      {/* Live Rider Chat Drawer */}
      <RiderChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        rider={order.deliveryPartner}
        orderId={id}
      />

      {/* Mystery Scratch Card Modal */}
      <ScratchCardModal
        isOpen={showScratchCard}
        onClose={() => setShowScratchCard(false)}
        onRewardClaimed={() => setHasScratched(true)}
      />
    </div>
  );
};

export default OrderTrackingPage;
