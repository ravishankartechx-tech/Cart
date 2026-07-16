import { useState, useEffect } from 'react';
import { HiChevronLeft, HiChevronRight, HiTag } from 'react-icons/hi';

const OFFERS = [
  { code: 'FEAST50', title: '50% OFF up to ₹100', desc: 'On your first order', color: 'from-orange-500 to-red-500', emoji: '🎉' },
  { code: 'FREEDEL', title: 'FREE DELIVERY', desc: 'On orders above ₹299', color: 'from-green-500 to-teal-500', emoji: '🛵' },
  { code: 'WEEKEND', title: '₹80 OFF', desc: 'Every weekend, min order ₹399', color: 'from-purple-500 to-pink-500', emoji: '🎊' },
  { code: 'NEWUSER', title: '60% OFF', desc: 'New user special — first 3 orders', color: 'from-blue-500 to-cyan-500', emoji: '🆕' },
];

const OfferBanner = () => {
  const [current, setCurrent] = useState(0);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % OFFERS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const copyCode = (code, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(''), 2000);
  };

  const prev = () => setCurrent(c => (c - 1 + OFFERS.length) % OFFERS.length);
  const next = () => setCurrent(c => (c + 1) % OFFERS.length);

  const offer = OFFERS[current];

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg">
      <div className={`bg-gradient-to-r ${offer.color} p-5 md:p-6 transition-all duration-500`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl animate-float">{offer.emoji}</div>
            <div>
              <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-0.5">{offer.desc}</p>
              <h3 className="text-white text-2xl font-black">{offer.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <HiTag className="w-3.5 h-3.5 text-white" />
                  <span className="text-white font-bold text-sm tracking-widest">{offer.code}</span>
                </div>
                <button
                  onClick={(e) => copyCode(offer.code, e)}
                  className="text-xs font-semibold text-white bg-white/25 hover:bg-white/40 px-3 py-1 rounded-full transition-colors"
                >
                  {copied === offer.code ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Nav buttons */}
          <div className="flex flex-col gap-2">
            <button onClick={prev} className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
              <HiChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
              <HiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="flex gap-1.5 mt-4">
          {OFFERS.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfferBanner;
