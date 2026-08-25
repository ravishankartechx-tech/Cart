import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const initialState = {
  items: [],
  restaurantId: null,
  restaurantName: '',
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
    case 'ADD_TO_CART': {
      const { id, name, price, image, restaurantId, restaurantName } = action.payload;

      // If adding from a different restaurant, clear cart first
      if (restaurantId && state.restaurantId && state.restaurantId !== restaurantId) {
        return {
          restaurantId,
          restaurantName,
          items: [{ id, name, price, image, qty: 1 }],
        };
      }

      const existing = state.items.find(i => i.id === id);
      if (existing) {
        return {
          ...state,
          restaurantId: restaurantId || state.restaurantId,
          restaurantName: restaurantName || state.restaurantName,
          items: state.items.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i),
        };
      }

      return {
        ...state,
        restaurantId: restaurantId || state.restaurantId,
        restaurantName: restaurantName || state.restaurantName,
        items: [...state.items, { id, name, price, image, qty: 1 }],
      };
    }

    case 'REMOVE_FROM_CART': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (!existing) return state;

      if (existing.qty === 1) {
        const newItems = state.items.filter(i => i.id !== action.payload.id);
        return {
          ...state,
          items: newItems,
          restaurantId: newItems.length === 0 ? null : state.restaurantId,
          restaurantName: newItems.length === 0 ? '' : state.restaurantName,
        };
      }

      return {
        ...state,
        items: state.items.map(i => i.id === action.payload.id ? { ...i, qty: i.qty - 1 } : i),
      };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'CLEAR_ITEM': {
      const newItems = state.items.filter(i => i.id !== action.payload.id);
      return {
        ...state,
        items: newItems,
        restaurantId:   newItems.length === 0 ? null : state.restaurantId,
        restaurantName: newItems.length === 0 ? ''   : state.restaurantName,
      };
    }

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState, () => {
    try {
      const saved = localStorage.getItem('fr_cart');
      return saved ? JSON.parse(saved) : initialState;
    } catch {
      return initialState;
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('fr_cart', JSON.stringify(cart));
  }, [cart]);

  const getCartTotal = () => cart.items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const getItemCount = () => cart.items.reduce((acc, i) => acc + i.qty, 0);
  const getItemQty = (id) => cart.items.find(i => i.id === id)?.qty || 0;

  return (
    <CartContext.Provider value={{ cart, dispatch, getCartTotal, getItemCount, getItemQty }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
