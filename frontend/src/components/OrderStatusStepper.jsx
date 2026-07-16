import { useState } from 'react';
import { HiCheckCircle } from 'react-icons/hi';

const ORDER_STEPS = [
  { key: 'pending',   label: 'Order Placed',     emoji: '📋', desc: 'We received your order' },
  { key: 'confirmed', label: 'Confirmed',         emoji: '✅', desc: 'Restaurant accepted' },
  { key: 'preparing', label: 'Preparing',         emoji: '👨‍🍳', desc: 'Chef is cooking your food' },
  { key: 'ready',     label: 'Ready for Pickup',  emoji: '🛍', desc: 'Order packed & ready' },
  { key: 'picked_up', label: 'Out for Delivery',  emoji: '🛵', desc: 'On the way to you!' },
  { key: 'delivered', label: 'Delivered',         emoji: '🎉', desc: 'Enjoy your meal!' },
];

const STATUS_INDEX = {
  pending: 0, confirmed: 1, preparing: 2, ready: 3, picked_up: 4, delivered: 5
};

const OrderStatusStepper = ({ status = 'pending', estimatedDelivery, deliveredAt }) => {
  const currentIdx = STATUS_INDEX[status] ?? 0;
  const isCancelled = status === 'cancelled';

  if (isCancelled) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-2xl p-5 text-center">
        <div className="text-4xl mb-2">❌</div>
        <p className="text-red-700 dark:text-red-400 font-bold text-lg">Order Cancelled</p>
        <p className="text-red-500 text-sm mt-1">Your refund will be processed in 3–5 business days.</p>
      </div>
    );
  }

  const eta = estimatedDelivery
    ? new Date(estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
      {/* ETA Banner */}
      {status !== 'delivered' && eta && (
        <div className="mb-5 flex items-center justify-between bg-orange-50 dark:bg-orange-900/20 rounded-xl px-4 py-3">
          <div>
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider">Estimated Delivery</p>
            <p className="text-xl font-black text-gray-900 dark:text-white">{eta}</p>
          </div>
          <div className="text-3xl animate-float">🛵</div>
        </div>
      )}

      {status === 'delivered' && deliveredAt && (
        <div className="mb-5 bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <HiCheckCircle className="w-8 h-8 text-green-500 shrink-0" />
          <div>
            <p className="font-bold text-green-700 dark:text-green-400">Delivered!</p>
            <p className="text-xs text-gray-500">
              at {new Date(deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200 dark:bg-gray-600" />
        <div
          className="absolute left-5 top-5 w-0.5 bg-[#ff5200] transition-all duration-700"
          style={{ height: `${(currentIdx / (ORDER_STEPS.length - 1)) * 100}%` }}
        />

        <div className="space-y-6">
          {ORDER_STEPS.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <div key={step.key} className="flex items-start gap-4 relative">
                {/* Icon circle */}
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 transition-all duration-300 ${
                  isCompleted ? 'bg-green-500' :
                  isCurrent  ? 'bg-[#ff5200] shadow-lg shadow-orange-200 dark:shadow-orange-900 scale-110' :
                  'bg-gray-200 dark:bg-gray-600'
                }`}>
                  {isCompleted ? <HiCheckCircle className="w-6 h-6 text-white" /> :
                   <span className={isCurrent ? 'animate-pulse' : 'grayscale opacity-60'}>{step.emoji}</span>}
                </div>

                {/* Text */}
                <div className={`pt-1.5 transition-opacity duration-300 ${!isCompleted && !isCurrent ? 'opacity-40' : ''}`}>
                  <p className={`font-semibold text-sm ${isCurrent ? 'text-[#ff5200]' : 'text-gray-800 dark:text-white'}`}>
                    {step.label}
                    {isCurrent && <span className="ml-2 inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#ff5200] rounded-full animate-ping" />
                    </span>}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusStepper;
