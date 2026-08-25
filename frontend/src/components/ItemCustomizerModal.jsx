import { useState } from 'react';
import { HiX, HiPlus, HiMinus, HiCheck } from 'react-icons/hi';
import { useCart } from '../context/CartContext';

const SIZE_OPTIONS = [
  { id: 'regular', name: 'Regular Portion', priceDelta: 0 },
  { id: 'medium', name: 'Medium Portion', priceDelta: 60 },
  { id: 'large', name: 'Large / Jumbo', priceDelta: 120 },
];

const SPICE_LEVELS = [
  { id: 'mild', name: 'Mild', icon: '🌶️' },
  { id: 'medium', name: 'Medium', icon: '🌶️🌶️' },
  { id: 'hot', name: 'Extra Spicy', icon: '🔥' },
];

const ADDONS = [
  { id: 'cheese', name: 'Extra Melted Cheese', price: 40 },
  { id: 'sauce', name: 'Signature Garlic & Peri Dip', price: 25 },
  { id: 'crispy', name: 'Crispy Fried Onions / Crunch', price: 30 },
  { id: 'cutlery', name: 'Eco-Friendly Cutlery Set', price: 0 },
];

const ItemCustomizerModal = ({ isOpen, onClose, item, restaurantId, restaurantName }) => {
  const { dispatch } = useCart();
  const [selectedSize, setSelectedSize] = useState(SIZE_OPTIONS[0]);
  const [selectedSpice, setSelectedSpice] = useState(SPICE_LEVELS[1]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [notes, setNotes] = useState('');
  const [qty, setQty] = useState(1);

  if (!isOpen || !item) return null;

  const toggleAddon = (addon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const basePrice = item.price || 200;
  const addonsTotal = selectedAddons.reduce((acc, a) => acc + a.price, 0);
  const unitPrice = basePrice + selectedSize.priceDelta + addonsTotal;
  const grandTotal = unitPrice * qty;

  const handleAddToCart = () => {
    const customizedName = `${item.name} (${selectedSize.name.split(' ')[0]})`;
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: `${item._id || item.id}-${selectedSize.id}-${Date.now()}`,
        name: customizedName,
        price: unitPrice,
        image: item.image,
        restaurantId: restaurantId || '65f000000000000000000001',
        restaurantName: restaurantName || 'Restaurant',
        qty,
        customizations: {
          size: selectedSize.name,
          spice: selectedSpice.name,
          addons: selectedAddons.map((a) => a.name),
          notes,
        },
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="relative p-5 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 rounded-2xl object-cover border border-gray-200 dark:border-gray-700"
              />
            )}
            <div>
              <h3 className="font-black text-base text-gray-900 dark:text-white leading-snug">{item.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Customize your portion and extras</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors shrink-0"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Customization Options Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Size Choice */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
              Select Size / Portion <span className="text-[#ff5200]">*</span>
            </label>
            <div className="space-y-2">
              {SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedSize(opt)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                    selectedSize.id === opt.id
                      ? 'border-[#ff5200] bg-orange-50/50 dark:bg-orange-950/20 text-gray-900 dark:text-white font-bold'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedSize.id === opt.id ? 'border-[#ff5200]' : 'border-gray-300'
                      }`}
                    >
                      {selectedSize.id === opt.id && <div className="w-2 h-2 bg-[#ff5200] rounded-full" />}
                    </div>
                    {opt.name}
                  </div>
                  <span className="text-xs text-[#ff5200] font-bold">
                    {opt.priceDelta > 0 ? `+₹${opt.priceDelta}` : 'Free'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Spice Level */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
              Spice Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SPICE_LEVELS.map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => setSelectedSpice(sp)}
                  className={`p-2.5 rounded-2xl border-2 text-center transition-all ${
                    selectedSpice.id === sp.id
                      ? 'border-[#ff5200] bg-orange-50/60 dark:bg-orange-950/20 text-[#ff5200] font-bold'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <div className="text-base mb-1">{sp.icon}</div>
                  <div className="text-xs">{sp.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
              Recommended Add-Ons
            </label>
            <div className="space-y-2">
              {ADDONS.map((ad) => {
                const isSelected = selectedAddons.some((a) => a.id === ad.id);
                return (
                  <button
                    key={ad.id}
                    type="button"
                    onClick={() => toggleAddon(ad)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-[#ff5200] bg-orange-50/30 dark:bg-orange-950/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-sm text-gray-800 dark:text-gray-200">
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                          isSelected ? 'bg-[#ff5200] border-[#ff5200] text-white' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {isSelected && <HiCheck className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-semibold">{ad.name}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                      {ad.price > 0 ? `+₹${ad.price}` : 'Free'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cooking Note */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Cooking Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Less oil, extra crispy, no garlic"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-base text-xs"
            />
          </div>
        </div>

        {/* Footer Bar with Quantity & Add to Cart */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-1 shadow-sm">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <HiMinus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-black text-sm text-gray-900 dark:text-white">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <HiPlus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 btn-primary py-3 rounded-2xl font-black text-sm shadow-xl shadow-orange-500/20"
          >
            Add to Cart • ₹{grandTotal}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCustomizerModal;
