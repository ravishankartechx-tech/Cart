const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const { apiLimiter } = require('./middleware/rateLimiter');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }
});

// Make io accessible in route handlers
app.set('io', io);

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Stripe webhook needs raw body — must be before express.json()
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/restaurants',  require('./routes/restaurantRoutes'));
app.use('/api/menu',         require('./routes/menuRoutes'));
app.use('/api/orders',       require('./routes/orderRoutes'));
app.use('/api/payment',      require('./routes/paymentRoutes'));
app.use('/api/reviews',      require('./routes/reviewRoutes'));
app.use('/api/coupons',      require('./routes/couponRoutes'));
app.use('/api/admin',        require('./routes/adminRoutes'));
app.use('/api/delivery',     require('./routes/deliveryRoutes'));

app.get('/', (req, res) => {
  res.json({ 
    message: '🍕 FeastRocket Food Delivery API', 
    version: '2.0.0', 
    status: 'running' 
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ─── Socket.io Real-time Events ──────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`✅ User Connected: ${socket.id}`);

  // User joins their order room for live updates
  socket.on('join_order_room', (orderId) => {
    socket.join(orderId);
    console.log(`User joined order room: ${orderId}`);
  });

  // Restaurant joins their room for new order notifications
  socket.on('join_restaurant_room', (restaurantId) => {
    socket.join(`restaurant_${restaurantId}`);
    console.log(`Restaurant joined room: ${restaurantId}`);
  });

  // Delivery partner location broadcast
  socket.on('update_location', ({ orderId, lat, lng }) => {
    socket.to(orderId).emit('delivery_location', { lat, lng });
  });

  socket.on('disconnect', () => {
    console.log(`❌ User Disconnected: ${socket.id}`);
  });
});

// ─── Database & Server Start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/feastrocket';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = { io };
