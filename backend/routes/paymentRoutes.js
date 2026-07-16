const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const authMiddleware = require('../middleware/auth');

// @route  POST /api/payment/create-intent
// @desc   Create Stripe PaymentIntent
// @access Private
router.post('/create-intent', authMiddleware, async (req, res) => {
  try {
    const { amount, currency = 'inr', orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount.' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe requires paise for INR
      currency,
      metadata: {
        orderId: orderId || '',
        userId: req.user.id,
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ success: false, message: err.message || 'Payment error.' });
  }
});

// @route  POST /api/payment/webhook
// @desc   Stripe webhook for payment confirmation
// @access Public (Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    console.log(`Payment succeeded for order: ${pi.metadata.orderId}`);
    // TODO: Update order paymentStatus to 'paid'
  }

  res.json({ received: true });
});

module.exports = router;
