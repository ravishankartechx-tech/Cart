import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider, useCart } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ToastProvider } from './context/ToastContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AiFoodAssistant from './components/AiFoodAssistant';
import CartDrawer from './components/CartDrawer';
import MobileBottomNav from './components/MobileBottomNav';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RestaurantListingPage from './pages/RestaurantListingPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import NotFoundPage from './pages/NotFoundPage';

// Pages that should not show footer
const NO_FOOTER_PAGES = ['/login', '/signup'];

// Sticky Cart Bottom Bar
function StickyCart() {
  const { getCartTotal, getItemCount, openCartDrawer } = useCart();
  const location = useLocation();
  const count = getItemCount();

  if (count === 0 || location.pathname === '/cart' || location.pathname === '/checkout') return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-0 right-0 z-40 px-4 pointer-events-none transition-all">
      <div className="max-w-3xl mx-auto pointer-events-auto">
        <button
          onClick={openCartDrawer}
          className="w-full gradient-primary text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl flex justify-between items-center transform transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          style={{ boxShadow: '0 8px 32px rgba(255,82,0,0.45)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center font-black text-xs sm:text-sm">
              {count}
            </div>
            <div className="text-left">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/80">
                {count} Item{count > 1 ? 's' : ''} in cart
              </p>
              <p className="font-black text-xs sm:text-sm">₹{getCartTotal().toFixed(2)} + taxes</p>
            </div>
          </div>
          <div className="font-extrabold flex items-center gap-1.5 text-xs sm:text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl backdrop-blur-sm transition-colors">
            View Cart →
          </div>
        </button>
      </div>
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  const showFooter = !NO_FOOTER_PAGES.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="flex-grow pt-16 pb-20 md:pb-0">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/restaurants" element={<RestaurantListingPage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />

          {/* Protected — any logged-in user */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/order-tracking/:id" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Protected — admin only */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />

          {/* Protected — restaurant only */}
          <Route path="/restaurant-dashboard" element={<ProtectedRoute requiredRole="restaurant"><RestaurantDashboard /></ProtectedRoute>} />

          {/* Protected — delivery only */}
          <Route path="/delivery" element={<ProtectedRoute requiredRole="delivery"><DeliveryDashboard /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <StickyCart />
      <CartDrawer />
      <MobileBottomNav />
      <AiFoodAssistant />
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <Router>
                <AppLayout />
              </Router>
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
