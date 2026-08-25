import { useState, useRef, useEffect } from 'react';
import { HiX, HiPaperAirplane, HiPhone } from 'react-icons/hi';

const QUICK_CHIPS = [
  'Leave food at the door 🚪',
  'Please call when downstairs 📞',
  'Do not ring the bell 🤫',
  'Extra cutlery please 🍴',
  'I am waiting at the gate 🏃‍♂️',
];

const RIDER_RESPONSES = [
  'Understood! I will do that.',
  'Sure, almost at your location! 👍',
  'Got it, riding safely with your order.',
  'Noted, will call once I arrive.',
  'Thanks for letting me know!',
];

const RiderChatDrawer = ({ isOpen, onClose, rider, orderId }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'rider',
      text: `Hi! I'm ${rider?.name || 'Arjun'}, your delivery partner. I’m on my way to deliver your order! 🛵`,
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const sendMessage = (textToSend) => {
    const clean = (textToSend || inputText).trim();
    if (!clean) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: clean,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulate Rider typing & replying
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const randomReply = RIDER_RESPONSES[Math.floor(Math.random() * RIDER_RESPONSES.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'rider',
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white dark:bg-gray-900 h-full flex flex-col shadow-2xl animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-orange-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={rider?.photoURL || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop'}
                alt={rider?.name || 'Rider'}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#ff5200]"
              />
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
                {rider?.name || 'Arjun R.'}
                <span className="text-[10px] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 font-bold px-1.5 py-0.5 rounded-full">
                  Online
                </span>
              </h3>
              <p className="text-xs text-gray-400">Order #{orderId?.slice(-6)?.toUpperCase() || 'LIVE'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {rider?.phone && (
              <a
                href={`tel:${rider.phone}`}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-orange-100 hover:text-[#ff5200] transition-colors"
              >
                <HiPhone className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  m.sender === 'user'
                    ? 'gradient-primary text-white rounded-tr-none'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-3 py-2 w-fit">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="text-[10px] text-gray-400 ml-1">{rider?.name?.split(' ')[0] || 'Rider'} is typing…</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Chips */}
        <div className="p-2.5 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto flex gap-1.5 no-scrollbar">
          {QUICK_CHIPS.map((chip, i) => (
            <button
              key={i}
              onClick={() => sendMessage(chip)}
              className="text-xs shrink-0 bg-gray-100 dark:bg-gray-800 hover:bg-orange-50 hover:text-[#ff5200] dark:hover:bg-orange-950/40 text-gray-700 dark:text-gray-300 font-medium px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message to your rider…"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="input-base text-sm py-2 flex-1"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!inputText.trim()}
            className="w-10 h-10 gradient-primary text-white rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40 hover:scale-105 transition-transform shadow-md"
          >
            <HiPaperAirplane className="w-4 h-4 rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiderChatDrawer;
