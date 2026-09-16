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
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
      {/* ETA Banner */}
      {status !== 'delivered' && eta && (
        <div className="mb-6 flex items-center justify-between bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 dark:from-orange-950/40 dark:via-amber-950/20 dark:to-orange-950/40 rounded-2xl p-4 border border-orange-200/80 dark:border-orange-900/40">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="live-dot" />
              <p className="text-[11px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Estimated Delivery
              </p>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {eta}
            </p>
          </div>
          <div className="text-3xl sm:text-4xl animate-float">🛵</div>
        </div>
      )}

      {status === 'delivered' && deliveredAt && (
        <div className="mb-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-3">
          <HiCheckCircle className="w-8 h-8 text-emerald-500 shrink-0" />
          <div>
            <p className="font-black text-emerald-700 dark:text-emerald-400 text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>Delivered Successfully!</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Handed over at {new Date(deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="relative pl-1">
        {/* Progress line */}
        <div className="absolute left-[23px] top-6 bottom-6 w-1 bg-gray-100 dark:bg-gray-800 rounded-full" />
        <div
          className="absolute left-[23px] top-6 w-1 gradient-primary rounded-full transition-all duration-700 shadow-sm"
          style={{ height: `${(currentIdx / (ORDER_STEPS.length - 1)) * 100}%` }}
        />

        <div className="space-y-6">
          {ORDER_STEPS.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <div key={step.key} className="flex items-start gap-4 relative">
                {/* Icon circle */}
                <div className={`relative z-10 w-11 h-11 rounded-2xl flex items-center justify-center text-lg shrink-0 transition-all duration-300 ${
                  isCompleted ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' :
                  isCurrent  ? 'gradient-primary text-white shadow-xl shadow-orange-500/35 scale-110' :
                  'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}>
                  {isCompleted ? <HiCheckCircle className="w-6 h-6 text-white" /> :
                   <span className={isCurrent ? 'animate-bounce' : 'grayscale opacity-40'}>{step.emoji}</span>}
                </div>

                {/* Text */}
                <div className={`pt-1 transition-opacity duration-300 ${!isCompleted && !isCurrent ? 'opacity-40' : ''}`}>
                  <p className={`font-black text-sm flex items-center gap-2 ${isCurrent ? 'text-[#ff5200]' : 'text-gray-900 dark:text-white'}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {step.label}
                    {isCurrent && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-100 dark:bg-orange-950/60 text-[#ff5200]">
                        In Progress
                      </span>
                    )}
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
