import { useState, useRef, useEffect } from 'react';
import { HiSparkles, HiX, HiPaperAirplane, HiShoppingCart, HiArrowRight } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const SUGGESTION_CHIPS = [
  '🔥 Best spicy biryani under ₹350',
  '🥗 Healthy high-protein meal',
  '🍕 Fast pizza combos for tonight',
  '🍫 Late night dessert cravings',
  '⚡ Quick bites under ₹150',
];

const DISH_DATABASE = [
  {
    id: 'ai-1',
    name: 'Royal Hyderabadi Chicken Dum Biryani',
    restaurantName: 'Meghana Foods',
    restaurantId: '65f000000000000000000001',
    price: 299,
    calories: '650 kcal',
    rating: 4.8,
    tags: ['spicy', 'biryani', 'chicken', 'protein', 'non-veg', '300'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop',
    description: 'Slow-cooked aromatic basmati rice with marinated chicken & secret spices.',
  },
  {
    id: 'ai-2',
    name: 'Grilled Paneer Protein Bowl',
    restaurantName: 'The Salad Factory',
    restaurantId: '65f000000000000000000002',
    price: 249,
    calories: '380 kcal',
    rating: 4.7,
    tags: ['healthy', 'protein', 'paneer', 'salad', 'veg', 'low-carb', 'diet'],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop',
    description: 'Fresh organic greens, charred cottage cheese cubes, quinoa & lemon vinaigrette.',
  },
  {
    id: 'ai-3',
    name: 'Truffle & Smoked Mozzarella Pizza',
    restaurantName: 'Toscano Pizzeria',
    restaurantId: '65f000000000000000000003',
    price: 380,
    calories: '720 kcal',
    rating: 4.9,
    tags: ['pizza', 'cheese', 'combo', 'veg', 'italian', 'dinner'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop',
    description: 'Wood-fired sourdough base loaded with fresh mozzarella and white truffle oil.',
  },
  {
    id: 'ai-4',
    name: 'Molten Belgian Chocolate Lava Cake',
    restaurantName: 'Sweet Tooth Bakery',
    restaurantId: '65f000000000000000000004',
    price: 160,
    calories: '420 kcal',
    rating: 4.9,
    tags: ['dessert', 'sweet', 'chocolate', 'late-night', 'cake', '150'],
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&auto=format&fit=crop',
    description: 'Warm chocolate cake with an irresistible gooey molten chocolate center.',
  },
  {
    id: 'ai-5',
    name: 'Crispy Peri-Peri Chicken Burger',
    restaurantName: 'Burger & Co.',
    restaurantId: '65f000000000000000000005',
    price: 189,
    calories: '550 kcal',
    rating: 4.6,
    tags: ['burger', 'fast food', 'snack', 'chicken', 'crispy', 'spicy', 'quick', '150'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop',
    description: 'Juicy golden fried chicken patty drenched in peri-peri sauce and house mayo.',
  },
];

const AiFoodAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "👋 Hey foodie! I'm **RocketChef AI**, your personal dining concierge. Tell me what you're craving, your budget, or dietary preference!",
      recommendations: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemName, setAddedItemName] = useState(null);

  const { dispatch } = useCart();
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleAddToCart = (dish) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: dish.id,
        name: dish.name,
        price: dish.price,
        image: dish.image,
        restaurantId: dish.restaurantId,
        restaurantName: dish.restaurantName,
        qty: 1,
      },
    });
    setAddedItemName(dish.name);
    setTimeout(() => setAddedItemName(null), 2500);
  };

  const handleQuery = (queryText) => {
    const q = (queryText || input).trim();
    if (!q) return;

    const userMsg = { id: Date.now(), sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = q.toLowerCase();

      let matchedDishes = DISH_DATABASE.filter((d) =>
        d.tags.some((t) => lower.includes(t)) ||
        d.name.toLowerCase().includes(lower) ||
        d.description.toLowerCase().includes(lower)
      );

      if (matchedDishes.length === 0) {
        // Fallback to top rated dishes
        matchedDishes = [DISH_DATABASE[0], DISH_DATABASE[4]];
      }

      let aiResponseText = `Here's what I hand-picked for your craving for **"${q}"**:`;
      if (lower.includes('healthy') || lower.includes('protein') || lower.includes('diet')) {
        aiResponseText = "🌱 Great choice! Here are delicious, nutrient-dense options prepared with fresh ingredients:";
      } else if (lower.includes('spicy') || lower.includes('biryani')) {
        aiResponseText = "🔥 Hot & aromatic! Here are our chef-special spicy delicacies:";
      } else if (lower.includes('sweet') || lower.includes('dessert') || lower.includes('chocolate')) {
        aiResponseText = "✨ Satisfy that sweet tooth with these top-rated desserts:";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: aiResponseText,
          recommendations: matchedDishes.slice(0, 2),
        },
      ]);
    }, 1200);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-[990]">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#ff5200] via-orange-500 to-amber-500 text-white rounded-full shadow-2xl shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
          >
            <span className="text-xl animate-bounce">🪄</span>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-100 leading-none">Smart Assistant</p>
              <p className="text-xs font-black leading-tight">RocketChef AI</p>
            </div>
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping absolute -top-1 -right-1" />
          </button>
        )}
      </div>

      {/* AI Assistant Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[9990] w-[calc(100vw-3rem)] sm:w-96 max-h-[85vh] h-[580px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#ff5200] to-orange-500 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg">
                🪄
              </div>
              <div>
                <h3 className="font-black text-sm flex items-center gap-1.5">
                  RocketChef AI
                  <span className="text-[9px] bg-white/30 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                    Beta
                  </span>
                </h3>
                <p className="text-[11px] text-orange-100">Personalized Food Recommendations</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Toast Notification when item added to cart */}
          {addedItemName && (
            <div className="bg-emerald-600 text-white text-xs px-3 py-1.5 text-center font-bold flex items-center justify-center gap-1.5 animate-fade-in">
              <HiShoppingCart className="w-4 h-4" /> Added "{addedItemName}" to Cart!
            </div>
          )}

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-950/40 text-sm">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
                    m.sender === 'user'
                      ? 'gradient-primary text-white rounded-tr-none'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                </div>

                {/* Recommendations Cards */}
                {m.recommendations && m.recommendations.length > 0 && (
                  <div className="mt-2.5 space-y-2.5 w-full">
                    {m.recommendations.map((dish) => (
                      <div
                        key={dish.id}
                        className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow flex gap-3"
                      >
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{dish.name}</h4>
                          <p className="text-[10px] text-gray-400 truncate">{dish.restaurantName} • ★ {dish.rating}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-black text-xs text-[#ff5200]">₹{dish.price}</span>
                            <button
                              onClick={() => handleAddToCart(dish)}
                              className="px-2.5 py-1 bg-orange-50 dark:bg-orange-950/40 text-[#ff5200] hover:bg-[#ff5200] hover:text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 border border-orange-200 dark:border-orange-800"
                            >
                              <HiShoppingCart className="w-3.5 h-3.5" /> Add
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-3 py-2 w-fit">
                <span className="w-1.5 h-1.5 bg-[#ff5200] rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-[#ff5200] rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-[#ff5200] rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-gray-400">RocketChef is thinking…</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Preset Prompts Chips */}
          <div className="p-2 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto flex gap-1.5 no-scrollbar">
            {SUGGESTION_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleQuery(chip)}
                className="text-[11px] shrink-0 bg-gray-100 dark:bg-gray-800 hover:bg-orange-50 hover:text-[#ff5200] dark:hover:bg-orange-950/30 text-gray-700 dark:text-gray-300 font-medium px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask for food, cravings or budget…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
              className="input-base text-xs py-2 flex-1"
            />
            <button
              onClick={() => handleQuery()}
              disabled={!input.trim()}
              className="w-9 h-9 gradient-primary text-white rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40 hover:scale-105 transition-transform shadow-md"
            >
              <HiPaperAirplane className="w-3.5 h-3.5 rotate-90" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AiFoodAssistant;
