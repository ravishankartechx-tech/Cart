import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiLocationMarker, HiPhone, HiMail, HiArrowRight } from 'react-icons/hi';
import { FaInstagram, FaTwitter, FaFacebook, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const links = {
    Company: ['About Us', 'Careers', 'Blog', 'Press Kit'],
    Explore: ['Restaurants', 'Offers & Deals', 'Gift Cards', 'Catering'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy'],
    Support: ['Help Center', 'Contact Us', 'Partner with Us', 'List your Restaurant'],
  };

  const SOCIAL_ICONS = [
    { Icon: FaInstagram, cls: 'social-instagram', label: 'Instagram' },
    { Icon: FaTwitter, cls: 'social-twitter', label: 'Twitter' },
    { Icon: FaFacebook, cls: 'social-facebook', label: 'Facebook' },
    { Icon: FaYoutube, cls: 'social-youtube', label: 'YouTube' },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-gray-950 text-gray-300 mt-auto overflow-hidden">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid-bg pointer-events-none opacity-60" />

      {/* Ambient glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ff5200 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #fc8019 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* ── CTA Strip ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        <div className="gradient-primary py-12 px-4 relative">
          {/* Wave SVG decoration */}
          <svg
            className="absolute bottom-0 left-0 right-0 w-full opacity-10"
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
            style={{ height: '40px' }}
          >
            <path d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,60 L0,60 Z" fill="white" />
          </svg>

          {/* Floating food emojis in CTA */}
          {['🍕', '🍜', '🍔', '🍣'].map((e, i) => (
            <span key={i} className="absolute text-2xl opacity-20 pointer-events-none"
              style={{
                top: `${15 + i * 18}%`,
                left: `${5 + i * 22}%`,
                animation: `float-slow ${4 + i}s ease-in-out ${i * 0.8}s infinite`,
              }}>
              {e}
            </span>
          ))}

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-white text-2xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>Get the FeastRocket App</h3>
                <p className="text-white/75 text-sm mt-1">Order faster. Track smarter. Live tastier.</p>
              </div>
              <div className="flex gap-3">
                {[
                  { emoji: '🍎', label: 'App Store', sub: 'iOS & macOS' },
                  { emoji: '▶', label: 'Google Play', sub: 'Android' },
                ].map((btn, i) => (
                  <button key={i}
                    className="flex items-center gap-3 bg-black/80 hover:bg-black text-white px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
                    style={{ border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                    <span className="text-xl">{btn.emoji}</span>
                    <div className="text-left">
                      <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>{btn.label}</p>
                      <p className="text-white/50 text-[10px]">{btn.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer ────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 space-y-5">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange-500/30 transition-shadow">
                <span className="text-white text-xl">🚀</span>
              </div>
              <span className="text-white text-xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Feast<span className="text-[#ff5200]">Rocket</span>
              </span>
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed">
              India's fastest growing food delivery platform. Fresh food, fast delivery, zero compromise.
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Stay in the loop</p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold animate-bounce-in">
                  <span>✓</span> You're subscribed!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="flex-1 bg-white/[0.06] border border-white/10 text-gray-300 placeholder-gray-600 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-orange-500/50 focus:bg-white/[0.09] transition-all"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  <button type="submit"
                    className="w-9 h-9 flex items-center justify-center gradient-primary rounded-xl hover:opacity-90 transition-opacity shrink-0">
                    <HiArrowRight className="w-4 h-4 text-white" />
                  </button>
                </form>
              )}
            </div>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {SOCIAL_ICONS.map(({ Icon, cls, label }) => (
                <a key={label} href="#" aria-label={label} className={`social-icon ${cls}`}>
                  <Icon className="w-4 h-4 text-gray-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white font-bold text-xs mb-4 uppercase tracking-widest" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {section}
              </h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item}>
                    <a href="#"
                      className="text-sm text-gray-500 hover:text-[#ff5200] transition-colors duration-200 hover:translate-x-1 inline-block"
                      style={{ fontFamily: 'Inter, sans-serif' }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <HiLocationMarker className="w-4 h-4 text-[#ff5200]" />
                <span>Bengaluru, India</span>
              </div>
              <a href="tel:+918001234567" className="flex items-center gap-1.5 hover:text-gray-400 transition-colors">
                <HiPhone className="w-4 h-4 text-[#ff5200]" />
                <span>+91 80 0123 4567</span>
              </a>
              <a href="mailto:support@feastrocket.in" className="flex items-center gap-1.5 hover:text-gray-400 transition-colors">
                <HiMail className="w-4 h-4 text-[#ff5200]" />
                <span>support@feastrocket.in</span>
              </a>
            </div>
            <p className="text-xs text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              © {year} FeastRocket Pvt. Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
