import { Link } from 'react-router-dom';
import { HiLocationMarker, HiPhone, HiMail } from 'react-icons/hi';
import { FaInstagram, FaTwitter, FaFacebook, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  const links = {
    Company: ['About Us', 'Careers', 'Blog', 'Press Kit'],
    Explore: ['Restaurants', 'Offers & Deals', 'Gift Cards', 'Catering'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy'],
    Support: ['Help Center', 'Contact Us', 'Partner with Us', 'List your Restaurant'],
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Top CTA strip */}
      <div className="gradient-primary py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white text-2xl font-black">Get the FeastRocket App</h3>
            <p className="text-white/80 text-sm mt-1">Order faster. Track smarter. Live tastier.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-900 transition">
              <span className="text-xl">🍎</span> App Store
            </button>
            <button className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-900 transition">
              <span className="text-xl">▶</span> Google Play
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🚀</span>
              </div>
              <span className="text-white text-xl font-black">Feast<span className="text-[#ff5200]">Rocket</span></span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              India's fastest growing food delivery platform. Fresh food, fast delivery, zero compromise.
            </p>
            <div className="flex gap-3">
              {[FaInstagram, FaTwitter, FaFacebook, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-[#ff5200] rounded-full flex items-center justify-center transition-colors duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">{section}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-400 hover:text-[#ff5200] transition-colors duration-200">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact + Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <HiLocationMarker className="w-4 h-4 text-[#ff5200]" />
                <span>Bengaluru, India</span>
              </div>
              <a href="tel:+918001234567" className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
                <HiPhone className="w-4 h-4 text-[#ff5200]" />
                <span>+91 80 0123 4567</span>
              </a>
              <a href="mailto:support@feastrocket.in" className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
                <HiMail className="w-4 h-4 text-[#ff5200]" />
                <span>support@feastrocket.in</span>
              </a>
            </div>
            <p className="text-xs text-gray-600">© {year} FeastRocket Pvt. Ltd. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
