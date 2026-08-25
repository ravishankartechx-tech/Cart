import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { HiSparkles, HiX } from 'react-icons/hi';

const ScratchCardModal = ({ isOpen, onClose, onRewardClaimed }) => {
  const canvasRef = useRef(null);
  const [isScratched, setIsScratched] = useState(false);
  const [rewardAmount] = useState(() => Math.floor(Math.random() * 50) + 30); // Random ₹30 - ₹80
  const isDrawingRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Draw scratchable silver glitter foil
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#94a3b8');
    gradient.addColorStop(0.5, '#cbd5e1');
    gradient.addColorStop(1, '#64748b');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Text on silver foil
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch to Reveal Reward! ✨', width / 2, height / 2);
  }, [isOpen]);

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentCount = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentCount++;
    }

    const percentage = (transparentCount / (pixels.length / 4)) * 100;
    if (percentage > 35 && !isScratched) {
      setIsScratched(true);
      triggerCelebration();
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff5200', '#fc8019', '#ffd700', '#22c55e'],
    });

    // Update wallet balance in localStorage
    const currentBalance = Number(localStorage.getItem('fr_wallet_balance') || '150');
    const newBalance = currentBalance + rewardAmount;
    localStorage.setItem('fr_wallet_balance', newBalance.toString());

    if (onRewardClaimed) onRewardClaimed(rewardAmount, newBalance);
  };

  const scratch = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2, false);
    ctx.fill();

    checkScratchPercentage();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-orange-100 dark:border-gray-800 text-center relative animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
        >
          <HiX className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/30 text-white text-2xl">
          🎁
        </div>

        <h3 className="text-xl font-black text-gray-900 dark:text-white">Mystery Scratch Card!</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-5">
          You earned a reward for completing this order. Scratch below!
        </p>

        {/* Scratch Card Area */}
        <div className="relative w-64 h-36 mx-auto rounded-2xl overflow-hidden shadow-inner border-2 border-orange-200 dark:border-orange-900/40 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 dark:from-amber-950/40 dark:to-orange-950/40 flex flex-col items-center justify-center">
          {/* Secret Prize Underneath */}
          <div className="text-center">
            <span className="text-3xl animate-bounce">🪙</span>
            <p className="text-2xl font-black text-[#ff5200] mt-1">₹{rewardAmount} CASHBACK</p>
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Added to FeastRocket Wallet</p>
          </div>

          {/* Silver Scratchable Foil Canvas */}
          {!isScratched && (
            <canvas
              ref={canvasRef}
              width={256}
              height={144}
              className="absolute inset-0 w-full h-full cursor-pointer touch-none"
              onMouseDown={() => (isDrawingRef.current = true)}
              onMouseUp={() => (isDrawingRef.current = false)}
              onMouseLeave={() => (isDrawingRef.current = false)}
              onMouseMove={(e) => isDrawingRef.current && scratch(e.clientX, e.clientY)}
              onTouchStart={() => (isDrawingRef.current = true)}
              onTouchEnd={() => (isDrawingRef.current = false)}
              onTouchMove={(e) => {
                if (!isDrawingRef.current) return;
                const touch = e.touches[0];
                scratch(touch.clientX, touch.clientY);
              }}
            />
          )}
        </div>

        {isScratched ? (
          <div className="mt-5 space-y-2 animate-bounce-in">
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
              <HiSparkles className="w-4 h-4" /> ₹{rewardAmount} Credited to Your Wallet!
            </p>
            <button
              onClick={onClose}
              className="btn-primary w-full py-3 text-sm rounded-xl"
            >
              Awesome, Continue!
            </button>
          </div>
        ) : (
          <p className="text-xs text-gray-400 mt-4 italic">
            👆 Drag your finger or mouse across the card to scratch
          </p>
        )}
      </div>
    </div>
  );
};

export default ScratchCardModal;
