import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider, useCart } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AiFoodAssistant from './components/AiFoodAssistant';

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
  const { cart, getCartTotal, getItemCount } = useCart();
  const location = useLocation();
  const count = getItemCount();

  if (count === 0 || location.pathname === '/cart' || location.pathname === '/checkout') return null;

  return (
    <div className="sticky-cart-bar pointer-events-none">
      <div className="max-w-3xl mx-auto pointer-events-auto">
        <Link
          to="/cart"
          className="gradient-primary text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center transform transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ boxShadow: '0 8px 32px rgba(255,82,0,0.4)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center font-black text-sm">
              {count}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/80">
                {count} Item{count > 1 ? 's' : ''} in cart
              </p>
              <p className="font-black text-sm">₹{getCartTotal().toFixed(2)} + taxes</p>
            </div>
          </div>
          <div className="font-extrabold flex items-center gap-2 text-sm">
            View Cart →
          </div>
        </Link>
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
      <main className="flex-grow pt-16">
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
      <AiFoodAssistant />
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppLayout />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
