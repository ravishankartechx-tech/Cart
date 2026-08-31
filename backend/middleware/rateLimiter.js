const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req),
  message: { success: false, message: 'Too many requests, please try again after 15 minutes.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req),
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes.' },
});

module.exports = { apiLimiter, authLimiter };
