const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
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

app.set('io', io);

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);

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
  res.json({ message: 'FeastRocket Food Delivery API', version: '2.0.0', status: 'running' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication required'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('User Connected: ' + socket.id);

  socket.on('join_order_room', (orderId) => {
    socket.join(orderId);
  });

  socket.on('join_restaurant_room', (restaurantId) => {
    socket.join('restaurant_' + restaurantId);
  });

  socket.on('update_location', ({ orderId, lat, lng }) => {
    if (typeof lat !== 'number' || typeof lng !== 'number') return;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return;
    socket.to(orderId).emit('delivery_location', { lat, lng });
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected: ' + socket.id);
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/feastrocket';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log('Server running on http://localhost:' + PORT);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = { io };
