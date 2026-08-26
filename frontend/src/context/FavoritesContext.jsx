import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext(null);

const FAVORITES_KEY = 'feastrocket_favorites_v1';

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  const toggleFavorite = (restaurant) => {
    const rId = restaurant._id || restaurant.id;
    setFavorites(prev => {
      const exists = prev.some(item => (item._id || item.id) === rId);
      if (exists) {
        return prev.filter(item => (item._id || item.id) !== rId);
      } else {
        return [...prev, {
          id: rId,
          _id: rId,
          name: restaurant.name,
          cuisines: restaurant.cuisines,
          rating: restaurant.rating,
          deliveryTime: restaurant.deliveryTime,
          costForTwo: restaurant.costForTwo,
          coverImage: restaurant.coverImage,
          isPureVeg: restaurant.isPureVeg,
          tags: restaurant.tags,
          deliveryFee: restaurant.deliveryFee,
        }];
      }
    });
  };

  const isFavorite = (restaurantId) => {
    return favorites.some(item => (item._id || item.id) === restaurantId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, favoriteCount: favorites.length }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
};
