import { useState, useEffect, useRef } from 'react';
import { HiChevronLeft, HiChevronRight, HiTag, HiClock } from 'react-icons/hi';

const OFFERS = [
  { code: 'FEAST50', title: '50% OFF up to ₹100', desc: 'On your first order', color: 'from-orange-500 via-red-500 to-rose-500', emoji: '🎉', expiresIn: 23 * 3600 + 45 * 60 + 12 },
  { code: 'FREEDEL', title: 'FREE DELIVERY', desc: 'On orders above ₹299', color: 'from-green-500 via-emerald-500 to-teal-500', emoji: '🛵', expiresIn: 11 * 3600 + 22 * 60 + 8 },
  { code: 'WEEKEND', title: '₹80 OFF', desc: 'Every weekend — min order ₹399', color: 'from-purple-500 via-violet-500 to-pink-500', emoji: '🎊', expiresIn: 2 * 3600 + 59 * 60 + 55 },
  { code: 'NEWUSER', title: '60% OFF', desc: 'New user special — first 3 orders', color: 'from-blue-500 via-cyan-500 to-sky-400', emoji: '🆕', expiresIn: 47 * 3600 + 10 * 60 + 30 },
];

function useCountdown(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    setSeconds(initialSeconds);
    const timer = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [initialSeconds]);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function CountdownTimer({ seconds }) {
  const time = useCountdown(seconds);
  return (
    <div className="flex items-center gap-1.5 mt-2">
      <HiClock className="w-3.5 h-3.5 text-white/70" />
      <span className="text-white/70 text-xs font-semibold">Expires in</span>
      <span className="text-white font-black text-sm tracking-widest" style={{ fontFamily: 'Outfit, monospace' }}>{time}</span>
    </div>
  );
}

// Floating particle
function Particle({ x, y, size, delay, duration }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: 'rgba(255,255,255,0.15)',
        animation: `particle-float ${duration}s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

const PARTICLES = [
  { x: 10, y: 20, size: '8px', delay: 0, duration: 4 },
  { x: 80, y: 15, size: '12px', delay: 1, duration: 5 },
  { x: 90, y: 60, size: '6px', delay: 0.5, duration: 3.5 },
  { x: 15, y: 70, size: '10px', delay: 2, duration: 6 },
  { x: 50, y: 80, size: '7px', delay: 1.5, duration: 4.5 },
  { x: 70, y: 40, size: '9px', delay: 0.8, duration: 5.5 },
  { x: 30, y: 50, size: '5px', delay: 3, duration: 4 },
  { x: 60, y: 10, size: '11px', delay: 2.5, duration: 5 },
];

const OfferBanner = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [copied, setCopied] = useState('');
  const timerRef = useRef(null);

  const changeTo = (idx) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 180);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      changeTo((current + 1) % OFFERS.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [current]);

  const copyCode = (code, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(''), 2500);
  };

  const prev = () => changeTo((current - 1 + OFFERS.length) % OFFERS.length);
  const next = () => changeTo((current + 1) % OFFERS.length);
  const offer = OFFERS[current];

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl select-none"
      style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>

      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${offer.color} transition-all duration-500`} />

      {/* Animated particles */}
      {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

      {/* Decorative circles */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-16 -left-8 w-56 h-56 rounded-full bg-black/10 pointer-events-none" />

      {/* Content */}
      <div
        className="relative z-10 p-6 md:p-8"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateX(16px)' : 'translateX(0)',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
        }}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left content */}
          <div className="flex items-center gap-5 min-w-0">
            {/* Emoji */}
            <div className="text-5xl md:text-6xl shrink-0 animate-float"
              style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>
              {offer.emoji}
            </div>

            {/* Text */}
            <div className="min-w-0">
              <p className="text-white/75 text-xs font-semibold uppercase tracking-widest mb-1">{offer.desc}</p>
              <h3 className="text-white text-2xl md:text-3xl font-black leading-tight" style={{ fontFamily: 'Outfit, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                {offer.title}
              </h3>

              {/* Coupon ticket */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <div className="coupon-ticket flex items-center gap-2">
                  <HiTag className="w-3.5 h-3.5 text-white/80" />
                  <span className="text-white font-black text-sm tracking-[0.15em]" style={{ fontFamily: 'Outfit, monospace' }}>
                    {offer.code}
                  </span>
                </div>
                <button
                  onClick={(e) => copyCode(offer.code, e)}
                  className="text-xs font-bold px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer active:scale-95"
                  style={{
                    background: copied === offer.code ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.2)',
                    color: 'white',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                >
                  {copied === offer.code ? '✓ Copied!' : 'Copy Code'}
                </button>
              </div>

              {/* Countdown */}
              <CountdownTimer seconds={offer.expiresIn} />
            </div>
          </div>

          {/* Right: nav arrows + dots */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <button
              onClick={prev}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white transition-all duration-200 hover:scale-110 active:scale-90 backdrop-blur-sm"
            >
              <HiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white transition-all duration-200 hover:scale-110 active:scale-90 backdrop-blur-sm"
            >
              <HiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="flex gap-2 mt-5">
          {OFFERS.map((_, i) => (
            <button
              key={i}
              onClick={() => changeTo(i)}
              className="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: i === current ? '2rem' : '0.5rem',
                background: i === current ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfferBanner;
